import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Database,
  Mail,
  Route,
  ShieldCheck,
  Upload,
  UserPlus,
} from 'lucide-react';
import { SITE_NAME, SITE_URL, usePageSeo } from '../utils/seo';
import '../styles/sections/blog-post.css';

const workflowPillars = [
  {
    title: 'Service Positioning',
    label: 'Freight service funnel',
    description:
      'A conversion-focused landing page and service hierarchy that positions freight dispatch operations for American carriers.',
    audience: 'Built for carrier acquisition',
    outcome: 'Presents dispatch service clarity and handles initial contact routing.',
    proof: ['Landing hero structure', 'Service categorizations', 'General inquiries form'],
  },
  {
    title: 'Guided Carrier Intake',
    label: 'Structured company registration',
    description:
      'A multi-step registration wizard and document upload flow that turns carrier prospects into qualified operational leads.',
    audience: 'Built for onboarding automation',
    outcome: 'Collects required operating numbers and compliance files without manual paperwork.',
    proof: ['DOT/MC contact setup', 'Equipment selection checklist', 'Secure document upload UI'],
  },
  {
    title: 'Operations & Admin',
    label: 'Backend lead management',
    description:
      'A secure dispatch admin login and review area where lead logs, document archives, and carrier files are monitored.',
    audience: 'Built for dispatch managers',
    outcome: 'Exposes lead records and company details to dispatch operations in a clean data table.',
    proof: ['Admin login portal', 'Record log access', 'Document inspection', 'Lead verification'],
  },
];

const capabilities = [
  { icon: UserPlus, title: 'Intake wizard', copy: 'Multi-step registration with client-side form validation and equipment filtering.' },
  { icon: Upload, title: 'Secure uploads', copy: 'Secure file upload handling for required carrier compliance documents.' },
  { icon: Database, title: 'Supabase integration', copy: 'Database schema for carrier logs and secure file storage buckets.' },
  { icon: Mail, title: 'EmailJS alerts', copy: 'Automated notification path to alert dispatch owners of new registrants.' },
];

const ORB_PALETTES = [
  ['#0f766e', '#115e59', '#134e4a'], // Tab 1: Deep Greens
  ['#d97706', '#b45309', '#92400e'], // Tab 2: Warm Ambers
  ['#475569', '#334155', '#1e293b']  // Tab 3: Steel Slates
];

export function DelivahDispatchCaseStudyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollHidden, setIsScrollHidden] = useState(false);

  // References for layout measuring and GSAP animations
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
          clearProps: 'transform'
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

          // 5. Fade out, reposition, and fade in the target edge (to avoid counter-sliding)
          tl.to(targetEdge, {
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out'
          }, 0);

          tl.set(targetEdge, {
            x: clickedCenter - targetEdgeCenter,
            y: 0
          }, 0.2);

          tl.to(targetEdge, {
            opacity: 0.72,
            duration: 0.4,
            ease: 'power2.in'
          }, 0.2);

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
    title: `Delivah Dispatch Case Study | ${SITE_NAME}`,
    description:
      'A Code by Leon case study for a freight dispatch website connecting service positioning, carrier intake, document upload, backend setup, and admin review.',
    path: '/work/delivah-dispatch-hub',
    image: '/portfolio/delivah-dispatch.png',
    imageAlt: 'Delivah Dispatch freight dispatch website homepage screenshot',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Delivah Dispatch Freight Dispatch Funnel',
      creator: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      about: ['Freight dispatch', 'Carrier acquisition', 'Service funnel', 'Operations intake'],
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
    <div className="case-study--delivah">


      {/* Subnav Strip */}
      <div className="v1-subnav-strip" ref={stripRef}>
        <button className="v1-subnav-edge v1-subnav-nav" onClick={(e) => handleProjectNav('/work/legit-logistics', -1, e.currentTarget)}>
          Legit Logistics
        </button>
        <div className="v1-subnav-brand-wrap">
          <button className="v1-subnav-nav v1-subnav-chevron" onClick={(e) => handleProjectNav('/work/legit-logistics', -1, e.currentTarget)} aria-label="Previous project">&lt;</button>
          <span className="v1-subnav-brand"><span className="v1-subnav-dot-indicator" />Delivah Dispatch</span>
          <button className="v1-subnav-nav v1-subnav-chevron" onClick={(e) => handleProjectNav('/work/kossy-langat', 1, e.currentTarget)} aria-label="Next project">&gt;</button>
        </div>
        <button className="v1-subnav-edge v1-subnav-nav" onClick={(e) => handleProjectNav('/work/kossy-langat', 1, e.currentTarget)}>
          Kossy Langat
        </button>
      </div>

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
          <span className="v2-pill-text-full">Service Funnel</span>
          <span className="v2-pill-text-short">Funnel</span>
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
          <span className="v2-pill-text-full">Onboarding</span>
          <span className="v2-pill-text-short">Onboard</span>
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
          <span className="v2-pill-text-full">Operations</span>
          <span className="v2-pill-text-short">Ops</span>
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
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL + '/work/delivah-dispatch-hub')}&text=${encodeURIComponent('Delivah Dispatch Case Study')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="v1-share-btn btn-x"
            title="Share on X"
          >
            X
          </a>
          <a 
            href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(SITE_URL + '/work/delivah-dispatch-hub')}&title=${encodeURIComponent('Delivah Dispatch Case Study')}`}
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

      {/* Spacer to offset fixed subnav + nav height */}
      <div className="v1-subnav-spacer" aria-hidden="true" />

      {/* Slider Stage */}
      <div className="stage" style={{ height: stageHeight }}>
        <div 
          className="stage-track" 
          style={{ 
            transform: `translateX(-${activeIndex * 100}vw)`,
            width: '300vw'
          }}
        >
          {/* SYSTEM 1: Service Funnel */}
          <section ref={panel1Ref} className="design design-v1 case-study__article-panel" data-design="v1">
            <main className="v1-main">
              <div className="v1-gutter" />
              
              <article className="v1-article">
                <div className="v1-meta case-study__article-meta">
                  <span className="v1-tag">{workflowPillars[0].label}</span>
                  <span className="v1-dot" />
                  <span className="v1-read">System 1 of 3</span>
                </div>

                <h1 className="v1-title">
                  A freight dispatch funnel <em>with operations behind it.</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg">L</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A service-business website built around customer acquisition plus operational intake: visitors understand the offer, enter registration, upload onboarding materials, and give the business a path toward admin review.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(15, 118, 110, 0.12)', '--workspace-bg-end': 'rgba(15, 118, 110, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio/case-studies/delivah/delivah-home-hero-mobile.png" />
                        <img src="/portfolio/case-studies/delivah/delivah-home-hero.png" alt="Delivah Dispatch website homepage screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Funnel hero landing page: positioning freight services for American owner-operators and fleet owners.
                  </div>
                </div>

                <div className="case-study__hero-actions" style={{ marginBottom: '48px' }}>
                  <a href="/get-started.html" className="case-study__button case-study__button--primary">
                    Build My Service Funnel
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>

                <h2 className="v1-h2">The Business Promise: Marketing to Carriers</h2>
                <p className="v1-p">
                  In the competitive truck dispatch industry, websites must work hard to build trust with owner-operators. Delivah Dispatch communicates freight rate advantages and dispatcher support immediately upon load.
                </p>

                <h2 className="v1-h2">{workflowPillars[0].title}</h2>
                <p className="v1-p">
                  <strong>{workflowPillars[0].audience}:</strong> {workflowPillars[0].outcome}
                </p>
                <p className="v1-p">
                  {workflowPillars[0].description}
                </p>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What visitors see in this module</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workflowPillars[0].proof.map((item) => (
                    <li key={item}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="v1-h2">Core service offers</h2>
                <p className="v1-p">
                  The services breakdown organizes dispatch services, W9 paperwork filing, route planning, and broker negotiations into distinct, clear offers.
                </p>
                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(15, 118, 110, 0.12)', '--workspace-bg-end': 'rgba(15, 118, 110, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000#services</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio/case-studies/delivah/delivah-services-mobile.png" />
                        <img src="/portfolio/case-studies/delivah/delivah-services.png" alt="Delivah Dispatch services list screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Service positioning layout showing dedicated dispatch and document handling advantages.
                  </div>
                </div>

                <h2 className="v1-h2">Contact flow</h2>
                <p className="v1-p">
                  A dedicated contact inquiry branch catches general questions and consultations, providing a lightweight path to conversion for prospects who aren't ready to submit DOT documentation.
                </p>
                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(15, 118, 110, 0.12)', '--workspace-bg-end': 'rgba(15, 118, 110, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/contact</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio/case-studies/delivah/delivah-contact-form-mobile.png" />
                        <img src="/portfolio/case-studies/delivah/delivah-contact-form.png" alt="Delivah Dispatch contact form screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Alternate lead collection form with validated contact routing.
                  </div>
                </div>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>

          {/* SYSTEM 2: Onboarding Intake */}
          <section ref={panel2Ref} className="design design-v2 case-study__article-panel" data-design="v2">
            <main className="v1-main">
              <div className="v1-gutter" />
              
              <article className="v1-article">
                <div className="v1-meta case-study__article-meta">
                  <span className="v1-tag">{workflowPillars[1].label}</span>
                  <span className="v1-dot" />
                  <span className="v1-read">System 2 of 3</span>
                </div>

                <h1 className="v1-title">
                  <span className="v1-title-main">Guided Carrier</span>{' '}
                  <em>Registration & Intake</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg">L</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A multi-step registration wizard and document upload flow that turns carrier prospects into qualified operational leads.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(217, 119, 6, 0.12)', '--workspace-bg-end': 'rgba(217, 119, 6, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/register</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio/case-studies/delivah/delivah-register-step-1-mobile.png" />
                        <img src="/portfolio/case-studies/delivah/delivah-register-step-1.png" alt="Delivah Dispatch registration step 1 screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Registration step 1: capturing DOT/MC logistics information and contact details.
                  </div>
                </div>

                <h2 className="v1-h2">Carrier intake step 1</h2>
                <p className="v1-p">
                  Carrier registration begins with validating essential contact and business numbers. Structuring this as a multi-step sequence reduces barrier fatigue and filters out unqualified leads before the document stage.
                </p>

                <h2 className="v1-h2">{workflowPillars[1].title}</h2>
                <p className="v1-p">
                  <strong>{workflowPillars[1].audience}:</strong> {workflowPillars[1].outcome}
                </p>
                <p className="v1-p">
                  {workflowPillars[1].description}
                </p>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>Guided registration elements</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workflowPillars[1].proof.map((item) => (
                    <li key={item}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="v1-h2">Document upload</h2>
                <p className="v1-p">
                  To complete registration onboarding, carriers must upload copies of W9 forms, liability certificates, and authority letters. This secure client-side form interface supports required file types and passes storage references to the database.
                </p>
                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(217, 119, 6, 0.12)', '--workspace-bg-end': 'rgba(217, 119, 6, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/register/step-4</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio/case-studies/delivah/delivah-register-document-upload-mobile.png" />
                        <img src="/portfolio/case-studies/delivah/delivah-register-document-upload.png" alt="Delivah Dispatch registration step 4 document upload screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Intake step 4: secure file dropzones for carrier W9, authority letter, and proof documentation.
                  </div>
                </div>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>

          {/* SYSTEM 3: Operations & Admin */}
          <section ref={panel3Ref} className="design design-v3 case-study__article-panel" data-design="v3">
            <main className="v1-main">
              <div className="v1-gutter" />
              
              <article className="v1-article">
                <div className="v1-meta case-study__article-meta">
                  <span className="v1-tag">{workflowPillars[2].label}</span>
                  <span className="v1-dot" />
                  <span className="v1-read">System 3 of 3</span>
                </div>

                <h1 className="v1-title">
                  <span className="v1-title-main">Operational Backend</span>{' '}
                  <em>& Lead Management</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg">L</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A secure dispatch admin login and review area where lead logs, document archives, and carrier files are monitored.
                </p>

                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(71, 85, 105, 0.12)', '--workspace-bg-end': 'rgba(71, 85, 105, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:3000/admin/login</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio/case-studies/delivah/delivah-admin-login-mobile.png" />
                        <img src="/portfolio/case-studies/delivah/delivah-admin-login.png" alt="Delivah Dispatch admin login page screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    Admin entry surface: secure dispatcher authentication controls for backend dashboard access.
                  </div>
                </div>

                <h2 className="v1-h2">Admin entry</h2>
                <p className="v1-p">
                  The dashboard is protected behind login controls, allowing dispatch managers to audit registrants, review contact logs, inspect uploaded authority files, and filter lead logs by state.
                </p>

                <h2 className="v1-h2">{workflowPillars[2].title}</h2>
                <p className="v1-p">
                  <strong>{workflowPillars[2].audience}:</strong> {workflowPillars[2].outcome}
                </p>
                <p className="v1-p">
                  {workflowPillars[2].description}
                </p>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What administrators see in this build</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workflowPillars[2].proof.map((item) => (
                    <li key={item}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="v1-h2" style={{ marginTop: '64px' }}>What CodeByLeon Delivered</h2>
                <p className="v1-p">
                  The developer skills applied to build this client funnel and operational intake platform:
                </p>
                
                <div className="case-study__capability-grid" style={{ marginTop: '24px' }}>
                  {capabilities.map((capability) => {
                    const Icon = capability.icon;
                    return (
                      <article className="case-study__capability" key={capability.title}>
                        <Icon aria-hidden="true" />
                        <h3>{capability.title}</h3>
                        <p>{capability.copy}</p>
                      </article>
                    );
                  })}
                </div>

                <div className="case-study__stack" style={{ marginTop: '32px', marginBottom: '64px' }}>
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Vite</span>
                  <span>Supabase</span>
                  <span>SQL</span>
                  <span>Row-Level Security</span>
                  <span>React Hook Form</span>
                  <span>EmailJS</span>
                  <span>Tailwind CSS</span>
                </div>

                <section className="case-study__cta" style={{ borderRadius: '16px', marginBottom: '40px' }}>
                  <div className="case-study__cta-inner">
                    <ClipboardList aria-hidden="true" />
                    <h2 style={{ color: 'white' }}>Need to automate customer acquisition and onboarding?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.72)' }}>
                      I can map your business intake form steps, configure secure storage for customer files, and build a review dashboard.
                    </p>
                    <a href="/get-started.html" className="case-study__button case-study__button--primary">
                      Build My Service Funnel
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

export default DelivahDispatchCaseStudyPage;
