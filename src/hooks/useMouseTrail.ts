import { useEffect, useRef } from 'react';

interface MouseTrailConfig {
  cursorColor: string;
  trailColors: string[];
  trailElementCount: number;
  cursorSize: number;
  trailSizes: number[];
  cursorLerp: number;
  trailLerps: number[];
  stationaryThreshold: number;
  coalesceSpeed: number;
}

const DEFAULT_CONFIG: MouseTrailConfig = {
  cursorColor: 'hsl(243, 88%, 16%)',
  trailColors: [
    'hsl(214, 90%, 59%)',
    'hsl(262, 76%, 54%)',
    'hsl(4, 96%, 79%)',
  ],
  trailElementCount: 3,
  cursorSize: 14,
  trailSizes: [12, 9, 6],
  cursorLerp: 0.25,
  trailLerps: [0.15, 0.12, 0.09],
  stationaryThreshold: 150,
  coalesceSpeed: 0.08,
};

export function useMouseTrail(config: Partial<MouseTrailConfig> = {}) {
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

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
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
    cursor.style.width = `${finalConfig.cursorSize}px`;
    cursor.style.height = `${finalConfig.cursorSize}px`;
    cursor.style.opacity = '0';
    container.appendChild(cursor);
    cursorRef.current = cursor;

    // Create trail elements
    for (let i = 0; i < finalConfig.trailElementCount; i++) {
      const element = document.createElement('div');
      element.className = 'trail-element';
      element.setAttribute('data-index', String(i));
      element.style.width = `${finalConfig.trailSizes[i]}px`;
      element.style.height = `${finalConfig.trailSizes[i]}px`;
      element.style.backgroundColor = finalConfig.trailColors[i];
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
      state.isStationary = now - state.lastMoveTime > finalConfig.stationaryThreshold;

      // Smoothly interpolate cursor position
      state.cursorX = lerp(state.cursorX, state.mouseX, finalConfig.cursorLerp);
      state.cursorY = lerp(state.cursorY, state.mouseY, finalConfig.cursorLerp);

      // Update cursor element
      if (cursor) {
        const offsetX = state.cursorX - finalConfig.cursorSize / 2;
        const offsetY = state.cursorY - finalConfig.cursorSize / 2;
        cursor.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
      }

      // Update trail elements
      for (let i = 0; i < finalConfig.trailElementCount; i++) {
        let targetX: number, targetY: number, lerpFactor: number;

        if (state.isStationary) {
          targetX = state.cursorX;
          targetY = state.cursorY;
          lerpFactor = finalConfig.coalesceSpeed;
        } else {
          if (i === 0) {
            targetX = state.cursorX;
            targetY = state.cursorY;
          } else {
            targetX = state.trailPositions[i - 1].x;
            targetY = state.trailPositions[i - 1].y;
          }
          lerpFactor = finalConfig.trailLerps[i];
        }

        state.trailPositions[i].x = lerp(state.trailPositions[i].x, targetX, lerpFactor);
        state.trailPositions[i].y = lerp(state.trailPositions[i].y, targetY, lerpFactor);

        const size = finalConfig.trailSizes[i];
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

        for (let i = 0; i < finalConfig.trailElementCount; i++) {
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
  }, [finalConfig]);
}
