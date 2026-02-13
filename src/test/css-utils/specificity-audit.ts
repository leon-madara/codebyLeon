/**
 * Specificity Audit Utility
 * 
 * Audits all CSS selectors for specificity compliance
 * Identifies selectors exceeding (0,0,2,0) and provides recommendations
 */

import { join } from 'path';
import { writeFileSync } from 'fs';
import {
  parseAllCSSFiles,
  extractAllSelectors,
  exceedsMaxSpecificity,
  type SelectorInfo,
  type SpecificityScore,
} from './parser';

export interface SpecificityAuditResult {
  totalSelectors: number;
  compliantSelectors: number;
  nonCompliantSelectors: number;
  complianceRate: number;
  violations: SpecificityViolation[];
  recommendations: string[];
}

export interface SpecificityViolation {
  selector: string;
  file: string;
  line: number;
  specificity: SpecificityScore;
  specificityString: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
}

/**
 * Format specificity score as string (inline, ids, classes, elements)
 */
function formatSpecificity(spec: SpecificityScore): string {
  return `(${spec.inline},${spec.ids},${spec.classes},${spec.elements})`;
}

/**
 * Determine severity of specificity violation
 */
function determineSeverity(spec: SpecificityScore): 'high' | 'medium' | 'low' {
  if (spec.inline > 0 || spec.ids > 0) return 'high';
  if (spec.classes > 3) return 'high';
  if (spec.classes === 3) return 'medium';
  return 'low';
}

/**
 * Generate recommendation for fixing specificity violation
 */
function generateRecommendation(selector: string, spec: SpecificityScore): string {
  const recommendations: string[] = [];

  // Check for ID selectors
  if (spec.ids > 0) {
    recommendations.push('Replace ID selectors with class selectors');
  }

  // Check for compound selectors
  if (selector.match(/[a-z]+\.[a-z]/i)) {
    recommendations.push('Remove compound element-class selectors (e.g., nav.navbar → .navbar)');
  }

  // Check for excessive class chaining
  if (spec.classes > 2) {
    recommendations.push('Reduce class chaining - use single class or BEM modifier instead');
  }

  // Check for descendant selectors
  if (selector.includes(' ') && !selector.includes('>')) {
    recommendations.push('Consider using direct child selector (>) or single class with BEM naming');
  }

  // Check for attribute selectors that could be classes
  if (selector.match(/\[[^\]]+\]/g) && !selector.includes('[data-theme')) {
    recommendations.push('Consider replacing attribute selectors with classes for better performance');
  }

  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push('Simplify selector structure or adjust cascade order in index.css');
  }

  return recommendations.join('; ');
}

/**
 * Audit all CSS files for specificity compliance
 */
export function auditSpecificity(stylesDir: string): SpecificityAuditResult {
  const cssFiles = parseAllCSSFiles(stylesDir);
  const allSelectors = extractAllSelectors(cssFiles);

  // Filter out utility files (they're allowed higher specificity)
  const selectorsToAudit = allSelectors.filter(
    selector => !selector.file.includes('utilities/')
  );

  const violations: SpecificityViolation[] = [];

  selectorsToAudit.forEach(selector => {
    if (exceedsMaxSpecificity(selector.specificity)) {
      violations.push({
        selector: selector.selector,
        file: selector.file,
        line: selector.line,
        specificity: selector.specificity,
        specificityString: formatSpecificity(selector.specificity),
        severity: determineSeverity(selector.specificity),
        recommendation: generateRecommendation(selector.selector, selector.specificity),
      });
    }
  });

  // Sort violations by severity and then by specificity
  violations.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    
    // Sort by total specificity (classes + elements)
    const aTotal = a.specificity.classes + a.specificity.elements;
    const bTotal = b.specificity.classes + b.specificity.elements;
    return bTotal - aTotal;
  });

  const totalSelectors = selectorsToAudit.length;
  const nonCompliantSelectors = violations.length;
  const compliantSelectors = totalSelectors - nonCompliantSelectors;
  const complianceRate = totalSelectors > 0 ? (compliantSelectors / totalSelectors) * 100 : 100;

  // Generate general recommendations
  const recommendations = generateGeneralRecommendations(violations);

  return {
    totalSelectors,
    compliantSelectors,
    nonCompliantSelectors,
    complianceRate,
    violations,
    recommendations,
  };
}

/**
 * Generate general recommendations based on violation patterns
 */
function generateGeneralRecommendations(violations: SpecificityViolation[]): string[] {
  const recommendations: string[] = [];

  // Count violation types
  const hasIdSelectors = violations.some(v => v.specificity.ids > 0);
  const hasCompoundSelectors = violations.some(v => v.selector.match(/[a-z]+\.[a-z]/i));
  const hasExcessiveChaining = violations.some(v => v.specificity.classes > 3);
  const hasDeepNesting = violations.some(v => (v.selector.match(/ /g) || []).length > 2);

  if (hasIdSelectors) {
    recommendations.push('Convert all ID selectors to class selectors for consistency');
  }

  if (hasCompoundSelectors) {
    recommendations.push('Eliminate compound selectors (e.g., nav.navbar) - use single classes with BEM naming');
  }

  if (hasExcessiveChaining) {
    recommendations.push('Reduce class chaining - prefer single class selectors with BEM modifiers');
  }

  if (hasDeepNesting) {
    recommendations.push('Flatten selector nesting - use BEM naming to avoid deep descendant selectors');
  }

  if (violations.length > 0) {
    recommendations.push('Review cascade order in index.css to resolve conflicts without increasing specificity');
    recommendations.push('Consider using CSS Modules for component-specific styles to avoid global conflicts');
  }

  return recommendations;
}

