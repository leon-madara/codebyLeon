import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PortfolioCarousel from './PortfolioCarousel';

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

  it('renders the project showcase without filter controls', () => {
    render(<PortfolioCarousel />);

    expect(screen.getByRole('heading', { name: /our work/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /filter/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /project filters/i })).not.toBeInTheDocument();
    expect(document.querySelector('.portfolio-filter')).not.toBeInTheDocument();
  });
});
