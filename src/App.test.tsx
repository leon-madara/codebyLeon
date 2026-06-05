import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

vi.mock('./utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

vi.mock('@gsap/react', () => ({
  useGSAP: (callback: () => void | (() => void)) => callback(),
}));

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    utils: {
      toArray: vi.fn(() => []),
    },
  },
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    })),
    utils: {
      toArray: vi.fn(() => []),
    },
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('gsap/ScrollSmoother', () => ({
  ScrollSmoother: {
    create: vi.fn(),
    get: vi.fn(() => null),
  },
}));

describe('App routes', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
    window.scrollTo = vi.fn();
  });

  it('renders the Process page at /process', async () => {
    window.history.pushState({}, '', '/process');

    render(<App />);

    expect(await screen.findByRole('heading', {
      name: /what happens after you choose code by leon/i,
    })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /build your quote/i })[0]).toHaveAttribute(
      'href',
      '/get-started.html',
    );
  });
});
