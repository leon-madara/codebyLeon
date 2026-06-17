import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BeatCard } from './BeatCard';

describe('BeatCard visibility', () => {
  it('renders the service image without a visual overlay layer', () => {
    const { container } = render(
      <BeatCard
        step={1}
        totalSteps={4}
        tagText="Problem"
        imageSrc="/service.png"
        icon={<span>!</span>}
        heading="The Problem"
        subheading="Your expertise deserves better visibility"
        body="Your skills should be easy to find."
      />,
    );

    expect(container.querySelector('.beat-card__overlay')).toBeNull();
  });

  it('uses theme-aware surfaces and typography instead of hard-coded dark overlays', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/styles/components/beat-card.css'),
      'utf8',
    );

    expect(css).not.toMatch(/\.beat-card__overlay\s*{/);
    expect(css).not.toContain('--bc-bg: hsl(220 18% 7%)');
    expect(css).not.toContain('var(--color-primary');
    expect(css).toContain('--bc-surface: hsl(var(--card))');
    expect(css).toContain('color: var(--text-secondary)');
  });

  it('gives stacked service cards enough height to keep mobile typography visible', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/styles/features/horizontal-scroll.css'),
      'utf8',
    );

    expect(css).not.toMatch(
      /\.hs__story--vertical \.beat-card\s*{\s*height:\s*clamp\(400px,\s*64vh,\s*660px\)/,
    );
    expect(css).toMatch(
      /\.hs__story--vertical \.beat-card\s*{[^}]*height:\s*auto;[^}]*}/,
    );
  });
});
