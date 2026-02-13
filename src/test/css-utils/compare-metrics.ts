/**
 * Script to compare current CSS metrics with baseline
 * 
 * Run this script after each refactoring phase to track progress
 * 
 * Usage: npx tsx src/test/css-utils/compare-metrics.ts
 */

import {
  collectCurrentMetrics,
  loadBaselineMetrics,
  compareMetrics,
  generateMetricsReport,
  formatBytes,
} from './metrics.js';
import { join } from 'path';

const CSS_DIR = join(process.cwd(), 'src', 'styles');

console.log('Comparing current CSS metrics with baseline...\n');
console.log(`CSS Directory: ${CSS_DIR}\n`);

try {
  const baseline = loadBaselineMetrics();
  
  if (!baseline) {
    console.error('❌ No baseline metrics found!');
    console.error('Please run: npx tsx src/test/css-utils/collect-baseline.ts');
    process.exit(1);
  }

  const current = collectCurrentMetrics(CSS_DIR);
  const comparison = compareMetrics(current, baseline);

  console.log('📊 Metrics Comparison\n');
  console.log('═══════════════════════════════════════════════════\n');
  
  console.log('Bundle Size:');
  console.log(`  Baseline:  ${formatBytes(baseline.bundleSize.totalSize)}`);
  console.log(`  Current:   ${formatBytes(current.bundleSize.totalSize)}`);
  console.log(`  Change:    ${formatBytes(comparison.bundleSizeReduction)} (${comparison.bundleSizeReductionPercent.toFixed(2)}%)`);
  
  if (comparison.bundleSizeReductionPercent >= 30 && comparison.bundleSizeReductionPercent <= 40) {
    console.log('  ✅ Target achieved: 30-40% reduction');
  } else if (comparison.bundleSizeReductionPercent > 40) {
    console.log('  🎉 Exceeded target: >40% reduction');
  } else if (comparison.bundleSizeReductionPercent > 0) {
    console.log(`  ⚠️  Progress: ${comparison.bundleSizeReductionPercent.toFixed(2)}% (target: 30-40%)`);
  } else {
    console.log('  ❌ Size increased');
  }
  
  console.log('\nGzipped Size:');
  console.log(`  Baseline:  ${formatBytes(baseline.bundleSize.gzippedSize)}`);
  console.log(`  Current:   ${formatBytes(current.bundleSize.gzippedSize)}`);
  console.log(`  Change:    ${formatBytes(comparison.gzippedSizeReduction)} (${comparison.gzippedSizeReductionPercent.toFixed(2)}%)`);
  
  if (comparison.parsingTimeChange !== undefined) {
    console.log('\nCSS Parsing Time:');
    console.log(`  Baseline:  ${baseline.cssParsingTime?.toFixed(2)}ms`);
    console.log(`  Current:   ${current.cssParsingTime?.toFixed(2)}ms`);
    console.log(`  Change:    ${comparison.parsingTimeChange.toFixed(2)}ms (${comparison.parsingTimeChangePercent?.toFixed(2)}%)`);
    
    if (comparison.parsingTimeChange >= 0) {
      console.log('  ✅ Parsing time maintained or improved');
    } else {
      console.log('  ⚠️  Parsing time increased');
    }
  }
  
  console.log('\nFile Count:');
  console.log(`  Baseline:  ${baseline.bundleSize.fileCount}`);
  console.log(`  Current:   ${current.bundleSize.fileCount}`);
  
  console.log('\n═══════════════════════════════════════════════════\n');
  
  // Generate full report
  const report = generateMetricsReport(current, baseline);
  console.log('\nFull Report:\n');
  console.log(report);
  
} catch (error) {
  console.error('❌ Error comparing metrics:', error);
  process.exit(1);
}
