import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { OurWorkPage } from './OurWorkPage';

vi.mock('../utils/seo', () => ({
  usePageSeo: vi.fn(),
}));

vi.mock('../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('../components/sections/PortfolioCarousel', () => ({
  default: () => <section aria-label="Portfolio Carousel" data-testid="portfolio-carousel" />,
}));

vi.mock('../components/sections/PortfolioCarouselMobile', () => ({
  default: () => <section aria-label="Portfolio Carousel Mobile" data-testid="portfolio-carousel-mobile" />,
}));

vi.mock('../components/cursor/GlassBallCursor', () => ({
  GlassBallCursor: () => <div data-testid="cursor" />,
}));

vi.mock('../components/sections/FinalCTA', () => ({
  FinalCTA: () => <section aria-label="Final CTA" data-testid="final-cta" />,
}));

describe('OurWorkPage', () => {
  it('renders the dedicated portfolio showcase and final CTA', () => {
    render(
      <MemoryRouter>
        <OurWorkPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId('portfolio-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('final-cta')).toBeInTheDocument();
  });
});
