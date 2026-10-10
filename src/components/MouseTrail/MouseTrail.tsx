import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  time: number;
  speed: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  time: number;
  maxAge: number;
}

export interface MouseTrailConfig {
  scopeRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
  className?: string;
  stationaryThreshold?: number; // ms before stationary decay kicks in
  decayMs?: number; // trail duration before disappearing shortly
  baseWidth?: number; // width at cursor head
}

const INTERACTIVE_TARGET_SELECTOR = 'a, button, [role="button"], input, textarea, select, label';
const MIN_DISTANCE_PX = 2.5;

export default function MouseTrail({
  scopeRef,
  disabled = false,
  className = '',
  stationaryThreshold = 80,
  decayMs = 700,
  baseWidth = 3.2
}: MouseTrailConfig) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const scopeElement = scopeRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!scopeElement || !canvas || !container || disabled) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || coarsePointer) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let points: Point[] = [];
    let sparks: Spark[] = [];
    let isInside = false;
    let isOverInteractive = false;
    let lastMoveTime = 0;
    let lastX = 0;
    let lastY = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Setup canvas resolution and bounds
    const resizeCanvas = () => {
      const rect = scopeElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(scopeElement);

    const getLocalPoint = (e: PointerEvent | MouseEvent) => {
      const rect = scopeElement.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const isInteractive = (clientX: number, clientY: number) => {
      if (typeof document.elementFromPoint !== 'function') return false;
      const target = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      return Boolean(target?.closest(INTERACTIVE_TARGET_SELECTOR));
    };

    const startAnimationLoop = () => {
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const addPoint = (x: number, y: number, now: number) => {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const dt = Math.max(1, now - lastMoveTime);
      const speed = dist / dt;

      // Add point
      points.push({ x, y, time: now, speed });

      // Spawn subtle obsidian glitter sparks on energetic movements
      if (speed > 0.4 && sparks.length < 40 && !isOverInteractive) {
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;
        const sparkSpeed = Math.random() * 0.8 + 0.2;
        sparks.push({
          x: x + (Math.random() - 0.5) * 4,
          y: y + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * sparkSpeed * 0.5,
          vy: Math.sin(angle) * sparkSpeed * 0.5,
          size: Math.random() * 1.5 + 0.8,
          alpha: 1,
          time: now,
          maxAge: Math.random() * 300 + 350
        });
      }

      lastX = x;
      lastY = y;
      lastMoveTime = now;
      startAnimationLoop();
    };

    const handlePointerEnter = (e: PointerEvent) => {
      isInside = true;
      isOverInteractive = isInteractive(e.clientX, e.clientY);
      const pt = getLocalPoint(e);
      lastX = pt.x;
      lastY = pt.y;
      lastMoveTime = performance.now();
      container.classList.add('is-active');
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = performance.now();
      const pt = getLocalPoint(e);
      isInside = true;
      isOverInteractive = isInteractive(e.clientX, e.clientY);

      if (points.length === 0) {
        lastX = pt.x;
        lastY = pt.y;
        lastMoveTime = now;
        points.push({ x: pt.x, y: pt.y, time: now, speed: 0 });
        startAnimationLoop();
        return;
      }

      const dx = pt.x - lastX;
      const dy = pt.y - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist >= MIN_DISTANCE_PX) {
        // Linear interpolation for smooth sampling during fast gestures
        if (dist > 18) {
          const steps = Math.min(5, Math.floor(dist / 10));
          for (let i = 1; i < steps; i++) {
            const frac = i / steps;
            addPoint(lastX + dx * frac, lastY + dy * frac, now - (1 - frac) * 8);
          }
        }
        addPoint(pt.x, pt.y, now);
      }
    };

    const handlePointerLeave = () => {
      isInside = false;
      isOverInteractive = false;
      container.classList.remove('is-active');
    };

    const render = (now: number) => {
      const rect = scopeElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Filter decayed trail points (trail that disappears shortly)
      points = points.filter((p) => now - p.time < decayMs);
      sparks = sparks.filter((s) => now - s.time < s.maxAge);

      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

      // Draw the smooth decaying ribbon trail
      if (points.length > 1) {
        // Theme-tuned obsidian trail colors
        // Dark mode: radiant champagne / golden amber with luminous bloom
        // Light mode: elegant deep bronze / warm amber with refined presence
        const coreHue = isDarkMode ? 43 : 32;
        const coreSat = isDarkMode ? 96 : 88;
        const coreLight = isDarkMode ? 78 : 46;

        const glowHue = isDarkMode ? 40 : 28;
        const glowSat = isDarkMode ? 100 : 85;
        const glowLight = isDarkMode ? 60 : 40;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw seamless segments with progressive tapering & alpha fade
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1];
          const p1 = points[i];

          const age = now - p1.time;
          const life = Math.max(0, 1 - age / decayMs);
          const alpha = Math.pow(life, 1.25) * (isOverInteractive ? 0.35 : 1);

          if (alpha <= 0.005) continue;

          const width = Math.max(0.6, baseWidth * Math.pow(life, 1.05));

          // 1. Glow stroke (diffuse aura)
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `hsla(${glowHue}, ${glowSat}%, ${glowLight}%, ${alpha * 0.28})`;
          ctx.lineWidth = width * 3.5;
          ctx.stroke();

          // 2. Core radiant stroke (sharp, continuous trail)
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `hsla(${coreHue}, ${coreSat}%, ${coreLight}%, ${alpha * 0.95})`;
          ctx.lineWidth = width;
          ctx.stroke();
        }
      }

      // Draw subtle glitter sparks
      if (sparks.length > 0) {
        for (const spark of sparks) {
          const age = now - spark.time;
          const life = Math.max(0, 1 - age / spark.maxAge);
          spark.x += spark.vx;
          spark.y += spark.vy;

          const sparkAlpha = Math.pow(life, 1.5) * (isDarkMode ? 0.8 : 0.65);
          ctx.fillStyle = isDarkMode
            ? `hsla(45, 100%, 82%, ${sparkAlpha})`
            : `hsla(30, 92%, 46%, ${sparkAlpha})`;

          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size * life, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Leading luminous dot when actively moving
      if (isInside && points.length > 0) {
        const head = points[points.length - 1];
        const timeSinceMove = now - lastMoveTime;
        const isStationary = timeSinceMove > stationaryThreshold;
        const headLife = isStationary ? Math.max(0, 1 - (timeSinceMove - stationaryThreshold) / 250) : 1;

        if (headLife > 0.01 && !isOverInteractive) {
          const dotRadius = (isDarkMode ? 2.6 : 2.2) * headLife;
          // Outer subtle aura
          ctx.beginPath();
          ctx.arc(head.x, head.y, dotRadius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode
            ? `hsla(42, 95%, 65%, ${0.25 * headLife})`
            : `hsla(32, 90%, 46%, ${0.2 * headLife})`;
          ctx.fill();

          // Core point
          ctx.beginPath();
          ctx.arc(head.x, head.y, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = isDarkMode
            ? `hsla(48, 100%, 90%, ${0.95 * headLife})`
            : `hsla(28, 95%, 44%, ${0.9 * headLife})`;
          ctx.fill();
        }
      }

      // Loop continues if there are active trail points or sparks
      if (points.length > 0 || sparks.length > 0 || isInside) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        animationFrameId = null;
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    };

    scopeElement.addEventListener('pointerenter', handlePointerEnter);
    scopeElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    scopeElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      scopeElement.removeEventListener('pointerenter', handlePointerEnter);
      scopeElement.removeEventListener('pointermove', handlePointerMove);
      scopeElement.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();

      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      points = [];
      sparks = [];
    };
  }, [scopeRef, disabled, stationaryThreshold, decayMs, baseWidth]);

  return (
    <div
      ref={containerRef}
      className={`mouse-trail-container mouse-trail-container--hero ${className}`.trim()}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="mouse-trail-canvas" />
    </div>
  );
}
