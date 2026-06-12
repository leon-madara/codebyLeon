import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('Hero growing-word label', () => {
  it('renders the animated designs label white in dark mode', () => {
    const heroSource = readFileSync(
      resolve(process.cwd(), 'src/components/sections/Hero.tsx'),
      'utf8'
    );
    const heroCss = readFileSync(
      resolve(process.cwd(), 'src/styles/sections/hero.css'),
      'utf8'
    );

    expect(heroSource).toContain(
      'designsLabel.className = "euphoria-script-regular hero__word-grow-designs";'
    );
    expect(heroSource).not.toMatch(/designsLabel\.style[\s\S]*color:\s*['"]#1a1a1a['"]/);
    expect(heroCss).toMatch(
      /\[data-theme='dark'\] \.hero__word-grow-designs\s*{[^}]*color:\s*#ffffff;/s
    );
  });
});
