import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlassBallCursor, getMomentumDotOffset } from './GlassBallCursor';

function installMatchMedia({
  desktopFine = true,
  reducedMotion = false,
}: {
  desktopFine?: boolean;
  reducedMotion?: boolean;
} = {}) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reducedMotion : desktopFine,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function createPortfolioSection() {
  const section = document.createElement('section');
  section.id = 'portfolio';
  section.getBoundingClientRect = vi.fn(() => ({
    x: 0,
    y: 100,
    top: 100,
    right: 700,
    bottom: 700,
    left: 0,
    width: 700,
    height: 600,
    toJSON: () => ({}),
  }));
  document.body.appendChild(section);
  return section;
}

async function waitForCursorEligibilityCheck() {
  await waitFor(() => {
    expect(window.matchMedia).toHaveBeenCalled();
  });
}

describe('GlassBallCursor', () => {
  beforeEach(() => {
    installMatchMedia();
    window.history.pushState({}, '', '/');
    document.documentElement.removeAttribute('data-visual-test');
    document.documentElement.removeAttribute('data-work-cursor-active');
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-visual-test');
    document.documentElement.removeAttribute('data-work-cursor-active');
    vi.restoreAllMocks();
  });

  it('renders nothing in visual test mode', async () => {
    document.documentElement.setAttribute('data-visual-test', 'true');

    render(<GlassBallCursor />);

    await waitForCursorEligibilityCheck();
    expect(screen.queryByTestId('glass-ball-cursor')).not.toBeInTheDocument();
  });

  it('renders nothing when reduced motion is enabled', async () => {
    installMatchMedia({ desktopFine: true, reducedMotion: true });

    render(<GlassBallCursor />);

    await waitForCursorEligibilityCheck();
    expect(screen.queryByTestId('glass-ball-cursor')).not.toBeInTheDocument();
  });

  it('renders nothing on non-desktop or coarse-pointer environments', async () => {
    installMatchMedia({ desktopFine: false, reducedMotion: false });

    render(<GlassBallCursor />);

    await waitForCursorEligibilityCheck();
    expect(screen.queryByTestId('glass-ball-cursor')).not.toBeInTheDocument();
  });

  it('portals the Webflow-style cursor structure to document.body', async () => {
    render(<GlassBallCursor />);

    const cursor = await screen.findByTestId('glass-ball-cursor');

    expect(cursor.parentElement).toBe(document.body);
    expect(cursor).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('work-cursor-ring')).toBeInTheDocument();
    expect(screen.getByTestId('work-cursor-dot')).toBeInTheDocument();
    expect(screen.getByText('DRAG')).toBeInTheDocument();
  });

  it('only activates while the pointer is inside the portfolio Our Work section', async () => {
    const portfolioSection = createPortfolioSection();

    render(<GlassBallCursor />);

    const cursor = await screen.findByTestId('glass-ball-cursor');

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 240, clientY: 240 }));

    await waitFor(() => {
      expect(cursor).toHaveAttribute('data-active', 'true');
      expect(document.documentElement).toHaveAttribute('data-work-cursor-active', 'true');
    });

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 240, clientY: 80 }));

    await waitFor(() => {
      expect(cursor).toHaveAttribute('data-active', 'false');
      expect(document.documentElement).not.toHaveAttribute('data-work-cursor-active');
    });

    portfolioSection.remove();
  });

  it('moves the dot farther toward the travel edge as pointer speed increases', () => {
    const slow = getMomentumDotOffset({
      current: { x: 140, y: 100 },
      previous: { x: 100, y: 100 },
      elapsedMs: 260,
    });
    const normal = getMomentumDotOffset({
      current: { x: 220, y: 100 },
      previous: { x: 100, y: 100 },
      elapsedMs: 120,
    });
    const fast = getMomentumDotOffset({
      current: { x: 700, y: 100 },
      previous: { x: 100, y: 100 },
      elapsedMs: 16,
    });

    expect(slow.x).toBeGreaterThan(0);
    expect(normal.x).toBeGreaterThan(slow.x);
    expect(fast.x).toBeGreaterThan(normal.x);
    expect(normal.x).toBeLessThanOrEqual(18);
    expect(fast.x).toBeGreaterThan(24);
  });
});
