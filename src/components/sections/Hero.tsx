import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTypingAnimation } from '../../hooks/useTypingAnimation';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { elementRef: typingRef, stop: stopTyping, start: startTyping, currentWord, currentWordRef } = useTypingAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isInitializedRef = useRef(false);
  const wordContainerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=700%", // Extended for extra animation step
      pin: true,
      scrub: 0.1,
      onUpdate: (self) => {
        // Case 1: Start Scroll Interaction
        if (!isInitializedRef.current && self.progress > 0.01 && typingRef.current) {
          isInitializedRef.current = true;

          // 1. Stop the typing animation immediately
          stopTyping();

          // 2. Get the state of the CURRENTLY typed letters
          const existingSpans = typingRef.current.querySelectorAll('span');
          const numExisting = existingSpans.length;

          // 3. Get the FULL target word
          const wordToAnimate = currentWordRef.current || "AMBITIOUS";

          // 4. Create separate lists for "preserved" and "new" letters to animate
          const lettersToAnimate: HTMLSpanElement[] = [];

          // ... ( Measurement Logic stays mostly the same ) ... 
          // Re-implementing measurement for context
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
          const initialWidth = measureElement.getBoundingClientRect().width;
          const initialHeight = measureElement.getBoundingClientRect().height;
          if (measureElement.parentNode) measureElement.parentNode.removeChild(measureElement);

          const typingRect = typingRef.current.getBoundingClientRect();
          const sectionRect = sectionRef.current!.getBoundingClientRect();
          const initialX = typingRect.left - sectionRect.left;
          const initialY = typingRect.top - sectionRect.top;

          const targetWidth = window.innerWidth * 0.8;
          const scaleFactor = targetWidth / initialWidth;

          const wordContainer = document.createElement('div');
          wordContainer.className = 'word-grow-container';
          Object.assign(wordContainer.style, {
            position: 'absolute',
            left: `${initialX}px`,
            top: `${initialY}px`,
            width: `${initialWidth * scaleFactor}px`,
            height: `${initialHeight * scaleFactor}px`,
            transformOrigin: 'top left',
            willChange: 'transform',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: '10'
          });

          sectionRef.current?.appendChild(wordContainer);
          wordContainerRef.current = wordContainer;

          // HIDE original
          gsap.set(typingRef.current, { opacity: 0, visibility: 'hidden' });

          // BUILD SPANS
          const computedStyle = getComputedStyle(typingRef.current);
          const originalFontSize = parseFloat(computedStyle.fontSize);
          const largeFontSize = originalFontSize * scaleFactor;

          const colorIndices = [1, 2, 3, 4, 5]; // From config

          wordToAnimate.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;

            // Determine Color and Opacity
            let colorClass = '';
            let initialOpacity = "0";

            if (index < numExisting) {
              // Preserved letter: Copy class and force visible
              colorClass = existingSpans[index].className;
              initialOpacity = "1";
            } else {
              // New letter: Pick random color (simple logic for now)
              // Filter to avoid repeating last color if possible
              const idx = colorIndices[Math.floor(Math.random() * colorIndices.length)];
              colorClass = `rainbow-color-${idx}`;
              initialOpacity = "0";
            }

            span.className = colorClass; // Applying the class for color

            Object.assign(span.style, {
              opacity: initialOpacity,
              display: "inline-block",
              fontFamily: 'ChristmasCandyInline, sans-serif',
              fontSize: `${largeFontSize}px`,
              fontWeight: computedStyle.fontWeight,
              letterSpacing: computedStyle.letterSpacing,
              textTransform: 'uppercase',
              // color is handled by className, but we can set a fallback or rely on CSS
              textShadow: "0px 10px 20px rgba(0,0,0,0.1)"
            });

            wordContainer.appendChild(span);

            if (index >= numExisting) {
              lettersToAnimate.push(span);
            }
          });

          const tl = gsap.timeline({ paused: true });

          // Fade out elements (instant)
          tl.to('.navbar, .hero-badge, .hero-subheadline, .hero-tag-wrapper, .hero-ctas, .headline-line-1, .headline-line-3', {
            autoAlpha: 0,
            duration: 0,
            ease: "none",
            pointerEvents: "none"
          }, 0);

          // Animate ONLY the new letters appearing
          // We distribute them over a portion of the scroll
          if (lettersToAnimate.length > 0) {
            const letterRevealDuration = 0.5; // Portion of timeline
            const stagger = letterRevealDuration / lettersToAnimate.length;

            lettersToAnimate.forEach((char, i) => {
              tl.to(char, {
                opacity: 1,
                duration: stagger,
                ease: "none"
              }, i * stagger);
            });
          }

          // Grow word and center it
          const wordGrowthStart = 0.1;
          const wordGrowthDuration = 0.7;

          // Initial State: Tiny Scale (looks normal size)
          gsap.set(wordContainer, {
            scale: 1 / scaleFactor,
            x: 0,
            y: 0
          });

          // Target Calculations for Centering
          const viewportCenterX = window.innerWidth / 2 - sectionRect.left;
          const viewportCenterY = window.innerHeight / 2 - sectionRect.top;

          // Since transformOrigin is 'top left', we move the top-left corner
          // so that the center of the HUGE element aligns with viewport center
          const finalWidth = initialWidth * scaleFactor; // equals targetWidth
          const finalHeight = initialHeight * scaleFactor;

          const targetLeft = viewportCenterX - (finalWidth / 2);
          const targetTop = viewportCenterY - (finalHeight / 2);

          const xMove = targetLeft - initialX;
          const yMove = targetTop - initialY;

          tl.to(wordContainer, {
            x: xMove,
            y: yMove,
            scale: 1, // Go to "natural" huge size (crisp!)
            duration: wordGrowthDuration,
            ease: "power2.inOut"
          }, wordGrowthStart);

          // 10. Create "designs" label (Handwritten style)
          const designsLabel = document.createElement('div');
          designsLabel.textContent = "designs";
          designsLabel.className = "euphoria-script-regular";

          Object.assign(designsLabel.style, {
            position: 'absolute',
            fontSize: `310px`, // Increased by 2.5x from 124px
            left: '50%', // Center horizontally
            top: 'calc(80% - 15vh)', // Moved up by 15vh
            transform: 'translate(-50%, 0) rotate(-6deg)', // True center alignment + Tilt
            color: '#1a1a1a',
            zIndex: '15',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: '1',
            clipPath: 'polygon(0 0, 0 100%, 0 100%, 0 0)' // Initially hidden
          });

          wordContainer.appendChild(designsLabel);

          // Animate "designs" appearing (Handwritten Wipe)
          tl.to(designsLabel, {
            clipPath: 'polygon(0 0, 0 100%, 150% 100%, 150% 0)', // Reveal fully
            duration: 0.5,
            ease: "power1.inOut"
          }, ">");

          // TRANSITION: "Curtain" effect
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
              ">+=0.2" // Wait a beat after "designs" writes
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
