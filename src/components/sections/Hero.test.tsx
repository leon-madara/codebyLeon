import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const heroSource = readFileSync(
  resolve(process.cwd(), 'src/components/sections/Hero.tsx'),
  'utf8'
);
const heroCss = readFileSync(
  resolve(process.cwd(), 'src/styles/sections/hero.css'),
  'utf8'
);

describe('Hero mobile rebuild', () => {
  it('separates desktop and mobile hero behavior with gsap matchMedia', () => {
    expect(heroSource).toContain('const mm = gsap.matchMedia();');
    expect(heroSource).toContain("mm.add('(min-width: 769px)'");
    expect(heroSource).toContain("mm.add('(max-width: 768px)'");
    expect(heroSource).not.toContain('--parallax-translate');
  });

  it('uses container-aware mobile layout rules and tappable ctas', () => {
    expect(heroCss).toMatch(/container-type:\s*inline-size;/);
    expect(heroCss).toMatch(/container-name:\s*hero;/);
    expect(heroCss).toContain('@container hero (max-width: 52rem)');
    expect(heroCss).toContain('@container hero (max-width: 24rem)');
    expect(heroCss).toMatch(/\.hero__cta\s*{[^}]*min-height:\s*44px;/s);
  });

  it('gives the longest animated word enough mobile line width', () => {
    expect(heroCss).toMatch(/max-width:\s*min\(100%,\s*12\.25ch\);/);
    expect(heroCss).toMatch(/max-width:\s*min\(100%,\s*12ch\);/);
  });
});

describe('Hero growing-word label', () => {
  it('renders the animated designs label white in dark mode', () => {
    expect(heroSource).toContain(
      'designsLabel.className = "euphoria-script-regular hero__word-grow-designs";'
    );
    expect(heroSource).not.toMatch(/designsLabel\.style[\s\S]*color:\s*['"]#1a1a1a['"]/);
    expect(heroCss).toMatch(
      /\[data-theme='dark'\] \.hero__word-grow-designs\s*{[^}]*color:\s*#ffffff;/s
    );
  });
});
