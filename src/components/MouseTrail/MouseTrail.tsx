import { useEffect, useRef } from 'react';

interface Vec2 {
  x: number;
  y: number;
}

const TRAIL_DOTS = [
  { size: 18, follow: 0.19 },
  { size: 14, follow: 0.14 },
  { size: 10, follow: 0.1 }
] as const;

const CURSOR_SIZE = 12;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

export interface MouseTrailConfig {
  scopeRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
  className?: string;
  stationaryThreshold?: number;
}

const INTERACTIVE_TARGET_SELECTOR = 'a, button, [role="button"], input, textarea, select, label';

export default function MouseTrail({
  scopeRef,
  disabled = false,
  className = '',
  stationaryThreshold = 140
}: MouseTrailConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointerRef = useRef<Vec2>({ x: 0, y: 0 });
  const cursorPosRef = useRef<Vec2>({ x: 0, y: 0 });
  const trailPosRef = useRef<Vec2[]>(TRAIL_DOTS.map(() => ({ x: 0, y: 0 })));
  const pointerInsideRef = useRef(false);
  const interactiveHoverRef = useRef(false);
  const idleRef = useRef(false);
  const lastMoveTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const scopeElement = scopeRef.current;

    if (!container || !cursor || !scopeElement || disabled) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || coarsePointer) return;

    scopeElement.classList.add('has-section-mouse-trail');

    const setVisible = (isVisible: boolean) => {
      container.classList.toggle('is-visible', isVisible);
    };

    const setIdle = (isIdle: boolean) => {
      if (idleRef.current === isIdle) return;
      idleRef.current = isIdle;
      container.classList.toggle('is-idle', isIdle);
    };

    const toLocalPoint = (event: MouseEvent): Vec2 => {
      const rect = scopeElement.getBoundingClientRect();
      return {
        x: clamp(event.clientX - rect.left, 0, rect.width),
        y: clamp(event.clientY - rect.top, 0, rect.height)
      };
    };

    const positionElementsImmediately = (point: Vec2) => {
      pointerRef.current = point;
      cursorPosRef.current = point;
      trailPosRef.current = TRAIL_DOTS.map(() => ({ ...point }));

      cursor.style.transform = `translate3d(${point.x - CURSOR_SIZE / 2}px, ${point.y - CURSOR_SIZE / 2}px, 0)`;

      trailRefs.current.forEach((trailElement, index) => {
        if (!trailElement) return;
        const size = TRAIL_DOTS[index].size;
        trailElement.style.transform = `translate3d(${point.x - size / 2}px, ${point.y - size / 2}px, 0)`;
      });
    };

    const isOverInteractiveTarget = (event: MouseEvent) => {
      const hoveredElement = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
      return Boolean(hoveredElement?.closest(INTERACTIVE_TARGET_SELECTOR));
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const point = toLocalPoint(event);
      positionElementsImmediately(point);

      pointerInsideRef.current = true;
      interactiveHoverRef.current = isOverInteractiveTarget(event);
      lastMoveTsRef.current = performance.now();

      setIdle(false);
      setVisible(!interactiveHoverRef.current);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!pointerInsideRef.current) return;

      pointerRef.current = toLocalPoint(event);
      interactiveHoverRef.current = isOverInteractiveTarget(event);
      lastMoveTsRef.current = performance.now();

      setVisible(!interactiveHoverRef.current);
    };

    const handleMouseLeave = () => {
      pointerInsideRef.current = false;
      interactiveHoverRef.current = false;
      setVisible(false);
      setIdle(false);
    };

    const tick = () => {
      if (pointerInsideRef.current && !interactiveHoverRef.current) {
        const now = performance.now();
        const isStationary = now - lastMoveTsRef.current > stationaryThreshold;
        setIdle(isStationary);

        const cursorTarget = pointerRef.current;
        const leadFollow = isStationary ? 0.22 : 0.32;

        cursorPosRef.current.x = lerp(cursorPosRef.current.x, cursorTarget.x, leadFollow);
        cursorPosRef.current.y = lerp(cursorPosRef.current.y, cursorTarget.y, leadFollow);

        cursor.style.transform = `translate3d(${cursorPosRef.current.x - CURSOR_SIZE / 2}px, ${cursorPosRef.current.y - CURSOR_SIZE / 2}px, 0)`;

        let previousPoint = cursorPosRef.current;
        trailPosRef.current.forEach((trailPos, index) => {
          const follow = isStationary ? 0.28 : TRAIL_DOTS[index].follow;
          const target = isStationary ? cursorPosRef.current : previousPoint;

          trailPos.x = lerp(trailPos.x, target.x, follow);
          trailPos.y = lerp(trailPos.y, target.y, follow);

          const trailElement = trailRefs.current[index];
          if (trailElement) {
            const size = TRAIL_DOTS[index].size;
            trailElement.style.transform = `translate3d(${trailPos.x - size / 2}px, ${trailPos.y - size / 2}px, 0)`;
          }

          previousPoint = trailPos;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    scopeElement.addEventListener('mouseenter', handleMouseEnter);
    scopeElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    scopeElement.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      scopeElement.removeEventListener('mouseenter', handleMouseEnter);
      scopeElement.removeEventListener('mousemove', handleMouseMove);
      scopeElement.removeEventListener('mouseleave', handleMouseLeave);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      pointerInsideRef.current = false;
      interactiveHoverRef.current = false;
      setVisible(false);
      setIdle(false);
      scopeElement.classList.remove('has-section-mouse-trail');
    };
  }, [scopeRef, disabled, stationaryThreshold]);

  return (
    <div
      ref={containerRef}
      className={`mouse-trail-container mouse-trail-container--hero ${className}`.trim()}
      aria-hidden="true"
    >
      <div ref={cursorRef} className="mouse-cursor" />
      {TRAIL_DOTS.map((_, index) => (
        <div
          key={index}
          ref={(node) => {
            trailRefs.current[index] = node;
          }}
          className="trail-element"
          data-index={index}
        />
      ))}
    </div>
  );
}
