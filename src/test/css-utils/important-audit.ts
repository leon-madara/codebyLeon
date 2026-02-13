/**
 * !important Declaration Audit Utility
 * 
 * Provides detailed auditing of !important declarations in CSS files
 */

import * as csstree from 'css-tree';
import { parseCSSFile, findCSSFiles } from './parser';
import { writeFileSync } from 'fs';
import { join } from 'path';

export interface ImportantDeclaration {
  file: string;
  line: number;
  selector: string;
  property: string;
  value: string;
  reason?: string;
  mediaQuery?: string;
}

/**
 * Extract all !important declarations with detailed information
 */
export function auditImportantDeclarations(dir: string): ImportantDeclaration[] {
  const cssFiles = findCSSFiles(dir);
  const declarations: ImportantDeclaration[] = [];
  const seen = new Set<string>();

  cssFiles.forEach(filePath => {
    const fileInfo = parseCSSFile(filePath);
    
    // Walk through the AST and track media query context
    const processNode = (node: any, mediaQuery?: string) => {
      if (node.type === 'Atrule' && node.name === 'media') {
        const newMediaQuery = node.prelude ? csstree.generate(node.prelude) : undefined;
        if (node.block) {
          csstree.walk(node.block, {
            visit: 'Rule',
            enter(ruleNode: any) {
              processRule(ruleNode, filePath, newMediaQuery);
            },
          });
        }
      } else if (node.type === 'Rule' && !mediaQuery) {
        // Only process top-level rules here (not inside media queries)
        processRule(node, filePath, mediaQuery);
      }
    };
    
    const processRule = (ruleNode: any, filePath: string, mediaQuery?: string) => {
      if (ruleNode.prelude && ruleNode.prelude.type === 'SelectorList') {
        const selectorText = csstree.generate(ruleNode.prelude);
        
        if (ruleNode.block && ruleNode.block.children) {
          ruleNode.block.children.forEach((node: any) => {
            if (node.type === 'Declaration' && node.important) {
              const property = node.property;
              const value = csstree.generate(node.value);
              const line = node.loc?.start.line || 0;
              
              // Create unique key to avoid duplicates
              const key = `${filePath}:${line}:${selectorText}:${property}`;
              if (seen.has(key)) return;
              seen.add(key);
              
              const reason = determineReason(filePath, property, selectorText, mediaQuery);
              
              declarations.push({
                file: filePath,
                line,
                selector: selectorText,
                property,
                value,
                reason,
                mediaQuery,
              });
            }
          });
        }
      }
    };
    
    csstree.walk(fileInfo.ast, {
      enter(node: any) {
        processNode(node);
      },
    });
  });

  return declarations;
}

/**
 * Determine the likely reason for !important usage
 */
function determineReason(filePath: string, property: string, selector: string, mediaQuery?: string): string {
  // Check if it's in utilities directory
  if (filePath.includes('utilities/') || filePath.includes('utilities\\')) {
    return 'Utility class override';
  }
  
  // Check for accessibility patterns
  if (selector.includes('sr-only') || selector.includes('visually-hidden')) {
    if (property === 'display' || property === 'position' || property === 'clip') {
      return 'Accessibility requirement';
    }
  }
  
  // Check for prefers-reduced-motion accessibility
  if (mediaQuery && mediaQuery.includes('prefers-reduced-motion')) {
    return 'Accessibility requirement (reduced motion)';
  }
  
  // Check for Tailwind utility overrides
  if (selector.startsWith('.') && selector.split(' ').length === 1) {
    return 'Possible utility class';
  }
  
  // Check for specificity conflict indicators
  if (selector.includes('.') && selector.includes(' ')) {
    return 'Specificity conflict - needs resolution';
  }
  
  return 'Unknown - requires investigation';
}

/**
 * Group declarations by directory
 */
export function groupByDirectory(declarations: ImportantDeclaration[]): Map<string, ImportantDeclaration[]> {
  const groups = new Map<string, ImportantDeclaration[]>();
  
  declarations.forEach(decl => {
    // Extract directory category (tokens, base, layout, components, sections, features, utilities)
    const pathParts = decl.file.split(/[/\\]/);
    const stylesIndex = pathParts.indexOf('styles');
    const category = stylesIndex >= 0 && pathParts[stylesIndex + 1] 
      ? pathParts[stylesIndex + 1] 
      : 'other';
    
    const existing = groups.get(category) || [];
    existing.push(decl);
    groups.set(category, existing);
  });
  
  return groups;
}

