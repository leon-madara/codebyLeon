import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FinalCTA } from './FinalCTA';

describe('FinalCTA section', () => {
  it('renders section with id="final-cta" and accessible label', () => {
    const { container } = render(<FinalCTA />);
    const section = container.querySelector('#final-cta');
    expect(section).toBeInTheDocument();
    expect(section).toHaveAttribute('aria-label', 'Final Call to Action');
  });

  it('prominently features the verbatim fast response guarantee', () => {
    render(<FinalCTA />);
    expect(
      screen.getByText('We will contact you within hours, if not minutes.')
    ).toBeInTheDocument();
  });

  it('provides two distinct conversion paths using canonical button classes', () => {
    render(<FinalCTA />);

    const discoveryBtn = screen.getByRole('link', {
      name: /book a 20-minute discovery call/i,
    });
    expect(discoveryBtn).toBeInTheDocument();
    expect(discoveryBtn).toHaveAttribute(
      'href',
      '/get-started.html?intent=discovery-call'
    );
    expect(discoveryBtn.className).toContain('button');
    expect(discoveryBtn.className).toContain('button--secondary');

    const configBtn = screen.getByRole('link', {
      name: /configure your project online/i,
    });
    expect(configBtn).toBeInTheDocument();
    expect(configBtn).toHaveAttribute('href', '/get-started.html');
    expect(configBtn.className).toContain('button');
    expect(configBtn.className).toContain('button--primary');
  });
});
