import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Hero, HeroHandle } from '../components/sections/Hero';
import { Portfolio } from '../components/sections/Portfolio';
import { About } from '../components/sections/About';
import { MultiCardScrollSection } from '../components/HorizontalScroll';
import { Blog } from '../components/sections/Blog';
import { FinalCTA } from '../components/sections/FinalCTA';
import { Preloader } from '../components/Preloader';
import { isVisualTestMode } from '../utils/runtimeFlags';

/**
 * HomePage component that renders all sections of the home page
 * This component is used for the "/" route
 */
export function HomePage() {
  const [showPreloader, setShowPreloader] = useState(true);
  const heroRef = useRef<HeroHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const isVisualTest = isVisualTestMode();

  // Handle Preloader Completion
  const handlePreloaderComplete = () => {
    // We don't immediately remove it from DOM to allow exit animation to finish visually
    // The Preloader component handles its own GSAP exit, then calls this.
    // However, for the React state, we might want to wait or just let it unmount.
    // In this specific implementation, Preloader handles the exit animation BEFORE calling onComplete?
    // Let's check Preloader logic: It calls onComplete THEN sets display:none.
    // So we can safely set state here if we want to remove it, OR just let it hide.
    // To be safe and clean, let's remove it after a tiny delay or immediately if it's hidden.
    setShowPreloader(false);
  };

  useGSAP(() => {
    if (isVisualTest) return;

    // Master Timeline for Entry
    const tl = gsap.timeline({ delay: 0.2 }); // Wait for preloader to start exiting

    if (!showPreloader && heroRef.current) {
      // Preloader is GONE, now we animate the Hero in.
      // Note: The Preloader component actually runs its exit animation *internally*
      // We need to sync the Hero animation to start *as* the Preloader is lifting.
      // Since we don't have a global context for the preloader timeline, we'll trigger 
      // these animations when the Preloader calls onComplete, OR we can rely on 
      // the fact that the Preloader lifts up, revealing what's underneath.

      // Ideally, the Hero should be "ready" underneath.
      // 1. Bg Scale Down (Falling in effect)
      if (heroRef.current.bgRef) {
        tl.fromTo(heroRef.current.bgRef,
          { scale: 1.2 },
          { scale: 1, duration: 1.8, ease: "power2.out" },
          0
        );
      }

      // 2. Text Stagger Up
      if (heroRef.current.textRefs) {
        tl.to(heroRef.current.textRefs, {
          y: "0%", // Slide up to natural position
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out"
        }, "-=1.2"); // Overlap with scale
      }
    }

  }, { dependencies: [showPreloader], scope: containerRef });

  // For visual tests, skip preloader
  useEffect(() => {
    if (isVisualTest) {
      setShowPreloader(false);
    }
  }, [isVisualTest]);


  return (
    <div ref={containerRef}>
      {showPreloader && !isVisualTest && (
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* 
         We pass the ref to Hero to control its internal elements.
         Note: The Hero's text elements are initially styled with `translate-y-full` 
         via Tailwind classes we added in the previous step, so they are hidden by default.
         The hero-scroll-wrapper replaces GSAP pin: true to avoid pin-spacer
         breaking downstream position: sticky on the portfolio section.
      */}
      <div ref={heroWrapperRef} className="hero-scroll-wrapper">
        <Hero ref={heroRef} scrollWrapperRef={heroWrapperRef} />
      </div>

      <div className="portfolio-sticky-wrapper">
        <Portfolio />
      </div>
      <About />
      <MultiCardScrollSection />
      <Blog />
      <FinalCTA />
    </div>
  );
}
