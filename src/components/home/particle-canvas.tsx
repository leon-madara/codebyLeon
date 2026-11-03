"use client";

import { useEffect, useRef } from "react";

interface ParticleCanvasProps {
  progress: number;
  className?: string;
  ambient?: boolean;
  brandColors?: boolean;
}

export function ParticleCanvas({ progress, className = "", ambient = false, brandColors = false }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);

  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame: number | null = null;
    let inView = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dark = document.documentElement.classList.contains("dark");
    let particles: Array<{ x: number; y: number; size: number; speed: number; alpha: number; phase: number }> = [];
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Fine grain, with a bounded count for phone and desktop rendering.
      const count = Math.min(2800, Math.max(700, Math.round(width * height / 380)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random(), y: Math.random(), size: .65 + Math.random() * 1.35,
        speed: .3 + Math.random() * .7, alpha: .3 + Math.random() * .65,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    const render = (time: number) => {
      frame = null;
      if (!inView || document.hidden) return;
      const p = progressRef.current;
      const t = Math.max(0, Math.min(1, (p - .25) / .7));
      const intensity = ambient ? .45 : 1 - t * t * (3 - 2 * t);
      ctx.clearRect(0, 0, width, height);
      // A translucent surface makes dots read before the section underneath resolves.
      ctx.globalAlpha = ambient ? 0 : intensity * .88;
      ctx.fillStyle = dark ? "#191813" : "#f5f2ea";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = dark ? "#ddd4c2" : "#615544";
      for (let i = 0; i < particles.length; i++) {
        const dot = particles[i];
        if (brandColors) ctx.fillStyle = i % 3 === 0 ? "#2380d9" : dark ? "#ff6226" : "#bc390b";
        // Thin the field as well as fading it; surviving grains drift outwards.
        if (i / particles.length > Math.max(.05, intensity)) continue;
        const spread = t * t * 100;
        const x = dot.x * width + Math.sin(time * .0003 + dot.phase) * 5 + (dot.x - .5) * spread;
        const y = (dot.y * height - time * .006 * dot.speed) % height;
        ctx.globalAlpha = dot.alpha * intensity;
        const size = dot.size * (brandColors ? 2 : 1);
        ctx.fillRect(x, y < 0 ? y + height : y, size, size);
      }
      ctx.globalAlpha = 1;
      if (!motion.matches) frame = requestAnimationFrame(render);
    };

    // Keep the same artwork, but spend no frames on hidden/offscreen canvases.
    // Reduced motion gets a single still frame, refreshed on resize/theme changes.
    const updateAnimation = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      if (inView && !document.hidden) {
        if (motion.matches) render(0);
        else frame = requestAnimationFrame(render);
      }
    };
    const onResize = () => { resize(); updateAnimation(); };
    const observer = new MutationObserver(() => {
      dark = document.documentElement.classList.contains("dark");
      updateAnimation();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateAnimation();
    });
    intersection.observe(canvas);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", updateAnimation);
    motion.addEventListener("change", updateAnimation);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", updateAnimation);
      motion.removeEventListener("change", updateAnimation);
    };
  }, [ambient, brandColors]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
