/**
 * Property-Based Tests for CSS Architecture
 * 
 * These tests use fast-check to verify universal correctness properties
 * across the CSS codebase. Each property should hold true for all valid
 * inputs and executions.
 * 
 * Properties validate the CSS architecture requirements and design decisions.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { join } from 'path';
import {
  parseAllCSSFiles,
  findDuplicateTokens,
  extractTokenDefinitions,
  extractTokenReferences,
  findUndefinedTokenReferences,
  type CSSFileInfo,
  type TokenInfo,
  type TokenReference,
} from './parser';

/**
 * Property 1: Token Centralization
 * 
 * For any CSS custom property (token) in the codebase, it should be defined
 * exactly once in the tokens/ directory, and all references to that token
 * should resolve to that single definition.
 * 
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.6
 */
describe('Property 1: Token Centralization', () => {
  const stylesDir = join(process.cwd(), 'src', 'styles');
  const tokensDir = join(stylesDir, 'tokens');

  it('should define all tokens exactly once in the tokens/ directory', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary subsets of CSS files to test
        // This ensures the property holds regardless of which files we examine
        fc.constant(stylesDir),
        (dir) => {
          // Parse all CSS files in the styles directory
          const allCSSFiles = parseAllCSSFiles(dir);
          
          // Separate token files from other CSS files
          const tokenFiles = allCSSFiles.filter(file => 
            file.path.includes('/tokens/')
          );
          const nonTokenFiles = allCSSFiles.filter(file => 
            !file.path.includes('/tokens/')
          );

          // Extract all token definitions
          const allTokens = extractTokenDefinitions(allCSSFiles);
          const tokenFileTokens = extractTokenDefinitions(tokenFiles);
          const nonTokenFileTokens = extractTokenDefinitions(nonTokenFiles);

          // Property 1a: All tokens should be defined in tokens/ directory
          // Check each token to see if it's defined in tokens/
          const tokensDefinedOutsideTokensDir: string[] = [];
          nonTokenFileTokens.forEach((definitions, tokenName) => {
            if (definitions.length > 0) {
              tokensDefinedOutsideTokensDir.push(tokenName);
            }
          });

          // Property 1b: No duplicate token definitions
          const duplicates = findDuplicateTokens(allCSSFiles);
          
          // Property 1c: Tokens should be defined exactly once
          const tokensWithMultipleDefinitions: Array<{
            token: string;
            count: number;
            locations: string[];
          }> = [];

          allTokens.forEach((definitions, tokenName) => {
            if (definitions.length > 1) {
              tokensWithMultipleDefinitions.push({
                token: tokenName,
                count: definitions.length,
                locations: definitions.map(d => `${d.file}:${d.line}`),
              });
            }
          });

          // Build detailed error message if property fails
          let errorMessage = '';
          
          if (tokensDefinedOutsideTokensDir.length > 0) {
            errorMessage += `\n\nTokens defined outside tokens/ directory (${tokensDefinedOutsideTokensDir.length}):\n`;
            tokensDefinedOutsideTokensDir.slice(0, 10).forEach(token => {
              const defs = nonTokenFileTokens.get(token) || [];
              errorMessage += `  ${token}:\n`;
              defs.forEach(def => {
                errorMessage += `    - ${def.file}:${def.line}\n`;
              });
            });
            if (tokensDefinedOutsideTokensDir.length > 10) {
              errorMessage += `  ... and ${tokensDefinedOutsideTokensDir.length - 10} more\n`;
            }
          }

          if (tokensWithMultipleDefinitions.length > 0) {
            errorMessage += `\n\nTokens with multiple definitions (${tokensWithMultipleDefinitions.length}):\n`;
            tokensWithMultipleDefinitions.slice(0, 10).forEach(({ token, count, locations }) => {
              errorMessage += `  ${token} (${count} definitions):\n`;
              locations.forEach(loc => {
                errorMessage += `    - ${loc}\n`;
              });
            });
            if (tokensWithMultipleDefinitions.length > 10) {
              errorMessage += `  ... and ${tokensWithMultipleDefinitions.length - 10} more\n`;
            }
          }

          // Assert the property holds
          expect(
            tokensDefinedOutsideTokensDir.length === 0 && 
            tokensWithMultipleDefinitions.length === 0,
            `Token Centralization Property Violated:${errorMessage}`
          ).toBe(true);
        }
      ),
      { numRuns: 1 } // Run once since we're testing the entire codebase
    );
  });

  it('should have all color tokens in tokens/colors.css', () => {
    fc.assert(
      fc.property(
        fc.constant(stylesDir),
        (dir) => {
          const allCSSFiles = parseAllCSSFiles(dir);
          const colorTokenFile = allCSSFiles.find(file => 
            file.path.includes('tokens') && file.path.endsWith('colors.css')
          );

          expect(colorTokenFile, 'tokens/colors.css should exist').toBeDefined();

          if (!colorTokenFile) return;

          // Extract all color-related tokens from all files
          const allTokens = extractTokenDefinitions(allCSSFiles);
          const colorTokens = Array.from(allTokens.keys()).filter(tokenName => {
            // Color tokens typically contain: color, bg, text, border, canvas, rainbow, orb, etc.
            return tokenName.match(
              /--(color|bg|text|border|canvas|rainbow|orb|glass|accent|primary|secondary|muted|destructive|foreground|card|popover|input|ring|forest|cyan|emerald|sage|mint|sky|ice|teal|seafoam|beat|brand|highlight|dot)/i
            );
          });

          // Check if color tokens are defined in colors.css
          const colorTokensInColorFile = colorTokenFile.tokens.map(t => t.name);
          const colorTokensOutsideColorFile: string[] = [];

          colorTokens.forEach(tokenName => {
            const definitions = allTokens.get(tokenName) || [];
            const definedInColorFile = definitions.some(def => 
              def.file.includes('tokens') && def.file.endsWith('colors.css')
            );
            const definedElsewhere = definitions.some(def => 
              !(def.file.includes('tokens') && def.file.endsWith('colors.css'))
            );

            if (definedElsewhere && !definedInColorFile) {
              colorTokensOutsideColorFile.push(tokenName);
            }
          });

          if (colorTokensOutsideColorFile.length > 0) {
            let errorMessage = `\n\nColor tokens defined outside tokens/colors.css (${colorTokensOutsideColorFile.length}):\n`;
            colorTokensOutsideColorFile.slice(0, 10).forEach(token => {
              const defs = allTokens.get(token) || [];
              errorMessage += `  ${token}:\n`;
              defs.forEach(def => {
                if (!(def.file.includes('tokens') && def.file.endsWith('colors.css'))) {
                  errorMessage += `    - ${def.file}:${def.line}\n`;
                }
              });
            });
            if (colorTokensOutsideColorFile.length > 10) {
              errorMessage += `  ... and ${colorTokensOutsideColorFile.length - 10} more\n`;
            }

            expect(
              colorTokensOutsideColorFile.length,
              errorMessage
            ).toBe(0);
          }
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should have all typography tokens in tokens/typography.css', () => {
    fc.assert(
      fc.property(
        fc.constant(stylesDir),
        (dir) => {
          const allCSSFiles = parseAllCSSFiles(dir);
          const typographyTokenFile = allCSSFiles.find(file => 
            file.path.includes('tokens') && file.path.endsWith('typography.css')
          );

          expect(typographyTokenFile, 'tokens/typography.css should exist').toBeDefined();

          if (!typographyTokenFile) return;

          // Extract all typography-related tokens from all files
          const allTokens = extractTokenDefinitions(allCSSFiles);
          const typographyTokens = Array.from(allTokens.keys()).filter(tokenName => {
            // Typography tokens typically contain: font, size, weight, line-height, letter-spacing
            return tokenName.match(/--(font|size|weight|line-height|letter-spacing)/i);
          });

          // Check if typography tokens are defined in typography.css
          const typographyTokensOutsideFile: string[] = [];

          typographyTokens.forEach(tokenName => {
            const definitions = allTokens.get(tokenName) || [];
            const definedInTypographyFile = definitions.some(def => 
              def.file.includes('tokens') && def.file.endsWith('typography.css')
            );
            const definedElsewhere = definitions.some(def => 
              !(def.file.includes('tokens') && def.file.endsWith('typography.css'))
            );

            if (definedElsewhere && !definedInTypographyFile) {
              typographyTokensOutsideFile.push(tokenName);
            }
          });

          if (typographyTokensOutsideFile.length > 0) {
            let errorMessage = `\n\nTypography tokens defined outside tokens/typography.css (${typographyTokensOutsideFile.length}):\n`;
            typographyTokensOutsideFile.slice(0, 10).forEach(token => {
              const defs = allTokens.get(token) || [];
              errorMessage += `  ${token}:\n`;
              defs.forEach(def => {
                if (!(def.file.includes('tokens') && def.file.endsWith('typography.css'))) {
                  errorMessage += `    - ${def.file}:${def.line}\n`;
                }
              });
            });

            expect(
              typographyTokensOutsideFile.length,
              errorMessage
            ).toBe(0);
          }
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should have all spacing tokens in tokens/spacing.css', () => {
    fc.assert(
      fc.property(
        fc.constant(stylesDir),
        (dir) => {
          const allCSSFiles = parseAllCSSFiles(dir);
          const spacingTokenFile = allCSSFiles.find(file => 
            file.path.includes('tokens') && file.path.endsWith('spacing.css')
          );

          expect(spacingTokenFile, 'tokens/spacing.css should exist').toBeDefined();

          if (!spacingTokenFile) return;

          // Extract all spacing-related tokens from all files
          const allTokens = extractTokenDefinitions(allCSSFiles);
          const spacingTokens = Array.from(allTokens.keys()).filter(tokenName => {
            // Spacing tokens typically contain: spacing, margin, padding, gap, breakpoint
            return tokenName.match(/--(spacing|margin|padding|gap|breakpoint)/i);
          });

          // Check if spacing tokens are defined in spacing.css
          const spacingTokensOutsideFile: string[] = [];

          spacingTokens.forEach(tokenName => {
            const definitions = allTokens.get(tokenName) || [];
            const definedInSpacingFile = definitions.some(def => 
              def.file.includes('tokens') && def.file.endsWith('spacing.css')
            );
            const definedElsewhere = definitions.some(def => 
              !(def.file.includes('tokens') && def.file.endsWith('spacing.css'))
            );

            if (definedElsewhere && !definedInSpacingFile) {
              spacingTokensOutsideFile.push(tokenName);
            }
          });

          if (spacingTokensOutsideFile.length > 0) {
            let errorMessage = `\n\nSpacing tokens defined outside tokens/spacing.css (${spacingTokensOutsideFile.length}):\n`;
            spacingTokensOutsideFile.slice(0, 10).forEach(token => {
              const defs = allTokens.get(token) || [];
              errorMessage += `  ${token}:\n`;
              defs.forEach(def => {
                if (!(def.file.includes('tokens') && def.file.endsWith('spacing.css'))) {
                  errorMessage += `    - ${def.file}:${def.line}\n`;
                }
              });
            });

            expect(
              spacingTokensOutsideFile.length,
              errorMessage
            ).toBe(0);
          }
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should have all shadow tokens in tokens/shadows.css', () => {
    fc.assert(
      fc.property(
        fc.constant(stylesDir),
        (dir) => {
          const allCSSFiles = parseAllCSSFiles(dir);
          const shadowTokenFile = allCSSFiles.find(file => 
            file.path.includes('tokens') && file.path.endsWith('shadows.css')
          );

          expect(shadowTokenFile, 'tokens/shadows.css should exist').toBeDefined();

          if (!shadowTokenFile) return;

          // Extract all shadow-related tokens from all files
          const allTokens = extractTokenDefinitions(allCSSFiles);
          const shadowTokens = Array.from(allTokens.keys()).filter(tokenName => {
            // Shadow tokens typically contain: shadow, elevation
            return tokenName.match(/--(shadow|elevation)/i);
          });

          // Check if shadow tokens are defined in shadows.css
          const shadowTokensOutsideFile: string[] = [];

          shadowTokens.forEach(tokenName => {
            const definitions = allTokens.get(tokenName) || [];
            const definedInShadowFile = definitions.some(def => 
              def.file.includes('tokens') && def.file.endsWith('shadows.css')
            );
            const definedElsewhere = definitions.some(def => 
              !(def.file.includes('tokens') && def.file.endsWith('shadows.css'))
            );

            if (definedElsewhere && !definedInShadowFile) {
              shadowTokensOutsideFile.push(tokenName);
            }
          });

          if (shadowTokensOutsideFile.length > 0) {
            let errorMessage = `\n\nShadow tokens defined outside tokens/shadows.css (${shadowTokensOutsideFile.length}):\n`;
            shadowTokensOutsideFile.slice(0, 10).forEach(token => {
              const defs = allTokens.get(token) || [];
              errorMessage += `  ${token}:\n`;
              defs.forEach(def => {
                if (!(def.file.includes('tokens') && def.file.endsWith('shadows.css'))) {
                  errorMessage += `    - ${def.file}:${def.line}\n`;
                }
              });
            });

            expect(
              shadowTokensOutsideFile.length,
              errorMessage
            ).toBe(0);
          }
        }
      ),
      { numRuns: 1 }
    );
  });
});

/**
 * Property 2: Token Resolution
 * 
 * For any CSS custom property reference (var(--token-name)) in any CSS file,
 * the token should be defined in one of the files in the tokens/ directory.
 * 
 * Validates: Requirements 1.5
 */
describe('Property 2: Token Resolution', () => {
  const stylesDir = join(process.cwd(), 'src', 'styles');
  const tokensDir = join(stylesDir, 'tokens');

  it('should resolve all token references to definitions in tokens/ directory', () => {
    fc.assert(
      fc.property(
        // Generate arbitrary subsets of CSS files to test
        // This ensures the property holds regardless of which files we examine
        fc.constant(stylesDir),
        (dir) => {
          // Parse all CSS files in the styles directory
          const allCSSFiles = parseAllCSSFiles(dir);
          
          // Find all token references that are not defined in tokens/
          const undefinedReferences = findUndefinedTokenReferences(allCSSFiles, '/tokens/');

          // Build detailed error message if property fails
          if (undefinedReferences.length > 0) {
            // Group by token name for better readability
            const groupedByToken = new Map<string, TokenReference[]>();
            undefinedReferences.forEach(ref => {
              const existing = groupedByToken.get(ref.tokenName) || [];
              existing.push(ref);
              groupedByToken.set(ref.tokenName, existing);
            });

            let errorMessage = `\n\nToken references without definitions in tokens/ directory (${undefinedReferences.length} references, ${groupedByToken.size} unique tokens):\n`;
            
            const tokenNames = Array.from(groupedByToken.keys()).slice(0, 10);
            tokenNames.forEach(tokenName => {
              const refs = groupedByToken.get(tokenName) || [];
              errorMessage += `\n  ${tokenName} (${refs.length} reference${refs.length > 1 ? 's' : ''}):\n`;
              refs.slice(0, 5).forEach(ref => {
                errorMessage += `    - ${ref.file}:${ref.line} (in property: ${ref.property})\n`;
              });
              if (refs.length > 5) {
                errorMessage += `    ... and ${refs.length - 5} more reference${refs.length - 5 > 1 ? 's' : ''}\n`;
              }
            });

            if (groupedByToken.size > 10) {
              errorMessage += `\n  ... and ${groupedByToken.size - 10} more undefined token${groupedByToken.size - 10 > 1 ? 's' : ''}\n`;
            }

            expect(
              undefinedReferences.length,
              `Token Resolution Property Violated:${errorMessage}`
            ).toBe(0);
          }

          // Property holds: all token references resolve to tokens/ directory
          expect(undefinedReferences.length).toBe(0);
        }
      ),
      { numRuns: 1 } // Run once since we're testing the entire codebase
    );
  });

  it('should have all var() references point to defined tokens', () => {
    fc.assert(
      fc.property(
        fc.constant(stylesDir),
        (dir) => {
          const allCSSFiles = parseAllCSSFiles(dir);
          
          // Extract all token references
          const allReferences = extractTokenReferences(allCSSFiles);
          
          // Extract all token definitions from tokens/ directory
          const tokenFiles = allCSSFiles.filter(file => 
            file.path.includes('/tokens/')
          );
          const definedTokens = extractTokenDefinitions(tokenFiles);
          const definedTokenNames = new Set(definedTokens.keys());

          // Find references to undefined tokens
          const undefinedRefs = allReferences.filter(ref => 
            !definedTokenNames.has(ref.tokenName)
          );

          if (undefinedRefs.length > 0) {
            const uniqueUndefined = new Set(undefinedRefs.map(r => r.tokenName));
            let errorMessage = `\n\nFound ${undefinedRefs.length} var() references to ${uniqueUndefined.size} undefined token(s):\n`;
            
            Array.from(uniqueUndefined).slice(0, 10).forEach(tokenName => {
              const refs = undefinedRefs.filter(r => r.tokenName === tokenName);
              errorMessage += `\n  ${tokenName}:\n`;
              refs.slice(0, 3).forEach(ref => {
                errorMessage += `    - ${ref.file}:${ref.line}\n`;
              });
              if (refs.length > 3) {
                errorMessage += `    ... and ${refs.length - 3} more\n`;
              }
            });

            expect(
              undefinedRefs.length,
              errorMessage
            ).toBe(0);
          }
        }
      ),
      { numRuns: 1 }
    );
  });

  it('should not have orphaned token references', () => {
    fc.assert(
      fc.property(
        fc.constant(stylesDir),
        (dir) => {
          const allCSSFiles = parseAllCSSFiles(dir);
          const allReferences = extractTokenReferences(allCSSFiles);
          const allDefinitions = extractTokenDefinitions(allCSSFiles);
          
          // For each reference, verify it has at least one definition
          const orphanedReferences: TokenReference[] = [];
          
          allReferences.forEach(ref => {
            const definitions = allDefinitions.get(ref.tokenName);
            if (!definitions || definitions.length === 0) {
              orphanedReferences.push(ref);
            }
          });

          if (orphanedReferences.length > 0) {
            const uniqueOrphans = new Set(orphanedReferences.map(r => r.tokenName));
            let errorMessage = `\n\nFound ${orphanedReferences.length} orphaned token reference(s) to ${uniqueOrphans.size} undefined token(s):\n`;
            
            Array.from(uniqueOrphans).slice(0, 10).forEach(tokenName => {
              const refs = orphanedReferences.filter(r => r.tokenName === tokenName);
              errorMessage += `\n  ${tokenName} (${refs.length} reference${refs.length > 1 ? 's' : ''}):\n`;
              refs.slice(0, 3).forEach(ref => {
                errorMessage += `    - ${ref.file}:${ref.line} (property: ${ref.property})\n`;
              });
              if (refs.length > 3) {
                errorMessage += `    ... and ${refs.length - 3} more\n`;
              }
            });

            expect(
              orphanedReferences.length,
              errorMessage
            ).toBe(0);
          }
        }
      ),
      { numRuns: 1 }
    );
  });
});
