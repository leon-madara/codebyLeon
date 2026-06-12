import { useRef, type ComponentType } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  CircleCheck,
  Eye,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroImage from '../assets/horizontal-scroll/07-refresh-process.png';
import listenImage from '../assets/horizontal-scroll/02-launch-plan.png';
import directionImage from '../assets/horizontal-scroll/06-refresh-strategy.png';
import visibleImage from '../assets/horizontal-scroll/08-refresh-transformation.png';
import buildImage from '../assets/horizontal-scroll/11-ongoing-workflow.png';
import launchImage from '../assets/horizontal-scroll/12-ongoing-success.png';
import journeyPath from '../assets/process/process-journey-path.png';

gsap.registerPlugin(ScrollTrigger);

type PromiseItem = {
  title: string;
  Icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  tone: 'violet' | 'coral' | 'blue';
};

type JourneyStage = {
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  side: 'left' | 'right';
  tone: 'violet' | 'coral';
};

type RoleColumn = {
  title: string;
  tone: 'violet' | 'coral';
  items: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

const promises: PromiseItem[] = [
  {
    title: 'You always know what is happening',
    Icon: Eye,
    tone: 'violet',
  },
  {
    title: 'You approve before I build',
    Icon: CircleCheck,
    tone: 'coral',
  },
  {
    title: 'You leave with a site you can own',
    Icon: Sparkles,
    tone: 'blue',
  },
];

const journeyStages: JourneyStage[] = [
  {
    number: '1',
    title: 'Listen together',
    description:
      'We start with a relaxed conversation about your brand, your goals, and the people you serve. I ask the right questions and really listen.',
    image: listenImage,
    imageAlt: 'Website planning sketches beside a laptop during discovery',
    side: 'right',
    tone: 'violet',
  },
  {
    number: '2',
    title: 'Set the direction',
    description:
      'I translate our conversation into a clear plan, structure and visuals you can react to. We align on priorities and the path forward.',
    image: directionImage,
    imageAlt: 'A designer arranging website concepts on a visual planning wall',
    side: 'left',
    tone: 'coral',
  },
  {
    number: '3',
    title: 'Make it visible',
    description:
      'You see your site take shape early with layouts and real content. You give feedback, we refine, and the vision becomes real.',
    image: visibleImage,
    imageAlt: 'A collaborative website preview being reviewed on a laptop',
    side: 'right',
    tone: 'violet',
  },
  {
    number: '4',
    title: 'Build in the open',
    description:
      'I build everything on a live link, so you can see progress in real time. No black boxes, just steady, transparent momentum.',
    image: buildImage,
    imageAlt: 'Website code being developed beside a design preview',
    side: 'left',
    tone: 'coral',
  },
  {
    number: '5',
    title: 'Launch with support',
    description:
      'We launch when you are confident. You get a clear handover, guidance where needed, and two weeks of included support.',
    image: launchImage,
    imageAlt: 'A client and designer reviewing a successful website launch',
    side: 'right',
    tone: 'violet',
  },
];

const roles: RoleColumn[] = [
  {
    title: 'Your role',
    tone: 'violet',
    items: [
      'Share your goals, content and feedback',
      'Review and approve key milestones',
      'Ask questions and tell me what you think',
      'Stay in the loop, without the overwhelm',
    ],
  },
  {
    title: 'My role',
    tone: 'coral',
    items: [
      'Guide the process and protect your time',
      'Design and build a site that performs',
      'Keep you updated with clarity and honesty',
      'Deliver a site you can manage with confidence',
    ],
  },
];

const faqs: FaqItem[] = [
  {
    question: 'How involved do I need to be?',
    answer:
      'Your involvement is focused around context, approvals, and planned feedback. You stay close to the decisions without having to manage the technical work.',
  },
  {
    question: 'How long does the process take?',
    answer:
      'Timing depends on scope, content readiness, and feedback speed. Your quote and roadmap will name the working timeline before production begins.',
  },
  {
    question: 'Will I be able to update my site?',
    answer:
      'Yes. The handover covers the parts of the site you will manage, and you receive guidance so routine updates do not feel intimidating.',
  },
  {
    question: "What if I'm not sure what I want yet?",
    answer:
      'That is normal. Discovery is designed to turn a loose idea into a clear first version before you commit to detailed design or build decisions.',
  },
];

export function ProcessPage() {
  const pageRef = useRef<HTMLElement>(null);
  const pathRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (prefersReducedMotion) {
      gsap.set(
        '.process-page__hero-copy > *, .process-page__hero-media, .process-page__promise-item, .process-page__journey-step, .process-page__roles, .process-page__faq, .process-page__closing',
        { clearProps: 'all' },
      );
      return;
    }

    gsap.fromTo(
      '.process-page__hero-copy > *',
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      },
    );

    gsap.fromTo(
      '.process-page__hero-media',
      { x: 36, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    );

    gsap.fromTo(
      '.process-page__underline',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.process-page',
          start: 'top 78%',
        },
      },
    );

    gsap.utils
      .toArray<HTMLElement>(
        '.process-page__promise-item, .process-page__journey-step, .process-page__roles, .process-page__faq, .process-page__closing',
      )
      .forEach((element) => {
        gsap.fromTo(
          element,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 86%',
            },
          },
        );
      });

    if (pathRef.current) {
      gsap.fromTo(
        pathRef.current,
        { clipPath: 'inset(0 0 100% 0)' },
        {
          clipPath: 'inset(0 0 0% 0)',
          ease: 'none',
          scrollTrigger: {
            trigger: '.process-page__journey-list',
            start: 'top 68%',
            end: 'bottom 72%',
            scrub: true,
          },
        },
      );
    }
  }, { scope: pageRef });

  return (
    <main ref={pageRef} className="process-page">
      <section className="process-page__hero" aria-labelledby="process-title">
        <div className="process-page__hero-copy">
          <p className="process-page__eyebrow">A clearer way to build</p>
          <h1
            id="process-title"
            className="process-page__hero-title"
            aria-label="You bring the ambition. I'll keep the work clear."
          >
            You bring the ambition.
            <br />
            I&apos;ll keep the{' '}
            <span className="process-page__underlined">
              work clear.
              <span className="process-page__underline" aria-hidden="true" />
            </span>
          </h1>
          <p className="process-page__hero-lead">
            You stay close to the decisions without having to manage the technical details.
          </p>
          <div className="process-page__hero-actions" aria-label="Process page actions">
            <a className="button button--primary process-page__action" href="/get-started.html">
              Build Your Quote
            </a>
            <a className="button button--secondary process-page__action" href="#process-journey">
              Meet the Process
              <ArrowRight className="process-page__action-icon" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="process-page__hero-media">
          <img
            className="process-page__hero-image"
            src={heroImage}
            alt="Designer planning a website beside a laptop and notebook"
          />
        </div>
      </section>

      <section className="process-page__promises" aria-labelledby="process-promises-title">
        <h2 id="process-promises-title" className="process-page__section-title process-page__section-title--center">
          Here&apos;s the{' '}
          <span className="process-page__underlined">
            promise
            <span className="process-page__underline" aria-hidden="true" />
          </span>
        </h2>
        <div className="process-page__promise-list">
          {promises.map(({ Icon, ...item }) => (
            <article
              className={`process-page__promise-item process-page__promise-item--${item.tone}`}
              key={item.title}
            >
              <Icon className="process-page__promise-icon" aria-hidden="true" />
              <h3 className="process-page__promise-title">{item.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section
        id="process-journey"
        className="process-page__journey"
        aria-labelledby="process-journey-title"
      >
        <div className="process-page__journey-heading">
          <h2
            id="process-journey-title"
            className="process-page__section-title"
            aria-label="Our 5-step journey, together"
          >
            Our 5-step
            <br />
            journey,{' '}
            <span className="process-page__underlined">
              together
              <span className="process-page__underline" aria-hidden="true" />
            </span>
          </h2>
        </div>

        <ol className="process-page__journey-list" aria-label="Five-step website journey">
          <img
            ref={pathRef}
            className="process-page__journey-path"
            src={journeyPath}
            alt=""
            aria-hidden="true"
          />
          {journeyStages.map((stage) => (
            <li
              className={`process-page__journey-step process-page__journey-step--${stage.side}`}
              key={stage.number}
            >
              <img
                className="process-page__journey-image"
                src={stage.image}
                alt={stage.imageAlt}
                loading="lazy"
              />
              <div className={`process-page__journey-marker process-page__journey-marker--${stage.tone}`}>
                {stage.number}
              </div>
              <div className="process-page__journey-copy">
                <h3 className="process-page__journey-title">{stage.title}</h3>
                <p className="process-page__journey-description">{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="process-page__roles" aria-labelledby="process-roles-title">
        <h2 id="process-roles-title" className="process-page__section-title process-page__section-title--center">
          Clear roles.{' '}
          <span className="process-page__underlined">
            Strong results.
            <span className="process-page__underline" aria-hidden="true" />
          </span>
        </h2>
        <div className="process-page__role-grid">
          {roles.map((role) => (
            <article
              className={`process-page__role process-page__role--${role.tone}`}
              key={role.title}
            >
              <div className="process-page__role-heading">
                <UserRound className="process-page__role-icon" aria-hidden="true" />
                <h3>{role.title}</h3>
              </div>
              <ul className="process-page__role-list">
                {role.items.map((item) => (
                  <li key={item}>
                    <Check className="process-page__role-check" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="process-page__faq" aria-labelledby="process-faq-title">
        <h2 id="process-faq-title" className="process-page__section-title process-page__section-title--center">
          Common{' '}
          <span className="process-page__underlined">
            questions
            <span className="process-page__underline" aria-hidden="true" />
          </span>
        </h2>
        <div className="process-page__faq-list">
          {faqs.map((item) => (
            <details className="process-page__faq-item" key={item.question}>
              <summary className="process-page__faq-question">
                <span className="process-page__faq-mark" aria-hidden="true">?</span>
                <span>{item.question}</span>
                <ChevronDown className="process-page__faq-chevron" aria-hidden="true" />
              </summary>
              <p className="process-page__faq-answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="process-page__closing" aria-labelledby="process-closing-title">
        <h2
          id="process-closing-title"
          className="process-page__closing-title"
          aria-label="Let's build something you'll be proud of."
        >
          Let&apos;s build something
          <br />
          you&apos;ll be{' '}
          <span className="process-page__underlined">
            proud of.
            <span className="process-page__underline" aria-hidden="true" />
          </span>
        </h2>
        <div className="process-page__closing-content">
          <p className="process-page__closing-copy">
            A collaborative process.
            <br />
            A website that works.
            <br />
            A partner who&apos;s in your corner.
          </p>
          <div className="process-page__closing-actions">
            <a className="button button--primary process-page__action" href="/get-started.html">
              Build Your Quote
            </a>
            <a className="button button--secondary process-page__action" href="/#final-cta">
              Let&apos;s Talk
              <ArrowRight className="process-page__action-icon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
