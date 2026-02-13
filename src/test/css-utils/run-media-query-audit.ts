/**
 * Script to run media query audit
 */

import * as path from 'path';
import { runMediaQueryAudit } from './media-query-audit';

const stylesDir = path.join(process.cwd(), 'src', 'styles');
const outputPath = path.join(process.cwd(), 'MEDIA_QUERY_AUDIT_REPORT.md');

console.log('🔍 Running media query audit...');
console.log(`Styles directory: ${stylesDir}`);
console.log('');

const report = runMediaQueryAudit(stylesDir, outputPath);

console.log('');
console.log('📊 Audit Summary:');
console.log(`  Total media queries: ${report.totalMediaQueries}`);
console.log(`  Files analyzed: ${report.fileCount}`);
console.log(`  Consistent breakpoints: ${report.breakpointConsistency.consistent.length}/${report.totalMediaQueries}`);
console.log(`  Mobile-first compliant: ${report.mobileFirstCompliance.compliant.length}/${report.totalMediaQueries}`);
console.log(`  Co-location issues: ${report.coLocationIssues.length}`);
console.log('');
console.log(`📄 Full report: ${outputPath}`);
