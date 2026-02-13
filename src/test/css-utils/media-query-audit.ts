/**
 * Media Query Audit Utility
 * Analyzes all CSS files for media queries and validates breakpoint consistency
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseCSS } from './parser';

interface MediaQueryInfo {
  file: string;
  line: number;
  query: string;
  breakpoint: string | null;
  isMinWidth: boolean;
  isMaxWidth: boolean;
  component: string | null;
  hasBaseStyles: boolean;
}

interface BreakpointToken {
  name: string;
  value: string;
}

interface AuditReport {
  totalMediaQueries: number;
  fileCount: number;
  mediaQueries: MediaQueryInfo[];
  breakpointConsistency: {
    consistent: MediaQueryInfo[];
    inconsistent: MediaQueryInfo[];
  };
  mobileFirstCompliance: {
    compliant: MediaQueryInfo[];
    nonCompliant: MediaQueryInfo[];
  };
  coLocationIssues: {
    component: string;
    baseFile: string | null;
    mediaQueryFiles: string[];
  }[];
  breakpointTokens: BreakpointToken[];
}

/**
 * Extract breakpoint tokens from tokens/spacing.css
 */
function extractBreakpointTokens(stylesDir: string): BreakpointToken[] {
  const tokensPath = path.join(stylesDir, 'tokens', 'spacing.css');
  
  if (!fs.existsSync(tokensPath)) {
    return [];
  }

  const content = fs.readFileSync(tokensPath, 'utf-8');
  const tokens: BreakpointToken[] = [];
  
  // Match --breakpoint-* variables
  const tokenRegex = /--(breakpoint-[a-z0-9]+):\s*([^;]+);/g;
  let match;
  
  while ((match = tokenRegex.exec(content)) !== null) {
    tokens.push({
      name: match[1],
      value: match[2].trim()
    });
  }
  
  return tokens;
}

/**
 * Parse media query string to extract breakpoint value
 */
function extractBreakpointValue(query: string): string | null {
  // Match patterns like (min-width: 768px) or (max-width: 1024px)
  const match = query.match(/\((?:min-width|max-width):\s*([^)]+)\)/);
  return match ? match[1].trim() : null;
}

/**
 * Check if breakpoint value matches a token
 */
function matchesToken(breakpoint: string, tokens: BreakpointToken[]): boolean {
  return tokens.some(token => token.value === breakpoint);
}

/**
 * Extract component name from file path
 */
function extractComponentName(filePath: string): string | null {
  const match = filePath.match(/\/(components|sections|layout|features)\/([^/]+)\.css$/);
  return match ? match[2] : null;
}

/**
 * Check if a file contains base styles for a component
 */
function hasBaseStyles(filePath: string, content: string, component: string): boolean {
  // Look for base class definition (e.g., .navigation, .button, .hero)
  const baseClassRegex = new RegExp(`\\.${component}\\s*\\{`, 'i');
  return baseClassRegex.test(content);
}

/**
 * Find all CSS files recursively
 */
function findCSSFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, etc.
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        findCSSFiles(filePath, fileList);
      }
    } else if (file.endsWith('.css') && !file.endsWith('.module.css')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Parse media queries from CSS content
 */
function parseMediaQueries(filePath: string, content: string, tokens: BreakpointToken[]): MediaQueryInfo[] {
  const mediaQueries: MediaQueryInfo[] = [];
  const lines = content.split('\n');
  const component = extractComponentName(filePath);
  const hasBase = component ? hasBaseStyles(filePath, content, component) : false;
  
  // Match @media queries
  const mediaRegex = /@media\s+([^{]+)\{/g;
  let match;
  
  while ((match = mediaRegex.exec(content)) !== null) {
    const query = match[1].trim();
    const breakpoint = extractBreakpointValue(query);
    
    // Find line number
    const position = match.index;
    const lineNumber = content.substring(0, position).split('\n').length;
    
    mediaQueries.push({
      file: filePath,
      line: lineNumber,
      query,
      breakpoint,
      isMinWidth: query.includes('min-width'),
      isMaxWidth: query.includes('max-width'),
      component,
      hasBaseStyles: hasBase
    });
  }
  
  return mediaQueries;
}

/**
 * Analyze co-location issues
 */
function analyzeCoLocation(mediaQueries: MediaQueryInfo[]): AuditReport['coLocationIssues'] {
  const componentMap = new Map<string, { baseFile: string | null; mediaQueryFiles: Set<string> }>();
  
  mediaQueries.forEach(mq => {
    if (!mq.component) return;
    
    if (!componentMap.has(mq.component)) {
      componentMap.set(mq.component, {
        baseFile: null,
        mediaQueryFiles: new Set()
      });
    }
    
    const entry = componentMap.get(mq.component)!;
    
    if (mq.hasBaseStyles) {
      entry.baseFile = mq.file;
    }
    
    entry.mediaQueryFiles.add(mq.file);
  });
  
  const issues: AuditReport['coLocationIssues'] = [];
  
  componentMap.forEach((value, component) => {
    // Issue if media queries are in different files than base styles
    if (value.mediaQueryFiles.size > 1 || 
        (value.baseFile && value.mediaQueryFiles.size === 1 && !value.mediaQueryFiles.has(value.baseFile))) {
      issues.push({
        component,
        baseFile: value.baseFile,
        mediaQueryFiles: Array.from(value.mediaQueryFiles)
      });
    }
  });
  
  return issues;
}

/**
 * Audit all media queries in the styles directory
 */
export function auditMediaQueries(stylesDir: string): AuditReport {
  const tokens = extractBreakpointTokens(stylesDir);
  const cssFiles = findCSSFiles(stylesDir);
  const allMediaQueries: MediaQueryInfo[] = [];
  
  cssFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const queries = parseMediaQueries(file, content, tokens);
    allMediaQueries.push(...queries);
  });
  
  // Analyze breakpoint consistency
  const consistent: MediaQueryInfo[] = [];
  const inconsistent: MediaQueryInfo[] = [];
  
  allMediaQueries.forEach(mq => {
    if (mq.breakpoint && matchesToken(mq.breakpoint, tokens)) {
      consistent.push(mq);
    } else if (mq.breakpoint) {
      inconsistent.push(mq);
    }
  });
  
  // Analyze mobile-first compliance
  const compliant: MediaQueryInfo[] = [];
  const nonCompliant: MediaQueryInfo[] = [];
  
  allMediaQueries.forEach(mq => {
    if (mq.isMinWidth) {
      compliant.push(mq);
    } else if (mq.isMaxWidth) {
      nonCompliant.push(mq);
    }
  });
  
  // Analyze co-location
  const coLocationIssues = analyzeCoLocation(allMediaQueries);
  
  return {
    totalMediaQueries: allMediaQueries.length,
    fileCount: cssFiles.length,
    mediaQueries: allMediaQueries,
    breakpointConsistency: {
      consistent,
      inconsistent
    },
    mobileFirstCompliance: {
      compliant,
      nonCompliant
    },
    coLocationIssues,
    breakpointTokens: tokens
  };
}

/**
 * Generate a formatted audit report
 */
export function generateAuditReport(report: AuditReport): string {
  const lines: string[] = [];
  
  lines.push('# Media Query Audit Report');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push('');
  
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Media Queries:** ${report.totalMediaQueries}`);
  lines.push(`- **Files Analyzed:** ${report.fileCount}`);
  lines.push(`- **Breakpoint Tokens Defined:** ${report.breakpointTokens.length}`);
  lines.push('');
  
  lines.push('## Breakpoint Tokens');
  lines.push('');
  report.breakpointTokens.forEach(token => {
    lines.push(`- \`--${token.name}\`: ${token.value}`);
  });
  lines.push('');
  
  lines.push('## Breakpoint Consistency Analysis');
  lines.push('');
  lines.push(`**Consistent with tokens:** ${report.breakpointConsistency.consistent.length} / ${report.totalMediaQueries}`);
  lines.push(`**Inconsistent (not using tokens):** ${report.breakpointConsistency.inconsistent.length} / ${report.totalMediaQueries}`);
  lines.push('');
  
  if (report.breakpointConsistency.inconsistent.length > 0) {
    lines.push('### Inconsistent Breakpoints');
    lines.push('');
    lines.push('These media queries use hardcoded values instead of tokens:');
    lines.push('');
    report.breakpointConsistency.inconsistent.forEach(mq => {
      const relativePath = mq.file.replace(/^.*\/src\//, 'src/');
      lines.push(`- **${relativePath}:${mq.line}**`);
      lines.push(`  - Query: \`${mq.query}\``);
      lines.push(`  - Breakpoint: \`${mq.breakpoint}\``);
      lines.push('');
    });
  }
  
  lines.push('## Mobile-First Compliance');
  lines.push('');
  lines.push(`**Mobile-first (min-width):** ${report.mobileFirstCompliance.compliant.length} / ${report.totalMediaQueries}`);
  lines.push(`**Desktop-first (max-width):** ${report.mobileFirstCompliance.nonCompliant.length} / ${report.totalMediaQueries}`);
  lines.push('');
  
  if (report.mobileFirstCompliance.nonCompliant.length > 0) {
    lines.push('### Desktop-First Media Queries');
    lines.push('');
    lines.push('These media queries use max-width (should be converted to min-width):');
    lines.push('');
    report.mobileFirstCompliance.nonCompliant.forEach(mq => {
      const relativePath = mq.file.replace(/^.*\/src\//, 'src/');
      lines.push(`- **${relativePath}:${mq.line}**`);
      lines.push(`  - Query: \`${mq.query}\``);
      lines.push('');
    });
  }
  
  lines.push('## Co-Location Analysis');
  lines.push('');
  
  if (report.coLocationIssues.length === 0) {
    lines.push('✅ **All responsive styles are co-located with their base styles!**');
  } else {
    lines.push(`⚠️ **Found ${report.coLocationIssues.length} components with scattered responsive styles:**`);
    lines.push('');
    
    report.coLocationIssues.forEach(issue => {
      lines.push(`### Component: ${issue.component}`);
      lines.push('');
      lines.push(`- **Base styles:** ${issue.baseFile ? issue.baseFile.replace(/^.*\/src\//, 'src/') : 'Not found'}`);
      lines.push(`- **Media queries in:**`);
      issue.mediaQueryFiles.forEach(file => {
        lines.push(`  - ${file.replace(/^.*\/src\//, 'src/')}`);
      });
      lines.push('');
    });
  }
  
  lines.push('## All Media Queries');
  lines.push('');
  
  // Group by file
  const byFile = new Map<string, MediaQueryInfo[]>();
  report.mediaQueries.forEach(mq => {
    if (!byFile.has(mq.file)) {
      byFile.set(mq.file, []);
    }
    byFile.get(mq.file)!.push(mq);
  });
  
  Array.from(byFile.entries()).forEach(([file, queries]) => {
    const relativePath = file.replace(/^.*\/src\//, 'src/');
    lines.push(`### ${relativePath}`);
    lines.push('');
    queries.forEach(mq => {
      const type = mq.isMinWidth ? '📱 min-width' : mq.isMaxWidth ? '🖥️ max-width' : '❓ other';
      const consistent = mq.breakpoint && report.breakpointConsistency.consistent.includes(mq) ? '✅' : '⚠️';
      lines.push(`- Line ${mq.line}: ${type} ${consistent}`);
      lines.push(`  - \`${mq.query}\``);
    });
    lines.push('');
  });
  
  lines.push('## Recommendations');
  lines.push('');
  
  if (report.breakpointConsistency.inconsistent.length > 0) {
    lines.push('1. **Update inconsistent breakpoints** to use tokens from `tokens/spacing.css`');
  }
  
  if (report.mobileFirstCompliance.nonCompliant.length > 0) {
    lines.push('2. **Convert max-width queries to min-width** for mobile-first approach');
  }
  
  if (report.coLocationIssues.length > 0) {
    lines.push('3. **Move scattered responsive styles** to component base files');
  }
  
  if (report.breakpointConsistency.inconsistent.length === 0 && 
      report.mobileFirstCompliance.nonCompliant.length === 0 && 
      report.coLocationIssues.length === 0) {
    lines.push('✅ **No issues found! All media queries follow best practices.**');
  }
  
  return lines.join('\n');
}

/**
 * Main audit function
 */
export function runMediaQueryAudit(stylesDir: string, outputPath?: string): AuditReport {
  const report = auditMediaQueries(stylesDir);
  const markdown = generateAuditReport(report);
  
  if (outputPath) {
    fs.writeFileSync(outputPath, markdown, 'utf-8');
    console.log(`✅ Media query audit report written to: ${outputPath}`);
  }
  
  return report;
}
