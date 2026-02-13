/**
 * Script to run !important declaration audit
 */

import { join } from 'path';
import { runAudit } from './important-audit';

const stylesDir = join(process.cwd(), 'src', 'styles');
const outputPath = join(process.cwd(), 'IMPORTANT_AUDIT_REPORT.md');

try {
  const declarations = runAudit(stylesDir, outputPath);
  
  console.log('\n✅ Audit complete!');
  console.log(`\nTotal declarations: ${declarations.length}`);
  
  // Group by category for summary
  const byCategory = new Map<string, number>();
  declarations.forEach(decl => {
    const pathParts = decl.file.split(/[/\\]/);
    const stylesIndex = pathParts.indexOf('styles');
    const category = stylesIndex >= 0 && pathParts[stylesIndex + 1] 
      ? pathParts[stylesIndex + 1] 
      : 'other';
    byCategory.set(category, (byCategory.get(category) || 0) + 1);
  });
  
  console.log('\nBy directory:');
  byCategory.forEach((count, category) => {
    console.log(`  - ${category}: ${count}`);
  });
  
  process.exit(0);
} catch (error) {
  console.error('❌ Audit failed:', error);
  process.exit(1);
}