/**
 * Generate audit report
 */
export function generateAuditReport(declarations: ImportantDeclaration[]): string {
  const grouped = groupByDirectory(declarations);
  const totalCount = declarations.length;
  
  let report = '# !important Declaration Audit Report\n\n';
  report += `**Generated:** ${new Date().toISOString()}\n\n`;
  report += `**Total !important declarations found:** ${totalCount}\n\n`;
  
  if (totalCount === 0) {
    report += '✅ No !important declarations found!\n';
    return report;
  }
  
  report += '## Summary by Directory\n\n';
  grouped.forEach((decls, category) => {
    report += `- **${category}**: ${decls.length} declaration(s)\n`;
  });
  report += '\n';
  
  report += '## Detailed Findings\n\n';
  
  grouped.forEach((decls, category) => {
    report += `### ${category}/ (${decls.length} declaration(s))\n\n`;
    
    decls.forEach((decl, index) => {
      report += `#### ${index + 1}. ${decl.file}:${decl.line}\n\n`;
      report += `- **Selector:** \`${decl.selector}\`\n`;
      if (decl.mediaQuery) {
        report += `- **Media Query:** \`@media ${decl.mediaQuery}\`\n`;
      }
      report += `- **Property:** \`${decl.property}: ${decl.value} !important\`\n`;
      report += `- **Reason:** ${decl.reason}\n`;
      report += `- **Action Required:** `;
      
      if (category === 'utilities') {
        report += '✅ Acceptable (utility class)\n';
      } else if (decl.reason?.includes('Accessibility requirement')) {
        report += '✅ Acceptable (accessibility)\n';
      } else {
        report += '❌ Must be removed - resolve specificity conflict\n';
      }
      
      report += '\n';
    });
  });
  
  report += '## Recommendations\n\n';
  
  const componentsCount = grouped.get('components')?.length || 0;
  const sectionsCount = grouped.get('sections')?.length || 0;
  const layoutCount = grouped.get('layout')?.length || 0;
  const featuresCount = grouped.get('features')?.filter(d => !d.reason?.includes('Accessibility')).length || 0;
  
  const needsRemoval = componentsCount + sectionsCount + layoutCount + featuresCount;
  
  if (needsRemoval > 0) {
    report += `### Priority: Remove ${needsRemoval} !important declaration(s)\n\n`;
    
    if (componentsCount > 0) {
      report += `1. **components/**: ${componentsCount} declaration(s) - Resolve specificity conflicts by:\n`;
      report += '   - Adjusting cascade order in index.css\n';
      report += '   - Using more specific selectors without !important\n';
      report += '   - Ensuring component styles load after base styles\n\n';
    }
    
    if (sectionsCount > 0) {
      report += `2. **sections/**: ${sectionsCount} declaration(s) - Resolve specificity conflicts by:\n`;
      report += '   - Adjusting cascade order in index.css\n';
      report += '   - Ensuring sections load after components\n';
      report += '   - Using BEM naming to avoid conflicts\n\n';
    }
    
    if (layoutCount > 0) {
      report += `3. **layout/**: ${layoutCount} declaration(s) - Resolve specificity conflicts by:\n`;
      report += '   - Adjusting cascade order in index.css\n';
      report += '   - Ensuring layout styles load early in cascade\n\n';
    }
    
    if (featuresCount > 0) {
      report += `4. **features/**: ${featuresCount} declaration(s) - Resolve specificity conflicts by:\n`;
      report += '   - Adjusting cascade order in index.css\n';
      report += '   - Using feature-specific class names\n\n';
    }
  } else {
    report += '✅ All !important declarations are in acceptable locations (utilities/ or accessibility)\n\n';
  }
  
  return report;
}

/**
 * Save audit report to file
 */
export function saveAuditReport(declarations: ImportantDeclaration[], outputPath: string): void {
  const report = generateAuditReport(declarations);
  writeFileSync(outputPath, report, 'utf-8');
}

/**
 * Run complete audit and save report
 */
export function runAudit(stylesDir: string, outputPath: string): ImportantDeclaration[] {
  console.log('🔍 Auditing !important declarations...');
  const declarations = auditImportantDeclarations(stylesDir);
  console.log(`📊 Found ${declarations.length} !important declaration(s)`);
  
  saveAuditReport(declarations, outputPath);
  console.log(`📝 Report saved to: ${outputPath}`);
  
  return declarations;
}
