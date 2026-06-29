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
  
  // Physics tracking refs
  const pointerRef = useRef<Vec2>({ x: 0, y: 0 });
  const cursorPosRef = useRef<Vec2>({ x: 0, y: 0 });
  const trailPosRef = useRef<Vec2[]>(TRAIL_DOTS.map(() => ({ x: 0, y: 0 })));
  const pointerInsideRef = useRef(false);
  const interactiveHoverRef = useRef(false);
  const idleRef = useRef(false);
  const lastMoveTsRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Screen coordinate and speed tracking refs
  const lastClientX = useRef(0);
  const lastClientY = useRef(0);
  const smoothedSpeed = useRef(0);
  const lastPointerPos = useRef<Vec2>({ x: 0, y: 0 });
  const lastFrameTime = useRef<number>(0);

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

    const toLocalPoint = (clientX: number, clientY: number): Vec2 => {
      const rect = scopeElement.getBoundingClientRect();
      return {
        x: clamp(clientX - rect.left, 0, rect.width),
        y: clamp(clientY - rect.top, 0, rect.height)
      };
    };

    const positionElementsImmediately = (point: Vec2) => {
      pointerRef.current = point;
      cursorPosRef.current = point;
      trailPosRef.current = TRAIL_DOTS.map(() => ({ ...point }));
      lastPointerPos.current = { ...point };

      cursor.style.transform = `translate3d(${point.x - CURSOR_SIZE / 2}px, ${point.y - CURSOR_SIZE / 2}px, 0)`;

      trailRefs.current.forEach((trailElement, index) => {
        if (!trailElement) return;
        const size = TRAIL_DOTS[index].size;
        trailElement.style.transform = `translate3d(${point.x - size / 2}px, ${point.y - size / 2}px, 0)`;
      });
    };

    const isOverInteractiveTarget = (clientX: number, clientY: number) => {
      const hoveredElement = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      return Boolean(hoveredElement?.closest(INTERACTIVE_TARGET_SELECTOR));
    };

    const handleMouseEnter = (event: MouseEvent) => {
      lastClientX.current = event.clientX;
      lastClientY.current = event.clientY;
      const point = toLocalPoint(event.clientX, event.clientY);
      positionElementsImmediately(point);

      pointerInsideRef.current = true;
      interactiveHoverRef.current = isOverInteractiveTarget(event.clientX, event.clientY);
      lastMoveTsRef.current = performance.now();
      lastFrameTime.current = performance.now();
      smoothedSpeed.current = 0;

      setIdle(false);
      setVisible(!interactiveHoverRef.current);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!pointerInsideRef.current) return;

      lastClientX.current = event.clientX;
      lastClientY.current = event.clientY;
      pointerRef.current = toLocalPoint(event.clientX, event.clientY);
      interactiveHoverRef.current = isOverInteractiveTarget(event.clientX, event.clientY);
      lastMoveTsRef.current = performance.now();

      setVisible(!interactiveHoverRef.current);
    };

    const handleScroll = () => {
      if (!pointerInsideRef.current) return;

      pointerRef.current = toLocalPoint(lastClientX.current, lastClientY.current);
      lastMoveTsRef.current = performance.now();
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
        
        // Frame rate independence calculation
        const elapsedMs = now - (lastFrameTime.current || now);
        lastFrameTime.current = now;
        const dt = clamp(elapsedMs / 16.666, 0.1, 10);

        // Speed calculation (pixels per nominal 60fps frame)
        const dx = pointerRef.current.x - lastPointerPos.current.x;
        const dy = pointerRef.current.y - lastPointerPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const rawSpeed = dist / dt;
        const smoothingFactor = clamp(0.12 * dt, 0.01, 1);
        smoothedSpeed.current = lerp(smoothedSpeed.current, rawSpeed, smoothingFactor);
        
        lastPointerPos.current = { ...pointerRef.current };

        // Normalize speed to [0, 1] range based on MAX_SPEED
        const MAX_SPEED = 25;
        const speedFactor = clamp(smoothedSpeed.current / MAX_SPEED, 0, 1);

        const isStationary = now - lastMoveTsRef.current > stationaryThreshold;
        setIdle(isStationary);

        const cursorTarget = pointerRef.current;
        // Smoother cursor movement using dynamic follow rate (dt adjusted)
        const leadFollow = isStationary ? 0.22 : 0.32;
        const cursorLerpFactor = clamp(leadFollow * dt, 0.01, 1);
        
        cursorPosRef.current.x = lerp(cursorPosRef.current.x, cursorTarget.x, cursorLerpFactor);
        cursorPosRef.current.y = lerp(cursorPosRef.current.y, cursorTarget.y, cursorLerpFactor);

        cursor.style.transform = `translate3d(${cursorPosRef.current.x - CURSOR_SIZE / 2}px, ${cursorPosRef.current.y - CURSOR_SIZE / 2}px, 0)`;

        let previousPoint = cursorPosRef.current;
        trailPosRef.current.forEach((trailPos, index) => {
          // Dynamic target: Interpolate target between center-stacking (speedFactor=0) and chain-following (speedFactor=1)
          const target = {
            x: lerp(cursorPosRef.current.x, previousPoint.x, speedFactor),
            y: lerp(cursorPosRef.current.y, previousPoint.y, speedFactor)
          };

          // Define follow bounds: Lower follow speed when moving (gentle lag) and higher when stopped (gentle resting)
          const followBounds = [
            { min: 0.08, max: 0.19 }, // Dot 0
            { min: 0.06, max: 0.14 }, // Dot 1
            { min: 0.04, max: 0.10 }  // Dot 2
          ][index];

          const baseFollow = lerp(followBounds.max, followBounds.min, speedFactor);
          const follow = clamp(baseFollow * dt, 0.01, 1);

          trailPos.x = lerp(trailPos.x, target.x, follow);
          trailPos.y = lerp(trailPos.y, target.y, follow);

          const trailElement = trailRefs.current[index];
          if (trailElement) {
            const size = TRAIL_DOTS[index].size;
            trailElement.style.transform = `translate3d(${trailPos.x - size / 2}px, ${trailPos.y - size / 2}px, 0)`;
          }

          previousPoint = trailPos;
        });
      } else {
        lastFrameTime.current = performance.now();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    scopeElement.addEventListener('mouseenter', handleMouseEnter);
    scopeElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    scopeElement.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      scopeElement.removeEventListener('mouseenter', handleMouseEnter);
      scopeElement.removeEventListener('mousemove', handleMouseMove);
      scopeElement.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);

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
