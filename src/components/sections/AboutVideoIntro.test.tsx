import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AboutVideoIntro } from './AboutVideoIntro';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    matchMedia: () => ({
      add: vi.fn(),
      revert: vi.fn(),
    }),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('../../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

describe('AboutVideoIntro', () => {
  it('renders video element with correct source and accessibility attributes', () => {
    const { container } = render(<AboutVideoIntro />);
    const video = container.querySelector('video');

    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/videos/codebyleon-intro.mp4');
    expect(video).toHaveAttribute(
      'aria-label',
      'A message from CodeByLeon founder, Leon Madara'
    );
  });

  it('renders accessible video controls and seek track', () => {
    render(<AboutVideoIntro />);

    expect(
      screen.getByRole('button', { name: /play video|pause video/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('slider', { name: /video seek progress/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /mute video|unmute video/i })
    ).toBeInTheDocument();
  });

  it('renders founder commitment copy with direct 1-on-1 collaboration and zero junior dev handoff', () => {
    render(<AboutVideoIntro />);

    expect(
      screen.getByRole('heading', { name: /first impressions happen in seconds/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/a message from codebyleon founder – leon madara/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/work directly 1-on-1 with leon/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/zero junior developer handoffs/i)
    ).toBeInTheDocument();
  });
});
