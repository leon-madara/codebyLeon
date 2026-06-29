import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

/**
 * 100svh cinematic chapter break before the services horizontal scroll.
 * Answers the visitor question: "What is the actual deliverable/engagement model here?"
 */
export function ServicesIntro() {
  const visualTestMode = isVisualTestMode();
  const containerRef = useRef<HTMLElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (visualTestMode) {
      // Show immediately in visual tests so screenshots capture the text
      gsap.set([text1Ref.current, text2Ref.current], { y: '0%' });
      gsap.set(subTextRef.current, { opacity: 0.8, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    // Only apply scroll-triggered entry animations on mobile/tablet (max-width: 1023px)
    mm.add('(max-width: 1023px)', () => {
      // Reset initial states manually in case of fast scroll/refresh
      gsap.set([text1Ref.current, text2Ref.current], { y: '110%' });
      gsap.set(subTextRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      tl.to(text1Ref.current, { y: '0%', duration: 0.8, ease: 'power3.out' })
        .to(text2Ref.current, { y: '0%', duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .to(subTextRef.current, { opacity: 0.8, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
    });

    return () => mm.revert();

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="services-intro" aria-label="Services Introduction">
      <div className="services-intro__container">
        <h2 className="services-intro__headline">
          <span className="services-intro__mask-text">
            <span ref={text1Ref} className="services-intro__mask-inner">We don't just</span>
          </span>
          <br />
          <span className="services-intro__mask-text">
            <span ref={text2Ref} className="services-intro__mask-inner">build pages.</span>
          </span>
        </h2>
        <p ref={subTextRef} className="services-intro__subheadline">
          We engineer custom digital systems for growth, identity, and scale.
        </p>
      </div>
    </section>
  );
}
