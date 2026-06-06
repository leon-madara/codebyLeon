import { Link } from 'react-router-dom';
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
import { SITE_NAME, SITE_URL, usePageSeo } from '../utils/seo';

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

export function LegitLogisticsCaseStudyPage() {
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

  return (
    <main className="case-study">
      <section className="case-study__hero" aria-labelledby="legit-logistics-title">
        <div className="case-study__hero-inner">
          <div className="case-study__hero-copy">
            <Link to="/#portfolio" className="case-study__back-link">
              Back to Our Work
            </Link>
            <p className="case-study__eyebrow">Legit Logistics case study</p>
            <h1 id="legit-logistics-title" className="case-study__title">
              Delivery Operations Automation Platform
            </h1>
            <p className="case-study__lead">
              A custom logistics system built to reduce manual coordination across dispatch, driver updates, proof
              collection, and customer tracking.
            </p>
            <div className="case-study__hero-actions" aria-label="Case study actions">
              <a href="/get-started.html" className="case-study__button case-study__button--primary">
                Automate My Workflow
                <ArrowRight aria-hidden="true" />
              </a>
              <a href="#systems" className="case-study__button case-study__button--secondary">
                See The Three Systems
              </a>
            </div>
          </div>

          <figure className="case-study__hero-media">
            <img
              src="/portfolio-legit.png"
              alt="Legit Logistics platform preview"
              className="case-study__hero-image"
            />
            <figcaption className="case-study__media-caption">
              Dispatch, driver actions, and public tracking brought into one connected workflow.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="case-study__section case-study__section--intro" aria-labelledby="problem-solution-title">
        <div className="case-study__split">
          <div>
            <p className="case-study__section-kicker">The business problem</p>
            <h2 id="problem-solution-title" className="case-study__section-title">
              Logistics work can get buried in calls, texts, and spreadsheets.
            </h2>
          </div>
          <div className="case-study__intro-copy">
            <p>
              Delivery teams need to know what is pending, what is moving, who is handling it, and what the customer
              can see. When those updates are manual, dispatch slows down and customers keep asking for status.
            </p>
            <p>
              Legit Logistics demonstrates the kind of software I build for clients: systems that turn repeated
              operational steps into clear, trackable workflows.
            </p>
          </div>
        </div>
      </section>

      <section id="systems" className="case-study__section" aria-labelledby="systems-title">
        <div className="case-study__section-heading">
          <p className="case-study__section-kicker">Three connected pages</p>
          <h2 id="systems-title" className="case-study__section-title">
            One platform, three users, less manual follow-up.
          </h2>
        </div>

        <div className="case-study__article-stack">
          {workflowPillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <article className="case-study__article-panel" key={pillar.title}>
                <aside className="case-study__article-rail" aria-hidden="true">
                  <span className="case-study__article-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="case-study__article-icon">
                    <Icon />
                  </span>
                </aside>

                <div className="case-study__article-content">
                  <div className="case-study__article-meta">
                    <span className="case-study__article-tag">{pillar.label}</span>
                    <span className="case-study__article-dot" aria-hidden="true" />
                    <span>System {index + 1} of 3</span>
                  </div>
                  <h3 className="case-study__article-title">{pillar.title}</h3>
                  <div className="case-study__article-proofline">
                    <span className="case-study__article-avatar" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <p className="case-study__article-proofline-title">{pillar.audience}</p>
                      <p className="case-study__article-proofline-copy">{pillar.outcome}</p>
                    </div>
                  </div>
                  <p className="case-study__article-lede">{pillar.description}</p>
                  <div className="case-study__article-body">
                    <h4 className="case-study__article-subhead">What clients can see in this build</h4>
                    <ul className="case-study__proof-list case-study__proof-list--article" aria-label={`${pillar.title} capabilities`}>
                      {pillar.proof.map((item) => (
                        <li key={item}>
                          <CheckCircle2 aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="case-study__section case-study__section--automation" aria-labelledby="automation-title">
        <div className="case-study__section-heading">
          <p className="case-study__section-kicker">What the software automates</p>
          <h2 id="automation-title" className="case-study__section-title">
            The value is not just the interface. It is the time saved between people.
          </h2>
        </div>

        <div className="case-study__automation-list">
          {automationMap.map((item, index) => (
            <article className="case-study__automation-row" key={item.manual}>
              <div className="case-study__automation-number">{String(index + 1).padStart(2, '0')}</div>
              <div>
                <p className="case-study__automation-label">Manual pattern</p>
                <p className="case-study__automation-copy">{item.manual}</p>
              </div>
              <Route className="case-study__automation-icon" aria-hidden="true" />
              <div>
                <p className="case-study__automation-label">Software replacement</p>
                <p className="case-study__automation-copy">{item.software}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-study__section" aria-labelledby="capabilities-title">
        <div className="case-study__section-heading">
          <p className="case-study__section-kicker">Skills demonstrated</p>
          <h2 id="capabilities-title" className="case-study__section-title">
            The same skills a growing business needs for custom software.
          </h2>
        </div>

        <div className="case-study__capability-grid">
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

        <div className="case-study__stack" aria-label="Technology stack">
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
      </section>

      <section className="case-study__cta" aria-labelledby="case-study-cta-title">
        <div className="case-study__cta-inner">
          <Clock aria-hidden="true" />
          <h2 id="case-study-cta-title">Have a workflow that wastes time every week?</h2>
          <p>
            I can help map the repeated steps, design the right screens, and build software that makes the work easier
            to run.
          </p>
          <a href="/get-started.html" className="case-study__button case-study__button--primary">
            Start With My Workflow
            <ClipboardList aria-hidden="true" />
          </a>
        </div>
      </section>
    </main>
  );
}

export default LegitLogisticsCaseStudyPage;
