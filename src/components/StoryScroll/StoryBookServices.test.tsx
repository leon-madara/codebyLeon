import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getAdjacentStoryPage,
  getChapterIndexForStoryPage,
  getCoverOpeningTransform,
  getPageIndexForStoryPage,
  getStoryPageForPageIndex,
  getStoryPageIndex,
  StoryBookServices,
  TOTAL_STORY_PAGES,
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

  afterEach(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('preserves the services navigation target and renders the selected book assets', () => {
    const { container } = render(<StoryBookServices />);

    const section = screen.getByRole('region', { name: /codebyleon services storybook/i });
    expect(section).toHaveAttribute('id', 'services');
    expect(screen.getByAltText(/closed black leather codebyleon services storybook/i))
      .toHaveAttribute('src', expect.stringContaining('closed-cover-straight-v1'));
    expect(container.querySelector('.sb__cover-image[data-theme-asset="dark"]'))
      .toHaveAttribute('src', expect.stringContaining('closed-cover-straight-dark-v1'));
    expect(container.querySelector('.sb__open-book-image[data-theme-asset="light"]'))
      .toHaveAttribute('src', expect.stringContaining('open-book-blank-base-v2-no-moon'));
    expect(container.querySelector('.sb__open-book-image[data-theme-asset="dark"]'))
      .toHaveAttribute('src', expect.stringContaining('open-book-blank-dark-v1'));
  });

  it('keeps the desktop cover pivot locked to the open-book midpoint', () => {
    expect(getCoverOpeningTransform(true)).toMatchObject({
      xPercent: 0,
      transformOrigin: 'center center',
    });
  });

  it('moves through the prologue and all twelve story pages without exceeding either edge', () => {
    expect(TOTAL_STORY_PAGES).toBe(12);
    expect(getAdjacentStoryPage(null, 1)).toBe(0);
    expect(getAdjacentStoryPage(0, -1)).toBeNull();
    expect(getAdjacentStoryPage(11, 1)).toBe(11);
    expect(getStoryPageIndex(0, 0)).toBe(0);
    expect(getStoryPageIndex(1, 0)).toBe(4);
    expect(getStoryPageIndex(2, 3)).toBe(11);
    expect(getChapterIndexForStoryPage(11)).toBe(2);
  });

  it('maps all twelve two-leaf story spreads to the matching StPageFlip page index', () => {
    expect(getPageIndexForStoryPage(null)).toBe(0);
    expect(getPageIndexForStoryPage(0)).toBe(2);
    expect(getPageIndexForStoryPage(1)).toBe(4);
    expect(getPageIndexForStoryPage(11)).toBe(24);

    expect(getStoryPageForPageIndex(0)).toBeNull();
    expect(getStoryPageForPageIndex(1)).toBeNull();
    expect(getStoryPageForPageIndex(2)).toBe(0);
    expect(getStoryPageForPageIndex(3)).toBe(0);
    expect(getStoryPageForPageIndex(4)).toBe(1);
    expect(getStoryPageForPageIndex(5)).toBe(1);
    expect(getStoryPageForPageIndex(24)).toBe(11);
    expect(getStoryPageForPageIndex(25)).toBe(11);
  });

  it('opens with direct service choices and a guided full-journey path', () => {
    render(<StoryBookServices />);

    expect(screen.getByRole('heading', { name: /choose the service you need/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /website design & digital systems/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /brand identity & digital refresh/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recurring support for campaigns/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore the full journey/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chapter 01: websites & systems/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chapter 02: brand identity & refresh/i }))
      .toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open chapter 03: ongoing design support/i }))
      .toBeInTheDocument();
  });

  it('keeps the active story mounted when the root theme changes', async () => {
    const user = userEvent.setup();
    const { container } = render(<StoryBookServices />);

    await user.click(screen.getByRole('button', {
      name: /open chapter 02: brand identity & refresh/i,
    }));
    expect(screen.getByRole('heading', { name: /outgrow the old story/i }))
      .toBeInTheDocument();

    document.documentElement.setAttribute('data-theme', 'dark');

    expect(screen.getByRole('heading', { name: /outgrow the old story/i }))
      .toBeInTheDocument();
    expect(container.querySelectorAll('.sb__open-book-image[data-theme-asset]'))
      .toHaveLength(2);

  });

  it('uses chapter and subchapter markers to navigate the twelve-page story', async () => {
    const user = userEvent.setup();
    render(<StoryBookServices />);

    await user.click(screen.getByRole('button', { name: /open chapter 01: websites & systems/i }));

    expect(screen.getByRole('heading', { name: /hidden in plain sight/i }))
      .toBeInTheDocument();
    expect(screen.getByText(/every good business has a story worth discovering/i))
      .toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /open story 01: hidden in plain sight/i }))
      .toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /open story 04: turn the key/i }))
      .toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open story 04: turn the key/i }));
    expect(screen.getByRole('heading', { name: /turn the key/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open your digital doors/i }))
      .toHaveAttribute('href', '/get-started.html');

    await user.click(screen.getByRole('button', {
      name: /open chapter 02: brand identity & refresh/i,
    }));
    expect(screen.getByText(/sometimes a business grows beyond the story/i))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /outgrow the old story/i }))
      .toBeInTheDocument();

    await user.click(screen.getByRole('button', {
      name: /open chapter 03: ongoing design support/i,
    }));
    expect(screen.getByText(/a growing business keeps writing new pages/i))
      .toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /keep hold of the thread/i }))
      .toBeInTheDocument();

    await user.click(screen.getByRole('button', {
      name: /open story 04: keep the story whole/i,
    }));
    expect(screen.getByRole('link', { name: /keep your story moving/i }))
      .toHaveAttribute('href', '/get-started.html');
  });

  it('uses the book edges to turn forward and back through individual story pages', async () => {
    const user = userEvent.setup();
    render(<StoryBookServices />);

    const previousEdge = screen.getByRole('button', { name: /services prologue/i });
    expect(previousEdge).toBeDisabled();

    await user.click(screen.getByRole('button', {
      name: /turn forward to story page 01: hidden in plain sight/i,
    }));

    expect(screen.getByRole('heading', { name: /hidden in plain sight/i }))
      .toBeInTheDocument();

    await user.click(screen.getByRole('button', {
      name: /turn forward to story page 02: draw the map/i,
    }));

    expect(screen.getByRole('heading', { name: /draw the map/i }))
      .toBeInTheDocument();

    await user.click(screen.getByRole('button', {
      name: /turn back to story page 01: hidden in plain sight/i,
    }));

    expect(screen.getByRole('heading', { name: /hidden in plain sight/i }))
      .toBeInTheDocument();
  });
});
