import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Pointer } from 'lucide-react';
import { isVisualTestMode } from '@/utils/runtimeFlags';
import { useTheme } from '@/contexts/ThemeContext';

const CURSOR_SIZE = 50;
const HALF_CURSOR_SIZE = CURSOR_SIZE / 2;
const HAND_CURSOR_SIZE = 48;
const HAND_HOTSPOT_X = 12;
const HAND_HOTSPOT_Y = 3;
const DESKTOP_FINE_POINTER_QUERY = '(min-width: 1024px) and (pointer: fine)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const OUR_WORK_SECTION_SELECTOR = '#portfolio';
const CLICKABLE_PROJECT_SURFACE_SELECTOR = '.work-cursor-target';
const DOT_NORMAL_SPEED_OFFSET = 18;
const DOT_MAX_OVERSHOOT_OFFSET = 28;

type Point = {
  x: number;
  y: number;
};

type DotOffsetInput = {
  current: Point;
  previous: Point;
  elapsedMs: number;
};

export function getMomentumDotOffset({ current, previous, elapsedMs }: DotOffsetInput): Point {
  const deltaX = current.x - previous.x;
  const deltaY = current.y - previous.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

  const safeElapsedMs = Math.max(elapsedMs, 16);
  const speed = distance / safeElapsedMs;
  const offset = Math.min(DOT_MAX_OVERSHOOT_OFFSET, speed * DOT_NORMAL_SPEED_OFFSET);

  return {
    x: (deltaX / distance) * offset,
    y: (deltaY / distance) * offset,
  };
}

