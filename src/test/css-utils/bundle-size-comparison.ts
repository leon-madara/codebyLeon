/**
 * Bundle Size Comparison Utility
 * 
 * This script builds the production bundle, measures the minified CSS size,
 * and compares it to the baseline metrics to verify the 30-40% reduction target.
 * 
 * Usage: npx tsx src/test/css-utils/bundle-size-comparison.ts
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { gzipSync } from 'zlib';
import { loadBaselineMetrics, formatBytes } from './metrics.js';

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  cssFiles: Array<{
    name: string;
    size: number;
    gzippedSize: number;
    percentOfTotal: number;
  }>;
  timestamp: string;
}

/**
 * Build the production bundle
 */
function buildProductionBundle(): void {
  console.log('🔨 Building production bundle...\n');
  
  try {
    // Clean dist directory if it exists
    if (existsSync('dist')) {
      console.log('Cleaning dist directory...');
      execSync('rmdir /s /q dist', { stdio: 'inherit' });
    }
    
    // Build with Vite
    console.log('Running Vite build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    console.log('\n✅ Production bundle built successfully\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    throw error;
  }
}

/**
 * Find all CSS files in the dist directory
 */
function findCSSFiles(dir: string): string[] {
  const cssFiles: string[] = [];
  
  function traverse(currentDir: string) {
    const entries = readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (entry.endsWith('.css')) {
        cssFiles.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return cssFiles;
}

/**
 * Analyze the production bundle
 */
function analyzeBundleSize(): BundleAnalysis {
  const distDir = join(process.cwd(), 'dist');
  
  if (!existsSync(distDir)) {
    throw new Error('dist directory not found. Please build the project first.');
  }
  
  const cssFiles = findCSSFiles(distDir);
  
  if (cssFiles.length === 0) {
    throw new Error('No CSS files found in dist directory');
  }
  
  let totalSize = 0;
  let totalGzippedSize = 0;
  const fileDetails: BundleAnalysis['cssFiles'] = [];
  
  for (const filePath of cssFiles) {
    const content = readFileSync(filePath);
    const size = content.length;
    const gzippedSize = gzipSync(content).length;
    
    totalSize += size;
    totalGzippedSize += gzippedSize;
    
    fileDetails.push({
      name: filePath.replace(distDir, '').replace(/\\/g, '/'),
      size,
      gzippedSize,
      percentOfTotal: 0, // Will be calculated after total is known
    });
  }
  
  // Calculate percentages
  for (const file of fileDetails) {
    file.percentOfTotal = (file.size / totalSize) * 100;
  }
  
  // Sort by size descending
  fileDetails.sort((a, b) => b.size - a.size);
  
  return {
    totalSize,
    gzippedSize: totalGzippedSize,
    cssFiles: fileDetails,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Compare bundle size with baseline
 */
function compareBundleSize(current: BundleAnalysis, baseline: any): void {
  console.log('📊 Bundle Size Comparison\n');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Total size comparison
  const sizeReduction = baseline.bundleSize.totalSize - current.totalSize;
  const sizeReductionPercent = (sizeReduction / baseline.bundleSize.totalSize) * 100;
  
  console.log('Total Bundle Size:');
  console.log(`  Baseline:  ${formatBytes(baseline.bundleSize.totalSize)}`);
  console.log(`  Current:   ${formatBytes(current.totalSize)}`);
  console.log(`  Reduction: ${formatBytes(sizeReduction)} (${sizeReductionPercent.toFixed(2)}%)`);
  
  // Check if target is met
  if (sizeReductionPercent >= 30 && sizeReductionPercent <= 40) {
    console.log('  ✅ TARGET ACHIEVED: 30-40% reduction');
  } else if (sizeReductionPercent > 40) {
    console.log('  🎉 EXCEEDED TARGET: >40% reduction');
  } else if (sizeReductionPercent > 0) {
    console.log(`  ⚠️  PROGRESS: ${sizeReductionPercent.toFixed(2)}% (target: 30-40%)`);
  } else {
    console.log('  ❌ SIZE INCREASED - refactoring did not reduce bundle size');
  }
  
  console.log('\nGzipped Bundle Size:');
  const gzippedReduction = baseline.bundleSize.gzippedSize - current.gzippedSize;
  const gzippedReductionPercent = (gzippedReduction / baseline.bundleSize.gzippedSize) * 100;
  
  console.log(`  Baseline:  ${formatBytes(baseline.bundleSize.gzippedSize)}`);
  console.log(`  Current:   ${formatBytes(current.gzippedSize)}`);
  console.log(`  Reduction: ${formatBytes(gzippedReduction)} (${gzippedReductionPercent.toFixed(2)}%)`);
  
  console.log('\nFile Count:');
  console.log(`  Baseline:  ${baseline.bundleSize.fileCount} files`);
  console.log(`  Current:   ${current.cssFiles.length} files`);
  
  console.log('\n═══════════════════════════════════════════════════\n');
  
  // Detailed file breakdown
  console.log('📁 CSS Files in Production Bundle:\n');
  
  for (const file of current.cssFiles) {
    console.log(`${file.name}`);
    console.log(`  Size:     ${formatBytes(file.size)} (${file.percentOfTotal.toFixed(1)}%)`);
    console.log(`  Gzipped:  ${formatBytes(file.gzippedSize)}`);
    console.log('');
  }
  
  console.log('═══════════════════════════════════════════════════\n');
  
  // Summary
  console.log('📈 Summary:\n');
  
  const targetMet = sizeReductionPercent >= 30 && sizeReductionPercent <= 40;
  const targetExceeded = sizeReductionPercent > 40;
  
  if (targetMet || targetExceeded) {
    console.log('✅ Bundle size reduction target achieved!');
    console.log(`   Reduced by ${sizeReductionPercent.toFixed(2)}% (target: 30-40%)`);
    console.log(`   Saved ${formatBytes(sizeReduction)} from baseline`);
  } else if (sizeReductionPercent > 0) {
    console.log('⚠️  Bundle size reduced but target not yet met');
    console.log(`   Current: ${sizeReductionPercent.toFixed(2)}% reduction`);
    console.log(`   Target:  30-40% reduction`);
    console.log(`   Need:    ${(30 - sizeReductionPercent).toFixed(2)}% more reduction`);
  } else {
    console.log('❌ Bundle size increased - refactoring needs adjustment');
    console.log(`   Increased by ${Math.abs(sizeReductionPercent).toFixed(2)}%`);
  }
  
  console.log('\n');
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Bundle Size Comparison Tool\n');
  console.log('This tool will:');
  console.log('1. Build the production bundle with Vite');
  console.log('2. Measure minified CSS bundle size');
  console.log('3. Compare to baseline metrics');
  console.log('4. Verify 30-40% reduction target\n');
  
  try {
    // Load baseline
    const baseline = loadBaselineMetrics();
    
    if (!baseline) {
      console.error('❌ No baseline metrics found!');
      console.error('Please run: npm run css:baseline');
      process.exit(1);
    }
    
    console.log('✅ Baseline metrics loaded\n');
    
    // Build production bundle
    buildProductionBundle();
    
    // Analyze bundle
    console.log('📊 Analyzing production bundle...\n');
    const bundleAnalysis = analyzeBundleSize();
    
    // Compare with baseline
    compareBundleSize(bundleAnalysis, baseline);
    
    // Exit with appropriate code
    const sizeReduction = baseline.bundleSize.totalSize - bundleAnalysis.totalSize;
    const sizeReductionPercent = (sizeReduction / baseline.bundleSize.totalSize) * 100;
    
    if (sizeReductionPercent >= 30) {
      process.exit(0); // Success
    } else {
      process.exit(1); // Target not met
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
