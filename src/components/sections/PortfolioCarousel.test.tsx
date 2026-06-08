import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { projects } from '@/data/projects';
import PortfolioCarousel, { getPortfolioProjectCta } from './PortfolioCarousel';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    refresh: vi.fn(),
  },
}));

vi.mock('gsap/ScrollSmoother', () => ({
  ScrollSmoother: {
    get: vi.fn(() => null),
  },
}));

function mockMediaQuery(matches = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('PortfolioCarousel', () => {
  beforeEach(() => {
    mockMediaQuery();
  });

  const renderCarousel = () =>
    render(
      <MemoryRouter>
        <PortfolioCarousel />
      </MemoryRouter>
    );

  it('renders the project showcase without filter controls', () => {
    renderCarousel();

    expect(screen.getByRole('heading', { name: /our work/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /filter/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /project filters/i })).not.toBeInTheDocument();
    expect(document.querySelector('.portfolio-filter')).not.toBeInTheDocument();
  });

  it('links the featured Legit Logistics project to its case study route', () => {
    renderCarousel();

    const detailsLink = screen.getByRole('link', { name: /view details/i });
    const titleLink = screen.getByRole('link', { name: 'Legit Logistics', exact: true });
    const imageLink = screen.getByRole('link', { name: /open legit logistics case study/i });

    expect(screen.getByRole('img', { name: /legit logistics/i })).toBeInTheDocument();
    expect(detailsLink).toHaveAttribute('href', '/work/legit-logistics');
    expect(titleLink).toHaveAttribute('href', '/work/legit-logistics');
    expect(imageLink).toHaveAttribute('href', '/work/legit-logistics');
  });

  it('uses the approved Phase 2 active carousel project set', () => {
    expect(projects.map((project) => project.name)).toEqual([
      'Legit Logistics',
      'Kossy Langat',
      'Delivah Dispatch',
    ]);
    expect(projects.find((project) => project.name === 'CodeByLeon')).toBeUndefined();
    expect(projects.find((project) => project.name === 'Reverie Reveal')).toBeUndefined();
    expect(projects.find((project) => project.name === 'Leon Madara Portfolio')).toBeUndefined();
  });

  it('links flagship projects to their case study routes', () => {
    expect(projects.find((project) => project.name === 'Legit Logistics')?.caseStudyPath).toBe(
      '/work/legit-logistics'
    );
    expect(projects.find((project) => project.name === 'Kossy Langat')?.caseStudyPath).toBe(
      '/work/kossy-langat'
    );
    expect(projects.find((project) => project.name === 'Delivah Dispatch')?.caseStudyPath).toBe(
      '/work/delivah-dispatch-hub'
    );
  });

  it('sends secondary projects to the configurator with a non-dead CTA', () => {
    expect(getPortfolioProjectCta({})).toEqual({
      href: '/get-started.html',
      isRoute: false,
      label: 'Start Similar Project',
    });
  });
});
