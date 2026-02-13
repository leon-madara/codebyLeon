/**
 * Script to collect baseline CSS metrics before refactoring
 * 
 * Run this script to establish baseline metrics for:
 * - Bundle size
 * - CSS parsing time
 * - File count
 * 
 * Usage: npx tsx src/test/css-utils/collect-baseline.ts
 */

import { createBaseline, generateMetricsReport } from './metrics.js';
import { join } from 'path';

const CSS_DIR = join(process.cwd(), 'src', 'styles');

console.log('Collecting baseline CSS metrics...\n');
console.log(`CSS Directory: ${CSS_DIR}\n`);

try {
  const baseline = createBaseline(
    CSS_DIR,
    '1.0.0-baseline',
    'Initial baseline before CSS architecture refactor'
  );

  console.log('✅ Baseline metrics collected successfully!\n');
  
  const report = generateMetricsReport(baseline);
  console.log(report);
  
  console.log('\n📊 Baseline saved to: src/test/css-utils/baseline-metrics.json');
  console.log('\nYou can now proceed with the CSS refactoring.');
  console.log('After each phase, run the comparison script to track progress.');
  
} catch (error) {
  console.error('❌ Error collecting baseline metrics:', error);
  process.exit(1);
}
