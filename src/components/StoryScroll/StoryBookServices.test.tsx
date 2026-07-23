import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAdjacentChapter,
  getChapterForPageIndex,
  getCoverOpeningTransform,
  getPageIndexForChapter,
  StoryBookServices,
} from './StoryBookServices';

vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn((callbackOrConfig) => {
    if (typeof callbackOrConfig === 'function') {
      callbackOrConfig();
    }

    return {
      contextSafe: <T extends (...args: never[]) => unknown>(callback: T) => callback,
    };
  }),
}));

vi.mock('gsap', () => {
  const gsapMock = {
    registerPlugin: vi.fn(),
    set: vi.fn(),
  };

  return { default: gsapMock, gsap: gsapMock };
});

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}));

vi.mock('gsap/ScrollSmoother', () => ({
  ScrollSmoother: {
    get: vi.fn(() => null),
  },
}));

vi.mock('../../utils/runtimeFlags', () => ({
  isVisualTestMode: () => true,
}));

describe('StoryBookServices', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  });

  it('preserves the services navigation target and renders the selected book assets', () => {
    render(<StoryBookServices />);

    const section = screen.getByRole('region', { name: /codebyleon services storybook/i });
    expect(section).toHaveAttribute('id', 'services');
    expect(screen.getByAltText(/closed black leather codebyleon services storybook/i))
      .toHaveAttribute('src', expect.stringContaining('closed-cover-straight-v1'));
  });

  it('keeps the desktop cover pivot locked to the open-book midpoint', () => {
    expect(getCoverOpeningTransform(true)).toMatchObject({
      xPercent: 0,
      transformOrigin: 'center center',
    });
  });

  it('moves through the prologue and chapters without exceeding either book edge', () => {
    expect(getAdjacentChapter(null, 1)).toBe(0);
    expect(getAdjacentChapter(0, -1)).toBeNull();
    expect(getAdjacentChapter(2, 1)).toBe(2);
  });

  it('maps every two-page spread to the matching StPageFlip page index', () => {
    expect(getPageIndexForChapter(null)).toBe(0);
    expect(getPageIndexForChapter(0)).toBe(2);
    expect(getPageIndexForChapter(1)).toBe(4);
    expect(getPageIndexForChapter(2)).toBe(6);

    expect(getChapterForPageIndex(0)).toBeNull();
    expect(getChapterForPageIndex(1)).toBeNull();
    expect(getChapterForPageIndex(2)).toBe(0);
    expect(getChapterForPageIndex(3)).toBe(0);
    expect(getChapterForPageIndex(4)).toBe(1);
    expect(getChapterForPageIndex(5)).toBe(1);
    expect(getChapterForPageIndex(6)).toBe(2);
    expect(getChapterForPageIndex(7)).toBe(2);
  });

  it('opens with a prologue and exposes all three service chapter controls', () => {
    render(<StoryBookServices />);

    expect(screen.getByRole('heading', { name: /what does your business need next/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chapter 01: websites & systems/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chapter 02: brand identity/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chapter 03: ongoing design/i }))
      .toBeInTheDocument();
  });

  it('uses the chapter tabs to reveal the selected service and its four beats', async () => {
    const user = userEvent.setup();
    render(<StoryBookServices />);

    await user.click(screen.getByRole('button', { name: /open chapter 01: websites & systems/i }));

    expect(screen.getByRole('heading', { name: /website design & digital systems/i }))
      .toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('link', { name: /build your digital presence/i }))
      .toHaveAttribute('href', '/get-started.html');
  });

  it('uses the book edges to turn forward and back through the live chapter content', async () => {
    const user = userEvent.setup();
    render(<StoryBookServices />);

    const previousEdge = screen.getByRole('button', { name: /services prologue/i });
    expect(previousEdge).toBeDisabled();

    await user.click(screen.getByRole('button', {
      name: /turn forward to chapter 01: websites & systems/i,
    }));

    expect(screen.getByRole('heading', { name: /website design & digital systems/i }))
      .toBeInTheDocument();

    await user.click(screen.getByRole('button', {
      name: /turn back to the services prologue/i,
    }));

    expect(screen.getByRole('heading', { name: /what does your business need next/i }))
      .toBeInTheDocument();
  });
});
