import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { LegitLogisticsCaseStudyPage } from './LegitLogisticsCaseStudyPage';

vi.mock('../utils/seo', () => ({
  SITE_NAME: 'Code by Leon',
  SITE_URL: 'https://codebyleon.com',
  usePageSeo: vi.fn(),
}));

describe('LegitLogisticsCaseStudyPage', () => {
  it('presents Legit Logistics as an operations automation case study', () => {
    render(
      <MemoryRouter>
        <LegitLogisticsCaseStudyPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /delivery operations automation platform/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/built to reduce manual coordination/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /driver app/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /customer tracking/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /automate my workflow/i })).toHaveAttribute(
      'href',
      '/get-started.html'
    );
  });
});
