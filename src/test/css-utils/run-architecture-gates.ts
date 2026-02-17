/**
 * CLI runner for CSS architecture gates
 */

import { join } from 'path';
import { runArchitectureGates } from './architecture-gates';

const stylesDir = join(process.cwd(), 'src', 'styles');
const exitCode = runArchitectureGates(stylesDir);
process.exit(exitCode);
