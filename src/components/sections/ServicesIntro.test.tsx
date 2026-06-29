import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ServicesIntro } from './ServicesIntro';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callback) => {
    // Execute the callback immediately in tests
    if (typeof callback === 'function') {
      callback();
    }
  }),
}));

vi.mock('gsap', () => {
  const gsapMock = {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
    })),
  };
  return { default: gsapMock, gsap: gsapMock };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('../../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

describe('ServicesIntro', () => {
  it('renders the services intro section', () => {
    render(<ServicesIntro />);

    expect(screen.getByRole('region', { name: /services introduction/i })).toBeInTheDocument();
  });

  it('contains the strategic headline and subheadline', () => {
    render(<ServicesIntro />);

    // Since the headline is split into two spans, text content combines them
    expect(screen.getByRole('heading')).toHaveTextContent(/we don't justbuild pages./i);
    expect(screen.getByText(/we engineer custom digital systems for growth, identity, and scale./i)).toBeInTheDocument();
  });
});
