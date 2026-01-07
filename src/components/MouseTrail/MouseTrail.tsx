import { useEffect, useRef } from 'react';

export interface MouseTrailProps {
  /** Number of trail elements (default: 3) */
  trailCount?: number;
  /** Colors for trail elements (default: blue, purple, coral) */
  colors?: string[];
  /** Sizes for trail elements in pixels (default: [12, 9, 6]) */
  sizes?: number[];
  /** Main cursor size in pixels (default: 14) */
  cursorSize?: number;
  /** Main cursor color (default: dark navy) */
  cursorColor?: string;
  /** Smoothness factor for cursor (0-1, default: 0.25) */
  cursorLerp?: number;
  /** Smoothness factors for trail elements (default: [0.15, 0.12, 0.09]) */
  trailLerps?: number[];
  /** Time in ms before dots coalesce (default: 150) */
  stationaryThreshold?: number;
  /** Speed of coalescing (0-1, default: 0.08) */
  coalesceSpeed?: number;
  /** Disable the trail effect */
  disabled?: boolean;
}

const DEFAULT_COLORS = [
  'hsl(214, 90%, 59%)', // Blue
  'hsl(262, 76%, 54%)', // Purple
  'hsl(4, 96%, 79%)',   // Coral
];

const DEFAULT_SIZES = [12, 9, 6];
const DEFAULT_TRAIL_LERPS = [0.15, 0.12, 0.09];

export function MouseTrail({
  trailCount = 3,
  colors = DEFAULT_COLORS,
  sizes = DEFAULT_SIZES,
  cursorSize = 14,
  cursorColor = 'hsl(243, 88%, 16%)',
  cursorLerp = 0.25,
  trailLerps = DEFAULT_TRAIL_LERPS,
  stationaryThreshold = 150,
  coalesceSpeed = 0.08,
  disabled = false,
}: MouseTrailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailElementsRef = useRef<HTMLDivElement[]>([]);
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    cursorX: 0,
    cursorY: 0,
    trailPositions: [] as { x: number; y: number }[],
    isStationary: false,
    lastMoveTime: 0,
    animationFrame: 0,
    isEnabled: false,
  });

  useEffect(() => {
    if (disabled) return;

    // Check for reduced motion preference
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const state = stateRef.current;

    // Create container
    const container = document.createElement('div');
    container.className = 'mouse-trail-container';
    document.body.appendChild(container);
    containerRef.current = container;

    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'mouse-cursor';
    cursor.style.width = `${cursorSize}px`;
    cursor.style.height = `${cursorSize}px`;
    cursor.style.backgroundColor = cursorColor;
    cursor.style.opacity = '0';
    container.appendChild(cursor);
    cursorRef.current = cursor;

    // Create trail elements
    trailElementsRef.current = [];
    for (let i = 0; i < trailCount; i++) {
      const element = document.createElement('div');
      element.className = 'trail-element';
      element.setAttribute('data-index', String(i));
      element.style.width = `${sizes[i]}px`;
      element.style.height = `${sizes[i]}px`;
      element.style.backgroundColor = colors[i];
      element.style.opacity = '0';
      container.appendChild(element);
      trailElementsRef.current.push(element);
      state.trailPositions.push({ x: 0, y: 0 });
    }

    // Linear interpolation
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    // Animation loop
    const animate = () => {
      if (!state.isEnabled) return;

      const now = performance.now();
      state.isStationary = now - state.lastMoveTime > stationaryThreshold;

      // Smoothly interpolate cursor position
      state.cursorX = lerp(state.cursorX, state.mouseX, cursorLerp);
      state.cursorY = lerp(state.cursorY, state.mouseY, cursorLerp);

      // Update cursor element
      if (cursor) {
        const offsetX = state.cursorX - cursorSize / 2;
        const offsetY = state.cursorY - cursorSize / 2;
        cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }

      // Update trail elements
      for (let i = 0; i < trailCount; i++) {
        let targetX: number, targetY: number, lerpFactor: number;

        if (state.isStationary) {
          targetX = state.cursorX;
          targetY = state.cursorY;
          lerpFactor = coalesceSpeed;
        } else {
          if (i === 0) {
            targetX = state.cursorX;
            targetY = state.cursorY;
          } else {
            targetX = state.trailPositions[i - 1].x;
            targetY = state.trailPositions[i - 1].y;
          }
          lerpFactor = trailLerps[i];
        }

        state.trailPositions[i].x = lerp(state.trailPositions[i].x, targetX, lerpFactor);
        state.trailPositions[i].y = lerp(state.trailPositions[i].y, targetY, lerpFactor);

        const size = sizes[i];
        const offsetX = state.trailPositions[i].x - size / 2;
        const offsetY = state.trailPositions[i].y - size / 2;
        trailElementsRef.current[i].style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }

      state.animationFrame = requestAnimationFrame(animate);
    };

    // Event handlers
    const handleMouseMove = (e: MouseEvent) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      state.lastMoveTime = performance.now();
      state.isStationary = false;

      if (cursor.style.opacity === '0') {
        cursor.style.opacity = '1';
        state.cursorX = state.mouseX;
        state.cursorY = state.mouseY;

        for (let i = 0; i < trailCount; i++) {
          state.trailPositions[i] = { x: state.mouseX, y: state.mouseY };
          trailElementsRef.current[i].style.opacity = '1';
        }
      }
    };

    const handleMouseLeave = () => {
      if (cursor) cursor.style.opacity = '0';
      trailElementsRef.current.forEach(el => (el.style.opacity = '0'));
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    state.isEnabled = true;
    animate();

    // Cleanup
    return () => {
      state.isEnabled = false;
      if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [
    disabled,
    trailCount,
    colors,
    sizes,
    cursorSize,
    cursorColor,
    cursorLerp,
    trailLerps,
    stationaryThreshold,
    coalesceSpeed,
  ]);

  // Component renders nothing (effect is in DOM)
  return null;
}
