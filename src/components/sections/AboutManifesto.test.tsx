import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AboutManifesto } from './AboutManifesto';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
  },
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

describe('AboutManifesto', () => {
  it('renders founder credentials and studio location', () => {
    render(<AboutManifesto />);

    expect(screen.getByText('Leon Madara')).toBeInTheDocument();
    expect(screen.getByText('Founder & Principal Technologist')).toBeInTheDocument();
    expect(screen.getByText(/Nairobi, Kenya • Worldwide Delivery/i)).toBeInTheDocument();
    expect(
      screen.getByText(/there are no account managers, no account reps, no middlemen, and no junior developer handoffs/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you get direct 1-on-1 access to the engineer/i)
    ).toBeInTheDocument();
  });

  it('renders anti-template principle and engineering standards', () => {
    render(<AboutManifesto />);

    expect(screen.getByText('The Anti-Template Principle')).toBeInTheDocument();
    expect(screen.getByText('Engineering Standards')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('< 1.2s')).toBeInTheDocument();
    expect(screen.getByText('60 FPS')).toBeInTheDocument();
  });

  it('renders executive client testimonials', () => {
    render(<AboutManifesto />);

    expect(screen.getByText('Executive Partnership Voices')).toBeInTheDocument();
    expect(screen.getByText('Kossy Langat')).toBeInTheDocument();
    expect(screen.getByText('Faith')).toBeInTheDocument();
    expect(screen.getByText('Ken Madara')).toBeInTheDocument();
  });
});
