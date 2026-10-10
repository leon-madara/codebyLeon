import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Sliders
} from 'lucide-react';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

export interface ServiceTier {
  id: string;
  badge: string;
  title: string;
  tagline: string;
  targetAudience: string;
  timeline: string;
  highlights: string[];
  deliverables: string[];
  ctaText: string;
  featured?: boolean;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'custom-website',
    badge: '01 • New Builds',
    title: 'A Brand-New Custom Website',
    tagline: 'Custom-engineered digital flagships that command authority and turn visitors into high-value clients.',
    targetAudience: 'Businesses launching a new venture or building their first professional web presence.',
    timeline: '3 – 5 Weeks',
    highlights: [
      '100% custom React & TypeScript code with zero page-builder bloat',
      'Sub-second load times engineered for high mobile conversion',
      'Clear information architecture designed around buyer decisions',
      'Custom contact and intake flows directly connected to your CRM or email'
    ],
    deliverables: [
      'Full Figma UX/UI System',
      'React / TypeScript Frontend',
      'Mobile-First Responsive Polish',
      'Technical SEO & Analytics Setup'
    ],
    ctaText: 'Commission a New Website',
    featured: true
  },
  {
    id: 'redesign-modernization',
    badge: '02 • Redesign & Overhaul',
    title: 'Complete Website Redesign & Modernization',
    tagline: 'Transform an outdated digital footprint to match your true market stature and executive credibility.',
    targetAudience: 'Companies with great offline reputations whose current websites fail to reflect their stature.',
    timeline: '2 – 4 Weeks',
    highlights: [
      'Strategic audit of current friction points and lost conversions',
      'Contemporary typographic hierarchy and refined color token system',
      'Sharpened editorial positioning and conversion-focused copy refresh',
      'Zero-downtime technical migration preserving your existing search rankings'
    ],
    deliverables: [
      'Brand Identity System',
      'Complete Website Redesign',
      'Conversion Architecture',
      'Zero-Downtime Migration'
    ],
    ctaText: 'Modernize Your Presence'
  },
  {
    id: 'portals-workflows',
    badge: '03 • Systems & Portals',
    title: 'Custom Portals & Automated Workflows',
    tagline: 'Client dashboards, guided onboarding wizards, and internal workflow automations.',
    targetAudience: 'Growing companies looking to automate manual processes and eliminate operational bottlenecks.',
    timeline: '3 – 6 Weeks',
    highlights: [
      'Custom client intake portals replacing endless emails and phone tag',
      'Secure authenticated dashboards with role-based permissions',
      'Automated document handling, notifications, and webhook workflows',
      'Direct API, Supabase, CRM, and custom portal integrations'
    ],
    deliverables: [
      'Custom Web Application',
      'Authentication & Database',
      'Workflow Automations',
      'Admin Management Console'
    ],
    ctaText: 'Build a Custom Portal'
  }
];

type ClientStage = 'startup' | 'sme' | 'corporate';
type ClientObjective = 'flagship' | 'rebrand' | 'intake' | 'retainer';

