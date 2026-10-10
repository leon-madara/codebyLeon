import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Terminal, 
  MapPin, 
  Clock, 
  Quote, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Activity, 
  ArrowUpRight 
} from 'lucide-react';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

export function AboutManifesto() {
  const visualTest = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const [nairobiTime, setNairobiTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: 'Africa/Nairobi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setNairobiTime(formatter.format(now));
      } catch {
        setNairobiTime('EAT (UTC+3)');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    if (visualTest) return;

    const bentoCards = sectionRef.current?.querySelectorAll('.about-manifesto__bento-card');
    if (bentoCards && bentoCards.length > 0) {
      gsap.fromTo(
        bentoCards,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bentoRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="about-manifesto" 
      aria-label="About the Founder and Engineering Philosophy"
    >
      <div className="about-manifesto__container">

        {/* Section Header */}
        <div className="about-manifesto__header">
          <div className="about-manifesto__eyebrow">
            <Terminal className="about-manifesto__eyebrow-icon" aria-hidden="true" />
            <span>Founder & Engineering Philosophy</span>
          </div>
          <h2 className="about-manifesto__headline">
            Crafting Digital Authority With High-Rigour Engineering.
          </h2>
          <p className="about-manifesto__lead">
            Great businesses shouldn’t have to settle for flimsy page builders, slow load times, or cookie-cutter templates. 
            CodeByLeon exists to bridge elite aesthetic craft with rock-solid software systems.
          </p>
        </div>

        {/* BENTO GRID */}
        <div ref={bentoRef} className="about-manifesto__bento-grid">
          
          {/* CARD 1: Founder Dossier (Spans 2 cols on desktop) */}
          <article className="about-manifesto__bento-card about-manifesto__bento-card--dossier">
            <div className="about-manifesto__dossier-top">
              <div className="about-manifesto__dossier-meta">
                <span className="about-manifesto__dossier-role">Founder & Principal Technologist</span>
                <h3 className="about-manifesto__dossier-name">Leon Madara</h3>
              </div>
              <div className="about-manifesto__live-badge">
                <span className="about-manifesto__status-dot" aria-hidden="true" />
                <span className="about-manifesto__status-text">Available For Select Commissions</span>
              </div>
            </div>

            <p className="about-manifesto__dossier-bio">
              I partner directly with ambitious founders, executives, and organizations to design and develop 
              custom websites, conversion funnels, and web applications. When you work with CodeByLeon, 
              there are no account managers, no account reps, no middlemen, and no junior developer handoffs. You get direct 1-on-1 access to 
              the engineer who architects, designs, and ships your product.
            </p>

            <div className="about-manifesto__dossier-coords">
              <div className="about-manifesto__coord-item">
                <MapPin className="about-manifesto__coord-icon" aria-hidden="true" />
                <span>Nairobi, Kenya • Worldwide Delivery</span>
              </div>
              <div className="about-manifesto__coord-item">
                <Clock className="about-manifesto__coord-icon" aria-hidden="true" />
                <span>Local Studio Time: <strong>{nairobiTime || 'EAT (UTC+3)'}</strong></span>
              </div>
            </div>
          </article>

          {/* CARD 2: Anti-Template Manifesto */}
          <article className="about-manifesto__bento-card about-manifesto__bento-card--manifesto">
            <h3 className="about-manifesto__card-title">The Anti-Template Principle</h3>
            <p className="about-manifesto__card-desc">
              Templates look cheap, perform poorly on mobile, and drag your business credibility down. 
              Here is how we do things differently:
            </p>
            
            <div className="about-manifesto__comparison-table">
              <div className="about-manifesto__comparison-col about-manifesto__comparison-col--bad">
                <h4 className="about-manifesto__comp-heading">
                  <XCircle className="about-manifesto__comp-icon-bad" aria-hidden="true" />
                  Generic Page Builders
                </h4>
                <ul className="about-manifesto__comp-list">
                  <li>Bloated DOM and 15MB JS script payloads</li>
                  <li>Fragile plugins that break on update</li>
                  <li>Cookie-cutter designs that blend into noise</li>
                  <li>Unreliable mobile responsiveness</li>
                </ul>
              </div>

              <div className="about-manifesto__comparison-col about-manifesto__comparison-col--good">
                <h4 className="about-manifesto__comp-heading">
                  <CheckCircle className="about-manifesto__comp-icon-good" aria-hidden="true" />
                  CodeByLeon Handcrafted Code
                </h4>
                <ul className="about-manifesto__comp-list">
                  <li>Pure semantic React + TypeScript architecture</li>
                  <li>Sub-second LCP and near-perfect Core Web Vitals</li>
                  <li>Custom-designed to your exact brand narrative</li>
                  <li>Bulletproof ergonomics across all viewports</li>
                </ul>
              </div>
            </div>
          </article>

          {/* CARD 3: Engineering Standards & Metrics */}
          <article className="about-manifesto__bento-card about-manifesto__bento-card--standards">
            <h3 className="about-manifesto__card-title">Engineering Standards</h3>
            <div className="about-manifesto__metrics-list">
              <div className="about-manifesto__metric-item">
                <div className="about-manifesto__metric-stat">100%</div>
                <div className="about-manifesto__metric-detail">
                  <strong>Custom Architecture</strong>
                  <span>Zero pre-built templates or third-party builder bloat.</span>
                </div>
              </div>
              <div className="about-manifesto__metric-item">
                <div className="about-manifesto__metric-stat">&lt; 1.2s</div>
                <div className="about-manifesto__metric-detail">
                  <strong>Target LCP Benchmark</strong>
                  <span>Ultra-fast delivery designed to minimize bounce rates.</span>
                </div>
              </div>
              <div className="about-manifesto__metric-item">
                <div className="about-manifesto__metric-stat">60 FPS</div>
                <div className="about-manifesto__metric-detail">
                  <strong>GSAP Cinematic Motion</strong>
                  <span>Smooth scroll animations that never drop frames.</span>
                </div>
              </div>
            </div>
          </article>

          {/* CARD 4: Executive Trust & Client Feedback */}
          <article className="about-manifesto__bento-card about-manifesto__bento-card--quotes">
            <h3 className="about-manifesto__card-title">Executive Partnership Voices</h3>
            <div className="about-manifesto__quotes-grid">
              
              <div className="about-manifesto__quote-item">
                <Quote className="about-manifesto__quote-icon" aria-hidden="true" />
                <p className="about-manifesto__quote-text">
                  "Leon turned my professional history and project credentials into a clean, narrative-led brand that communicates trust instantly."
                </p>
                <div className="about-manifesto__quote-author">
                  <strong>Kossy Langat</strong>
                  <span>Structural Engineer & GM</span>
                </div>
              </div>

              <div className="about-manifesto__quote-item">
                <Quote className="about-manifesto__quote-icon" aria-hidden="true" />
                <p className="about-manifesto__quote-text">
                  "The guided intake wizard qualified carrier prospects and captured DOT compliance files without manual paperwork."
                </p>
                <div className="about-manifesto__quote-author">
                  <strong>Faith</strong>
                  <span>Owner, Delivah Dispatch</span>
                </div>
              </div>

              <div className="about-manifesto__quote-item">
                <Quote className="about-manifesto__quote-icon" aria-hidden="true" />
                <p className="about-manifesto__quote-text">
                  "Leon built a custom dispatch engine that replaces phone tag and scattered records with guided digital workflows."
                </p>
                <div className="about-manifesto__quote-author">
                  <strong>Ken Madara</strong>
                  <span>Owner, Legit Logistics</span>
                </div>
              </div>

            </div>
          </article>

        </div>

      </div>
    </section>
  );
}
