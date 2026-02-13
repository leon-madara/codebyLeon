/**
 * Lighthouse Performance Metrics Utilities
 * 
 * Provides utilities for measuring:
 * - First Contentful Paint (FCP)
 * - Render-blocking time
 * 
 * These metrics require a running server and use Lighthouse CLI
 */

import { execSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export interface LighthouseMetrics {
  firstContentfulPaint: number;
  renderBlockingTime: number;
  performanceScore: number;
  timestamp: number;
}

export interface LighthouseConfig {
  url: string;
  outputPath?: string;
  chromeFlags?: string[];
}

/**
 * Run Lighthouse and extract performance metrics
 * 
 * Note: This requires:
 * 1. A running development server
 * 2. Lighthouse CLI installed (npm install -g lighthouse)
 * 3. Chrome/Chromium installed
 */
export async function runLighthouse(config: LighthouseConfig): Promise<LighthouseMetrics> {
  const outputPath = config.outputPath || join(process.cwd(), 'lighthouse-report.json');
  const chromeFlags = config.chromeFlags || ['--headless'];
  
  try {
    // Run Lighthouse CLI
    const command = `lighthouse ${config.url} --output=json --output-path=${outputPath} --only-categories=performance --chrome-flags="${chromeFlags.join(' ')}"`;
    
    console.log('Running Lighthouse...');
    execSync(command, { stdio: 'inherit' });
    
    // Read the report
    if (!existsSync(outputPath)) {
      throw new Error(`Lighthouse report not found at ${outputPath}`);
    }
    
    const reportContent = readFileSync(outputPath, 'utf-8');
    const report = JSON.parse(reportContent);
    
    // Extract metrics
    const audits = report.audits;
    const fcp = audits['first-contentful-paint']?.numericValue || 0;
    const renderBlocking = audits['render-blocking-resources']?.numericValue || 0;
    const performanceScore = report.categories.performance.score * 100;
    
    return {
      firstContentfulPaint: fcp,
      renderBlockingTime: renderBlocking,
      performanceScore,
      timestamp: Date.now(),
    };
    
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    throw error;
  }
}

/**
 * Measure FCP using Lighthouse
 */
export async function measureFCP(url: string): Promise<number> {
  const metrics = await runLighthouse({ url });
  return metrics.firstContentfulPaint;
}

/**
 * Measure render-blocking time using Lighthouse
 */
export async function measureRenderBlockingTime(url: string): Promise<number> {
  const metrics = await runLighthouse({ url });
  return metrics.renderBlockingTime;
}

/**
 * Save Lighthouse metrics to a JSON file
 */
export function saveLighthouseMetrics(
  metrics: LighthouseMetrics,
  outputPath: string = 'src/test/css-utils/lighthouse-metrics.json'
): void {
  writeFileSync(outputPath, JSON.stringify(metrics, null, 2), 'utf-8');
}

/**
 * Load Lighthouse metrics from a JSON file
 */
export function loadLighthouseMetrics(
  inputPath: string = 'src/test/css-utils/lighthouse-metrics.json'
): LighthouseMetrics | null {
  if (!existsSync(inputPath)) {
    return null;
  }
  
  const content = readFileSync(inputPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Compare Lighthouse metrics
 */
export function compareLighthouseMetrics(
  current: LighthouseMetrics,
  baseline: LighthouseMetrics
): {
  fcpChange: number;
  fcpChangePercent: number;
  renderBlockingChange: number;
  renderBlockingChangePercent: number;
  performanceScoreChange: number;
} {
  const fcpChange = baseline.firstContentfulPaint - current.firstContentfulPaint;
  const fcpChangePercent = (fcpChange / baseline.firstContentfulPaint) * 100;
  
  const renderBlockingChange = baseline.renderBlockingTime - current.renderBlockingTime;
  const renderBlockingChangePercent = baseline.renderBlockingTime > 0
    ? (renderBlockingChange / baseline.renderBlockingTime) * 100
    : 0;
  
  const performanceScoreChange = current.performanceScore - baseline.performanceScore;
  
  return {
    fcpChange,
    fcpChangePercent,
    renderBlockingChange,
    renderBlockingChangePercent,
    performanceScoreChange,
  };
}

/**
 * Generate Lighthouse metrics report
 */
export function generateLighthouseReport(
  current: LighthouseMetrics,
  baseline?: LighthouseMetrics
): string {
  let report = '# Lighthouse Performance Metrics\n\n';
  report += `Generated: ${new Date(current.timestamp).toISOString()}\n\n`;
  
  report += '## Current Metrics\n\n';
  report += `- First Contentful Paint: ${current.firstContentfulPaint.toFixed(0)}ms\n`;
  report += `- Render-Blocking Time: ${current.renderBlockingTime.toFixed(0)}ms\n`;
  report += `- Performance Score: ${current.performanceScore.toFixed(0)}/100\n\n`;
  
  if (baseline) {
    const comparison = compareLighthouseMetrics(current, baseline);
    
    report += '## Comparison with Baseline\n\n';
    report += `- FCP Change: ${comparison.fcpChange.toFixed(0)}ms (${comparison.fcpChangePercent.toFixed(2)}%)\n`;
    
    if (comparison.fcpChange >= 0) {
      report += '  ✅ FCP maintained or improved\n';
    } else {
      report += '  ⚠️  FCP increased\n';
    }
    
    report += `\n- Render-Blocking Change: ${comparison.renderBlockingChange.toFixed(0)}ms (${comparison.renderBlockingChangePercent.toFixed(2)}%)\n`;
    
    if (comparison.renderBlockingChange >= 0) {
      report += '  ✅ Render-blocking time maintained or improved\n';
    } else {
      report += '  ⚠️  Render-blocking time increased\n';
    }
    
    report += `\n- Performance Score Change: ${comparison.performanceScoreChange > 0 ? '+' : ''}${comparison.performanceScoreChange.toFixed(0)}\n`;
    
    if (comparison.performanceScoreChange >= 0) {
      report += '  ✅ Performance score maintained or improved\n';
    } else {
      report += '  ⚠️  Performance score decreased\n';
    }
  }
  
  return report;
}

/**
 * Browser-based CSS parsing time measurement
 * This is a simpler alternative to Lighthouse for quick checks
 */
export function generateBrowserParsingScript(): string {
  return `
// Measure CSS parsing time in the browser
(function() {
  const perfEntries = performance.getEntriesByType('resource');
  const cssEntries = perfEntries.filter(entry => entry.name.endsWith('.css'));
  
  let totalParsingTime = 0;
  let totalRenderBlockingTime = 0;
  
  cssEntries.forEach(entry => {
    // Duration includes download + parsing
    totalParsingTime += entry.duration;
    
    // Render-blocking resources block the first paint
    if (entry.renderBlockingStatus === 'blocking') {
      totalRenderBlockingTime += entry.duration;
    }
  });
  
  console.log('CSS Parsing Metrics:');
  console.log('Total CSS Parsing Time:', totalParsingTime.toFixed(2), 'ms');
  console.log('Render-Blocking Time:', totalRenderBlockingTime.toFixed(2), 'ms');
  console.log('CSS Files:', cssEntries.length);
  
  return {
    totalParsingTime,
    totalRenderBlockingTime,
    fileCount: cssEntries.length,
    files: cssEntries.map(e => ({
      name: e.name,
      duration: e.duration,
      renderBlocking: e.renderBlockingStatus === 'blocking'
    }))
  };
})();
`;
}
