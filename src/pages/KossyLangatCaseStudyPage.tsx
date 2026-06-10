import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SITE_NAME, SITE_URL, usePageSeo } from '../utils/seo';
import '../styles/sections/blog-post.css';

const kossyAssets = {
  hero: {
    desktop: '/portfolio/case-studies/kossy/kossy-home-hero.png',
    mobile: '/portfolio/case-studies/kossy/kossy-home-hero-mobile.png',
  },
  values: {
    desktop: '/portfolio/case-studies/kossy/kossy-about-values.png',
    mobile: '/portfolio/case-studies/kossy/kossy-about-values-mobile.png',
  },
  workIndex: {
    desktop: '/portfolio/case-studies/kossy/kossy-work-index.png',
    mobile: '/portfolio/case-studies/kossy/kossy-work-index-mobile.png',
  },
  workDetail: {
    desktop: '/portfolio/case-studies/kossy/kossy-work-tassis.png',
    mobile: '/portfolio/case-studies/kossy/kossy-work-tassis-mobile.png',
  },
  mentorship: {
    desktop: '/portfolio/case-studies/kossy/kossy-mentorship-hero.png',
    mobile: '/portfolio/case-studies/kossy/kossy-mentorship-hero-mobile.png',
  },
};

const proofChips = [
  'Identity architecture',
  'Editorial storytelling',
  'Professional authority',
  'Values-led copy',
  'Mentorship narrative',
];

const identityPillars = [
  {
    title: 'Engineering excellence',
    copy:
      'The site needed to respect the technical discipline behind Kossy Langat without reducing her to a project list.',
  },
  {
    title: 'Business pragmatism',
    copy:
      'Her role as a general manager sits beside the engineering work, so the brand had to show judgment, leadership, and operational clarity.',
  },
  {
    title: 'Worker welfare',
    copy:
      'The personal brand also carries a values position: representation, alignment, long-term stability, and care for the people behind the work.',
  },
];

const values = [
  'Integrity as a professional standard, not a decorative value.',
  'Alignment between technical decisions, team leadership, and public voice.',
  'Clarity for visitors who need to understand the person before the resume.',
  'Representation for young women engineers looking for practical guidance.',
];

const workProof = [
  'Tassis Residential Development as a representative work story with detail and credibility.',
  'BBS Mall, Kaputei Residence, and Private Hostel Development as supporting project proof.',
  'A work index that gives the personal brand evidence without turning it into a cold archive.',
];

const deliveryCapabilities = [
  {
    icon: Sparkles,
    title: 'Identity architecture',
    copy:
      'CodeByLeon translated role, character, values, work, and mentorship into one public-facing brand system.',
  },
  {
    icon: BookOpen,
    title: 'Copy direction',
    copy:
      'The narrative explains the person behind the work with structure, restraint, and specific professional proof.',
  },
  {
    icon: Layers,
    title: 'Visual system',
    copy:
      'The website uses editorial pacing, focused screenshots, and responsive sections instead of generic profile blocks.',
  },
  {
    icon: Compass,
    title: 'Page intent',
    copy:
      'Every section answers a visitor question: who she is, what she values, what she has built, and why that matters.',
  },
];

const ORB_PALETTES = [
  ['#c2410c', '#9a3412', '#7c2d12'], // Tab 1: Warm Terracotta
  ['#475569', '#334155', '#1e293b'], // Tab 2: Steel Slate
  ['#0f766e', '#115e59', '#134e4a']  // Tab 3: Teal Green
];

