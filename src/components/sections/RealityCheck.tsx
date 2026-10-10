import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, XCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

export function RealityCheck() {
  const visualTest = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (visualTest) return;

    const cards = sectionRef.current?.querySelectorAll('.reality-check__card');
    if (cards && cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35 },
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
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="reality-check"
      className="reality-check"
      aria-label="The Reality Check and Our Approach"
    >
      <div className="reality-check__container">
        {/* Section Header */}
        <div className="reality-check__header">
          <div className="reality-check__eyebrow">
            <AlertCircle className="reality-check__eyebrow-icon" aria-hidden="true" />
            <span>The Reality Check</span>
          </div>
          <h2 className="reality-check__headline">
            Your Business Is Established. Does Your Website Look Like It?
          </h2>
          <p className="reality-check__lead">
            Most successful companies suffer from a silent credibility gap: an offline reputation built over years of excellent work, paired with an outdated, sluggish, or amateurish website that repels high-value clients before the first conversation even starts.
          </p>
        </div>

        {/* Comparison Grid */}
        <div ref={cardsRef} className="reality-check__grid">
          {/* Card 1: The Problem */}
          <div className="reality-check__card reality-check__card--problem">
            <div>
              <div className="reality-check__card-tag reality-check__card-tag--problem">
                <ShieldAlert className="w-4 h-4" aria-hidden="true" />
                <span>The Common Trap</span>
              </div>
              <h3 className="reality-check__card-title">The Professional Gap</h3>
              <p className="reality-check__card-description">
                You deliver top-tier work, have proven domain authority, and command respect in person. But when prospective partners or enterprise clients look you up online, they find a slow, generic template with broken mobile layouts. Within seconds, doubts form about your attention to detail.
              </p>

              <ul className="reality-check__list">
                <li className="reality-check__list-item">
                  <XCircle className="reality-check__item-icon reality-check__item-icon--problem" aria-hidden="true" />
                  <span>Slow loading speeds and clunky navigation that cause high-intent prospects to bounce.</span>
                </li>
                <li className="reality-check__list-item">
                  <XCircle className="reality-check__item-icon reality-check__item-icon--problem" aria-hidden="true" />
                  <span>Generic drag-and-drop templates that make an established firm look like an unvetted startup.</span>
                </li>
                <li className="reality-check__list-item">
                  <XCircle className="reality-check__item-icon reality-check__item-icon--problem" aria-hidden="true" />
                  <span>Vague, buzzword-heavy copy that leaves visitors confused about what you actually deliver.</span>
                </li>
                <li className="reality-check__list-item">
                  <XCircle className="reality-check__item-icon reality-check__item-icon--problem" aria-hidden="true" />
                  <span>Hidden technical debt and bloated plugins vulnerable to security issues and sudden crashes.</span>
                </li>
              </ul>
            </div>

            <div className="reality-check__card-footer">
              <span className="reality-check__metric">Result: Lost deals and eroded pricing power before your pitch begins.</span>
            </div>
          </div>

          {/* Card 2: Our Approach */}
          <div className="reality-check__card reality-check__card--approach">
            <div>
              <div className="reality-check__card-tag reality-check__card-tag--approach">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>The CodeByLeon Standard</span>
              </div>
              <h3 className="reality-check__card-title">Handcrafted Code & Bespoke Design</h3>
              <p className="reality-check__card-description">
                We do not use bloated WordPress, Elementor, or Wix site builders. Every CodeByLeon platform is designed from first principles and hand-coded in clean React, TypeScript, and modern CSS—giving your business the polish, performance, and credibility of an industry leader.
              </p>

              <ul className="reality-check__list">
                <li className="reality-check__list-item">
                  <CheckCircle2 className="reality-check__item-icon reality-check__item-icon--approach" aria-hidden="true" />
                  <span>Sub-second load times engineered with zero bloat and clean, production-grade code.</span>
                </li>
                <li className="reality-check__list-item">
                  <CheckCircle2 className="reality-check__item-icon reality-check__item-icon--approach" aria-hidden="true" />
                  <span>Bespoke visual identity tailored strictly to your market position and high-value buyers.</span>
                </li>
                <li className="reality-check__list-item">
                  <CheckCircle2 className="reality-check__item-icon reality-check__item-icon--approach" aria-hidden="true" />
                  <span>Frictionless conversion funnels designed to turn interested visitors into qualified inquiries.</span>
                </li>
                <li className="reality-check__list-item">
                  <CheckCircle2 className="reality-check__item-icon reality-check__item-icon--approach" aria-hidden="true" />
                  <span>Direct founder craftsmanship: no messy plugin stacks, fragile themes, or middleman handoffs.</span>
                </li>
              </ul>
            </div>

            <div className="reality-check__card-footer">
              <span className="reality-check__metric">Result: An authoritative digital flagship that commands premium rates.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
