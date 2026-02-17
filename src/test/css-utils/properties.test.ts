import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { runArchitectureGates } from './architecture-gates';
import { parseAllCSSFiles, extractTokenDefinitions, extractTokenReferences } from './parser';

describe('CSS Architecture Properties', () => {
  const stylesDir = join(process.cwd(), 'src', 'styles');

  it('passes architecture gates', () => {
    expect(runArchitectureGates(stylesDir)).toBe(0);
  });

  it('maintains a usable token contract', () => {
    const cssFiles = parseAllCSSFiles(stylesDir);
    const tokenDefinitions = extractTokenDefinitions(cssFiles);
    const tokenReferences = extractTokenReferences(cssFiles);

    expect(tokenDefinitions.size).toBeGreaterThan(0);
    expect(tokenReferences.length).toBeGreaterThan(0);
  });
});
