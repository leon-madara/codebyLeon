import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Hero, HeroHandle } from '../components/sections/Hero';
import { Portfolio } from '../components/sections/Portfolio'; // OLD - kept for rollback
// import { PortfolioStacked } from '../components/sections/PortfolioStacked'; // OLD
import PortfolioCarousel from '../components/sections/PortfolioCarousel'; // NEW
// import { Portfolio3DStack } from '../components/sections/Portfolio3DStack'; // OLD
// import { About } from '../components/sections/About'; // OLD
import { About3DStack } from '../components/sections/About3DStack'; // NEW
import { MultiCardScrollSection } from '../components/HorizontalScroll';
import { Blog } from '../components/sections/Blog';
import { FinalCTA } from '../components/sections/FinalCTA';
import { isVisualTestMode } from '../utils/runtimeFlags';

/**
 * HomePage component that renders all sections of the home page
 * This component is used for the "/" route
 */
export function HomePage() {
  const isVisualTest = isVisualTestMode();
  const heroRef = useRef<HeroHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isVisualTest) return;

    // Master Timeline for Entry
    const tl = gsap.timeline({ delay: 0.15 });

    if (heroRef.current) {
      if (heroRef.current.bgRef) {
        tl.fromTo(heroRef.current.bgRef,
          { scale: 1.2 },
          { scale: 1, duration: 1.8, ease: "power2.out" },
          0
        );
      }

      if (heroRef.current.textRefs) {
        tl.to(heroRef.current.textRefs, {
          y: "0%",
          stagger: 0.15,
          duration: 1.1,
          ease: "power3.out"
        }, "-=1.2");
      }
    }

  }, { dependencies: [], scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* 
         We pass the ref to Hero to control its internal elements.
         Note: The Hero's text elements are initially styled with `translate-y-full` 
         via Tailwind classes we added in the previous step, so they are hidden by default.
         The hero-scroll-wrapper provides scroll distance for the Hero ScrollTrigger sequence.
      */}
      <div ref={heroWrapperRef} className="hero-scroll-wrapper">
        <Hero ref={heroRef} scrollWrapperRef={heroWrapperRef} />
      </div>

      {/* NEW: Stacked Portfolio with Carousel */}
      <PortfolioCarousel />

      {/* OLD: Original Portfolio (commented for rollback)
      <Portfolio />
      */}
      <About3DStack />
      <MultiCardScrollSection />
      <Blog />
      <FinalCTA />
    </div>
  );
}
