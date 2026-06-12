import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProcessPage } from './ProcessPage';

vi.mock('@gsap/react', () => ({
  useGSAP: (callback: () => void | (() => void)) => callback(),
}));

vi.mock('gsap', () => ({
  default: {
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    set: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
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

describe('ProcessPage', () => {
  it('renders the screenshot-led page hierarchy without the concept pill', () => {
    render(<ProcessPage />);

    expect(screen.getByRole('heading', {
      level: 1,
      name: /you bring the ambition\. i'll keep the work clear\./i,
    })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /here's the promise/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /our 5-step journey, together/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /clear roles\. strong results\./i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /common questions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', {
      name: /let's build something you'll be proud of\./i,
    })).toBeInTheDocument();

    expect(screen.queryByText('Cinematic')).not.toBeInTheDocument();
    expect(screen.queryByText('Human')).not.toBeInTheDocument();
    expect(screen.queryByText('Precise')).not.toBeInTheDocument();
  });

  it('shows the three promises and all five ordered journey stages', () => {
    render(<ProcessPage />);

    expect(screen.getByText(/you always know what is happening/i)).toBeInTheDocument();
    expect(screen.getByText(/you approve before i build/i)).toBeInTheDocument();
    expect(screen.getByText(/you leave with a site you can own/i)).toBeInTheDocument();

    const stageList = screen.getByRole('list', { name: /five-step website journey/i });
    const stages = stageList.querySelectorAll('.process-page__journey-step');

    expect(stages).toHaveLength(5);
    expect(stages[0]).toHaveTextContent('Listen together');
    expect(stages[1]).toHaveTextContent('Set the direction');
    expect(stages[2]).toHaveTextContent('Make it visible');
    expect(stages[3]).toHaveTextContent('Build in the open');
    expect(stages[4]).toHaveTextContent('Launch with support');
    expect(screen.getByText('4', { selector: '.process-page__journey-marker' })).toBeInTheDocument();
  });

  it('renders role guidance, meaningful images, and the intended CTA destinations', () => {
    render(<ProcessPage />);

    expect(screen.getByRole('heading', { name: /your role/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /my role/i })).toBeInTheDocument();
    expect(screen.getByText(/share your goals, content and feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/guide the process and protect your time/i)).toBeInTheDocument();

    expect(screen.getByRole('img', {
      name: /designer planning a website beside a laptop and notebook/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('img', {
      name: /website code being developed beside a design preview/i,
    })).toBeInTheDocument();

    const quoteLinks = screen.getAllByRole('link', { name: /build your quote/i });
    expect(quoteLinks.length).toBeGreaterThanOrEqual(2);
    quoteLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/get-started.html');
    });

    expect(screen.getByRole('link', { name: /meet the process/i })).toHaveAttribute(
      'href',
      '#process-journey',
    );
    expect(screen.getByRole('link', { name: /let's talk/i })).toHaveAttribute(
      'href',
      '/#final-cta',
    );
  });

  it('uses an accessible native FAQ accordion', async () => {
    const user = userEvent.setup();
    render(<ProcessPage />);

    const question = screen.getByText(/how involved do i need to be\?/i);
    const details = question.closest('details');

    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute('open');

    await user.click(question);

    expect(details).toHaveAttribute('open');
    expect(screen.getByText(/your involvement is focused around context, approvals, and planned feedback/i))
      .toBeVisible();
  });
});
