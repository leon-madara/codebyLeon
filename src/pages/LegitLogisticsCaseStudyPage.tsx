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
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollHidden, setIsScrollHidden] = useState(false);

  // References for GSAP background orb animations
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

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
    <div className="blog-post-page-wrapper">
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
          Dashboard
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
          Driver App
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
          Tracking
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
        <button 
          onClick={() => navigate('/#portfolio')} 
          className="v1-back"
          aria-label="Back to Our Work"
        >
          <span className="v1-back-circle" aria-hidden="true">
            <span className="v1-back-icon">&larr;</span>
          </span>
          <span className="v1-back-label">Back to Work</span>
        </button>
        
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
      <div className="stage">
        <div 
          className="stage-track" 
          style={{ 
            transform: `translateX(-${activeIndex * 100}vw)`,
            width: '300vw'
          }}
        >
          {/* SYSTEM 1: Admin Dashboard */}
          <section className="design design-v1 case-study__article-panel" data-design="v1">
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

                <figure className="v1-hero">
                  <img src="/portfolio-legit.png" alt="Legit Logistics platform preview" />
                  <figcaption>Dispatch, driver actions, and public tracking brought into one connected workflow.</figcaption>
                </figure>

                <div className="case-study__hero-actions" style={{ marginBottom: '48px' }}>
                  <a href="/get-started.html" className="case-study__button case-study__button--primary">
                    Automate My Workflow
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>

                <h2 className="v1-h2">The Business Problem</h2>
                <p className="v1-p">
                  Logistics work can get buried in calls, texts, and spreadsheets. Delivery teams need to know what is pending, what is moving, who is handling it, and what the customer can see. When those updates are manual, dispatch slows down and customers keep asking for status.
                </p>
                <p className="v1-p">
                  Legit Logistics demonstrates the kind of software I build for clients: systems that turn repeated operational steps into clear, trackable workflows.
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

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What the software automates</h3>
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
          <section className="design design-v2 case-study__article-panel" data-design="v2">
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

                <figure className="v1-hero">
                  <img src="/portfolio-legit.png" alt="Legit Logistics driver app preview" />
                  <figcaption>Guided driver actions in the field, with real-time status syncing.</figcaption>
                </figure>

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

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What the software automates</h3>
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
          <section className="design design-v3 case-study__article-panel" data-design="v3">
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

                <figure className="v1-hero">
                  <img src="/portfolio-legit.png" alt="Legit Logistics customer tracking portal preview" />
                  <figcaption>Self-service tracking and confirmation timelines for public visitors.</figcaption>
                </figure>

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

                <h3 className="v1-h2" style={{ fontSize: '24px', marginTop: '40px' }}>What the software automates</h3>
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