function canUseWorkCursor(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  if (typeof window.matchMedia !== 'function' || isVisualTestMode()) {
    return false;
  }

  return (
    window.matchMedia(DESKTOP_FINE_POINTER_QUERY).matches &&
    !window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

function addMediaListener(media: MediaQueryList, listener: () => void) {
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', listener);
    return;
  }

  media.addListener(listener);
}

function removeMediaListener(media: MediaQueryList, listener: () => void) {
  if (typeof media.removeEventListener === 'function') {
    media.removeEventListener('change', listener);
    return;
  }

  media.removeListener(listener);
}

function isPointInsideOurWork(point: Point): boolean {
  const section = document.querySelector<HTMLElement>(OUR_WORK_SECTION_SELECTOR);

  if (!section) {
    return false;
  }

  const rect = section.getBoundingClientRect();

  return (
    point.x >= rect.left &&
    point.x <= rect.right &&
    point.y >= rect.top &&
    point.y <= rect.bottom
  );
}

export function GlassBallCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const interactiveRef = useRef(false);
  const previousPointRef = useRef<Point | null>(null);
  const previousMoveTimeRef = useRef<number | null>(null);
  const dotReturnTimerRef = useRef<number | null>(null);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isCursorActive, setIsCursorActive] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  let theme: 'light' | 'dark' = 'dark';
  try {
    theme = useTheme().theme;
  } catch {
    const htmlTheme =
      typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : null;
    theme = htmlTheme === 'light' ? 'light' : 'dark';
  }

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const desktopFinePointer = window.matchMedia(DESKTOP_FINE_POINTER_QUERY);
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

    const updateEnabledState = () => {
      setIsEnabled(canUseWorkCursor());
    };

    updateEnabledState();
    addMediaListener(desktopFinePointer, updateEnabledState);
    addMediaListener(reducedMotion, updateEnabledState);

    return () => {
      removeMediaListener(desktopFinePointer, updateEnabledState);
      removeMediaListener(reducedMotion, updateEnabledState);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      document.documentElement.removeAttribute('data-work-cursor-active');
      activeRef.current = false;
      interactiveRef.current = false;
      setIsCursorActive(false);
      setIsInteractive(false);
    }
  }, [isEnabled]);

  useGSAP(
    () => {
      const cursor = cursorRef.current;
      const dot = dotRef.current;

      if (!isEnabled || !cursor || !dot) {
        return;
      }

      gsap.set(cursor, {
        x: -CURSOR_SIZE * 2,
        y: -CURSOR_SIZE * 2,
        scale: 0.92,
      });

      const xTo = gsap.quickTo(cursor, 'x', {
        duration: 0.22,
        ease: 'power3.out',
      });
      const yTo = gsap.quickTo(cursor, 'y', {
        duration: 0.22,
        ease: 'power3.out',
      });
      const animateScale = (scale: number) => {
        gsap.to(cursor, {
          scale,
          duration: 0.18,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      };
      const dotXTo = gsap.quickTo(dot, 'x', {
        duration: 0.12,
        ease: 'power3.out',
      });
      const dotYTo = gsap.quickTo(dot, 'y', {
        duration: 0.12,
        ease: 'power3.out',
      });

      const returnDotToCenter = () => {
        dotXTo(0);
        dotYTo(0);
      };

      const scheduleDotReturn = () => {
        if (dotReturnTimerRef.current !== null) {
          window.clearTimeout(dotReturnTimerRef.current);
        }

        dotReturnTimerRef.current = window.setTimeout(() => {
          returnDotToCenter();
          dotReturnTimerRef.current = null;
        }, 90);
      };

      const setActive = (nextIsActive: boolean) => {
        if (activeRef.current === nextIsActive) {
          return;
        }

        activeRef.current = nextIsActive;
        setIsCursorActive(nextIsActive);

        if (nextIsActive) {
          document.documentElement.setAttribute('data-work-cursor-active', 'true');
          return;
        }

        document.documentElement.removeAttribute('data-work-cursor-active');
      };

      const setInteractive = (nextIsInteractive: boolean) => {
        if (interactiveRef.current === nextIsInteractive) {
          return;
        }

        interactiveRef.current = nextIsInteractive;
        setIsInteractive(nextIsInteractive);
      };

      const updateCursor = (event: MouseEvent) => {
        const nextPoint = {
          x: event.clientX,
          y: event.clientY,
        };
        const nextMoveTime = event.timeStamp || performance.now();
        const isInside = isPointInsideOurWork(nextPoint);
        const isInteractive =
          isInside &&
          event.target instanceof Element &&
          event.target.closest(CLICKABLE_PROJECT_SURFACE_SELECTOR) !== null;
        const cursorStateChanged = interactiveRef.current !== isInteractive;

        xTo(nextPoint.x - (isInteractive ? HAND_HOTSPOT_X : HALF_CURSOR_SIZE));
        yTo(nextPoint.y - (isInteractive ? HAND_HOTSPOT_Y : HALF_CURSOR_SIZE));
        setActive(isInteractive);
        setInteractive(isInteractive);

        if (cursorStateChanged) {
          animateScale(isInteractive ? 1 : 0.92);
        }

        if (!isInteractive) {
          previousPointRef.current = null;
          previousMoveTimeRef.current = null;
          returnDotToCenter();
          return;
        }

        if (previousPointRef.current && previousMoveTimeRef.current !== null) {
          const offset = getMomentumDotOffset({
            current: nextPoint,
            previous: previousPointRef.current,
            elapsedMs: nextMoveTime - previousMoveTimeRef.current,
          });

          dotXTo(offset.x);
          dotYTo(offset.y);
          scheduleDotReturn();
        }

        previousPointRef.current = nextPoint;
        previousMoveTimeRef.current = nextMoveTime;
      };

      const handleMouseDown = () => {
        if (!activeRef.current) {
          return;
        }

        cursor.setAttribute('data-pressed', 'true');
        animateScale(interactiveRef.current ? 0.92 : 0.82);
      };

      const handleMouseUp = () => {
        cursor.removeAttribute('data-pressed');
        animateScale(activeRef.current ? 1 : 0.92);
      };

      const handleWindowBlur = () => {
        cursor.removeAttribute('data-pressed');
        setActive(false);
        setInteractive(false);
        animateScale(0.92);
      };

      window.addEventListener('mousemove', updateCursor, { passive: true });
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('blur', handleWindowBlur);

      return () => {
        window.removeEventListener('mousemove', updateCursor);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('blur', handleWindowBlur);
        document.documentElement.removeAttribute('data-work-cursor-active');
        if (dotReturnTimerRef.current !== null) {
          window.clearTimeout(dotReturnTimerRef.current);
          dotReturnTimerRef.current = null;
        }
        previousPointRef.current = null;
        previousMoveTimeRef.current = null;
        activeRef.current = false;
        interactiveRef.current = false;
        setIsCursorActive(false);
        setIsInteractive(false);
      };
    },
    { dependencies: [isEnabled, portalHost] }
  );

  if (!portalHost || !isEnabled) {
    return null;
  }

  return createPortal(
    <div
      ref={cursorRef}
      className="glass-ball-cursor"
      data-testid="glass-ball-cursor"
      data-active={isCursorActive ? 'true' : 'false'}
      data-interactive={isInteractive ? 'true' : 'false'}
      data-theme={theme}
      aria-hidden="true"
    >
      <div
        className={`glass-ball-cursor__ring${isInteractive ? ' is-hidden' : ''}`}
        data-testid="work-cursor-ring"
      >
        <span className="glass-ball-cursor__text">DRAG</span>
      </div>
      <div
        ref={dotRef}
        className={`glass-ball-cursor__dot${isInteractive ? ' is-hidden' : ''}`}
        data-testid="work-cursor-dot"
      />
      <div
        className={`glass-ball-cursor__hand${isInteractive ? ' is-visible' : ''}`}
        data-testid="work-cursor-hand"
        data-size="2x"
      >
        <Pointer className="glass-ball-cursor__hand-outline" size={HAND_CURSOR_SIZE} />
        <Pointer className="glass-ball-cursor__hand-fill" size={HAND_CURSOR_SIZE} />
      </div>
    </div>,
    portalHost
  );
}

export default GlassBallCursor;
