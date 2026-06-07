import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  DatabaseZap,
  LayoutDashboard,
  Route,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Truck,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { SITE_NAME, SITE_URL, usePageSeo } from '../utils/seo';
import '../styles/sections/blog-post.css';

const workflowPillars = [
  {
    icon: LayoutDashboard,
    title: 'Admin Dashboard',
    label: 'Owner and dispatcher control',
    description:
      'A central dashboard for quote review, job creation, active delivery management, completed work, and operational visibility.',
    audience: 'Built for owners and dispatchers',
    outcome: 'Replaces scattered admin work with one place to review, create, and monitor deliveries.',
    proof: ['Quote queue', 'Delivery creation', 'Status review', 'Mobile admin views'],
  },
  {
    icon: Truck,
    title: 'Driver App',
    label: 'Field workflow automation',
    description:
      'A mobile-first driver flow that turns pickup, transit, arrival, and delivery into guided actions with proof capture.',
    audience: 'Built for field teams',
    outcome: 'Turns delivery progress into guided actions instead of calls, texts, and memory.',
    proof: ['Job selection', 'Status updates', 'Pickup photo proof', 'Customer signature'],
  },
  {
    icon: SearchCheck,
    title: 'Customer Tracking',
    label: 'Self-service delivery visibility',
    description:
      'A public tracking and lookup experience so customers can check order progress without calling the dispatch team.',
    audience: 'Built for customers and support teams',
    outcome: 'Moves routine status questions into a self-service tracking experience.',
    proof: ['Tracking code pages', 'Phone lookup', 'Timeline updates', 'Delivered privacy state'],
  },
];

const automationMap = [
  {
    manual: 'Dispatchers manually create and chase delivery updates',
    software: 'Admin creates orders, tracks status, and reviews work from one dashboard',
  },
  {
    manual: 'Drivers send status updates through calls or messages',
    software: 'Driver app guides each milestone and records proof as the job moves',
  },
  {
    manual: 'Customers contact support to ask where their order is',
    software: 'Customers use a tracking link or phone lookup to see active delivery progress',
  },
  {
    manual: 'Proof of delivery lives in scattered photos or conversations',
    software: 'Photos, signatures, and status history are attached to the delivery workflow',
  },
];

const capabilities = [
  { icon: DatabaseZap, title: 'Realtime backend', copy: 'Supabase PostgreSQL, storage, realtime subscriptions, and delivery history.' },
  { icon: Smartphone, title: 'Mobile workflow UX', copy: 'Touch-friendly driver and admin views for work that happens away from a desk.' },
  { icon: ShieldCheck, title: 'Secure public access', copy: 'Tracking codes, RLS-aware data access, and privacy handling after delivery.' },
  { icon: BarChart3, title: 'Operational dashboards', copy: 'Tabbed work queues, status counts, quote review, and order analytics.' },
];

const ORB_PALETTES = [
  ['#d9751a', '#a45711', '#fd9f68'], // Admin Dashboard: Oranges / Peaches
  ['#10b981', '#0d9488', '#115e59'], // Driver App: Greens
  ['#2563eb', '#1d4ed8', '#3b82f6']  // Customer Tracking: Blues
];

export function LegitLogisticsCaseStudyPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { contextSafe } = useGSAP();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollHidden, setIsScrollHidden] = useState(false);
  const [system3ActiveTab, setSystem3ActiveTab] = useState<'lookup' | 'tracking'>('lookup');

  // References for layout measuring and GSAP animations
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLAnchorElement>(null);
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

  usePageSeo({
    title: `Legit Logistics Case Study | ${SITE_NAME}`,
    description:
      'A Code by Leon case study showing how a logistics platform can automate dispatch, driver workflows, and customer tracking.',
    path: '/work/legit-logistics',
    image: '/portfolio-legit.png',
    imageAlt: 'Legit Logistics delivery operations platform preview',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: 'Legit Logistics Delivery Operations Automation Platform',
      creator: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      about: ['Logistics software', 'Workflow automation', 'Customer tracking', 'Driver operations'],
    },
  });

  // Hide design switcher when scrolling down, show on scroll up
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

  const Icon1 = workflowPillars[0].icon;
  const Icon2 = workflowPillars[1].icon;
  const Icon3 = workflowPillars[2].icon;

  return (
    <div className="blog-post-page-wrapper case-study-white-bg">
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
          <span className="v2-pill-text-full">Dashboard</span>
          <span className="v2-pill-text-short">Dash</span>
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
          <span className="v2-pill-text-full">Driver App</span>
          <span className="v2-pill-text-short">Driver</span>
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
          <span className="v2-pill-text-full">Tracking</span>
          <span className="v2-pill-text-short">Track</span>
        </button>
      </div>

      {/* Subnav Strip */}
      <div className="v1-subnav-strip">
        <span className="v1-subnav-edge">Strategy / Issue 04</span>
        <span className="v1-subnav-brand">THE STUDIO.</span>
        <span className="v1-subnav-edge">Archive 2026</span>
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
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SITE_URL + '/work/legit-logistics')}&text=${encodeURIComponent('Legit Logistics Case Study')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="v1-share-btn btn-x"
            title="Share on X"
          >
            X
          </a>
          <a 
            href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(SITE_URL + '/work/legit-logistics')}&title=${encodeURIComponent('Legit Logistics Case Study')}`}
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
          <button 
            onClick={() => {
              navigator.clipboard.writeText(SITE_URL + '/work/legit-logistics');
              toast({
                title: "Link Copied",
                description: "Case study link copied to clipboard.",
              });
            }}
            className="v1-share-btn btn-more"
            title="Copy Link"
          >
            ···
          </button>
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
          {/* SYSTEM 1: Admin Dashboard */}
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
                  <span className="v1-title-main">Delivery Operations</span>{' '}
                  <em>Automation Platform</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg">L</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A custom logistics system built to reduce manual coordination across dispatch, driver updates, proof collection, and customer tracking.
                </p>

                {/* Inline Workspace Canvas */}
                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(217, 117, 26, 0.12)', '--workspace-bg-end': 'rgba(217, 117, 26, 0.02)' } as React.CSSProperties}>
                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">localhost:5173/admin/dashboard</div>
                    </div>
                    <div className="browser-body">
                      <picture>
                        <source media="(max-width: 768px)" srcSet="/portfolio-legit-dashboard-mobile.png" />
                        <img src="/portfolio-legit-dashboard.png" alt="Legit Logistics admin dashboard screenshot" />
                      </picture>
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    The central digital dispatch: active delivery queues, live status boards, and driver assignments in a unified panel.
                  </div>
                </div>

                <div className="case-study__hero-actions" style={{ marginBottom: '48px' }}>
                  <a href="/get-started.html" className="case-study__button case-study__button--primary">
                    Automate My Workflow
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>

                <h2 className="v1-h2">The Business Problem: Whiteboards & Chaos</h2>
                <p className="v1-p">
                  In many service and delivery operations, information is scattered. Dispatchers track orders on whiteboards, drivers call in status updates via SMS, and managers manually reconcile delivery slips at the end of the day. When customer service agents get questions, they must text the driver directly, creating operational bottlenecks.
                </p>
                <p className="v1-p">
                  Legit Logistics replaces these disconnected steps with a single source of truth. By linking the dispatch queue directly to a driver app and a customer tracking link, the software automates routine communication.
                </p>

                <h3 className="v1-h2" style={{ fontSize: '22px', marginTop: '32px' }}>Database & Synchronization Architecture</h3>
                <p className="v1-p">
                  At the core of the admin system is a Supabase PostgreSQL database structured for transactional integrity. Active order rows transition through a strict enum state model: <code>pending_quote</code> &rarr; <code>assigned</code> &rarr; <code>in_transit</code> &rarr; <code>delivered</code>. Leveraging real-time PostgreSQL replication, dispatchers see update events instantly as drivers trigger actions in the field, eliminating double-booking and manual phone checks.
                </p>

                <h2 className="v1-h2">{workflowPillars[0].title}</h2>
                <p className="v1-p">
                  <strong>{workflowPillars[0].audience}:</strong> {workflowPillars[0].outcome}
                </p>
                <p className="v1-p">
                  {workflowPillars[0].description}
                </p>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What dispatchers see in this build</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workflowPillars[0].proof.map((item) => (
                    <li key={item}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>Dispatch Automation Flow</h3>
                <div className="case-study__automation-list" style={{ marginTop: '20px' }}>
                  <article className="case-study__automation-row">
                    <div className="case-study__automation-number">01</div>
                    <div>
                      <p className="case-study__automation-label">Manual pattern</p>
                      <p className="case-study__automation-copy">{automationMap[0].manual}</p>
                    </div>
                    <Route className="case-study__automation-icon" aria-hidden="true" />
                    <div>
                      <p className="case-study__automation-label">Software replacement</p>
                      <p className="case-study__automation-copy">{automationMap[0].software}</p>
                    </div>
                  </article>
                </div>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>

          {/* SYSTEM 2: Driver App */}
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
                  <span className="v1-title-main">Guided Driver</span>{' '}
                  <em>Flow & Actions</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg">L</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A mobile-first driver flow that turns pickup, transit, arrival, and delivery into guided actions with proof capture.
                </p>

                {/* Inline Workspace Canvas */}
                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(16, 185, 129, 0.12)', '--workspace-bg-end': 'rgba(16, 185, 129, 0.02)' } as React.CSSProperties}>
                  <div className="phone-shell">
                    <div className="phone-screen">
                      <img
                        src="/portfolio-legit-driver-mobile.png"
                        alt="Legit Logistics driver app screenshot"
                      />
                    </div>
                  </div>
                  <div className="workspace-canvas-caption" style={{ marginTop: '16px' }}>
                    Mobile-first driver interface showing active job tasks and automated status controls.
                  </div>
                </div>

                <h2 className="v1-h2">The Driver Workflow: Click-to-Update</h2>
                <p className="v1-p">
                  Drivers in the field are busy. Expecting them to manually call dispatch at every pick-up or drop-off fails in practice. The mobile driver app solves this by guiding drivers with simple milestone buttons (e.g. <em>Mark as Transit</em>, <em>Arrived</em>, <em>Delivered</em>). Each action logs timestamps and automatically triggers Supabase database triggers to update the customer page.
                </p>
                <p className="v1-p">
                  Instead of paper invoices, drivers capture a photo at pickup and a digital customer signature at delivery, which are uploaded securely to Supabase storage buckets and pinned to the database record.
                </p>

                <h3 className="v1-h2" style={{ fontSize: '22px', marginTop: '32px' }}>Offline Resilience & Storage Operations</h3>
                <p className="v1-p">
                  The mobile-first client utilizes optimistic state caching. If a driver drops connection in a low-reception area, signature capture and photo proofs are cached in local storage before being securely synced to Supabase Storage Buckets once the connection is restored. High-resolution photos are compressed client-side using canvas scaling to minimize data usage for field operations.
                </p>

                <h2 className="v1-h2">{workflowPillars[1].title}</h2>
                <p className="v1-p">
                  <strong>{workflowPillars[1].audience}:</strong> {workflowPillars[1].outcome}
                </p>
                <p className="v1-p">
                  {workflowPillars[1].description}
                </p>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What drivers see in this build</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workflowPillars[1].proof.map((item) => (
                    <li key={item}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>Driver Automation Flow</h3>
                <div className="case-study__automation-list" style={{ marginTop: '20px' }}>
                  <article className="case-study__automation-row">
                    <div className="case-study__automation-number">02</div>
                    <div>
                      <p className="case-study__automation-label">Manual pattern</p>
                      <p className="case-study__automation-copy">{automationMap[1].manual}</p>
                    </div>
                    <Route className="case-study__automation-icon" aria-hidden="true" />
                    <div>
                      <p className="case-study__automation-label">Software replacement</p>
                      <p className="case-study__automation-copy">{automationMap[1].software}</p>
                    </div>
                  </article>
                </div>
              </article>
              
              <div className="v1-gutter" />
            </main>
          </section>

          {/* SYSTEM 3: Customer Tracking */}
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
                  <span className="v1-title-main">Real-time Delivery</span>{' '}
                  <em>Visibility & Timeline</em>
                </h1>

                <div className="v1-author case-study__article-proofline">
                  <div className="v1-avatar-lg">L</div>
                  <div>
                    <div className="v1-author-name">By Leon Madara</div>
                    <div className="v1-author-date">June 2024</div>
                  </div>
                </div>

                <p className="v1-lede case-study__article-lede">
                  A public tracking and lookup experience so customers can check order progress without calling the dispatch team.
                </p>

                {/* Inline Workspace Canvas */}
                <div className="workspace-canvas-inline" style={{ '--workspace-bg-start': 'rgba(37, 99, 235, 0.12)', '--workspace-bg-end': 'rgba(37, 99, 235, 0.02)' } as React.CSSProperties}>
                  <div className="workspace-canvas-switcher">
                    <button 
                      onClick={() => setSystem3ActiveTab('lookup')}
                      className={`workspace-canvas-btn ${system3ActiveTab === 'lookup' ? 'is-active' : ''}`}
                    >
                      Order Lookup
                    </button>
                    <button 
                      onClick={() => setSystem3ActiveTab('tracking')}
                      className={`workspace-canvas-btn ${system3ActiveTab === 'tracking' ? 'is-active' : ''}`}
                    >
                      Live Tracking
                    </button>
                  </div>

                  <div className="browser-shell">
                    <div className="browser-header">
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-dot" />
                      <div className="browser-url">
                        {system3ActiveTab === 'lookup' ? 'localhost:3000/tracking' : 'localhost:3000/tracking/legit-track-102'}
                      </div>
                    </div>
                    <div className="browser-body">
                      {system3ActiveTab === 'lookup' ? (
                        <picture>
                          <source media="(max-width: 768px)" srcSet="/portfolio-legit-lookup-mobile.png" />
                          <img src="/portfolio-legit-lookup.png" alt="Legit Logistics order lookup screenshot" />
                        </picture>
                      ) : (
                        <picture>
                          <source media="(max-width: 768px)" srcSet="/portfolio-legit-tracking-mobile.png" />
                          <img src="/portfolio-legit-tracking.png" alt="Legit Logistics live order tracking page screenshot" />
                        </picture>
                      )}
                    </div>
                  </div>
                  <div className="workspace-canvas-caption">
                    {system3ActiveTab === 'lookup' 
                      ? 'The public lookup portal: customers type tracking codes or enter phone numbers to get order details.'
                      : 'Self-service tracking timeline: customers monitor the driver\'s progress and delivery status milestones in real-time.'
                    }
                  </div>
                </div>

                <h2 className="v1-h2">Customer Transparency: Self-Service Tracking</h2>
                <p className="v1-p">
                  The most common support questions for logistics teams are <em>"Where is my driver?"</em>. Responding to these manually consumes hours of dispatcher time. By automatically emailing or texting a secure tracking link to the customer upon job creation, customers can track their package's journey self-service.
                </p>
                <p className="v1-p">
                  The portal is designed with Row-Level Security (RLS) policies. Public visitors can view the active status timeline using their unique, cryptographically random tracking code, but private details (such as the driver's phone number or drop-off signature) are protected until they pass secondary verification.
                </p>

                <h3 className="v1-h2" style={{ fontSize: '22px', marginTop: '32px' }}>Row-Level Security (RLS) & Privacy</h3>
                <p className="v1-p">
                  To protect operational security, public access is governed by strict PostgreSQL RLS policies. The public tracking portal queries a dedicated RPC function that requires a cryptographically random, 16-character tracking token. Once the order reaches the <code>delivered</code> state, the policy automatically obfuscates driver location details and contact numbers, ensuring customer privacy and business security.
                </p>

                <h2 className="v1-h2">{workflowPillars[2].title}</h2>
                <p className="v1-p">
                  <strong>{workflowPillars[2].audience}:</strong> {workflowPillars[2].outcome}
                </p>
                <p className="v1-p">
                  {workflowPillars[2].description}
                </p>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What customers see in this build</h3>
                <ul className="case-study__proof-list case-study__proof-list--article" style={{ marginBottom: '40px' }}>
                  {workflowPillars[2].proof.map((item) => (
                    <li key={item}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>Customer Visibility Flow</h3>
                <div className="case-study__automation-list" style={{ marginTop: '20px', marginBottom: '48px' }}>
                  <article className="case-study__automation-row">
                    <div className="case-study__automation-number">03</div>
                    <div>
                      <p className="case-study__automation-label">Manual pattern</p>
                      <p className="case-study__automation-copy">{automationMap[2].manual}</p>
                    </div>
                    <Route className="case-study__automation-icon" aria-hidden="true" />
                    <div>
                      <p className="case-study__automation-label">Software replacement</p>
                      <p className="case-study__automation-copy">{automationMap[2].software}</p>
                    </div>
                  </article>
                  
                  <article className="case-study__automation-row" style={{ marginTop: '16px' }}>
                    <div className="case-study__automation-number">04</div>
                    <div>
                      <p className="case-study__automation-label">Manual pattern</p>
                      <p className="case-study__automation-copy">{automationMap[3].manual}</p>
                    </div>
                    <Route className="case-study__automation-icon" aria-hidden="true" />
                    <div>
                      <p className="case-study__automation-label">Software replacement</p>
                      <p className="case-study__automation-copy">{automationMap[3].software}</p>
                    </div>
                  </article>
                </div>

                <h2 className="v1-h2" style={{ marginTop: '64px' }}>Skills & Capabilities Demonstrated</h2>
                <p className="v1-p">
                  The same developer skills a growing business needs for reliable, custom systems:
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
                  <span>Realtime</span>
                  <span>PostgreSQL</span>
                  <span>React Hook Form</span>
                  <span>Zod</span>
                  <span>Tailwind CSS</span>
                </div>

                <section className="case-study__cta" style={{ borderRadius: '16px', marginBottom: '40px' }}>
                  <div className="case-study__cta-inner">
                    <Clock aria-hidden="true" />
                    <h2 style={{ color: 'white' }}>Have a workflow that wastes time every week?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.72)' }}>
                      I can help map the repeated steps, design the right screens, and build software that makes the work easier to run.
                    </p>
                    <a href="/get-started.html" className="case-study__button case-study__button--primary">
                      Start With My Workflow
                      <ClipboardList aria-hidden="true" />
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
  );
}

export default LegitLogisticsCaseStudyPage;
