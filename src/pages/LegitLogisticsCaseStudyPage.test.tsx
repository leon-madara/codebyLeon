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

  it('presents the three systems with an editorial article layout', () => {
    const { container } = render(
      <MemoryRouter>
        <LegitLogisticsCaseStudyPage />
      </MemoryRouter>
    );

    const systemArticles = container.querySelectorAll('.case-study__article-panel');

    expect(systemArticles).toHaveLength(3);
    expect(container.querySelector('.case-study__system-card')).not.toBeInTheDocument();
    expect(container.querySelectorAll('.case-study__article-meta')).toHaveLength(3);
    expect(container.querySelectorAll('.case-study__article-proofline')).toHaveLength(3);
    expect(container.querySelectorAll('.case-study__article-lede')).toHaveLength(3);
  });
});
