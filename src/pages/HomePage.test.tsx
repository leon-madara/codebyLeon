import { render, screen } from '@testing-library/react';
import { forwardRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { HomePage } from './HomePage';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

vi.mock('../utils/seo', () => ({
  DEFAULT_DESCRIPTION: 'Default description',
  DEFAULT_TITLE: 'Default title',
  SITE_NAME: 'Code by Leon',
  SITE_URL: 'https://codebyleon.com',
  usePageSeo: vi.fn(),
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

vi.mock('../components/sections/Hero', () => ({
  Hero: forwardRef(() => <section aria-label="Hero" />),
}));

vi.mock('../components/sections/PortfolioCarousel', () => ({
  default: () => <section aria-label="Portfolio carousel" />,
}));

vi.mock('../components/sections/About3DStack', () => ({
  About3DStack: () => <section aria-label="About" />,
}));

vi.mock('../components/HorizontalScroll', () => ({
  MultiCardScrollSection: () => <section aria-label="Services" />,
}));

vi.mock('../components/sections/Blog', () => ({
  Blog: () => <section aria-label="Blog" />,
}));

vi.mock('../components/sections/FinalCTA', () => ({
  FinalCTA: () => <section aria-label="Final CTA" />,
}));

describe('HomePage', () => {
  it('does not render the BuildBrands section', () => {
    render(<HomePage />);

    expect(document.querySelector('#build-brands')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /we build brands/i })).not.toBeInTheDocument();
  });
});
