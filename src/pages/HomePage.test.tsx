import { render, screen } from '@testing-library/react';
import { forwardRef } from 'react';
import { MemoryRouter } from 'react-router-dom';
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

vi.mock('../components/sections/Hero', () => ({
  Hero: forwardRef(() => <section aria-label="Hero" />),
}));

vi.mock('../components/sections/RealityCheck', () => ({
  RealityCheck: () => <section id="reality-check" aria-label="The Reality Check and Our Approach" />,
}));

vi.mock('../components/sections/ServicesIntro', () => ({
  ServicesIntro: () => <section aria-label="Services Intro" />,
}));

vi.mock('../components/sections/ServicesMatrix', () => ({
  ServicesMatrix: () => <section aria-label="Services Matrix" />,
}));

vi.mock('../components/sections/AboutVideoIntro', () => ({
  AboutVideoIntro: () => <section aria-label="About Video Intro" />,
}));

vi.mock('../components/sections/AboutManifesto', () => ({
  AboutManifesto: () => <section aria-label="About Manifesto" />,
}));

vi.mock('../components/sections/WorkGatewayStrip', () => ({
  WorkGatewayStrip: () => <section aria-label="Work Gateway" />,
}));

vi.mock('../components/sections/Blog', () => ({
  Blog: () => <section aria-label="Blog" />,
}));

vi.mock('../components/sections/FinalCTA', () => ({
  FinalCTA: () => <section aria-label="Final CTA" />,
}));

describe('HomePage', () => {
  it('does not render the BuildBrands section', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(document.querySelector('#build-brands')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /we build brands/i })).not.toBeInTheDocument();
  });

  it('renders the RealityCheck section in narrative flow', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(document.querySelector('#reality-check')).toBeInTheDocument();
  });
});
