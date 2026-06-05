import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Portfolio } from './Portfolio';

vi.mock('../../hooks/useScrollAnimation', () => ({
  useScrollAnimation: vi.fn(),
}));

describe('Portfolio', () => {
  it('renders the Our Work section without filter controls', () => {
    render(<Portfolio />);

    expect(screen.getByRole('heading', { name: /our work/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /all projects/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /small business/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /creative professional/i })).not.toBeInTheDocument();
    expect(document.querySelector('.portfolio-filters')).not.toBeInTheDocument();
  });
});
