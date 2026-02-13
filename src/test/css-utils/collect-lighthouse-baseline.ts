/**
 * Script to collect baseline Lighthouse metrics before refactoring
 * 
 * Prerequisites:
 * 1. Install Lighthouse: npm install -g lighthouse
 * 2. Start development server: npm run dev
 * 3. Run this script: npx tsx src/test/css-utils/collect-lighthouse-baseline.ts
 * 
 * Usage: npx tsx src/test/css-utils/collect-lighthouse-baseline.ts [url]
 */

import {
  runLighthouse,
  saveLighthouseMetrics,
  generateLighthouseReport,
} from './lighthouse-metrics.js';

const DEFAULT_URL = 'http://localhost:5173';
const url = process.argv[2] || DEFAULT_URL;

console.log('Collecting baseline Lighthouse metrics...\n');
console.log(`URL: ${url}\n`);
console.log('⚠️  Make sure your development server is running!\n');

async function main() {
  try {
    const metrics = await runLighthouse({ url });
    
    saveLighthouseMetrics(metrics);
    
    console.log('\n✅ Baseline Lighthouse metrics collected successfully!\n');
    
    const report = generateLighthouseReport(metrics);
    console.log(report);
    
    console.log('\n📊 Baseline saved to: src/test/css-utils/lighthouse-metrics.json');
    console.log('\nYou can now proceed with the CSS refactoring.');
    console.log('After each phase, run the comparison script to track progress.');
    
  } catch (error) {
    console.error('❌ Error collecting Lighthouse metrics:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure your development server is running');
    console.error('2. Install Lighthouse: npm install -g lighthouse');
    console.error('3. Make sure Chrome/Chromium is installed');
    process.exit(1);
  }
}

main();
