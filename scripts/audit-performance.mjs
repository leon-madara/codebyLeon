import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('====================================================');
console.log('   CodeByLeon Web Performance & Bundle Auditor');
console.log('====================================================\n');

if (!fs.existsSync(distDir)) {
  console.log('⚠️  dist/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

function getFilesRecursively(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else {
      results.push({
        path: fullPath,
        relPath: path.relative(distDir, fullPath),
        sizeKb: (stat.size / 1024).toFixed(2),
        sizeBytes: stat.size,
        ext: path.extname(fullPath).toLowerCase(),
      });
    }
  }
  return results;
}

const allFiles = getFilesRecursively(distDir);
const jsFiles = allFiles.filter(f => f.ext === '.js');
const cssFiles = allFiles.filter(f => f.ext === '.css');
const imgFiles = allFiles.filter(f => ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(f.ext));

console.log(`📦 Analyzed ${allFiles.length} production files in dist/:\n`);

// Budget thresholds
const JS_CHUNK_WARN_KB = 350;
const CSS_TOTAL_WARN_KB = 120;
const IMG_FILE_WARN_KB = 250;

let warnings = 0;

console.log('--- JavaScript Chunks ---');
let totalJsBytes = 0;
jsFiles.sort((a, b) => b.sizeBytes - a.sizeBytes).forEach(file => {
  totalJsBytes += file.sizeBytes;
  const isLarge = file.sizeKb > JS_CHUNK_WARN_KB;
  const status = isLarge ? '⚠️ WARN' : '✓ OK';
  if (isLarge) warnings++;
  console.log(`  [${status}] ${file.relPath.padEnd(45)} ${file.sizeKb.padStart(8)} KB`);
});
console.log(`  Total JS Footprint: ${(totalJsBytes / 1024).toFixed(2)} KB\n`);

console.log('--- CSS Stylesheets ---');
let totalCssBytes = 0;
cssFiles.sort((a, b) => b.sizeBytes - a.sizeBytes).forEach(file => {
  totalCssBytes += file.sizeBytes;
  console.log(`  [✓ OK] ${file.relPath.padEnd(45)} ${file.sizeKb.padStart(8)} KB`);
});
const totalCssKb = (totalCssBytes / 1024).toFixed(2);
console.log(`  Total CSS Footprint: ${totalCssKb} KB`);
if (totalCssKb > CSS_TOTAL_WARN_KB) {
  console.log(`  ⚠️ WARN: Total CSS exceeds target budget of ${CSS_TOTAL_WARN_KB} KB`);
  warnings++;
}
console.log('\n--- Key Asset Images ---');
imgFiles.filter(f => f.sizeKb > 50).sort((a, b) => b.sizeBytes - a.sizeBytes).forEach(file => {
  const isLarge = file.sizeKb > IMG_FILE_WARN_KB;
  const status = isLarge ? '⚠️ WARN' : '✓ OK';
  if (isLarge) warnings++;
  console.log(`  [${status}] ${file.relPath.padEnd(45)} ${file.sizeKb.padStart(8)} KB`);
});

console.log('\n====================================================');
if (warnings === 0) {
  console.log('🎉 AUDIT PASSED: All bundle assets within performance budgets!');
} else {
  console.log(`⚠️  AUDIT COMPLETED: ${warnings} item(s) flagged above recommended budgets.`);
}
console.log('====================================================\n');
