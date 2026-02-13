/**
 * Inline Styles Audit Utility
 * 
 * Analyzes TSX/JSX files to identify and categorize inline styles.
 * Categorizes styles as static (hardcoded values) or dynamic (computed/variable values).
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

export interface InlineStyleOccurrence {
  file: string;
  line: number;
  styleContent: string;
  isStatic: boolean;
  isDynamic: boolean;
  properties: string[];
}

export interface InlineStyleAuditResult {
  totalFiles: number;
  filesWithInlineStyles: number;
  totalInlineStyles: number;
  staticStyles: number;
  dynamicStyles: number;
  occurrences: InlineStyleOccurrence[];
  summary: {
    byFile: Record<string, number>;
    byType: {
      static: number;
      dynamic: number;
      mixed: number;
    };
  };
}

/**
 * Determines if a style value is static (hardcoded) or dynamic (computed/variable)
 */
function isStaticValue(value: string): boolean {
  // Dynamic indicators:
  // - Contains template literals with expressions: ${...}
  // - Contains variable references without quotes
  // - Contains function calls
  // - Contains ternary operators
  // - Contains mathematical operations
  
  const dynamicPatterns = [
    /\$\{[^}]+\}/,           // Template literal expressions
    /\b(props|state|index|i)\b/, // Common variable names
    /\?\s*[^:]+\s*:/,       // Ternary operators
    /[\+\-\*\/]\s*\d/,      // Math operations
    /\b(Math|Number|String)\./,  // Function calls
  ];
  
  return !dynamicPatterns.some(pattern => pattern.test(value));
}

/**
 * Analyzes a style attribute to determine if it's static or dynamic
 */
function analyzeStyleAttribute(styleContent: string): { isStatic: boolean; isDynamic: boolean; properties: string[] } {
  const properties: string[] = [];
  let hasStatic = false;
  let hasDynamic = false;
  
  // Extract property names and values
  // Handle both object notation and template strings
  const propertyMatches = styleContent.matchAll(/(\w+):\s*([^,}]+)/g);
  
  for (const match of propertyMatches) {
    const propName = match[1];
    const propValue = match[2].trim();
    
    properties.push(propName);
    
    if (isStaticValue(propValue)) {
      hasStatic = true;
    } else {
      hasDynamic = true;
    }
  }
  
  return {
    isStatic: hasStatic && !hasDynamic,
    isDynamic: hasDynamic,
    properties
  };
}

/**
 * Parses a TSX/JSX file to find inline style attributes
 */
function parseFileForInlineStyles(filePath: string): InlineStyleOccurrence[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const occurrences: InlineStyleOccurrence[] = [];
  
  // Find style={ patterns
  const styleRegex = /style=\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
  
  let match;
  while ((match = styleRegex.exec(content)) !== null) {
    const styleContent = match[1];
    const position = match.index;
    
    // Find line number
    let lineNumber = 1;
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1; // +1 for newline
      if (charCount > position) {
        lineNumber = i + 1;
        break;
      }
    }
    
    const analysis = analyzeStyleAttribute(styleContent);
    
    occurrences.push({
      file: filePath,
      line: lineNumber,
      styleContent: styleContent.substring(0, 100), // Truncate for readability
      isStatic: analysis.isStatic,
      isDynamic: analysis.isDynamic,
      properties: analysis.properties
    });
  }
  
  return occurrences;
}

/**
 * Audits all TSX/JSX files in the project for inline styles
 */
