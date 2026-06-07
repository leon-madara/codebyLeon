import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { KossyLangatCaseStudyPage } from './KossyLangatCaseStudyPage';

vi.mock('../utils/seo', () => ({
  SITE_NAME: 'Code by Leon',
  SITE_URL: 'https://codebyleon.com',
  usePageSeo: vi.fn(),
}));

describe('KossyLangatCaseStudyPage', () => {
  it('renders the editorial identity case study with its Phase 4 CTA', () => {
    const { container } = render(
      <MemoryRouter>
        <KossyLangatCaseStudyPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /the orchestrator, translated into a website\./i,
      })
    ).toBeInTheDocument();
    expect(container.querySelector('.case-study--kossy')).toBeInTheDocument();
    expect(container.querySelector('.case-study--delivah')).not.toBeInTheDocument();
    expect(screen.getAllByText(/identity architecture/i)[0]).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /character and values/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /work credibility/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /mentorship and public voice/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what codebyleon delivered/i })).toBeInTheDocument();
    expect(screen.getByText(/professional story with structure/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to.*work/i })).toHaveAttribute(
      'href',
      '/#portfolio'
    );
    const ctaLinks = screen.getAllByRole('link', { name: /build my personal brand/i });
    expect(ctaLinks).toHaveLength(2);
    ctaLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/get-started.html');
    });
  });

  it('uses only Kossy website screenshot evidence', () => {
    const { container } = render(
      <MemoryRouter>
        <KossyLangatCaseStudyPage />
      </MemoryRouter>
    );

    const imageSources = Array.from(container.querySelectorAll('img')).map((image) =>
      image.getAttribute('src')
    );

    expect(imageSources).toContain('/portfolio/case-studies/kossy/kossy-home-hero.png');
    expect(imageSources).toContain('/portfolio/case-studies/kossy/kossy-about-values.png');
    expect(imageSources).toContain('/portfolio/case-studies/kossy/kossy-work-index.png');
    expect(imageSources).toContain('/portfolio/case-studies/kossy/kossy-work-tassis.png');
    expect(imageSources).toContain('/portfolio/case-studies/kossy/kossy-mentorship-hero.png');
    expect(imageSources.every((source) => source?.startsWith('/portfolio/case-studies/kossy/'))).toBe(
      true
    );
    expect(imageSources.some((source) => source?.includes('/images/about/'))).toBe(false);
    expect(imageSources.some((source) => source?.includes('/projects done/'))).toBe(false);
  });
});
