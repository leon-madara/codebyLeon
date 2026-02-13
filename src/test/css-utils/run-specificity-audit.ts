/**
 * CLI script to run specificity audit
 */

import { join } from 'path';
import { runSpecificityAudit } from './specificity-audit';

const stylesDir = join(process.cwd(), 'src/styles');
const outputPath = join(process.cwd(), 'SPECIFICITY_AUDIT_REPORT.md');

runSpecificityAudit(stylesDir, outputPath);
