import { useEffect, RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationConfig {
  trigger: string | Element;
  start?: string;
  toggleActions?: string;
  animateHeadline?: boolean;
  animateSubheadline?: boolean;
  animateFilters?: boolean;
  animateItems?: boolean;
}

/**
 * Helper function to split text into words and wrap them in spans
 */
function splitTextToWords(element: HTMLElement) {
  const text = element.textContent?.trim() || '';
  const words = text.split(/\s+/);

  element.innerHTML = '';

  words.forEach((word, index) => {
    const wordSpan = document.createElement('span');
    wordSpan.className = 'split-word-wrapper';
    wordSpan.style.display = 'inline-block';
    wordSpan.style.overflow = 'hidden';
    wordSpan.style.verticalAlign = 'top';

    const innerSpan = document.createElement('span');
    innerSpan.className = 'split-word-inner';
    innerSpan.style.display = 'inline-block';
    innerSpan.textContent = word;

    wordSpan.appendChild(innerSpan);
    element.appendChild(wordSpan);

    if (index < words.length - 1) {
      element.appendChild(document.createTextNode(' '));
    }
  });
}

export function useScrollAnimation(
  sectionRef: RefObject<HTMLElement>,
  config: ScrollAnimationConfig
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headline = section.querySelector('.section-headline') as HTMLElement;
    const subheadline = section.querySelector('.section-subheadline') as HTMLElement;
    const filters = section.querySelector('.portfolio-filters') as HTMLElement;
    const items = section.querySelectorAll('.portfolio-item');

    // Apply splitting
    if (config.animateHeadline && headline) splitTextToWords(headline);
    if (config.animateSubheadline && subheadline) splitTextToWords(subheadline);

    // Set initial visibility
    gsap.set([headline, subheadline, filters], { opacity: 1 });

    // Create timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: config.trigger,
        start: config.start || 'top 80%',
        toggleActions: config.toggleActions || 'play none none none',
      },
      defaults: { ease: 'power3.out' },
    });

    // Headline animation
    if (config.animateHeadline && headline) {
      const innerWords = headline.querySelectorAll('.split-word-inner');
      tl.from(
        innerWords,
        {
          y: '100%',
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
        },
        0
      );
    }

    // Subheadline animation
    if (config.animateSubheadline && subheadline) {
      const innerWordsSub = subheadline.querySelectorAll('.split-word-inner');
      tl.from(
        innerWordsSub,
        {
          y: '100%',
          opacity: 0,
          duration: 0.8,
          stagger: 0.03,
        },
        0.2
      );
    }

    // Filters animation
    if (config.animateFilters && filters) {
      tl.from(
        filters,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
        },
        0.5
      );
    }

    // Items animation
    if (config.animateItems && items.length > 0) {
      tl.from(
        items,
        {
          y: 60,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          clearProps: 'transform,opacity',
        },
        0.6
      );
    }

    // Cleanup
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [sectionRef, config]);
}
