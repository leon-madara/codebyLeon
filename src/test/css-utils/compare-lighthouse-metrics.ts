/**
 * Script to compare current Lighthouse metrics with baseline
 * 
 * Prerequisites:
 * 1. Baseline metrics collected (run collect-lighthouse-baseline.ts first)
 * 2. Development server running
 * 
 * Usage: npx tsx src/test/css-utils/compare-lighthouse-metrics.ts [url]
 */

import {
  runLighthouse,
  loadLighthouseMetrics,
  compareLighthouseMetrics,
  generateLighthouseReport,
} from './lighthouse-metrics.js';

const DEFAULT_URL = 'http://localhost:5173';
const url = process.argv[2] || DEFAULT_URL;

console.log('Comparing current Lighthouse metrics with baseline...\n');
console.log(`URL: ${url}\n`);
console.log('⚠️  Make sure your development server is running!\n');

async function main() {
  try {
    const baseline = loadLighthouseMetrics();
    
    if (!baseline) {
      console.error('❌ No baseline Lighthouse metrics found!');
      console.error('Please run: npx tsx src/test/css-utils/collect-lighthouse-baseline.ts');
      process.exit(1);
    }
    
    const current = await runLighthouse({ url });
    const comparison = compareLighthouseMetrics(current, baseline);
    
    console.log('\n📊 Lighthouse Metrics Comparison\n');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('First Contentful Paint (FCP):');
    console.log(`  Baseline:  ${baseline.firstContentfulPaint.toFixed(0)}ms`);
    console.log(`  Current:   ${current.firstContentfulPaint.toFixed(0)}ms`);
    console.log(`  Change:    ${comparison.fcpChange.toFixed(0)}ms (${comparison.fcpChangePercent.toFixed(2)}%)`);
    
    if (comparison.fcpChange >= 0) {
      console.log('  ✅ FCP maintained or improved');
    } else {
      console.log('  ⚠️  FCP increased');
    }
    
    console.log('\nRender-Blocking Time:');
    console.log(`  Baseline:  ${baseline.renderBlockingTime.toFixed(0)}ms`);
    console.log(`  Current:   ${current.renderBlockingTime.toFixed(0)}ms`);
    console.log(`  Change:    ${comparison.renderBlockingChange.toFixed(0)}ms (${comparison.renderBlockingChangePercent.toFixed(2)}%)`);
    
    if (comparison.renderBlockingChange >= 0) {
      console.log('  ✅ Render-blocking time maintained or improved');
    } else {
      console.log('  ⚠️  Render-blocking time increased');
    }
    
    console.log('\nPerformance Score:');
    console.log(`  Baseline:  ${baseline.performanceScore.toFixed(0)}/100`);
    console.log(`  Current:   ${current.performanceScore.toFixed(0)}/100`);
    console.log(`  Change:    ${comparison.performanceScoreChange > 0 ? '+' : ''}${comparison.performanceScoreChange.toFixed(0)}`);
    
    if (comparison.performanceScoreChange >= 0) {
      console.log('  ✅ Performance score maintained or improved');
    } else {
      console.log('  ⚠️  Performance score decreased');
    }
    
    console.log('\n═══════════════════════════════════════════════════\n');
    
    // Generate full report
    const report = generateLighthouseReport(current, baseline);
    console.log('\nFull Report:\n');
    console.log(report);
    
  } catch (error) {
    console.error('❌ Error comparing Lighthouse metrics:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your development server is running');
    console.error('2. Make sure Lighthouse is installed: npm install -g lighthouse');
    console.error('3. Make sure Chrome/Chromium is installed');
    process.exit(1);
  }
}

main();