/**
 * Generate markdown report for specificity audit
 */
export function generateSpecificityReport(result: SpecificityAuditResult): string {
  const lines: string[] = [];

  lines.push('# CSS Specificity Audit Report');
  lines.push('');
  lines.push(`**Generated:** ${new Date().toISOString()}`);
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Selectors Audited:** ${result.totalSelectors}`);
  lines.push(`- **Compliant Selectors:** ${result.compliantSelectors} (${result.complianceRate.toFixed(1)}%)`);
  lines.push(`- **Non-Compliant Selectors:** ${result.nonCompliantSelectors}`);
  lines.push('');

  // Compliance status
  if (result.complianceRate === 100) {
    lines.push('✅ **All selectors comply with maximum specificity (0,0,2,0)**');
  } else if (result.complianceRate >= 90) {
    lines.push('⚠️ **Most selectors comply, but some violations need attention**');
  } else {
    lines.push('❌ **Significant specificity violations detected - refactoring required**');
  }
  lines.push('');

  // General recommendations
  if (result.recommendations.length > 0) {
    lines.push('## General Recommendations');
    lines.push('');
    result.recommendations.forEach(rec => {
      lines.push(`- ${rec}`);
    });
    lines.push('');
  }

  // Violations by severity
  if (result.violations.length > 0) {
    const highSeverity = result.violations.filter(v => v.severity === 'high');
    const mediumSeverity = result.violations.filter(v => v.severity === 'medium');
    const lowSeverity = result.violations.filter(v => v.severity === 'low');

    if (highSeverity.length > 0) {
      lines.push('## High Severity Violations');
      lines.push('');
      lines.push('These violations use ID selectors or excessive specificity and should be fixed immediately.');
      lines.push('');
      highSeverity.forEach(v => {
        lines.push(`### ${v.selector}`);
        lines.push('');
        lines.push(`- **File:** \`${v.file}\``);
        lines.push(`- **Line:** ${v.line}`);
        lines.push(`- **Specificity:** ${v.specificityString}`);
        lines.push(`- **Recommendation:** ${v.recommendation}`);
        lines.push('');
      });
    }

    if (mediumSeverity.length > 0) {
      lines.push('## Medium Severity Violations');
      lines.push('');
      lines.push('These violations exceed the maximum specificity but can be addressed in the next refactoring phase.');
      lines.push('');
      mediumSeverity.forEach(v => {
        lines.push(`### ${v.selector}`);
        lines.push('');
        lines.push(`- **File:** \`${v.file}\``);
        lines.push(`- **Line:** ${v.line}`);
        lines.push(`- **Specificity:** ${v.specificityString}`);
        lines.push(`- **Recommendation:** ${v.recommendation}`);
        lines.push('');
      });
    }

    if (lowSeverity.length > 0) {
      lines.push('## Low Severity Violations');
      lines.push('');
      lines.push('These violations slightly exceed the maximum specificity.');
      lines.push('');
      lowSeverity.forEach(v => {
        lines.push(`### ${v.selector}`);
        lines.push('');
        lines.push(`- **File:** \`${v.file}\``);
        lines.push(`- **Line:** ${v.line}`);
        lines.push(`- **Specificity:** ${v.specificityString}`);
        lines.push(`- **Recommendation:** ${v.recommendation}`);
        lines.push('');
      });
    }
  }

  // Detailed violations table
  if (result.violations.length > 0) {
    lines.push('## Detailed Violations Table');
    lines.push('');
    lines.push('| Selector | File | Line | Specificity | Severity | Recommendation |');
    lines.push('|----------|------|------|-------------|----------|----------------|');
    
    result.violations.forEach(v => {
      const fileName = v.file.split('/').slice(-2).join('/');
      lines.push(`| \`${v.selector}\` | ${fileName} | ${v.line} | ${v.specificityString} | ${v.severity} | ${v.recommendation} |`);
    });
    lines.push('');
  }

  // Next steps
  lines.push('## Next Steps');
  lines.push('');
  lines.push('1. Review high severity violations first');
  lines.push('2. Replace ID selectors with class selectors');
  lines.push('3. Eliminate compound selectors (e.g., nav.navbar → .navbar)');
  lines.push('4. Reduce class chaining by using BEM modifiers');
  lines.push('5. Adjust cascade order in index.css if needed');
  lines.push('6. Re-run audit to verify compliance');
  lines.push('');

  return lines.join('\n');
}

/**
 * Run specificity audit and save report
 */
export function runSpecificityAudit(stylesDir: string, outputPath: string): SpecificityAuditResult {
  console.log('Running specificity audit...');
  
  const result = auditSpecificity(stylesDir);
  const report = generateSpecificityReport(result);
  
  writeFileSync(outputPath, report, 'utf-8');
  console.log(`Audit complete. Report saved to: ${outputPath}`);
  console.log(`Compliance rate: ${result.complianceRate.toFixed(1)}%`);
  console.log(`Violations found: ${result.nonCompliantSelectors}`);
  
  return result;
}