export function ServicesMatrix() {
  const visualTest = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'tiers' | 'estimator'>('tiers');

  // Interactive Scope Estimator State
  const [selectedStage, setSelectedStage] = useState<ClientStage>('sme');
  const [selectedObjective, setSelectedObjective] = useState<ClientObjective>('flagship');

  // Compute recommended tier based on selections
  const getRecommendation = () => {
    if (selectedObjective === 'retainer') {
      return {
        tier: SERVICE_TIERS[2],
        rationale: 'Your team requires ongoing feature delivery, campaign landing pages, and fast engineering sprints.',
        estimatedWeeks: 'Monthly Rolling Sprints',
        idealFit: 'Dedicated Senior Engineering Partner'
      };
    }
    if (selectedObjective === 'rebrand') {
      return {
        tier: SERVICE_TIERS[1],
        rationale: 'Your business already has commercial traction, but the current digital identity lags behind your actual quality.',
        estimatedWeeks: '2 – 4 Weeks',
        idealFit: 'Brand Authority & Digital Modernization'
      };
    }
    return {
      tier: SERVICE_TIERS[0],
      rationale: selectedObjective === 'intake'
        ? 'You need custom interactive workflows (like client intake portals or dispatch systems) built with rock-solid code.'
        : 'You need an authoritative, high-performance web platform built from scratch to win high-ticket clients.',
      estimatedWeeks: '3 – 5 Weeks',
      idealFit: 'Bespoke Web Platforms & Digital Flagships'
    };
  };

  const recommendation = getRecommendation();

  useGSAP(() => {
    if (visualTest) return;

    const cards = sectionRef.current?.querySelectorAll('.services-matrix__tier-card');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, { scope: sectionRef, dependencies: [activeTab] });

  return (
    <section 
      ref={sectionRef} 
      id="services" 
      className="services-matrix" 
      aria-label="Services and Engagement Models"
    >
      <div className="services-matrix__container">
        
        {/* Section Header */}
        <div className="services-matrix__header">
          <div className="services-matrix__eyebrow">
            <Cpu className="services-matrix__eyebrow-icon" aria-hidden="true" />
            <span>Architecture & Engagements</span>
          </div>
          <h2 className="services-matrix__headline">
            High-Performance Systems Built For Measurable Growth.
          </h2>
          <p className="services-matrix__lead">
            Every engagement delivers custom code, crisp typography, and commercial clarity. 
            No outsourced templates. No bloated agency overhead.
          </p>

          {/* View Mode Switcher */}
          <div className="services-matrix__switcher" role="tablist" aria-label="Services display options">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'tiers'}
              className={`services-matrix__switch-btn ${activeTab === 'tiers' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('tiers')}
            >
              <Layers className="services-matrix__switch-icon" aria-hidden="true" />
              <span>All Service Tiers</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'estimator'}
              className={`services-matrix__switch-btn ${activeTab === 'estimator' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('estimator')}
            >
              <Sliders className="services-matrix__switch-icon" aria-hidden="true" />
              <span>Interactive Scope Matcher</span>
            </button>
          </div>
        </div>

        {/* TAB 1: ALL TIERS GRID */}
        {activeTab === 'tiers' && (
          <>
            <div ref={cardsRef} className="services-matrix__grid">
            {SERVICE_TIERS.map((tier) => (
              <article 
                key={tier.id} 
                className={`services-matrix__tier-card ${tier.featured ? 'services-matrix__tier-card--featured' : ''}`}
              >
                {tier.featured && (
                  <div className="services-matrix__featured-tag">
                    <Sparkles className="services-matrix__featured-icon" aria-hidden="true" />
                    <span>Most Requested</span>
                  </div>
                )}
                
                <header className="services-matrix__card-header">
                  <span className="services-matrix__card-badge">{tier.badge}</span>
                  <h3 className="services-matrix__card-title">{tier.title}</h3>
                  <p className="services-matrix__card-tagline">{tier.tagline}</p>
                </header>

                <div className="services-matrix__card-meta">
                  <div className="services-matrix__meta-item">
                    <Clock className="services-matrix__meta-icon" aria-hidden="true" />
                    <span><strong>Timeline:</strong> {tier.timeline}</span>
                  </div>
                  <div className="services-matrix__meta-item">
                    <ShieldCheck className="services-matrix__meta-icon" aria-hidden="true" />
                    <span><strong>Ideal For:</strong> {tier.targetAudience}</span>
                  </div>
                </div>

                <div className="services-matrix__card-section">
                  <h4 className="services-matrix__subheading">Architecture Highlights</h4>
                  <ul className="services-matrix__highlights-list">
                    {tier.highlights.map((highlight, idx) => (
                      <li key={idx} className="services-matrix__highlight-item">
                        <CheckCircle2 className="services-matrix__check-icon" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="services-matrix__card-section">
                  <h4 className="services-matrix__subheading">Key Deliverables</h4>
                  <div className="services-matrix__deliverables-tags">
                    {tier.deliverables.map((item, idx) => (
                      <span key={idx} className="services-matrix__deliverable-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <footer className="services-matrix__card-footer">
                  <a
                    href={`/get-started.html?tier=${tier.id}`}
                    className="services-matrix__cta-btn"
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="services-matrix__cta-arrow" aria-hidden="true" />
                  </a>
                </footer>
              </article>
            ))}
          </div>

          {/* Bridge Card linking to 7-Step Configurator */}
          <div className="services-matrix__bridge-card">
            <div className="services-matrix__bridge-content">
              <div className="services-matrix__bridge-tag">
                <Sliders className="w-4 h-4" aria-hidden="true" />
                <span>Interactive Project Configurator</span>
              </div>
              <h4 className="services-matrix__bridge-title">
                Not Sure Which Tier Fits Your Goals?
              </h4>
              <p className="services-matrix__bridge-description">
                Use our interactive 7-step project configurator to outline your requirements, get instant timeline and budget scope estimates in under 2 minutes.
              </p>
              <div className="services-matrix__bridge-meta">
                <span>⏱️ 2-minute duration</span>
                <span>⚡ Instant timeline & budget scope</span>
                <span>📋 7 guided questions</span>
              </div>
            </div>
            <div className="services-matrix__bridge-action">
              <a
                href="/get-started.html"
                className="services-matrix__bridge-btn"
              >
                <span>Configure Your Project</span>
                <ArrowRight className="services-matrix__cta-arrow" aria-hidden="true" />
              </a>
            </div>
          </div>
        </>
      )}

        {/* TAB 2: INTERACTIVE SCOPE ESTIMATOR */}
        {activeTab === 'estimator' && (
          <div className="services-estimator">
            <div className="services-estimator__container">
              
              {/* Controls Column */}
              <div className="services-estimator__controls">
                <div className="services-estimator__control-group">
                  <label className="services-estimator__label">
                    <span className="services-estimator__step-num">Step 1</span>
                    Where is your business right now?
                  </label>
                  <div className="services-estimator__options-grid">
                    {[
                      { id: 'startup', label: 'Early-Stage / Fast Growth', desc: 'Pre-seed to Series A needing serious market polish' },
                      { id: 'sme', label: 'Established Business / SME', desc: 'Proven revenue ready to upgrade into industry-leading authority' },
                      { id: 'corporate', label: 'Executive / Corporate Entity', desc: 'High-stakes reputation requiring enterprise trust' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`services-estimator__option-btn ${selectedStage === opt.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedStage(opt.id as ClientStage)}
                      >
                        <span className="services-estimator__option-title">{opt.label}</span>
                        <span className="services-estimator__option-desc">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="services-estimator__control-group">
                  <label className="services-estimator__label">
                    <span className="services-estimator__step-num">Step 2</span>
                    What is your primary commercial priority?
                  </label>
                  <div className="services-estimator__options-grid">
                    {[
                      { id: 'flagship', label: 'Launch 0-to-1 Digital Flagship', desc: 'Build a bespoke, high-performance web platform from scratch' },
                      { id: 'rebrand', label: 'Modernize & Rebrand Legacy Site', desc: 'Transform an outdated site to look modern and credible' },
                      { id: 'intake', label: 'Automate Portals & Client Intake', desc: 'Replace phone tags with custom intake wizards and apps' },
                      { id: 'retainer', label: 'Ongoing Growth & Fast Sprints', desc: 'Continuous weekly engineering sprints and landing pages' }
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`services-estimator__option-btn ${selectedObjective === opt.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedObjective(opt.id as ClientObjective)}
                      >
                        <span className="services-estimator__option-title">{opt.label}</span>
                        <span className="services-estimator__option-desc">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendation Panel */}
              <div className="services-estimator__output-panel">
                <div className="services-estimator__output-badge">
                  <Zap className="services-estimator__badge-icon" aria-hidden="true" />
                  <span>Recommended Architecture</span>
                </div>
                
                <h3 className="services-estimator__output-title">{recommendation.idealFit}</h3>
                <p className="services-estimator__output-rationale">{recommendation.rationale}</p>

                <div className="services-estimator__summary-box">
                  <div className="services-estimator__summary-row">
                    <span className="services-estimator__summary-label">Estimated Delivery:</span>
                    <span className="services-estimator__summary-value">{recommendation.estimatedWeeks}</span>
                  </div>
                  <div className="services-estimator__summary-row">
                    <span className="services-estimator__summary-label">Operating Model:</span>
                    <span className="services-estimator__summary-value">Direct Founder Collaboration (Leon Madara)</span>
                  </div>
                  <div className="services-estimator__summary-row">
                    <span className="services-estimator__summary-label">Code Quality Guarantee:</span>
                    <span className="services-estimator__summary-value">100% Handcrafted • Sub-1.2s LCP • 60 FPS</span>
                  </div>
                </div>

                <div className="services-estimator__deliverables-preview">
                  <h4 className="services-estimator__preview-heading">Included Core Deliverables:</h4>
                  <ul className="services-estimator__preview-list">
                    {recommendation.tier.deliverables.map((item, idx) => (
                      <li key={idx} className="services-estimator__preview-item">
                        <CheckCircle2 className="services-estimator__check-icon" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`/get-started.html?tier=${recommendation.tier.id}&stage=${selectedStage}&objective=${selectedObjective}`}
                  className="services-estimator__cta-btn"
                >
                  <span>Schedule Discovery Call For This Scope</span>
                  <ArrowRight className="services-estimator__btn-arrow" aria-hidden="true" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
