import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CardChip = {
  label: string;
  title: string;
  detail: string;
  metric: string;
  toneClass: string;
};

type CardTestimonial = {
  quote: string;
  name: string;
  role: string;
};

type AboutStackCard = {
  number: string;
  badge: string;
  title: string;
  description: string;
  testimonial: CardTestimonial;
  themeClass: string;
  chips: CardChip[];
};

const CARD_STACK_SCALE_STEP = 0.04;
const CARD_STACK_BRIGHTNESS_STEP = 0.18;
const INITIAL_CARD_DWELL_VH = 90;
const CARD_EXIT_DURATION_VH = 55;
const CARD_DWELL_DURATION_VH = 130;
const CARD_TRANSITION_COUNT = 2;
const FINAL_SCENE_EXIT_DURATION_VH = 0;
const POST_EXIT_HOLD_VH = 20;
const STACK_SCRUB = 1.5;
const CARD_LAYER_CLASSES = [
  "about-3d-stack__card--layer-3",
  "about-3d-stack__card--layer-2",
  "about-3d-stack__card--layer-1",
] as const;

export function getAboutStackMotionPlan() {
  const cardExitStartsVh = Array.from(
    { length: CARD_TRANSITION_COUNT },
    (_, index) =>
      INITIAL_CARD_DWELL_VH +
      index * (CARD_EXIT_DURATION_VH + CARD_DWELL_DURATION_VH),
  );
  const finalSceneExitStartVh =
    INITIAL_CARD_DWELL_VH +
    CARD_TRANSITION_COUNT * (CARD_EXIT_DURATION_VH + CARD_DWELL_DURATION_VH);
  const animationCompleteVh = finalSceneExitStartVh + FINAL_SCENE_EXIT_DURATION_VH;

  return {
    cardExitStartsVh,
    finalCardDwellVh: CARD_DWELL_DURATION_VH,
    finalSceneExitStartVh,
    animationCompleteVh,
    totalDurationVh: animationCompleteVh + POST_EXIT_HOLD_VH,
  };
}

export function getAboutStackPinDistance(viewportHeight: number) {
  return viewportHeight * (getAboutStackMotionPlan().totalDurationVh / 100);
}

export function getAboutStackLayerOffset(_layerIndex: number) {
  return 0;
}

