import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ServicesMatrix } from './ServicesMatrix';

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

describe('ServicesMatrix', () => {
  it('renders all three service tiers by default', () => {
    render(<ServicesMatrix />);

    expect(screen.getByText('A Brand-New Custom Website')).toBeInTheDocument();
    expect(screen.getByText('Complete Website Redesign & Modernization')).toBeInTheDocument();
    expect(screen.getByText('Custom Portals & Automated Workflows')).toBeInTheDocument();
  });

  it('renders the interactive project configurator bridge card', () => {
    render(<ServicesMatrix />);

    expect(screen.getByText('Interactive Project Configurator')).toBeInTheDocument();
    expect(
      screen.getByText('Not Sure Which Tier Fits Your Goals?')
    ).toBeInTheDocument();
    const ctaButton = screen.getByRole('link', { name: /Configure Your Project/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/get-started.html');
  });

  it('allows switching to the Interactive Scope Matcher', () => {
    render(<ServicesMatrix />);

    const switcherBtn = screen.getByRole('tab', { name: /Interactive Scope Matcher/i });
    fireEvent.click(switcherBtn);

    expect(screen.getByText('Where is your business right now?')).toBeInTheDocument();
    expect(screen.getByText('What is your primary commercial priority?')).toBeInTheDocument();
    expect(screen.getByText(/Recommended Architecture/i)).toBeInTheDocument();
  });

  it('updates recommendation when choosing an objective in the estimator', () => {
    render(<ServicesMatrix />);

    // Switch to estimator tab
    fireEvent.click(screen.getByRole('tab', { name: /Interactive Scope Matcher/i }));

    // Select Retainer objective
    const retainerBtn = screen.getByRole('button', { name: /Ongoing Growth & Fast Sprints/i });
    fireEvent.click(retainerBtn);

    expect(screen.getByText('Dedicated Senior Engineering Partner')).toBeInTheDocument();
    expect(screen.getByText('Monthly Rolling Sprints')).toBeInTheDocument();
  });
});