export async function auditInlineStyles(rootDir: string = 'src'): Promise<InlineStyleAuditResult> {
  // Find all TSX/JSX files
  const tsxFiles = await glob(`${rootDir}/**/*.tsx`, { 
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.tsx', '**/*.spec.tsx']
  });
  
  const allOccurrences: InlineStyleOccurrence[] = [];
  const byFile: Record<string, number> = {};
  
  for (const file of tsxFiles) {
    const occurrences = parseFileForInlineStyles(file);
    allOccurrences.push(...occurrences);
    
    if (occurrences.length > 0) {
      byFile[file] = occurrences.length;
    }
  }
  
  // Calculate statistics
  const staticStyles = allOccurrences.filter(o => o.isStatic).length;
  const dynamicStyles = allOccurrences.filter(o => o.isDynamic).length;
  const mixedStyles = allOccurrences.filter(o => o.isStatic && o.isDynamic).length;
  
  return {
    totalFiles: tsxFiles.length,
    filesWithInlineStyles: Object.keys(byFile).length,
    totalInlineStyles: allOccurrences.length,
    staticStyles,
    dynamicStyles,
    occurrences: allOccurrences,
    summary: {
      byFile,
      byType: {
        static: staticStyles,
        dynamic: dynamicStyles - mixedStyles,
        mixed: mixedStyles
      }
    }
  };
}

/**
 * Generates a detailed audit report
 */
export function generateAuditReport(result: InlineStyleAuditResult): string {
  const lines: string[] = [];
  
  lines.push('# Inline Styles Audit Report');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push('');
  
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total TSX/JSX Files Scanned:** ${result.totalFiles}`);
  lines.push(`- **Files with Inline Styles:** ${result.filesWithInlineStyles}`);
  lines.push(`- **Total Inline Style Attributes:** ${result.totalInlineStyles}`);
  lines.push(`- **Static Styles (hardcoded values):** ${result.staticStyles} (${((result.staticStyles / result.totalInlineStyles) * 100).toFixed(1)}%)`);
  lines.push(`- **Dynamic Styles (computed values):** ${result.dynamicStyles} (${((result.dynamicStyles / result.totalInlineStyles) * 100).toFixed(1)}%)`);
  lines.push('');
  
  lines.push('## Baseline Count');
  lines.push('');
  lines.push(`**${result.totalInlineStyles}** inline style attributes found across ${result.filesWithInlineStyles} files.`);
  lines.push('');
  lines.push('This baseline will be used to measure the 90% reduction target (Requirement 9.1).');
  lines.push('');
  
  lines.push('## By File');
  lines.push('');
  const sortedFiles = Object.entries(result.summary.byFile)
    .sort((a, b) => b[1] - a[1]);
  
  for (const [file, count] of sortedFiles) {
    lines.push(`- **${file}**: ${count} inline styles`);
  }
  lines.push('');
  
  lines.push('## By Type');
  lines.push('');
  lines.push(`- **Pure Static:** ${result.summary.byType.static} (should be converted to CSS classes)`);
  lines.push(`- **Pure Dynamic:** ${result.summary.byType.dynamic} (should use CSS custom properties)`);
  lines.push(`- **Mixed (static + dynamic):** ${result.summary.byType.mixed} (requires case-by-case analysis)`);
  lines.push('');
  
  lines.push('## Detailed Occurrences');
  lines.push('');
  
  // Group by file
  const byFile = new Map<string, InlineStyleOccurrence[]>();
  for (const occurrence of result.occurrences) {
    if (!byFile.has(occurrence.file)) {
      byFile.set(occurrence.file, []);
    }
    byFile.get(occurrence.file)!.push(occurrence);
  }
  
  for (const [file, occurrences] of byFile) {
    lines.push(`### ${file}`);
    lines.push('');
    
    for (const occ of occurrences) {
      const type = occ.isStatic && !occ.isDynamic ? 'STATIC' : 
                   occ.isDynamic && !occ.isStatic ? 'DYNAMIC' : 'MIXED';
      lines.push(`**Line ${occ.line}** [${type}]`);
      lines.push('```tsx');
      lines.push(`style={${occ.styleContent}${occ.styleContent.length >= 100 ? '...' : ''}}`);
      lines.push('```');
      lines.push(`Properties: ${occ.properties.join(', ')}`);
      lines.push('');
    }
  }
  
  lines.push('## Recommendations');
  lines.push('');
  lines.push('### Static Styles (Task 25.2)');
  lines.push('Convert static inline styles to CSS classes:');
  lines.push('- Extract hardcoded values to appropriate CSS files');
  lines.push('- Replace `style={{...}}` with `className="..."`');
  lines.push('- Use existing component CSS files or create new ones as needed');
  lines.push('');
  lines.push('### Dynamic Styles (Task 25.3)');
  lines.push('Convert dynamic inline styles to CSS custom properties:');
  lines.push('- Define CSS rules using custom properties: `animation-delay: var(--delay)`');
  lines.push('- Set custom properties via inline styles: `style={{ "--delay": \`\${index * 100}ms\` }}`');
  lines.push('- This maintains dynamic behavior while centralizing styling logic');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * CLI entry point - auto-execute when run directly
 */
(async () => {
  console.log('Starting inline styles audit...\n');
  
  const result = await auditInlineStyles('src');
  const report = generateAuditReport(result);
  
  // Write report to file
  const reportPath = 'INLINE_STYLES_AUDIT_REPORT.md';
  fs.writeFileSync(reportPath, report);
  
  console.log(`Audit complete!`);
  console.log(`Total inline styles found: ${result.totalInlineStyles}`);
  console.log(`Report written to: ${reportPath}`);
})();