const CARDS: AboutStackCard[] = [
  {
    number: "01",
    badge: "Brand Positioning",
    title: "Branding that drives conversion & funding.",
    description:
      "We clarify positioning, define tone of voice, and build visual systems that work across acquisition and product. Each sprint ships a robust logo, pragmatic brand guidelines, and a social kit so you can launch fast. The goal is simple: perceived value up.",
    testimonial: {
      quote: "Best investment we've made for our brand identity.",
      name: "Jeremy Bendayan",
      role: "COO @Jaws Group",
    },
    themeClass: "about-3d-stack__card--indigo",
    chips: [
      {
        label: "Audit",
        title: "Revenue Leak Audit",
        detail: "Find and fix trust gaps that block buyers from requesting a quote.",
        metric: "More qualified leads",
        toneClass: "about-3d-stack__chip--green",
      },
      {
        label: "Voice",
        title: "Offer Messaging",
        detail: "Sharper value proposition and CTA copy that pushes visitors to act.",
        metric: "Higher response rate",
        toneClass: "about-3d-stack__chip--yellow",
      },
      {
        label: "Visual",
        title: "Trust-Building UI",
        detail: "Premium visual hierarchy that makes your pricing feel worth paying.",
        metric: "Raise perceived value",
        toneClass: "about-3d-stack__chip--amber",
      },
      {
        label: "Assets",
        title: "Sales Asset Pack",
        detail: "Launch-ready campaign visuals and CTA blocks for fast demand capture.",
        metric: "Campaign-ready in days",
        toneClass: "about-3d-stack__chip--maroon",
      },
    ],
  },
  {
    number: "02",
    badge: "UX Systems",
    title: "Product experiences users adopt & keep using.",
    description:
      "Map critical journeys and prototype what moves the needle. We validate assumptions fast so your team ships features that stick, reduce churn, and convert free users to paying customers. Shipping is a feature.",
    testimonial: {
      quote: "Transformed our onboarding - activation up 40%.",
      name: "Theo Cesarini",
      role: "CEO @Incard",
    },
    themeClass: "about-3d-stack__card--orange",
    chips: [
      {
        label: "Map",
        title: "Buyer Journey Map",
        detail: "Engineer the path from first click to booked call and paid project.",
        metric: "More booked calls",
        toneClass: "about-3d-stack__chip--cream",
      },
      {
        label: "Flow",
        title: "Conversion Wireframes",
        detail: "Design forms and flows that remove friction at every decision point.",
        metric: "Lower drop-off",
        toneClass: "about-3d-stack__chip--orange-soft",
      },
      {
        label: "Test",
        title: "Offer A/B Tests",
        detail: "Validate headlines, pricing anchors, and CTAs before full rollout.",
        metric: "Win rate up",
        toneClass: "about-3d-stack__chip--orange-strong",
      },
      {
        label: "Ship",
        title: "Sprint Release",
        detail: "Ship production-ready screens fast so you can start selling this week.",
        metric: "Revenue faster",
        toneClass: "about-3d-stack__chip--brick",
      },
    ],
  },
  {
    number: "03",
    badge: "Growth Websites",
    title: "Web Design for growing teams & business.",
    description:
      "Align messaging, page architecture, and UI for clear structure. We build sites that load fast, convert visitors, and scale as your business grows - no bloat, no technical debt. Launch in weeks, not months.",
    testimonial: {
      quote: "Our conversion rate doubled in the first month.",
      name: "Alexis Botaya",
      role: "MD @Sound Experience",
    },
    themeClass: "about-3d-stack__card--crimson",
    chips: [
      {
        label: "SEO",
        title: "Local Search Capture",
        detail: "Rank for high-intent local terms that bring ready-to-buy visitors.",
        metric: "More inbound leads",
        toneClass: "about-3d-stack__chip--rose-light",
      },
      {
        label: "CRO",
        title: "Lead Conversion UX",
        detail: "Turn casual visits into serious inquiries with stronger offer pages.",
        metric: "Inquiry rate up",
        toneClass: "about-3d-stack__chip--rose-mid",
      },
      {
        label: "Perf",
        title: "Speed for Sales",
        detail: "Faster load times reduce bounce and keep buyers inside your funnel.",
        metric: "< 2s helps CVR",
        toneClass: "about-3d-stack__chip--rose-strong",
      },
      {
        label: "UI",
        title: "Trust-First Polish",
        detail: "Premium interactions that justify pricing and reduce buyer hesitation.",
        metric: "Higher close rate",
        toneClass: "about-3d-stack__chip--rose-dark",
      },
    ],
  },
];

function MockupChip({ chip }: { chip: CardChip }) {
  const handleToggleFlip = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.currentTarget.classList.toggle("is-flipped");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggleFlip(e);
    }
  };

  return (
    <article
      className={`about-3d-stack__chip ${chip.toneClass}`.trim()}
      tabIndex={0}
      onClick={handleToggleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label={`${chip.title} outcome details`}
    >
      <div className="about-3d-stack__chip-inner pointer-events-none">
        <div className="about-3d-stack__chip-face about-3d-stack__chip-face--front">
          <p className="about-3d-stack__chip-eyebrow">{chip.label}</p>
          <h3 className="about-3d-stack__chip-title">{chip.title}</h3>
          <span className="about-3d-stack__chip-metric">{chip.metric}</span>
        </div>

        <div className="about-3d-stack__chip-face about-3d-stack__chip-face--back">
          <p className="about-3d-stack__chip-eyebrow">Outcome</p>
          <p className="about-3d-stack__chip-detail">{chip.detail}</p>
          <span className="about-3d-stack__chip-metric">{chip.metric}</span>
        </div>
      </div>
    </article>
  );
}

