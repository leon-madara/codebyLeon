import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RealityCheck } from './RealityCheck';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
  },
}));

vi.mock('../../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

describe('RealityCheck section', () => {
  it('renders with semantic section id and accessible label', () => {
    const { container } = render(<RealityCheck />);
    const section = container.querySelector('#reality-check');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-label', 'The Reality Check and Our Approach');
  });

  it('diagnoses the Professional Gap in plain English', () => {
    render(<RealityCheck />);
    expect(
      screen.getByRole('heading', {
        name: /your business is established\. does your website look like it\?/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText('The Professional Gap')).toBeInTheDocument();
    expect(
      screen.getByText(/most successful companies suffer from a silent credibility gap/i)
    ).toBeInTheDocument();
  });

  it('contrasts the problem against our bespoke handcrafted code approach', () => {
    render(<RealityCheck />);
    expect(screen.getByText('Handcrafted Code & Bespoke Design')).toBeInTheDocument();
    expect(
      screen.getByText(/we do not use bloated wordpress, elementor, or wix site builders/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sub-second load times engineered with zero bloat/i)
    ).toBeInTheDocument();
  });
});
