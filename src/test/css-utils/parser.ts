/**
 * CSS Parser Utilities
 * 
 * Provides utilities for parsing CSS files and extracting information
 * about selectors, tokens, specificity, and other CSS properties.
 */

import * as csstree from 'css-tree';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

export interface SpecificityScore {
  inline: number;      // 1,0,0,0
  ids: number;         // 0,1,0,0
  classes: number;     // 0,0,1,0
  elements: number;    // 0,0,0,1
}

export interface SelectorInfo {
  selector: string;
  file: string;
  line: number;
  specificity: SpecificityScore;
  hasImportant: boolean;
}

export interface TokenInfo {
  name: string;
  value: string;
  file: string;
  line: number;
}

export interface CSSFileInfo {
  path: string;
  content: string;
  ast: csstree.CssNode;
  lineCount: number;
  selectors: SelectorInfo[];
  tokens: TokenInfo[];
}

/**
 * Calculate specificity score for a CSS selector
 */
export function calculateSpecificity(selector: string): SpecificityScore {
  const specificity: SpecificityScore = {
    inline: 0,
    ids: 0,
    classes: 0,
    elements: 0,
  };

  // Remove pseudo-elements and pseudo-classes for parsing
  const cleanSelector = selector
    .replace(/::[\w-]+/g, '') // Remove pseudo-elements
    .replace(/:not\([^)]+\)/g, '') // Remove :not() content
    .replace(/\[data-theme[^\]]*\]/g, '.theme-selector'); // Treat attribute selectors as classes

  // Count IDs
  const idMatches = cleanSelector.match(/#[\w-]+/g);
  if (idMatches) specificity.ids = idMatches.length;

  // Count classes, attributes, and pseudo-classes
  const classMatches = cleanSelector.match(/\.[\w-]+/g);
  const attrMatches = cleanSelector.match(/\[[^\]]+\]/g);
  const pseudoMatches = cleanSelector.match(/:[\w-]+/g);
  
  specificity.classes = 
    (classMatches?.length || 0) + 
    (attrMatches?.length || 0) + 
    (pseudoMatches?.length || 0);

  // Count elements
  const elementMatches = cleanSelector.match(/(?:^|[\s>+~])([a-z][\w-]*)/gi);
  if (elementMatches) {
    specificity.elements = elementMatches.filter(match => {
      const tag = match.trim();
      return tag && !tag.match(/^(and|or|not)$/i);
    }).length;
  }

  return specificity;
}

/**
 * Check if specificity exceeds maximum allowed (0,0,2,0)
 */
export function exceedsMaxSpecificity(specificity: SpecificityScore): boolean {
  if (specificity.inline > 0) return true;
  if (specificity.ids > 0) return true;
  if (specificity.classes > 2) return true;
  return false;
}

/**
 * Parse a CSS file and extract information
 */
export function parseCSSFile(filePath: string): CSSFileInfo {
  const content = readFileSync(filePath, 'utf-8');
  const ast = csstree.parse(content, {
    positions: true,
    filename: filePath,
  });

  const lineCount = content.split('\n').length;
  const selectors: SelectorInfo[] = [];
  const tokens: TokenInfo[] = [];

  // Walk the AST to extract selectors and tokens
  csstree.walk(ast, {
    visit: 'Rule',
    enter(node: any) {
      if (node.prelude && node.prelude.type === 'SelectorList') {
        csstree.walk(node.prelude, {
          visit: 'Selector',
          enter(selectorNode: any) {
            const selectorText = csstree.generate(selectorNode);
            const hasImportant = checkForImportant(node);
            
            selectors.push({
              selector: selectorText,
              file: filePath,
              line: node.loc?.start.line || 0,
              specificity: calculateSpecificity(selectorText),
              hasImportant,
            });
          },
        });
      }
    },
  });

  // Extract CSS custom properties (tokens)
  csstree.walk(ast, {
    visit: 'Declaration',
    enter(node: any) {
      if (node.property.startsWith('--')) {
        tokens.push({
          name: node.property,
          value: csstree.generate(node.value),
          file: filePath,
          line: node.loc?.start.line || 0,
        });
      }
    },
  });

  return {
    path: filePath,
    content,
    ast,
    lineCount,
    selectors,
    tokens,
  };
}

/**
 * Check if a rule contains !important declarations
 */
