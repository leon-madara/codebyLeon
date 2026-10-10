import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, Briefcase, ExternalLink } from 'lucide-react';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProject {
  id: string;
  number: string;
  badge: string;
  title: string;
  client: string;
  category: string;
  description: string;
  metric: string;
  link: string;
}

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'kossy-langat',
    number: '01',
    badge: 'Authority Brand',
    title: 'Identity Architecture & Executive Portfolio',
    client: 'Kossy Langat',
    category: 'Structural Engineering & Management',
    description: 'A personal brand that projects professional authority and aligns civil engineering credentials into an editorial narrative.',
    metric: 'High-Trust Authority',
    link: '/work/kossy-langat'
  },
  {
    id: 'delivah-dispatch',
    number: '02',
    badge: 'Operations Funnel',
    title: 'Carrier Intake & Compliance Portal',
    client: 'Delivah Dispatch',
    category: 'Freight & Logistics Automation',
    description: 'Replacing phone tags with guided registration wizards, DOT compliance document vaults, and automated dispatch intake.',
    metric: 'Zero Registration Paperwork',
    link: '/work/delivah-dispatch-hub'
  },
  {
    id: 'legit-logistics',
    number: '03',
    badge: 'Software System',
    title: 'Custom Logistics Dispatch & Driver App',
    client: 'Legit Logistics',
    category: 'Real-Time Dispatch Engine',
    description: 'An end-to-end dispatch portal featuring admin consoles, live milestone driver apps, and self-service tracking.',
    metric: 'Unified Operations',
    link: '/work/legit-logistics'
  }
];

export function WorkGatewayStrip() {
  const visualTest = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (visualTest) return;

    const cards = sectionRef.current?.querySelectorAll('.work-gateway__card');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
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
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef} 
      id="work-gateway" 
      className="work-gateway" 
      aria-label="Selected Production Systems"
    >
      <div className="work-gateway__container">
        
        {/* Header with Title and All-Work CTA */}
        <div className="work-gateway__header">
          <div>
            <div className="work-gateway__eyebrow">
              <Briefcase className="work-gateway__eyebrow-icon" aria-hidden="true" />
              <span>Selected Works</span>
            </div>
            <h2 className="work-gateway__headline">Proof Over Promises.</h2>
            <p className="work-gateway__lead">
              A curated look at recent client systems, web platforms, and operational tools built by CodeByLeon.
            </p>
          </div>

          <div className="work-gateway__header-action">
            <Link to="/work" className="work-gateway__all-work-btn">
              <span>Explore All Case Studies</span>
              <ArrowRight className="work-gateway__btn-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* 3 Featured Teaser Cards */}
        <div ref={cardsRef} className="work-gateway__cards-grid">
          {FEATURED_PROJECTS.map((project) => (
            <article key={project.id} className="work-gateway__card">
              <header className="work-gateway__card-top">
                <span className="work-gateway__card-num">{project.number}</span>
                <span className="work-gateway__card-badge">{project.badge}</span>
              </header>

              <div className="work-gateway__card-content">
                <span className="work-gateway__client-name">{project.client} • {project.category}</span>
                <h3 className="work-gateway__card-title">
                  <Link to={project.link} className="work-gateway__card-link">
                    {project.title}
                  </Link>
                </h3>
                <p className="work-gateway__card-desc">{project.description}</p>
              </div>

              <footer className="work-gateway__card-footer">
                <span className="work-gateway__metric-pill">{project.metric}</span>
                <Link to={project.link} className="work-gateway__view-link" aria-label={`View ${project.title} case study`}>
                  <span>Read Case Study</span>
                  <ArrowUpRight className="work-gateway__view-arrow" aria-hidden="true" />
                </Link>
              </footer>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
