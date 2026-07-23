import React, { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

/* =============================================
   CHAPTER DATA
   ============================================= */
export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'launch',
    number: '01',
    title: 'Launch in 10 Days',
    subtitle: 'Rapid deployment from brief to production.',
    features: ['Full-Stack React & GSAP', 'Custom UI Design System', 'Domain & SEO Setup'],
    ctaLabel: 'Explore Package',
    ctaHref: '#configurator',
  },
  {
    id: 'brand-refresh',
    number: '02',
    title: 'Brand Refresh',
    subtitle: 'Transforming outdated sites into cinematic flagships.',
    features: ['Visual Identity Upgrade', 'Interactive GSAP Motion', 'Conversion Optimization'],
    ctaLabel: 'View Transformation',
    ctaHref: '#configurator',
  },
  {
    id: 'ongoing-support',
    number: '03',
    title: 'Ongoing Support',
    subtitle: 'Continuous iteration with a dedicated team.',
    features: ['Monthly Retainer Model', 'Performance Monitoring', 'Feature Roadmap'],
    ctaLabel: 'See Plans',
    ctaHref: '#configurator',
  },
];

const TOTAL_CHAPTERS = CHAPTERS.length;

/* =============================================
   STORYBOOK SERVICES COMPONENT
   ============================================= */
