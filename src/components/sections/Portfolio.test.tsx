import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Portfolio } from './Portfolio';

vi.mock('../../hooks/useScrollAnimation', () => ({
  useScrollAnimation: vi.fn(),
}));

vi.mock('../../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

vi.mock('gsap', () => {
  const timelineInstance = {
    to: vi.fn().mockReturnThis(),
    fromTo: vi.fn().mockReturnThis(),
    kill: vi.fn(),
  };

  return {
    default: {
      timeline: vi.fn(() => timelineInstance),
      to: vi.fn(),
      set: vi.fn(),
    },
  };
});

function mockSectionInView(inView: boolean) {
  const section = document.querySelector('#portfolio') as HTMLElement | null;
  if (!section) return;

  Object.defineProperty(section, 'getBoundingClientRect', {
    configurable: true,
    value: () =>
      ({
        x: 0,
        y: inView ? 120 : 0,
        width: 1200,
        height: 700,
        top: inView ? 120 : -1000,
        right: 1200,
        bottom: inView ? 820 : -200,
        left: 0,
        toJSON: () => ({}),
      }) as DOMRect,
  });
}

describe('Portfolio showcase transitions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders first project by default', () => {
    render(<Portfolio />);
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');
    expect(screen.getByTestId('portfolio-active-counter')).toHaveTextContent('1 / 3');
  });

  it('advances and wraps using next/prev controls', () => {
    render(<Portfolio />);

    fireEvent.click(screen.getByLabelText('Show next project'));
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('School Management');

    fireEvent.click(screen.getByLabelText('Show previous project'));
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');

    fireEvent.click(screen.getByLabelText('Show previous project'));
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('CodeByLeon V1');
    expect(screen.getByTestId('portfolio-active-counter')).toHaveTextContent('3 / 3');
  });

  it('resets active index when filter changes', () => {
    render(<Portfolio />);

    fireEvent.click(screen.getByLabelText('Show next project'));
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('School Management');

    fireEvent.click(screen.getByRole('button', { name: 'Creative' }));
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('CodeByLeon V1');
    expect(screen.getByTestId('portfolio-active-counter')).toHaveTextContent('1 / 1');
  });

  it('opens modal with currently active project', async () => {
    render(<Portfolio />);

    fireEvent.click(screen.getByLabelText('Show next project'));
    fireEvent.click(screen.getByRole('button', { name: /view details/i }));

    expect(await screen.findByText('The Challenge & Solution')).toBeInTheDocument();
    expect(screen.getAllByText('School Management').length).toBeGreaterThan(0);
  });

  it('supports keyboard arrow navigation when section is active', () => {
    render(<Portfolio />);
    mockSectionInView(true);

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('School Management');

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');
  });

  it('does not change projects on wheel scroll', () => {
    render(<Portfolio />);

    mockSectionInView(false);
    fireEvent.wheel(window, { deltaY: 120 });
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');

    mockSectionInView(true);
    fireEvent.wheel(window, { deltaY: 120 });
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');
  });

  it('does not change projects on touch swipe', () => {
    render(<Portfolio />);

    mockSectionInView(false);
    fireEvent.touchStart(window, { touches: [{ clientY: 400 }] });
    fireEvent.touchEnd(window, { changedTouches: [{ clientY: 120 }] });
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');

    mockSectionInView(true);
    fireEvent.touchStart(window, { touches: [{ clientY: 400 }] });
    fireEvent.touchEnd(window, { changedTouches: [{ clientY: 120 }] });
    expect(screen.getByTestId('portfolio-active-title')).toHaveTextContent('Legit Logistics');
  });

  it('disables navigation buttons for single-item filtered set', () => {
    render(<Portfolio />);

    fireEvent.click(screen.getByRole('button', { name: 'Creative' }));

    expect(screen.getByLabelText('Show previous project')).toBeDisabled();
    expect(screen.getByLabelText('Show next project')).toBeDisabled();
  });
});
