import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { DelivahDispatchCaseStudyPage } from './DelivahDispatchCaseStudyPage';

vi.mock('../utils/seo', () => ({
  SITE_NAME: 'Code by Leon',
  SITE_URL: 'https://codebyleon.com',
  usePageSeo: vi.fn(),
}));

describe('DelivahDispatchCaseStudyPage', () => {
  it('renders the funnel-and-operations case study with its Phase 4 CTA', () => {
    const { container } = render(
      <MemoryRouter>
        <DelivahDispatchCaseStudyPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /a freight dispatch funnel with operations behind it\./i,
      })
    ).toBeInTheDocument();
    expect(container.querySelector('.case-study--delivah')).toBeInTheDocument();
    expect(container.querySelector('.case-study--kossy')).not.toBeInTheDocument();
    expect(screen.getByText(/customer acquisition plus operational intake/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /service positioning/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /carrier intake step 1/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /document upload/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact flow/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /admin entry/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what codebyleon delivered/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to.*work/i })).toHaveAttribute(
      'href',
      '/#portfolio'
    );
    const ctaLinks = screen.getAllByRole('link', { name: /build my service funnel/i });
    expect(ctaLinks).toHaveLength(2);
    ctaLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/get-started.html');
    });
  });

  it('uses Delivah platform evidence without live-business overclaims', () => {
    const { container } = render(
      <MemoryRouter>
        <DelivahDispatchCaseStudyPage />
      </MemoryRouter>
    );

    const imageSources = Array.from(container.querySelectorAll('img')).map((image) =>
      image.getAttribute('src')
    );
    const pageCopy = container.textContent ?? '';

    expect(imageSources).toContain('/portfolio/case-studies/delivah/delivah-home-hero.png');
    expect(imageSources).toContain('/portfolio/case-studies/delivah/delivah-services.png');
    expect(imageSources).toContain('/portfolio/case-studies/delivah/delivah-register-step-1.png');
    expect(imageSources).toContain(
      '/portfolio/case-studies/delivah/delivah-register-document-upload.png'
    );
    expect(imageSources).toContain('/portfolio/case-studies/delivah/delivah-contact-form.png');
    expect(imageSources).toContain('/portfolio/case-studies/delivah/delivah-admin-login.png');
    expect(imageSources.every((source) => source?.startsWith('/portfolio/case-studies/delivah/'))).toBe(
      true
    );
    expect(pageCopy).not.toMatch(/active carriers/i);
    expect(pageCopy).not.toMatch(/fully licensed/i);
    expect(pageCopy).not.toMatch(/insurance/i);
    expect(pageCopy).not.toMatch(/\b\d{3}[-.)\s]\d{3}[-.\s]\d{4}\b/);
  });
});