function checkForImportant(ruleNode: any): boolean {
  let hasImportant = false;
  
  csstree.walk(ruleNode, {
    visit: 'Declaration',
    enter(node: any) {
      if (node.important) {
        hasImportant = true;
      }
    },
  });

  return hasImportant;
}

/**
 * Recursively find all CSS files in a directory
 */
export function findCSSFiles(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and dist directories
      if (!file.match(/^(node_modules|dist|build)$/)) {
        findCSSFiles(filePath, fileList);
      }
    } else if (extname(file) === '.css') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Parse all CSS files in a directory
 */
export function parseAllCSSFiles(dir: string): CSSFileInfo[] {
  const cssFiles = findCSSFiles(dir);
  return cssFiles.map(file => parseCSSFile(file));
}

/**
 * Extract all token definitions from parsed CSS files
 */
export function extractTokenDefinitions(cssFiles: CSSFileInfo[]): Map<string, TokenInfo[]> {
  const tokenMap = new Map<string, TokenInfo[]>();

  cssFiles.forEach(fileInfo => {
    fileInfo.tokens.forEach(token => {
      const existing = tokenMap.get(token.name) || [];
      existing.push(token);
      tokenMap.set(token.name, existing);
    });
  });

  return tokenMap;
}

/**
 * Find duplicate token definitions
 */
export function findDuplicateTokens(cssFiles: CSSFileInfo[]): Map<string, TokenInfo[]> {
  const tokenMap = extractTokenDefinitions(cssFiles);
  const duplicates = new Map<string, TokenInfo[]>();

  tokenMap.forEach((tokens, name) => {
    if (tokens.length > 1) {
      duplicates.set(name, tokens);
    }
  });

  return duplicates;
}

/**
 * Extract all selectors from parsed CSS files
 */
export function extractAllSelectors(cssFiles: CSSFileInfo[]): SelectorInfo[] {
  return cssFiles.flatMap(fileInfo => fileInfo.selectors);
}

/**
 * Find selectors that exceed maximum specificity
 */
export function findHighSpecificitySelectors(cssFiles: CSSFileInfo[]): SelectorInfo[] {
  const allSelectors = extractAllSelectors(cssFiles);
  return allSelectors.filter(selector => exceedsMaxSpecificity(selector.specificity));
}

/**
 * Find all !important declarations
 */
export function findImportantDeclarations(cssFiles: CSSFileInfo[]): SelectorInfo[] {
  const allSelectors = extractAllSelectors(cssFiles);
  return allSelectors.filter(selector => selector.hasImportant);
}

/**
 * Extract all token references (var(--token-name)) from CSS files
 */
export interface TokenReference {
  tokenName: string;
  file: string;
  line: number;
  property: string;
}

export function extractTokenReferences(cssFiles: CSSFileInfo[]): TokenReference[] {
  const references: TokenReference[] = [];

  cssFiles.forEach(fileInfo => {
    csstree.walk(fileInfo.ast, {
      visit: 'Declaration',
      enter(node: any) {
        // Check if the value contains var() function
        csstree.walk(node.value, {
          visit: 'Function',
          enter(funcNode: any) {
            if (funcNode.name === 'var') {
              // Extract the token name from var(--token-name)
              const tokenNameNode = funcNode.children.first;
              if (tokenNameNode) {
                let tokenName = '';
                // The token name already includes the -- prefix
                if (tokenNameNode.type === 'Identifier') {
                  tokenName = tokenNameNode.name;
                } else if (tokenNameNode.type === 'Dashed') {
                  tokenName = tokenNameNode.name;
                }
                
                if (tokenName) {
                  references.push({
                    tokenName,
                    file: fileInfo.path,
                    line: node.loc?.start.line || 0,
                    property: node.property,
                  });
                }
              }
            }
          },
        });
      },
    });
  });

  return references;
}

/**
 * Find token references that are not defined in the tokens/ directory
 */
export function findUndefinedTokenReferences(
  cssFiles: CSSFileInfo[],
  tokensDir: string
): TokenReference[] {
  const references = extractTokenReferences(cssFiles);
  const tokenFiles = cssFiles.filter(file => file.path.includes(tokensDir));
  const definedTokens = extractTokenDefinitions(tokenFiles);
  const definedTokenNames = new Set(definedTokens.keys());

  return references.filter(ref => !definedTokenNames.has(ref.tokenName));
}