export function About3DStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;
    const motionPlan = getAboutStackMotionPlan();

    const mm = gsap.matchMedia();

    // Desktop pinned 3D stack (min-width: 900px)
    mm.add("(min-width: 900px)", () => {
      cards.forEach((card, i) => {
        if (!card) return;
        gsap.set(card, {
          y: getAboutStackLayerOffset(i),
          scale: 1 - i * CARD_STACK_SCALE_STEP,
          filter: `brightness(${1 - i * CARD_STACK_BRIGHTNESS_STEP})`,
          rotationX: 0,
          rotationZ: 0,
          opacity: 1,
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getAboutStackPinDistance(window.innerHeight)}`,
          pin: true,
          pinSpacing: true,
          scrub: STACK_SCRUB,
          pinType: "transform",
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < CARDS.length - 1; i++) {
        const card = cards[i] as HTMLDivElement;
        const belowCards = cards.slice(i + 1) as HTMLDivElement[];
        const beatStartVh = motionPlan.cardExitStartsVh[i];

        tl.to(
          card,
          {
            y: "-120vh",
            rotationX: 12,
            rotationZ: -4,
            opacity: 0,
            scale: 0.94,
            duration: CARD_EXIT_DURATION_VH,
            ease: "none",
            force3D: true,
          },
          beatStartVh
        );

        belowCards.forEach((belowCard, j) => {
          tl.to(
            belowCard,
            {
              y: getAboutStackLayerOffset(j),
              scale: 1 - j * CARD_STACK_SCALE_STEP,
              filter: `brightness(${1 - j * CARD_STACK_BRIGHTNESS_STEP})`,
              rotationX: 0,
              rotationZ: 0,
              duration: CARD_EXIT_DURATION_VH,
              ease: "none",
              force3D: true,
            },
            beatStartVh
          );
        });

        tl.to({}, { duration: CARD_DWELL_DURATION_VH }, beatStartVh + CARD_EXIT_DURATION_VH);
      }

      tl.to(
        {},
        { duration: POST_EXIT_HOLD_VH },
        motionPlan.animationCompleteVh,
      );
    });

    // Mobile natural scrolling column with standard reveals (max-width: 899px)
    mm.add("(max-width: 899px)", () => {
      cards.forEach((card) => {
        if (!card) return;
        gsap.set(card, {
          clearProps: "all",
        });
      });

      cards.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();

    return () => {
      mm.revert();
    };
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about about-3d-stack relative overflow-hidden h-screen"
    >
      <div className="about__orbs absolute inset-0 pointer-events-none">
        <div className="about__overlay--3d absolute inset-0" />
      </div>

      <div
        ref={contentRef}
        className="about-3d-stack__content-layer relative flex flex-col items-center h-full"
      >
        <header className="text-center pt-[4vh] px-6 w-full max-w-4xl mx-auto flex-shrink-0">
          <h1 className="about-3d-stack__headline">
            Helping Kenyan Businesses{" "}
            <em>Look Professional Online</em>
          </h1>
          <p className="about-3d-stack__subheadline">
            I design websites and visuals that help Kenyan businesses look
            professional, get more inquiries, and build trust online.
          </p>
        </header>

        <div className="about-3d-stack__stack">
          {CARDS.map((card, i) => (
            <article
              key={card.number}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`about-3d-stack__card ${card.themeClass} ${CARD_LAYER_CLASSES[i] ?? ""}`.trim()}
            >
              <div className="about-3d-stack__card-bg" />
              <div className="about__card-gloss" />

              <div className="about-3d-stack__card-content">
                <div className="about-3d-stack__card-main">
                  <div className="about-3d-stack__card-meta">
                    <span className="about-3d-stack__card-number">({card.number})</span>
                    <span className="about-3d-stack__card-badge">{card.badge}</span>
                  </div>

                  <h2 className="about-3d-stack__card-title">{card.title}</h2>
                  <p className="about-3d-stack__card-description">{card.description}</p>

                  <div className="about-3d-stack__testimonial">
                    <p className="about-3d-stack__testimonial-quote">"{card.testimonial.quote}"</p>
                    <div className="about-3d-stack__testimonial-author">
                      <div className="about-3d-stack__testimonial-avatar">
                        {card.testimonial.name[0]}
                      </div>
                      <span className="about-3d-stack__testimonial-name">
                        {card.testimonial.name}
                        <span className="about-3d-stack__testimonial-role">
                          {" "}
                          | {card.testimonial.role}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="about-3d-stack__chip-track">
                  {card.chips.map((chip) => (
                    <MockupChip key={chip.label} chip={chip} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
