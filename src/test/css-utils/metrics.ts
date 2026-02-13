/**
 * CSS Metrics Collection Utilities
 * 
 * Provides utilities for collecting baseline metrics including:
 * - Bundle size
 * - CSS parsing time
 * - First Contentful Paint (FCP)
 * - Render-blocking time
 */

import { readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { gzipSync } from 'zlib';
import { findCSSFiles } from './parser.js';

export interface BundleMetrics {
  totalSize: number;
  gzippedSize: number;
  fileCount: number;
  files: Array<{
    path: string;
    size: number;
    gzippedSize: number;
  }>;
}

export interface PerformanceMetrics {
  bundleSize: BundleMetrics;
  cssParsingTime?: number;
  firstContentfulPaint?: number;
  renderBlockingTime?: number;
  timestamp: number;
}

export interface BaselineMetrics extends PerformanceMetrics {
  version: string;
  description: string;
}

/**
 * Calculate bundle size metrics for CSS files
 */
export function calculateBundleSize(cssDir: string): BundleMetrics {
  const cssFiles = findCSSFiles(cssDir);
  let totalSize = 0;
  let totalGzippedSize = 0;
  const files: Array<{ path: string; size: number; gzippedSize: number }> = [];

  cssFiles.forEach(filePath => {
    const content = readFileSync(filePath);
    const size = statSync(filePath).size;
    const gzippedSize = gzipSync(content).length;

    totalSize += size;
    totalGzippedSize += gzippedSize;

    files.push({
      path: filePath,
      size,
      gzippedSize,
    });
  });

  return {
    totalSize,
    gzippedSize: totalGzippedSize,
    fileCount: cssFiles.length,
    files,
  };
}

/**
 * Measure CSS parsing time (simulated)
 * In a real scenario, this would use browser performance APIs
 */
export function measureCSSParsingTime(cssContent: string): number {
  const startTime = performance.now();
  
  // Simulate parsing by reading and processing the CSS
  // In production, this would be measured in the browser
  const lines = cssContent.split('\n');
  const rules = cssContent.match(/[^{}]+\{[^}]*\}/g) || [];
  
  const endTime = performance.now();
  return endTime - startTime;
}

/**
 * Calculate total CSS parsing time for all files
 */
export function calculateTotalParsingTime(cssDir: string): number {
  const cssFiles = findCSSFiles(cssDir);
  let totalTime = 0;

  cssFiles.forEach(filePath => {
    const content = readFileSync(filePath, 'utf-8');
    totalTime += measureCSSParsingTime(content);
  });

  return totalTime;
}

/**
 * Save baseline metrics to a JSON file
 */
export function saveBaselineMetrics(
  metrics: BaselineMetrics,
  outputPath: string = 'src/test/css-utils/baseline-metrics.json'
): void {
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(outputPath, JSON.stringify(metrics, null, 2), 'utf-8');
}

/**
 * Load baseline metrics from a JSON file
 */
export function loadBaselineMetrics(
  inputPath: string = 'src/test/css-utils/baseline-metrics.json'
): BaselineMetrics | null {
  if (!existsSync(inputPath)) {
    return null;
  }

  const content = readFileSync(inputPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Compare current metrics with baseline
 */
export function compareMetrics(
  current: PerformanceMetrics,
  baseline: BaselineMetrics
): {
  bundleSizeReduction: number;
  bundleSizeReductionPercent: number;
  gzippedSizeReduction: number;
  gzippedSizeReductionPercent: number;
  parsingTimeChange?: number;
  parsingTimeChangePercent?: number;
} {
  const bundleSizeReduction = baseline.bundleSize.totalSize - current.bundleSize.totalSize;
  const bundleSizeReductionPercent = (bundleSizeReduction / baseline.bundleSize.totalSize) * 100;

  const gzippedSizeReduction = baseline.bundleSize.gzippedSize - current.bundleSize.gzippedSize;
  const gzippedSizeReductionPercent = (gzippedSizeReduction / baseline.bundleSize.gzippedSize) * 100;

  const result: any = {
    bundleSizeReduction,
    bundleSizeReductionPercent,
    gzippedSizeReduction,
    gzippedSizeReductionPercent,
  };

  if (current.cssParsingTime && baseline.cssParsingTime) {
    const parsingTimeChange = baseline.cssParsingTime - current.cssParsingTime;
    const parsingTimeChangePercent = (parsingTimeChange / baseline.cssParsingTime) * 100;
    result.parsingTimeChange = parsingTimeChange;
    result.parsingTimeChangePercent = parsingTimeChangePercent;
  }

  return result;
}

/**
 * Collect all current metrics
 */
export function collectCurrentMetrics(cssDir: string): PerformanceMetrics {
  const bundleSize = calculateBundleSize(cssDir);
  const cssParsingTime = calculateTotalParsingTime(cssDir);

  return {
    bundleSize,
    cssParsingTime,
    timestamp: Date.now(),
  };
}

/**
 * Create and save initial baseline metrics
 */
export function createBaseline(
  cssDir: string,
  version: string = '1.0.0-baseline',
  description: string = 'Initial baseline before CSS architecture refactor'
): BaselineMetrics {
  const metrics = collectCurrentMetrics(cssDir);
  
  const baseline: BaselineMetrics = {
    ...metrics,
    version,
    description,
  };

  saveBaselineMetrics(baseline);
  return baseline;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a metrics report
 */
export function generateMetricsReport(
  current: PerformanceMetrics,
  baseline?: BaselineMetrics
): string {
  let report = '# CSS Metrics Report\n\n';
  report += `Generated: ${new Date(current.timestamp).toISOString()}\n\n`;

  report += '## Bundle Size\n\n';
  report += `- Total Size: ${formatBytes(current.bundleSize.totalSize)}\n`;
  report += `- Gzipped Size: ${formatBytes(current.bundleSize.gzippedSize)}\n`;
  report += `- File Count: ${current.bundleSize.fileCount}\n\n`;

  if (current.cssParsingTime) {
    report += '## Performance\n\n';
    report += `- CSS Parsing Time: ${current.cssParsingTime.toFixed(2)}ms\n\n`;
  }

  if (baseline) {
    const comparison = compareMetrics(current, baseline);
    report += '## Comparison with Baseline\n\n';
    report += `- Bundle Size Reduction: ${formatBytes(comparison.bundleSizeReduction)} (${comparison.bundleSizeReductionPercent.toFixed(2)}%)\n`;
    report += `- Gzipped Size Reduction: ${formatBytes(comparison.gzippedSizeReduction)} (${comparison.gzippedSizeReductionPercent.toFixed(2)}%)\n`;
    
    if (comparison.parsingTimeChange !== undefined) {
      report += `- Parsing Time Change: ${comparison.parsingTimeChange.toFixed(2)}ms (${comparison.parsingTimeChangePercent?.toFixed(2)}%)\n`;
    }
    report += '\n';
  }

  report += '## Files\n\n';
  current.bundleSize.files.forEach(file => {
    report += `- ${file.path}\n`;
    report += `  - Size: ${formatBytes(file.size)}\n`;
    report += `  - Gzipped: ${formatBytes(file.gzippedSize)}\n`;
  });

  return report;
}
