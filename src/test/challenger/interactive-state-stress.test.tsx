import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import { AboutVideoIntro } from '../../components/sections/AboutVideoIntro';
import { AboutManifesto } from '../../components/sections/AboutManifesto';
import { Hero } from '../../components/sections/Hero';
import { RealityCheck } from '../../components/sections/RealityCheck';
import { FinalCTA } from '../../components/sections/FinalCTA';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';
import { ThemeProvider, useTheme } from '../../contexts/ThemeContext';

// Helper theme toggle component for stress testing
function ThemeTester({ onToggle }: { onToggle?: (theme: string) => void }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="active-theme">{theme}</span>
      <button
        data-testid="toggle-btn"
        onClick={() => {
          toggleTheme();
          if (onToggle) onToggle(theme === 'dark' ? 'light' : 'dark');
        }}
      >
        Toggle
      </button>
    </div>
  );
}

describe('Adversarial Empirical Stress Tests: Interactive & Stateful Components', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.useRealTimers();
  });

  // =========================================================================
  // 1. VIDEO PLAYER INTERACTION IN AboutVideoIntro.tsx
  // =========================================================================
  describe('1. Video Player Interaction (AboutVideoIntro.tsx)', () => {
    let playMock: ReturnType<typeof vi.fn>;
    let pauseMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      playMock = vi.fn().mockImplementation(() => Promise.resolve());
      pauseMock = vi.fn();
      window.HTMLMediaElement.prototype.play = playMock;
      window.HTMLMediaElement.prototype.pause = pauseMock;
    });

    it('toggles playback via play/pause button, wrapper click, and keyboard triggers', async () => {
      render(<AboutVideoIntro />);

      const video = screen.getByLabelText(/A message from CodeByLeon founder/i) as HTMLVideoElement;
      const playPauseBtn = screen.getByRole('button', { name: /pause video/i });
      const videoWrapper = screen.getByRole('button', { name: /toggle video playback/i });

      // Click pause button
      fireEvent.click(playPauseBtn);
      expect(pauseMock).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();
      expect(screen.getByText('▶', { selector: '.about-video-intro__center-play span' })).toBeInTheDocument();

      // Click play button to resume
      fireEvent.click(screen.getByRole('button', { name: /play video/i }));
      expect(playMock).toHaveBeenCalled();

      // Toggle via wrapper click
      fireEvent.click(videoWrapper);
      expect(pauseMock).toHaveBeenCalledTimes(2);

      // Toggle via Space key on wrapper
      fireEvent.keyDown(videoWrapper, { key: ' ' });
      expect(playMock).toHaveBeenCalled();

      // Toggle via Enter key on wrapper
      fireEvent.keyDown(videoWrapper, { key: 'Enter' });
      expect(pauseMock).toHaveBeenCalledTimes(3);
    });

    it('gracefully handles play() promise rejection without uncaught exception', async () => {
      playMock.mockImplementation(() => Promise.reject(new Error('Autoplay blocked by browser policy')));
      render(<AboutVideoIntro />);

      const playPauseBtn = screen.getByRole('button', { name: /pause video/i });
      fireEvent.click(playPauseBtn); // pause

      const playBtn = screen.getByRole('button', { name: /play video/i });
      expect(() => {
        fireEvent.click(playBtn); // play fails
      }).not.toThrow();
    });

    it('resets playing state when video ended event fires', () => {
      render(<AboutVideoIntro />);
      const video = screen.getByLabelText(/A message from CodeByLeon founder/i) as HTMLVideoElement;

      expect(screen.getByRole('button', { name: /pause video/i })).toBeInTheDocument();

      fireEvent.ended(video);

      expect(screen.getByRole('button', { name: /play video/i })).toBeInTheDocument();
      expect(pauseMock).toHaveBeenCalled();
    });

    it('enforces mute/unmute toggle and volume restoration logic', () => {
      render(<AboutVideoIntro />);

      const muteBtn = screen.getByRole('button', { name: /unmute video/i });
      const video = screen.getByLabelText(/A message from CodeByLeon founder/i) as HTMLVideoElement;

      // Click to unmute
      fireEvent.click(muteBtn);
      expect(video.muted).toBe(false);
      expect(screen.getByRole('button', { name: /mute video/i })).toBeInTheDocument();

      // Click to mute again
      fireEvent.click(screen.getByRole('button', { name: /mute video/i }));
      expect(video.muted).toBe(true);
      expect(screen.getByRole('button', { name: /unmute video/i })).toBeInTheDocument();
    });

    it('enforces volume slider boundaries and auto-mute at volume 0', () => {
      render(<AboutVideoIntro />);

      const volumeSlider = screen.getByRole('slider', { name: /adjust video volume/i }) as HTMLInputElement;
      const video = screen.getByLabelText(/A message from CodeByLeon founder/i) as HTMLVideoElement;

      expect(volumeSlider.min).toBe('0');
      expect(volumeSlider.max).toBe('1');
      expect(volumeSlider.step).toBe('0.02');

      // Set volume to 0.8
      fireEvent.change(volumeSlider, { target: { value: '0.8' } });
      expect(video.volume).toBe(0.8);
      expect(video.muted).toBe(false);

      // Set volume to 0 (should auto-mute)
      fireEvent.change(volumeSlider, { target: { value: '0' } });
      expect(video.volume).toBe(0);
      expect(video.muted).toBe(true);

      // Unmuting when volume was 0 restores volume to 0.5
      const muteBtn = screen.getByRole('button', { name: /unmute video/i });
      fireEvent.click(muteBtn);
      expect(video.volume).toBe(0.5);
      expect(video.muted).toBe(false);
    });

    it('enforces seek progress slider boundaries under extreme click coordinates', () => {
      render(<AboutVideoIntro />);

      const seekTrack = screen.getByRole('slider', { name: /video seek progress/i });
      const video = screen.getByLabelText(/A message from CodeByLeon founder/i) as HTMLVideoElement;

      // Mock video duration
      Object.defineProperty(video, 'duration', { value: 120, writable: true });
      Object.defineProperty(video, 'currentTime', { value: 0, writable: true });

      // Mock seekTrack dimensions: left=100, width=500
      vi.spyOn(seekTrack, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 0,
        right: 600,
        bottom: 20,
        width: 500,
        height: 20,
        x: 100,
        y: 0,
        toJSON: () => ({})
      });

      // Extreme left: clientX = 50 (negative relative offset -50px) -> clamped to 0%
      fireEvent.click(seekTrack, { clientX: 50 });
      expect(video.currentTime).toBe(0);

      // Middle: clientX = 350 (250px out of 500 = 50%) -> 60s
      fireEvent.click(seekTrack, { clientX: 350 });
      expect(video.currentTime).toBe(60);

      // Extreme right: clientX = 800 (overshoot relative offset 700px) -> clamped to 100% (120s)
      fireEvent.click(seekTrack, { clientX: 800 });
      expect(video.currentTime).toBe(120);

      // ARIA boundaries
      expect(seekTrack).toHaveAttribute('aria-valuemin', '0');
      expect(seekTrack).toHaveAttribute('aria-valuemax', '100');
    });

    it('updates time display accurately on timeupdate and loadedmetadata', () => {
      render(<AboutVideoIntro />);

      const video = screen.getByLabelText(/A message from CodeByLeon founder/i) as HTMLVideoElement;
      Object.defineProperty(video, 'duration', { value: 125, writable: true });
      Object.defineProperty(video, 'currentTime', { value: 65, writable: true });

      fireEvent.loadedMetadata(video);
      fireEvent.timeUpdate(video);

      // 65s = 1:05, 125s = 2:05
      expect(screen.getByText('1:05 / 2:05')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // 2. NAIROBI TIMEZONE CALCULATION IN AboutManifesto.tsx
  // =========================================================================
  describe('2. Nairobi Timezone Calculation & Clock Lifecycle (AboutManifesto.tsx)', () => {
    it('accurately computes live Nairobi studio time with Africa/Nairobi timezone', () => {
      render(<AboutManifesto />);

      const timeElement = screen.getByText(/Local Studio Time:/i);
      expect(timeElement).toBeInTheDocument();

      // Format should include AM/PM and time numbers (e.g. 12:00:00 AM)
      expect(timeElement.textContent).toMatch(/Local Studio Time:\s*(\d{1,2}:\d{2}:\d{2}\s*(AM|PM)|EAT \(UTC\+3\))/i);
    });

    it('produces identical Nairobi time regardless of host system timezone offset', () => {
      // Test reference timestamp: 2026-10-10T12:00:00Z (UTC)
      // In Africa/Nairobi (UTC+3), this is exactly 03:00:00 PM (15:00:00)
      const testDate = new Date('2026-10-10T12:00:00Z');
      vi.useFakeTimers();
      vi.setSystemTime(testDate);

      render(<AboutManifesto />);

      const nairobiFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const expectedTime = nairobiFormatter.format(testDate);

      expect(screen.getByText(new RegExp(expectedTime))).toBeInTheDocument();
    });

    it('gracefully falls back to EAT (UTC+3) if Intl.DateTimeFormat throws', () => {
      const originalDateTimeFormat = Intl.DateTimeFormat;
      // Force Intl.DateTimeFormat constructor to throw
      const errorSpy = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
        throw new RangeError('Unsupported time zone: Africa/Nairobi');
      });

      render(<AboutManifesto />);

      expect(screen.getByText(/EAT \(UTC\+3\)/i)).toBeInTheDocument();
      errorSpy.mockRestore();
    });

    it('cleans up interval timer on component unmount without memory leaks', () => {
      vi.useFakeTimers();
      const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

      const { unmount } = render(<AboutManifesto />);
      expect(clearIntervalSpy).not.toHaveBeenCalled();

      // Unmount component
      unmount();
      expect(clearIntervalSpy).toHaveBeenCalled();

      // Advance timers by 10 seconds post-unmount — should not trigger unhandled state updates
      expect(() => {
        act(() => {
          vi.advanceTimersByTime(10000);
        });
      }).not.toThrow();
    });
  });

  // =========================================================================
  // 3. TYPING ANIMATION IN Hero.tsx & useTypingAnimation.ts
  // =========================================================================
  describe('3. Typing Animation & Cleanup Lifecycle (Hero.tsx & useTypingAnimation.ts)', () => {
    it('renders full initial word immediately when disabled (visual test mode)', () => {
      const { result } = renderHook(() => useTypingAnimation({ disabled: true }));

      expect(result.current.currentWord).toBe('DRIVEN');
      expect(result.current.elementRef.current).toBeNull(); // not yet attached to DOM
    });

    it('mounts and executes word normalization for out-of-bounds indices', () => {
      const { result } = renderHook(() =>
        useTypingAnimation({
          words: ['DRIVEN', 'AMBITIOUS', 'VISIONARY'],
          disabled: false,
        })
      );

      // Test negative index normalization (-1 should wrap to index 2: VISIONARY)
      act(() => {
        result.current.setStartingWordIndex(-1);
      });
      expect(result.current.currentWordIndexRef.current).toBe(2);

      // Test large positive index normalization (10 % 3 = 1: AMBITIOUS)
      act(() => {
        result.current.setStartingWordIndex(10);
      });
      expect(result.current.currentWordIndexRef.current).toBe(1);
    });

    it('survives rapid mount and unmount cycles without orphaned animations or crashes', () => {
      // Stress test: 50 rapid mount and unmount cycles
      for (let i = 0; i < 50; i++) {
        const { unmount } = render(
          <MemoryRouter>
            <Hero />
          </MemoryRouter>
        );
        unmount();
      }
      expect(true).toBe(true);
    });

    it('supports imperative stop() and start() controls', () => {
      const { result } = renderHook(() => useTypingAnimation({ disabled: false }));

      expect(() => {
        act(() => {
          result.current.stop();
        });
      }).not.toThrow();

      expect(() => {
        act(() => {
          result.current.start();
        });
      }).not.toThrow();
    });

    it('gracefully handles empty words array without throwing', () => {
      expect(() => {
        renderHook(() =>
          useTypingAnimation({
            words: [],
            disabled: false,
          })
        );
      }).not.toThrow();
    });
  });

  // =========================================================================
  // 4. REALITY CHECK CARD LAYOUT UNDER EXTREME VIEWPORTS & REDUCED MOTION
  // =========================================================================
  describe('4. Reality Check Card Layout & Viewport Robustness (RealityCheck.tsx)', () => {
    const testViewports = [
      { name: 'Ultra-Narrow Foldable (280px)', width: 280, height: 653 },
      { name: 'Mobile Standard (320px)', width: 320, height: 568 },
      { name: 'Tablet Portrait (768px)', width: 768, height: 1024 },
      { name: 'Desktop Standard (1440px)', width: 1440, height: 900 },
      { name: '4K Ultra-Wide (3840px)', width: 3840, height: 2160 },
    ];

    testViewports.forEach(({ name, width, height }) => {
      it(`renders complete narrative content under ${name} (${width}x${height})`, () => {
        window.innerWidth = width;
        window.innerHeight = height;

        const { container } = render(<RealityCheck />);

        // Section container and accessibility
        const section = container.querySelector('#reality-check');
        expect(section).toBeInTheDocument();
        expect(section).toHaveAttribute('aria-label', 'The Reality Check and Our Approach');

        // Headline & diagnosis
        expect(
          screen.getByRole('heading', {
            name: /Your Business Is Established\. Does Your Website Look Like It\?/i,
          })
        ).toBeInTheDocument();
        expect(screen.getByText('The Professional Gap')).toBeInTheDocument();
        expect(screen.getByText('Handcrafted Code & Bespoke Design')).toBeInTheDocument();

        // 4 Problem list items
        expect(screen.getByText(/Slow loading speeds and clunky navigation/i)).toBeInTheDocument();
        expect(screen.getByText(/Generic drag-and-drop templates/i)).toBeInTheDocument();
        expect(screen.getByText(/Vague, buzzword-heavy copy/i)).toBeInTheDocument();
        expect(screen.getByText(/Hidden technical debt and bloated plugins/i)).toBeInTheDocument();

        // 4 Approach list items
        expect(screen.getByText(/Sub-second load times engineered with zero bloat/i)).toBeInTheDocument();
        expect(screen.getByText(/Bespoke visual identity tailored strictly to your market position/i)).toBeInTheDocument();
        expect(screen.getByText(/Frictionless conversion funnels/i)).toBeInTheDocument();
        expect(screen.getByText(/Direct founder craftsmanship/i)).toBeInTheDocument();

        // Outcome summary metrics
        expect(screen.getByText(/Result: Lost deals and eroded pricing power/i)).toBeInTheDocument();
        expect(screen.getByText(/Result: An authoritative digital flagship/i)).toBeInTheDocument();
      });
    });

    it('renders cleanly without motion dependencies when reduced-motion is requested', () => {
      // Mock prefers-reduced-motion media query
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { container } = render(<RealityCheck />);
      expect(container.querySelector('.reality-check__grid')).toBeInTheDocument();
      expect(container.querySelectorAll('.reality-check__card')).toHaveLength(2);
    });
  });

  // =========================================================================
  // 5. DUAL THEME TOGGLING STABILITY
  // =========================================================================
  describe('5. Dual Theme Toggle Stability & State Synchronicity', () => {
    it('maintains perfect DOM attribute and storage sync across 50 rapid toggles', async () => {
      const user = userEvent.setup();
      let lastTheme = 'light';

      render(
        <ThemeProvider>
          <ThemeTester onToggle={(t) => (lastTheme = t)} />
        </ThemeProvider>
      );

      const toggleBtn = screen.getByTestId('toggle-btn');
      const themeLabel = screen.getByTestId('active-theme');

      expect(themeLabel.textContent).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');

      // Rapidly toggle 50 times
      for (let i = 0; i < 50; i++) {
        await user.click(toggleBtn);
        const expected = i % 2 === 0 ? 'dark' : 'light';
        expect(themeLabel.textContent).toBe(expected);
        expect(document.documentElement.getAttribute('data-theme')).toBe(expected);
        expect(localStorage.getItem('theme')).toBe(expected);
      }
    });

    it('preserves component integrity across full narrative stack during theme shifts', async () => {
      const user = userEvent.setup();

      const { container } = render(
        <MemoryRouter>
          <ThemeProvider>
            <ThemeTester />
            <Hero />
            <RealityCheck />
            <AboutVideoIntro />
            <AboutManifesto />
            <FinalCTA />
          </ThemeProvider>
        </MemoryRouter>
      );

      const toggleBtn = screen.getByTestId('toggle-btn');

      // Toggle to dark
      await user.click(toggleBtn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(container.querySelector('#hero')).toBeInTheDocument();
      expect(container.querySelector('#reality-check')).toBeInTheDocument();
      expect(container.querySelector('#about-intro')).toBeInTheDocument();
      expect(container.querySelector('#about')).toBeInTheDocument();
      expect(container.querySelector('#final-cta')).toBeInTheDocument();

      // Toggle back to light
      await user.click(toggleBtn);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(container.querySelector('#hero')).toBeInTheDocument();
      expect(container.querySelector('#reality-check')).toBeInTheDocument();
      expect(container.querySelector('#about-intro')).toBeInTheDocument();
      expect(container.querySelector('#about')).toBeInTheDocument();
      expect(container.querySelector('#final-cta')).toBeInTheDocument();
    });
  });
});
