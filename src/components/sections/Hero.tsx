import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { elementRef: typingRef, stop: stopTyping, start: startTyping, currentWord } = useTypingAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isInitializedRef = useRef(false);
  const wordContainerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=500%",
      pin: true,
      scrub: 0.1,
      onUpdate: (self) => {
        // Case 1: Start Scroll Interaction
        if (!isInitializedRef.current && self.progress > 0.01 && typingRef.current) {
          isInitializedRef.current = true;

          // 1. Stop the typing animation
          stopTyping();

          // 2. Get current FULL target word (forces complete word even if typing was mid-way)
          const wordToAnimate = currentWord || "AMBITIOUS"; // Fallback just in case

          // 3. Create a temporary measurement element to get accurate dimensions
          // Append to section to match inherited styles (font, etc)
          const measureElement = document.createElement('div');
          Object.assign(measureElement.style, {
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            fontFamily: 'ChristmasCandyInline, sans-serif',
            fontSize: getComputedStyle(typingRef.current).fontSize,
            fontWeight: getComputedStyle(typingRef.current).fontWeight,
            letterSpacing: getComputedStyle(typingRef.current).letterSpacing,
            textTransform: 'uppercase',
            color: '#D9751A'
          });
          measureElement.textContent = wordToAnimate;

          sectionRef.current?.appendChild(measureElement);

          // Force a reflow to ensure measurement
          const initialWidth = measureElement.getBoundingClientRect().width;
          const initialHeight = measureElement.getBoundingClientRect().height;

          // Remove measurement element
          if (measureElement.parentNode) measureElement.parentNode.removeChild(measureElement);

          // 4. Get the current position of the typing element relative to the section
          const typingRect = typingRef.current.getBoundingClientRect();
          const sectionRect = sectionRef.current!.getBoundingClientRect();

          // Calculate exact relative position
          const initialX = typingRect.left - sectionRect.left;
          const initialY = typingRect.top - sectionRect.top;

          // 5. Calculate target dimensions and scale
          const targetWidth = window.innerWidth * 0.8; // 80vw
          const targetScale = targetWidth / initialWidth;

          // Calculate vector to center
          // We want the center of the word to move to the center of the viewport
          const wordCenterX = initialX + initialWidth / 2;
          const wordCenterY = initialY + initialHeight / 2;

          const viewportCenterX = window.innerWidth / 2 - sectionRect.left; // Adjust for pinned section offset if any (usually 0 if pinned)
          const viewportCenterY = window.innerHeight / 2 - sectionRect.top;

          const xMove = viewportCenterX - wordCenterX;
          const yMove = viewportCenterY - wordCenterY;

          // 6. Create the word container that will grow
          const wordContainer = document.createElement('div');
          wordContainer.className = 'word-grow-container';
          Object.assign(wordContainer.style, {
            position: 'absolute',
            left: `${initialX}px`, // exact top-left match
            top: `${initialY}px`,
            width: `${initialWidth}px`, // explicit width for correct center transform
            height: `${initialHeight}px`,
            transformOrigin: 'center center',
            willChange: 'transform',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: '10'
          });

          sectionRef.current?.appendChild(wordContainer);
          wordContainerRef.current = wordContainer;

          // 7. Hide the original typing element
          gsap.set(typingRef.current, { opacity: 0, visibility: 'hidden' });

          // 8. Create spans for each letter
          const chars: HTMLSpanElement[] = [];
          const computedStyle = getComputedStyle(typingRef.current);
          wordToAnimate.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            Object.assign(span.style, {
              opacity: "0",
              display: "inline-block",
              fontFamily: 'ChristmasCandyInline, sans-serif',
              fontSize: computedStyle.fontSize,
              fontWeight: computedStyle.fontWeight,
              letterSpacing: computedStyle.letterSpacing,
              textTransform: 'uppercase',
              color: "#D9751A",
              textShadow: "0px 10px 20px rgba(0,0,0,0.1)"
            });
            wordContainer.appendChild(span);
            chars.push(span);
          });

          // 9. Create the animation timeline
          const tl = gsap.timeline({ paused: true });

          // Fade out elements - Use scoped string selectors!
          // This ensures we get everything inside the section that matches
          tl.to('.navbar, .hero-badge, .hero-subheadline, .hero-tag-wrapper, .hero-ctas, .headline-line-1, .headline-line-3', {
            autoAlpha: 0,
            duration: 0, // Instant vanish
            ease: "none",
            pointerEvents: "none" // prevent clicking while faded
          }, 0);

          // Animate letters appearing
          const letterRevealProgress = 0.6;
          const letterCount = chars.length;
          const staggerDuration = letterRevealProgress / letterCount;

          chars.forEach((char, index) => {
            tl.to(char, {
              opacity: 1,
              duration: staggerDuration,
              ease: "none"
            }, index * staggerDuration);
          });

          // Grow word and center it
          const wordGrowthStart = 0.1;
          const wordGrowthDuration = 0.7;

          gsap.set(wordContainer, {
            transformOrigin: "center center",
            x: 0,
            y: 0,
            scale: 1
          });

          tl.to(wordContainer, {
            x: xMove,
            y: yMove,
            scale: targetScale,
            duration: wordGrowthDuration,
            ease: "power2.inOut"
          }, wordGrowthStart);

          // TRANSITION: "Curtain" effect
          // Pull the portfolio section up to cover the hero
          const portfolioSection = document.querySelector('#portfolio');
          if (portfolioSection) {
            gsap.set(portfolioSection, { zIndex: 10, position: 'relative' });

            tl.fromTo(portfolioSection,
              { y: 0 },
              {
                y: -window.innerHeight, // Pull up by one viewport height
                duration: 0.5,
                ease: "power2.inOut"
              },
              ">-=0.1" // Overlap slightly with end of growth
            );
          }

          timelineRef.current = tl;
        }

        // Case 2: Revert (Back to Top)
        if (isInitializedRef.current && self.progress <= 0.01) {
          isInitializedRef.current = false;

          if (timelineRef.current) {
            timelineRef.current.kill();
            timelineRef.current = null;
          }

          if (wordContainerRef.current) {
            wordContainerRef.current.remove();
            wordContainerRef.current = null;
          }

          // Reset portfolio position if needed
          gsap.set('#portfolio', { y: 0 });

          if (typingRef.current) {
            gsap.set(typingRef.current, {
              opacity: 1,
              visibility: 'visible'
            });
          }

          // Restore other elements
          gsap.set('.navbar, .hero-badge, .hero-subheadline, .hero-tag-wrapper, .hero-ctas, .headline-line-1, .headline-line-3', {
            autoAlpha: 1, // Restore autoAlpha
            pointerEvents: "auto"
          });

          startTyping();
        }

        // Scrub the timeline based on scroll progress
        if (timelineRef.current) {
          timelineRef.current.progress(Math.min(self.progress, 1));
        }
      }
    });

  }, { scope: sectionRef, dependencies: [stopTyping, startTyping, typingRef] });

  return (
    <section ref={sectionRef} className="hero">
      {/* LAYER 2: Abstract Orbs */}
      <div className="orbs-container">
        <div className="orb orb-purple"></div>
        <div className="orb orb-orange"></div>
        <div className="orb orb-blue"></div>
      </div>

      {/* LAYER 3: Full-Screen Frosted Overlay with Dot Grid */}
      <div className="frosted-overlay"></div>

      {/* LAYER 4: Content (Bold Typography) */}
      <div ref={contentRef} className="hero-content main-content">
        <div className="hero-text-wrapper">
          {/* Badge */}
          <span className="hero-badge anim-item">Nairobi-based design studio</span>

          {/* Main Headline */}
          <h1 className="hero-headline">
            <div className="headline-line-1">
              <span className="highlight-bold">Bold</span> websites for
            </div>
            <div className="headline-line-2">
              <span ref={typingRef} className="highlight-ambitious"></span>
            </div>
            <div className="headline-line-3">brands<span className="highlight-dot">.</span></div>
          </h1>

          {/* Subheadline */}
          <p className="hero-subheadline anim-item">
            Websites and design that make your business<br />look as professional as it is.
          </p>

          {/* Tag with Gradient + SVG Underline */}
          <div className="hero-tag-wrapper anim-item">
            <span className="hero-tag gradient-text">Beyond the Blueprint</span>
            <svg className="underline-svg" viewBox="0 0 200 12" preserveAspectRatio="none">
              <path
                className="underline-path"
                d="M0 6 Q16.67 0.5 33.33 6 Q50 11.5 66.67 6 Q83.33 0.5 100 6 Q116.67 11.5 133.33 6 Q150 0.5 166.67 6 Q183.33 11.5 200 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* CTAs */}
          <div className="hero-ctas anim-item">
            <a href="/get-started.html" className="btn-primary">Book a free 20-minute call</a>
            <a href="#portfolio" className="btn-secondary">VIEW PORTFOLIO</a>
          </div>
        </div>
      </div>
    </section>
  );
}