export function KossyLangatCaseStudyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollHidden, setIsScrollHidden] = useState(false);

  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLAnchorElement>(null);
  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState<number | 'auto'>('auto');

  // Adjust stage height dynamically to active panel height to avoid empty whitespace
  useEffect(() => {
    const handleResize = () => {
      const activePanel = [panel1Ref, panel2Ref, panel3Ref][activeIndex].current;
      if (activePanel) {
        setStageHeight(activePanel.offsetHeight);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  const { contextSafe } = useGSAP();

  const handleBackClick = contextSafe((e: React.MouseEvent) => {
    e.preventDefault();
    const button = backButtonRef.current;
    if (!button) {
      navigate('/#portfolio');
      return;
    }

    const label = button.querySelector('.v1-back-pill-label');
    const arrow = button.querySelector('.v1-back-arrow');

    const tl = gsap.timeline({
      onComplete: () => {
        navigate('/#portfolio');
      }
    });

    // Fade out and collapse label width
    tl.to(label, {
      opacity: 0,
      width: 0,
      duration: 0.15,
      ease: 'power2.out'
    });

    // Squeeze button to a circle (width 42px)
    tl.to(button, {
      width: 42,
      paddingLeft: 0,
      paddingRight: 0,
      gap: 0,
      duration: 0.22,
      ease: 'power3.inOut'
    }, '<');

    // Slide arrow from right to left
    tl.fromTo(arrow,
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.22, ease: 'power2.out' },
      '<'
    );
  });

  // Entrance transition animation if navigated via switcher strip
  useGSAP(() => {
    const direction = location.state?.transitionDirection;
    if (direction === 1 || direction === -1) {
      const wrapper = pageWrapperRef.current;
      if (wrapper) {
        // Clear history state immediately to prevent re-trigger on reload
        window.history.replaceState({}, document.title);
        gsap.killTweensOf(wrapper);
        gsap.set(wrapper, {
          opacity: 0,
          y: 15
        });
        gsap.to(wrapper, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    }
  }, []);

  // Sliding morph transition to another project.
  // Uses a ref guard to prevent double-fires and always cleans up.
  const handleProjectNav = contextSafe((path: string, direction: -1 | 1 = 1, clickedElement?: HTMLElement) => {
    if (isNavigatingRef.current) return;
    const wrapper = pageWrapperRef.current;
    if (!wrapper) { navigate(path, { state: { transitionDirection: direction } }); return; }

    isNavigatingRef.current = true;
    gsap.killTweensOf(wrapper);

    // If a subnav edge link is clicked and we are on desktop, execute morph animation
    if (clickedElement && clickedElement.classList.contains('v1-subnav-edge') && window.innerWidth >= 768) {
      const brandElement = document.querySelector('.v1-subnav-brand') as HTMLElement;
      const strip = stripRef.current;
      
      if (brandElement && strip) {
        const edgePrev = strip.querySelector('.v1-subnav-edge:first-child') as HTMLElement;
        const edgeNext = strip.querySelector('.v1-subnav-edge:last-child') as HTMLElement;
        const chevrons = strip.querySelectorAll('.v1-subnav-chevron');
        const brandDot = brandElement.querySelector('.v1-subnav-dot-indicator');
        
        if (edgePrev && edgeNext) {
          const clickedRect = clickedElement.getBoundingClientRect();
          const brandRect = brandElement.getBoundingClientRect();
          const prevRect = edgePrev.getBoundingClientRect();
          const nextRect = edgeNext.getBoundingClientRect();
          
          const clickedCenter = clickedRect.left + clickedRect.width / 2;
          const brandCenter = brandRect.left + brandRect.width / 2;
          const prevCenter = prevRect.left + prevRect.width / 2;
          const nextCenter = nextRect.left + nextRect.width / 2;

          const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

          const tl = gsap.timeline({
            onComplete: () => {
              isNavigatingRef.current = false;
              navigate(path, { state: { transitionDirection: direction } });
            }
          });

          // 1. Fade out chevrons quickly
          tl.to(chevrons, {
            opacity: 0,
            duration: 0.18,
            ease: 'power2.out'
          }, 0);

          // 2. Fade out the brand dot indicator
          if (brandDot) {
            tl.to(brandDot, {
              opacity: 0,
              scale: 0,
              duration: 0.2,
              ease: 'power2.in'
            }, 0);
          }

          // Identify elements for the 3-way swap
          const isNextClicked = clickedElement === edgeNext;
          const targetEdge = isNextClicked ? edgePrev : edgeNext;
          const targetEdgeCenter = isNextClicked ? prevCenter : nextCenter;

          // 3. Animate Clicked edge → Center position (morphing into pill)
          tl.to(clickedElement, {
            x: brandCenter - clickedCenter,
            y: 0,
            backgroundColor: isDark ? 'rgba(217, 117, 26, 0.12)' : 'rgba(217, 117, 26, 0.05)',
            borderColor: isDark ? 'rgba(217, 117, 26, 0.25)' : 'rgba(217, 117, 26, 0.15)',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderRadius: '9999px',
            paddingLeft: '16px',
            paddingRight: '16px',
            paddingTop: '6px',
            paddingBottom: '6px',
            color: isDark ? '#FD9F68' : '#D9751A',
            fontWeight: '700',
            fontSize: '12px',
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.inOut'
          }, 0);

          // 4. Animate Brand → Opposite edge position (shedding pill styling)
          tl.to(brandElement, {
            x: targetEdgeCenter - brandCenter,
            y: 0,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            color: 'var(--text-secondary)',
            fontWeight: '400',
            fontSize: '11px',
            scale: 1,
            opacity: 0.72,
            duration: 0.6,
            ease: 'power3.inOut'
          }, 0);

          // 5. Animate the uninvolved edge → where clicked was (keeping plain style)
          tl.to(targetEdge, {
            x: clickedCenter - targetEdgeCenter,
            y: 0,
            opacity: 0.72,
            duration: 0.6,
            ease: 'power3.inOut'
          }, 0);

          // 6. Fade out the page body content smoothly
          tl.to(wrapper, {
            opacity: 0,
            y: -10,
            duration: 0.45,
            ease: 'power2.in'
          }, 0.12);

          return;
        }
      }
    }

    // Fallback: simple fade transition of the page content
    const tl = gsap.timeline({
      onComplete: () => {
        isNavigatingRef.current = false;
        navigate(path, { state: { transitionDirection: direction } });
      }
    });

    tl.to(wrapper, {
      opacity: 0,
      y: -10,
      duration: 0.45,
      ease: 'power2.in'
    });
  });

  usePageSeo({
    title: `Kossy Langat Case Study | ${SITE_NAME}`,
    description:
      'A Code by Leon case study for a personal brand website built around identity architecture, structural engineering, leadership, mentorship, and public voice.',
    path: '/work/kossy-langat',
    image: kossyAssets.hero.desktop,
    imageAlt: 'Kossy Langat personal brand website homepage screenshot',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Kossy Langat Personal Brand Website',
      creator: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      about: ['Personal brand', 'Structural engineering', 'Leadership', 'Mentorship'],
    },
  });

  // Hide switcher when scrolling down, show on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    const handleScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          if (currentScrollY <= 8 || delta < -4) {
            setIsScrollHidden(false);
          } else if (delta > 4) {
            setIsScrollHidden(true);
          }
          lastScrollY = currentScrollY;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Background orb color-morphing animation
  useGSAP(() => {
    const palette = ORB_PALETTES[activeIndex];
    
    gsap.to(orb1Ref.current, {
      backgroundColor: palette[0],
      duration: 0.75,
      ease: 'power2.out'
    });
    
    gsap.to(orb2Ref.current, {
      backgroundColor: palette[1],
      duration: 0.75,
      ease: 'power2.out'
    });
    
    gsap.to(orb3Ref.current, {
      backgroundColor: palette[2],
      duration: 0.75,
      ease: 'power2.out'
    });
  }, [activeIndex]);

  return (
    <div className="case-study--kossy">


      {/* Subnav Strip */}
      <div className="v1-subnav-strip" ref={stripRef}>
        <button className="v1-subnav-edge v1-subnav-nav" onClick={(e) => handleProjectNav('/work/delivah-dispatch-hub', -1, e.currentTarget)}>
          Delivah Dispatch
        </button>
        <div className="v1-subnav-brand-wrap">
          <button className="v1-subnav-nav v1-subnav-chevron" onClick={(e) => handleProjectNav('/work/delivah-dispatch-hub', -1, e.currentTarget)} aria-label="Previous project">&lt;</button>
          <span className="v1-subnav-brand"><span className="v1-subnav-dot-indicator" />Kossy Langat</span>
          <button className="v1-subnav-nav v1-subnav-chevron" onClick={(e) => handleProjectNav('/work/legit-logistics', 1, e.currentTarget)} aria-label="Next project">&gt;</button>
        </div>
        <button className="v1-subnav-edge v1-subnav-nav" onClick={(e) => handleProjectNav('/work/legit-logistics', 1, e.currentTarget)}>
          Legit Logistics
        </button>
      </div>

      <div className="blog-post-page-wrapper case-study-white-bg" ref={pageWrapperRef}>
      {/* Background Orbs */}
      <div className="blog__orbs">
        <div ref={orb1Ref} className="blog__orb blog__orb--1" />
        <div ref={orb2Ref} className="blog__orb blog__orb--2" />
        <div ref={orb3Ref} className="blog__orb blog__orb--3" />
      </div>
      <div className="blog__overlay" />

      {/* Global Design Switcher (Floating pills) */}
      <div 
        className={`v2-pills global-v2-switcher ${isScrollHidden ? 'is-scroll-hidden' : ''}`} 
        role="tablist" 
        aria-label="Design directions"
        style={{ 
          '--indicator-pos': activeIndex 
        } as React.CSSProperties}
      >
        <div className="v2-pill-indicator" />
        <button
          className={`v2-pill ${activeIndex === 0 ? 'is-active' : ''}`}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveIndex(0);
          }}
          role="tab"
          aria-selected={activeIndex === 0}
        >
          <span className="v2-pill-text-full">Identity & Values</span>
          <span className="v2-pill-text-short">Identity</span>
        </button>
        <button
          className={`v2-pill ${activeIndex === 1 ? 'is-active' : ''}`}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveIndex(1);
          }}
          role="tab"
          aria-selected={activeIndex === 1}
        >
          <span className="v2-pill-text-full">Structural Portfolio</span>
          <span className="v2-pill-text-short">Portfolio</span>
        </button>
        <button
          className={`v2-pill ${activeIndex === 2 ? 'is-active' : ''}`}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveIndex(2);
          }}
          role="tab"
          aria-selected={activeIndex === 2}
        >
          <span className="v2-pill-text-full">Mentorship & Voice</span>
          <span className="v2-pill-text-short">Mentorship</span>
        </button>
      </div>

      {/* Fixed Gutter Sidebar Controls */}
      <aside className="v1-gutter-sticky">
        <Link 
          to="/#portfolio"
          onClick={handleBackClick} 
          className="v1-back-pill"
          aria-label="Back to Our Work"
          ref={backButtonRef}
        >
          <span className="v1-back-arrow-container">
            <span className="v1-back-arrow">&larr;</span>
          </span>
          <span className="v1-back-pill-label">Back to Our Work</span>
        </Link>
        
        <div className="v1-share">
          <div className="v1-share-label">Share</div>
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL + '/work/kossy-langat')}&text=${encodeURIComponent('Kossy Langat Case Study')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="v1-share-btn btn-x"
            title="Share on X"
          >
            X
          </a>
          <a 
            href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(SITE_URL + '/work/kossy-langat')}&title=${encodeURIComponent('Kossy Langat Case Study')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="v1-share-btn btn-linkedin"
            title="Share on LinkedIn"
          >
            in
          </a>
          <a 
            href="https://github.com/leon-madara"
            target="_blank"
            rel="noopener noreferrer"
            className="v1-share-btn btn-github"
            title="Developer GitHub"
          >
            GH
          </a>
        </div>
      </aside>

      {/* Slider Stage */}
      <div className="stage" style={{ height: stageHeight }}>
        <div 
          className="stage-track" 
          style={{ 
            transform: `translateX(-${activeIndex * 100}vw)`,
            width: '300vw'
          }}
        >
          {/* PANEL 1: Identity & Values */}
          <section ref={panel1Ref} className="design design-v1 case-study__article-panel" data-design="v1">
            <main className="v1-main">
              <div className="v1-gutter" />
              
              <article className="v1-article">
                <div className="v1-meta case-study__article-meta">
                  <span className="v1-tag">Identity Architecture</span>
                  <span className="v1-dot" />
                  <span className="v1-read">System 1 of 3</span>
                </div>

                <h1 className="v1-title">
                  The Orchestrator, <em>translated into a website.</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg" style={{ backgroundColor: '#c2410c' }}>K</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A personal brand for a structural engineer, general manager, mentor, and public voice. The challenge was turning a full professional story with structure into a website that feels specific to her.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(194, 65, 12, 0.12)', '--workspace-bg-end': 'rgba(194, 65, 12, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet={kossyAssets.hero.mobile} />
                        <img src={kossyAssets.hero.desktop} alt="Kossy Langat website homepage leading with The Orchestrator positioning" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Homepage evidence: the source site leads with identity, role, and the Orchestrator idea before moving into work proof.
                  </div>
                </div>

                <div className="case-study__hero-actions" style={{ marginBottom: '48px' }}>
                  <a href="/get-started.html" className="case-study__button case-study__button--primary">
                    Build My Personal Brand
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>

                <h2 className="v1-h2">A full person, not a flat resume.</h2>
                <p className="v1-p">
                  Kossy is not presented as one role with a few supporting details. The page structure treats engineering, management, mentorship, and values as connected parts of the same professional identity.
                </p>

                <div className="case-study__pillar-strip" style={{ display: 'grid', gap: '24px', margin: '40px 0' }}>
                  {identityPillars.map((pillar) => (
                    <article className="case-study__text-panel case-study__text-panel--quiet" key={pillar.title} style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{pillar.title}</h3>
                      <p style={{ margin: 0, fontSize: '15px', color: 'var(--foreground)' }}>{pillar.copy}</p>
                    </article>
                  ))}
                </div>

                <h2 className="v1-h2">Character and values</h2>
                <p className="v1-p">
                  The site gives visitors a way to understand how Kossy thinks, leads, and measures good work. This is where the page stops feeling like a resume and starts feeling like a public identity.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(194, 65, 12, 0.12)', '--workspace-bg-end': 'rgba(194, 65, 12, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/about</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet={kossyAssets.values.mobile} />
                        <img src={kossyAssets.values.desktop} alt="Kossy Langat about page values and identity section screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    About evidence: values, discipline, representation, and character.
                  </div>
                </div>

                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {values.map((value) => (
                    <li key={value}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>

          {/* PANEL 2: Structural Portfolio */}
          <section ref={panel2Ref} className="design design-v2 case-study__article-panel" data-design="v2">
            <main className="v1-main">
              <div className="v1-gutter" />
              
              <article className="v1-article">
                <div className="v1-meta case-study__article-meta">
                  <span className="v1-tag">Structural Portfolio</span>
                  <span className="v1-dot" />
                  <span className="v1-read">System 2 of 3</span>
                </div>

                <h1 className="v1-title">
                  Structural Portfolio <em style={{ fontFamily: 'var(--font-heading)' }}>& Project Spreads</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg" style={{ backgroundColor: '#475569' }}>K</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A portfolio layout designed to support the identity rather than overwhelm it. Visitors see real project context, then return to the larger professional story.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(71, 85, 105, 0.12)', '--workspace-bg-end': 'rgba(71, 85, 105, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/work</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet={kossyAssets.workIndex.mobile} />
                        <img src={kossyAssets.workIndex.desktop} alt="Kossy Langat work index page screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Work index evidence: multiple projects organized as brand credibility.
                  </div>
                </div>

                <h2 className="v1-h2">Work credibility</h2>
                <p className="v1-p">
                  A structural engineer's brand is built on projects completed. The layout displays these credentials with clean spacing, professional context, and structural clarity.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(71, 85, 105, 0.12)', '--workspace-bg-end': 'rgba(71, 85, 105, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/work/tassis-residence</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet={kossyAssets.workDetail.mobile} />
                        <img src={kossyAssets.workDetail.desktop} alt="Tassis Residential Development work detail page screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Work detail evidence: a representative project connects technical context and professional authority.
                  </div>
                </div>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>Projects & Evidence</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workProof.map((proof) => (
                    <li key={proof}>
                      <Briefcase aria-hidden="true" />
                      <span>{proof}</span>
                    </li>
                  ))}
                </ul>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>

          {/* PANEL 3: Mentorship & Voice */}
          <section ref={panel3Ref} className="design design-v3 case-study__article-panel" data-design="v3">
            <main className="v1-main">
              <div className="v1-gutter" />
              
              <article className="v1-article">
                <div className="v1-meta case-study__article-meta">
                  <span className="v1-tag">Mentorship & Voice</span>
                  <span className="v1-dot" />
                  <span className="v1-read">System 3 of 3</span>
                </div>

                <h1 className="v1-title">
                  Leadership Beyond <em style={{ fontFamily: 'var(--font-heading)' }}>Project Delivery</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg" style={{ backgroundColor: '#0f766e' }}>K</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  Translating guidance, mentorship, and public presence into a core pillar of leadership and personal authority.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(15, 118, 110, 0.12)', '--workspace-bg-end': 'rgba(15, 118, 110, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/mentorship</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet={kossyAssets.mentorship.mobile} />
                        <img src={kossyAssets.mentorship.desktop} alt="Kossy Langat mentorship page hero screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Mentorship evidence: leadership and public voice beyond project delivery.
                  </div>
                </div>

                <h2 className="v1-h2">Mentorship and public voice</h2>
                <p className="v1-p">
                  The mentorship page positions guidance as part of the brand, not a side note. It helps visitors see Kossy as someone who builds structures, leads teams, and opens practical paths for others.
                </p>

                <div className="case-study__proofline" style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '24px 0', padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                  <GraduationCap aria-hidden="true" style={{ color: '#0f766e' }} />
                  <span style={{ fontSize: '15px' }}>Mentorship becomes a proof point for leadership, values, and public presence.</span>
                </div>

                <h2 className="v1-h2">What CodeByLeon delivered</h2>
                <p className="v1-p" style={{ marginBottom: '32px' }}>
                  This case study sells the ability to understand a person deeply, then convert that understanding into copy, structure, visuals, and a working public website.
                </p>

                <div className="case-study__capability-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                  {deliveryCapabilities.map((capability) => {
                    const Icon = capability.icon;

                    return (
                      <article className="case-study__capability" key={capability.title} style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '8px' }}>
                        <Icon aria-hidden="true" style={{ width: '28px', height: '28px', marginBottom: '12px', color: '#0f766e' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{capability.title}</h3>
                        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(0,0,0,0.65)' }}>{capability.copy}</p>
                      </article>
                    );
                  })}
                </div>

                <div className="case-study__stack" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '64px' }}>
                  {proofChips.map((chip) => (
                    <span key={chip} style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', background: 'rgba(194, 65, 12, 0.08)' }}>
                      {chip}
                    </span>
                  ))}
                  <span style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', background: 'rgba(194, 65, 12, 0.08)' }}>React 18</span>
                  <span style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', background: 'rgba(194, 65, 12, 0.08)' }}>TypeScript</span>
                  <span style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', background: 'rgba(194, 65, 12, 0.08)' }}>Vite</span>
                  <span style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', background: 'rgba(194, 65, 12, 0.08)' }}>GSAP 3</span>
                  <span style={{ fontSize: '13px', padding: '6px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '999px', background: 'rgba(194, 65, 12, 0.08)' }}>Tailwind CSS</span>
                </div>

                <section className="case-study__cta" style={{ borderRadius: '16px', marginBottom: '40px', padding: '40px', background: '#1c1917', color: 'white' }}>
                  <div className="case-study__cta-inner">
                    <Sparkles aria-hidden="true" style={{ width: '36px', height: '36px', color: '#c2410c', marginBottom: '16px' }} />
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>Turn your full story into a public brand.</h2>
                    <p style={{ color: 'rgba(255,255,255,0.72)', marginBottom: '24px' }}>
                      If your work, values, leadership, and voice need to be understood together, CodeByLeon can help shape that into a personal-brand website.
                    </p>
                    <a href="/get-started.html" className="case-study__button case-study__button--primary">
                      Build My Personal Brand
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </div>
                </section>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>
        </div>
      </div>
    </div>
    </div>
  );
}

export default KossyLangatCaseStudyPage;

