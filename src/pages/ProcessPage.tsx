import { useRef } from 'react';
import { ArrowRight, ClipboardCheck, Code, Handshake, MessageSquare, PenTool, Rocket } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ProcessStep = {
  number: string;
  title: string;
  promise: string;
  clientRole: string;
  deliverable: string;
  removes: string;
  Icon: typeof MessageSquare;
};

type ProcessProof = {
  label: string;
  value: string;
};

type Objection = {
  question: string;
  answer: string;
};

const processProof: ProcessProof[] = [
  {
    label: 'Before pricing',
    value: 'You get a clear scope, not a vague estimate.',
  },
  {
    label: 'During build',
    value: 'You see private previews and plain-English updates.',
  },
  {
    label: 'After launch',
    value: 'You keep support while the site settles in real use.',
  },
];

const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Discovery call',
    promise: 'We turn the loose idea into a business problem worth solving.',
    clientRole: 'Share goals, audience, rough budget, and what is not working today.',
    deliverable: 'A written direction for scope, priorities, and next best step.',
    removes: 'The fear that you need to know all the technical answers before starting.',
    Icon: MessageSquare,
  },
  {
    number: '02',
    title: 'Quote and roadmap',
    promise: 'You see what is included, what is not, and how the work will move.',
    clientRole: 'Choose the package, timeline, and launch priorities that fit your situation.',
    deliverable: 'A quote, project roadmap, and decision points before production begins.',
    removes: 'The fear of hidden costs, open-ended timelines, or unclear ownership.',
    Icon: ClipboardCheck,
  },
  {
    number: '03',
    title: 'Design direction',
    promise: 'The visual direction is agreed before build work gets expensive.',
    clientRole: 'Review structure, tone, references, and key page decisions.',
    deliverable: 'Wireframes, creative direction, and approved content priorities.',
    removes: 'The fear that the site will look nice but miss the actual business goal.',
    Icon: PenTool,
  },
  {
    number: '04',
    title: 'Build and preview',
    promise: 'The site becomes real in visible, reviewable increments.',
    clientRole: 'Review private previews and give focused feedback at planned checkpoints.',
    deliverable: 'A responsive build with copy, interactions, performance, and core SEO in place.',
    removes: 'The fear that the project disappears into a black box until the deadline.',
    Icon: Code,
  },
  {
    number: '05',
    title: 'Launch and aftercare',
    promise: 'Launch is handled as a handoff, not a cliff edge.',
    clientRole: 'Approve final checks, confirm access, and send any launch-day notes.',
    deliverable: 'Live site, analytics basics, launch checklist, and two weeks of included tweaks.',
    removes: 'The fear of being left alone with a site you cannot confidently use.',
    Icon: Rocket,
  },
];

const objections: Objection[] = [
  {
    question: 'What if I do not know exactly what I need yet?',
    answer: 'That is normal. Discovery is designed to sort the idea, the business goal, and the useful first version before you commit to build decisions.',
  },
  {
    question: 'How much involvement will you need from me?',
    answer: 'You stay involved at the moments that matter: goals, approvals, feedback, and launch checks. The technical decisions are guided for you.',
  },
  {
    question: 'What happens after the site goes live?',
    answer: 'The first two weeks are for real-world adjustments, small fixes, and handoff support. Longer-term care can continue as a retainer if you need it.',
  },
];

export function ProcessPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      '.process-page__hero > *',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
    );

    if (railRef.current) {
      gsap.fromTo(
        railRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-page__steps',
            start: 'top 68%',
            end: 'bottom 78%',
            scrub: true,
          },
        },
      );
    }

    gsap.utils.toArray<HTMLElement>('.process-page__step').forEach((step) => {
      gsap.fromTo(
        step,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 84%',
          },
        },
      );
    });
  }, { scope: pageRef });

  return (
    <main ref={pageRef} className="process-page">
      <section className="process-page__hero" aria-labelledby="process-title">
        <p className="process-page__intro">Process</p>
        <h1 id="process-title" className="process-page__title">
          What happens after you choose Code by Leon?
        </h1>
        <p className="process-page__lead">
          A web project should not feel like handing your business to a stranger and hoping for the best.
          This page shows how the work moves from first conversation to launch with clear decisions,
          useful previews, and no guessing games.
        </p>
        <div className="process-page__actions" aria-label="Process page actions">
          <a className="button button--primary process-page__action" href="/get-started.html">
            Build Your Quote
            <ArrowRight className="process-page__action-icon" aria-hidden="true" />
          </a>
          <a className="button button--secondary process-page__action" href="#process-steps">
            See the five steps
          </a>
        </div>
      </section>

      <section className="process-page__proof" aria-label="How the process builds trust">
        {processProof.map((item) => (
          <article className="process-page__proof-item" key={item.label}>
            <h2 className="process-page__proof-label">{item.label}</h2>
            <p className="process-page__proof-value">{item.value}</p>
          </article>
        ))}
      </section>

      <section id="process-steps" className="process-page__steps" aria-labelledby="process-steps-title">
        <div className="process-page__section-header">
          <p className="process-page__intro">The roadmap</p>
          <h2 id="process-steps-title" className="process-page__section-title">
            Five steps that keep the project understandable.
          </h2>
          <p className="process-page__section-copy">
            Every phase has a client role, a deliverable, and one kind of uncertainty it is meant to remove.
          </p>
        </div>

        <div className="process-page__timeline">
          <div ref={railRef} className="process-page__rail" aria-hidden="true" />
          {processSteps.map(({ Icon, ...step }) => (
            <article className="process-page__step" key={step.number}>
              <div className="process-page__marker" aria-hidden="true">
                <Icon className="process-page__marker-icon" />
              </div>
              <div className="process-page__step-content">
                <div className="process-page__step-heading">
                  <span className="process-page__step-number">Step {step.number}</span>
                  <h3 className="process-page__step-title">{step.title}</h3>
                </div>
                <p className="process-page__step-promise">{step.promise}</p>
                <dl className="process-page__step-details">
                  <div className="process-page__detail">
                    <dt>You do</dt>
                    <dd>{step.clientRole}</dd>
                  </div>
                  <div className="process-page__detail">
                    <dt>You get</dt>
                    <dd>{step.deliverable}</dd>
                  </div>
                  <div className="process-page__detail">
                    <dt>This removes</dt>
                    <dd>{step.removes}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="process-page__objections" aria-labelledby="process-objections-title">
        <div className="process-page__section-header process-page__section-header--compact">
          <p className="process-page__intro">Common questions</p>
          <h2 id="process-objections-title" className="process-page__section-title">
            Built for clients who want clarity before commitment.
          </h2>
        </div>

        <div className="process-page__objection-list">
          {objections.map((item) => (
            <article className="process-page__objection" key={item.question}>
              <h3 className="process-page__objection-question">{item.question}</h3>
              <p className="process-page__objection-answer">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="process-page__cta" aria-labelledby="process-cta-title">
        <Handshake className="process-page__cta-icon" aria-hidden="true" />
        <h2 id="process-cta-title" className="process-page__cta-title">
          Start with a quote that matches the work.
        </h2>
        <p className="process-page__cta-copy">
          The quote builder helps shape the first conversation around your actual project instead of a generic contact form.
        </p>
        <a className="button button--primary process-page__action" href="/get-started.html">
          Build Your Quote
          <ArrowRight className="process-page__action-icon" aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