export function StoryBookServices() {
  const visualTest = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const flipTimelineRef = useRef<gsap.core.Timeline | null>(null);

  /* -------- Tab Click Handler -------- */
  const handleTabClick = useCallback((index: number) => {
    if (index === activeChapter || !spreadRef.current) return;

    const direction = index > activeChapter ? 'forward' : 'backward';
    const pages = pageRefs.current.filter((p): p is HTMLDivElement => Boolean(p));
    const currentPage = pages[activeChapter];
    const nextPage = pages[index];
    if (!currentPage || !nextPage) return;

    // Kill any running flip
    if (flipTimelineRef.current) {
      flipTimelineRef.current.kill();
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveChapter(index);
      },
    });

    // Fade out current page content
    tl.to(currentPage, {
      autoAlpha: 0,
      duration: 0.25,
      ease: 'power2.in',
    });

    // Flip effect — overlay that sweeps across
    const flipOverlay = spreadRef.current.querySelector('.sb-flip-overlay') as HTMLElement;
    if (flipOverlay) {
      if (direction === 'forward') {
        tl.fromTo(flipOverlay,
          { xPercent: 100, autoAlpha: 0.8 },
          { xPercent: -100, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' },
          '-=0.15'
        );
      } else {
        tl.fromTo(flipOverlay,
          { xPercent: -100, autoAlpha: 0.8 },
          { xPercent: 100, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' },
          '-=0.15'
        );
      }
    }

    // Fade in next page content
    tl.fromTo(nextPage,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
      '-=0.3'
    );

    flipTimelineRef.current = tl;
  }, [activeChapter]);

  /* -------- GSAP ScrollTrigger Setup -------- */
  useGSAP(() => {
    if (visualTest || !sectionRef.current || !bookRef.current) return;

    const section = sectionRef.current;
    const cover = coverRef.current;
    const spread = spreadRef.current;

    // Phase 1: Cover unfold on scroll
    if (cover && spread) {
      const coverTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'top 10%',
          scrub: 0.5,
          onEnter: () => setIsBookOpen(true),
          onLeaveBack: () => setIsBookOpen(false),
        },
      });

      // Cover slides/fades away, spread appears
      coverTl
        .to(cover, {
          rotateY: -180,
          autoAlpha: 0,
          duration: 1,
          ease: 'power2.inOut',
          transformOrigin: 'left center',
        })
        .fromTo(spread,
          { autoAlpha: 0, scale: 0.92 },
          { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'power2.out' },
          '-=0.5'
        );
    }

    // Phase 2: Pin the book and advance chapters on scroll
    const chapterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top+=80',
        end: `+=${window.innerHeight * (TOTAL_CHAPTERS + 1)}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        snap: {
          snapTo: 1 / TOTAL_CHAPTERS,
          duration: { min: 0.2, max: 0.5 },
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const chapterIndex = Math.min(
            TOTAL_CHAPTERS - 1,
            Math.floor(progress * TOTAL_CHAPTERS)
          );
          setActiveChapter(chapterIndex);
        },
      },
    });

    // Animate through chapters
    for (let i = 0; i < TOTAL_CHAPTERS; i++) {
      chapterTl.to({}, { duration: 1 });
    }

  }, { scope: sectionRef, dependencies: [visualTest] });

  /* -------- Active page visibility sync -------- */
  useGSAP(() => {
    const pages = pageRefs.current.filter((p): p is HTMLDivElement => Boolean(p));
    pages.forEach((page, i) => {
      gsap.set(page, { autoAlpha: i === activeChapter ? 1 : 0 });
    });
  }, { dependencies: [activeChapter], scope: spreadRef });

  /* -------- Render -------- */
  const currentChapter = CHAPTERS[activeChapter];

  return (
    <section
      ref={sectionRef}
      id="services-storybook"
      className="sb"
      aria-label="Services Storybook"
    >
      {/* Section Heading (above the book) */}
      <div className="sb__header">
        <span className="sb__eyebrow">Our Services</span>
        <h2 className="sb__heading">
          The CodeByLeon <em>Storybook</em>
        </h2>
        <p className="sb__subheading">
          Each chapter tells a different story of transformation.
          Flip through to find yours.
        </p>
      </div>

      <div className="sb__stage">
        {/* The Book Container */}
        <div ref={bookRef} className="sb__book">
          {/* ---- CLOSED COVER ---- */}
          <div
            ref={coverRef}
            className={`sb__cover ${isBookOpen ? 'sb__cover--open' : ''}`}
            aria-hidden={isBookOpen}
          >
            <div className="sb__cover-inner">
              <div className="sb__cover-filigree sb__cover-filigree--tl" />
              <div className="sb__cover-filigree sb__cover-filigree--tr" />
              <div className="sb__cover-filigree sb__cover-filigree--bl" />
              <div className="sb__cover-filigree sb__cover-filigree--br" />
              <div className="sb__cover-title">
                <span className="sb__cover-brand">CODE</span>
                <span className="sb__cover-brand sb__cover-brand--accent">BY LEON</span>
                <span className="sb__cover-subtitle">/ Services Storybook</span>
              </div>
            </div>
          </div>

          {/* ---- OPEN SPREAD ---- */}
          <div
            ref={spreadRef}
            className={`sb__spread ${isBookOpen ? 'sb__spread--visible' : ''}`}
          >
            {/* Spine shadow + flip overlay */}
            <div className="sb__spine" />
            <div className="sb-flip-overlay" />

            {/* Left Page */}
            <div className="sb__page sb__page--left">
              {CHAPTERS.map((chapter, i) => (
                <div
                  key={chapter.id}
                  ref={(el) => { pageRefs.current[i] = el; }}
                  className="sb__page-content"
                  style={{ visibility: i === activeChapter ? 'visible' : 'hidden' }}
                >
                  <div className="sb__page-ornament sb__page-ornament--tl" />
                  <div className="sb__page-ornament sb__page-ornament--br" />
                  <span className="sb__chapter-label">
                    {chapter.number} / {CHAPTERS.length.toString().padStart(2, '0')}
                  </span>
                  <h3 className="sb__chapter-title">{chapter.title}</h3>
                  <p className="sb__chapter-subtitle">{chapter.subtitle}</p>
                  <div className="sb__chapter-visual">
                    {/* Placeholder for a screenshot/illustration */}
                    <div className="sb__chapter-thumbnail" aria-hidden="true">
                      <span className="sb__chapter-thumbnail-label">Preview</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Page */}
            <div className="sb__page sb__page--right">
              <div className="sb__page-content sb__page-content--right">
                <ul className="sb__features">
                  {currentChapter.features.map((feat) => (
                    <li key={feat} className="sb__feature-item">
                      <span className="sb__feature-icon" aria-hidden="true">✦</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a href={currentChapter.ctaHref} className="sb__cta">
                  {currentChapter.ctaLabel}
                  <span className="sb__cta-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
              {/* Page number */}
              <span className="sb__page-number">{currentChapter.number}</span>
            </div>

            {/* Bottom ornament */}
            <div className="sb__spread-ornament" aria-hidden="true">
              <span className="sb__ornament-line" />
              <span className="sb__ornament-star">✦</span>
              <span className="sb__ornament-line" />
            </div>
          </div>
        </div>

        {/* ---- BOOKMARK TABS ---- */}
        <nav className="sb__tabs" aria-label="Chapter navigation">
          {CHAPTERS.map((chapter, i) => (
            <button
              key={chapter.id}
              className={`sb__tab ${i === activeChapter ? 'sb__tab--active' : ''} ${i % 2 === 0 ? 'sb__tab--copper' : 'sb__tab--cyan'}`}
              onClick={() => handleTabClick(i)}
              aria-current={i === activeChapter ? 'true' : undefined}
              aria-label={`Go to chapter ${chapter.number}: ${chapter.title}`}
            >
              <span className="sb__tab-number">{chapter.number}</span>
              <span className="sb__tab-label">{chapter.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default StoryBookServices;
