import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Signal parent that preload is done
        onComplete();
        // Remove from DOM strictly speaking is handled by parent unmounting, 
        // but we can ensure it's invisible here
        gsap.set(containerRef.current, { display: 'none' });
      }
    });

    timelineRef.current = tl;

    // 1. Initial State
    gsap.set(containerRef.current, { autoAlpha: 1 });
    gsap.set(logoRef.current, { scale: 0.8, autoAlpha: 0 });

    // 2. Logo Pulse In
    tl.to(logoRef.current, {
      scale: 1,
      autoAlpha: 1,
      duration: 1.2,
      ease: "power2.out"
    });

    // 3. Pause briefly
    tl.to({}, { duration: 0.5 });

    // 4. Exit Animation (Curtain Lift / Fade Out)
    tl.to(logoRef.current, {
      scale: 1.5,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power2.in"
    });

    tl.to(containerRef.current, {
      yPercent: -100, // Slide up like a curtain
      duration: 0.8,
      ease: "power2.inOut"
    }, "-=0.2");

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div ref={logoRef} className="text-white">
        {/* Simple SVG Logo or Icon Replacement */}
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      </div>
    </div>
  );
}
