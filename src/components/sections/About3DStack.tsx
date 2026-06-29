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
      "Positioning, narrative, messaging, and visual identity that make you look established, trustworthy, and investor-ready from day one.",
    testimonial: {
      quote: "Leon turned our rough idea into a brand that investors took seriously instantly.",
      name: "Kossy Langat",
      role: "Founder, Editorial Studio",
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
    badge: "Product Showcase",
    title: "Product design that sells without talking.",
    description:
      "We design interactive product walkthroughs, feature showcases, and dashboard UI that turn curious visitors into paying clients.",
    testimonial: {
      quote: "The product preview alone closed three enterprise retainers before our full launch.",
      name: "Daniel Njuguna",
      role: "Head of Growth, Delivah",
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
    badge: "Growth Engine",
    title: "Websites built for recurring revenue.",
    description:
      "Data-driven landing pages, scalable CMS structures, and automated lead capture pipelines engineered for long-term business scale.",
    testimonial: {
      quote: "CodeByLeon delivered an engine that consistently generates qualified inbound leads every week.",
      name: "Mercy Wanjiku",
      role: "Operations Lead, Legit Logistics",
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

function MobileOutcomeLine({ chip, index }: { chip: CardChip; index: number }) {
  return (
    <article className={`about-3d-stack__mobile-line ${chip.toneClass}`.trim()}>
      <span className="about-3d-stack__mobile-line-index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="about-3d-stack__mobile-line-copy">
        <p className="about-3d-stack__mobile-line-label">{chip.label}</p>
        <h3 className="about-3d-stack__mobile-line-title">{chip.title}</h3>
        <p className="about-3d-stack__mobile-line-detail">{chip.detail}</p>
      </div>
      <span className="about-3d-stack__mobile-line-metric">{chip.metric}</span>
    </article>
  );
}

export function About3DStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileRootRef = useRef<HTMLDivElement>(null);
  const mobileIntroRef = useRef<HTMLElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const mobilePanelRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean);
    const mobilePanels = mobilePanelRefs.current.filter(Boolean);
    const motionPlan = getAboutStackMotionPlan();

    const mm = gsap.matchMedia();

    // Desktop pinned 3D stack (min-width: 900px)
    mm.add("(min-width: 900px)", () => {
      if (cards.length === 0) return;

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

    // Mobile card-deck scroll story (max-width: 899px)
    mm.add("(max-width: 899px)", () => {
      const mobileRoot = mobileRootRef.current;
      const mobileIntro = mobileIntroRef.current;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      cards.forEach((card) => {
        if (!card) return;
        gsap.set(card, {
          clearProps: "all",
        });
      });

      if (!mobileRoot || !mobileIntro || mobilePanels.length === 0) return;

      if (reduceMotion) {
        gsap.set([mobileIntro, ...mobilePanels], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.set(mobileIntro, {
        zIndex: mobilePanels.length + 5,
        y: "0svh",
        autoAlpha: 1,
        force3D: true,
      });

      gsap.set(mobileIntro.querySelectorAll(".about-3d-stack__mobile-reveal"), {
        y: 0,
        autoAlpha: 1,
      });

      mobilePanels.forEach((panel, index) => {
        const depth = Math.min(index, 2);

        gsap.set(panel, {
          zIndex: mobilePanels.length - index,
          y: `${10 + depth * 6}svh`,
          scale: 0.86 - depth * 0.06,
          rotationX: -7,
          autoAlpha: index === 0 ? 0.64 : index === 1 ? 0.38 : 0,
          transformOrigin: "50% 76%",
          force3D: true,
        });
      });

      const mobileTl = gsap.timeline({ paused: true });

      mobileTl.to(
        mobileIntro,
        {
          y: "-105svh",
          autoAlpha: 0,
          duration: 0.82,
          ease: "none",
          force3D: true,
        },
        0,
      );

      mobileTl.to(
        mobilePanels[0],
        {
          y: "0svh",
          rotationX: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.82,
          ease: "none",
          force3D: true,
        },
        0,
      );

      if (mobilePanels[1]) {
        mobileTl.to(
          mobilePanels[1],
          {
            y: "11svh",
            rotationX: -7,
            scale: 0.84,
            autoAlpha: 0.56,
            duration: 0.82,
            ease: "none",
            force3D: true,
          },
          0,
        );
      }

      mobileTl.to({}, { duration: 0.35 }, 0.82);

      for (let i = 0; i < mobilePanels.length - 1; i++) {
        const current = mobilePanels[i];
        const next = mobilePanels[i + 1];
        const following = mobilePanels[i + 2];
        const beatStart = 1.17 + i * 1.17;

        if (!current || !next) continue;

        mobileTl.to(
          current,
          {
            y: "-105svh",
            rotationX: 9,
            autoAlpha: 0,
            duration: 0.78,
            ease: "none",
            force3D: true,
          },
          beatStart,
        );

        mobileTl.to(
          next,
          {
            y: "0svh",
            rotationX: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.78,
            ease: "none",
            force3D: true,
          },
          beatStart,
        );

        if (following) {
          mobileTl.to(
            following,
            {
              y: "11svh",
              rotationX: -7,
              scale: 0.84,
              autoAlpha: 0.56,
              duration: 0.78,
              ease: "none",
              force3D: true,
            },
            beatStart,
          );
        }

        mobileTl.to({}, { duration: 0.39 }, beatStart + 0.78);
      }

      const clampMobileProgress = gsap.utils.clamp(0, 1);
      const getMobileScrollDistance = () => window.innerHeight * (mobilePanels.length + 0.9);
      const syncMobileProgress = () => {
        const rect = section.getBoundingClientRect();
        mobileTl.progress(clampMobileProgress(-rect.top / getMobileScrollDistance()));
      };
      const mobileProgressTrigger = ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        invalidateOnRefresh: true,
        onUpdate: syncMobileProgress,
        onRefresh: syncMobileProgress,
      });

      syncMobileProgress();

      return () => {
        mobileProgressTrigger.kill();
        mobileTl.kill();
      };
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
      className="about about-3d-stack"
    >
      <div
        ref={contentRef}
        className="about-3d-stack__desktop about-3d-stack__content-layer relative flex flex-col items-center h-full"
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

      <div
        ref={mobileRootRef}
        className="about-3d-stack__mobile"
        aria-label="Helping Kenyan businesses mobile story"
      >
        <section ref={mobileIntroRef} className="about-3d-stack__mobile-intro">
          <div className="about-3d-stack__mobile-intro-content">
            <p className="about-3d-stack__mobile-kicker about-3d-stack__mobile-reveal">
              What this section shows
            </p>
            <h1 className="about-3d-stack__mobile-headline about-3d-stack__mobile-reveal">
              Helping Kenyan Businesses <em>Look Professional Online</em>
            </h1>
            <p className="about-3d-stack__mobile-subheadline about-3d-stack__mobile-reveal">
              A quick walk through the three layers that make a business look credible,
              easier to trust, and ready for better inquiries.
            </p>

            <div className="about-3d-stack__mobile-rule-pack about-3d-stack__mobile-reveal" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="about-3d-stack__mobile-chapters about-3d-stack__mobile-reveal">
              {CARDS.map((card) => (
                <div key={card.number} className="about-3d-stack__mobile-chapter">
                  <span>{card.number}</span>
                  <p>{card.badge}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div ref={mobileStageRef} className="about-3d-stack__mobile-stage">
          <div className="about-3d-stack__mobile-stage-pin">
            {CARDS.map((card, cardIndex) => (
              <article
                key={`mobile-${card.number}`}
                ref={(el) => {
                  mobilePanelRefs.current[cardIndex] = el;
                }}
                className={`about-3d-stack__mobile-panel ${card.themeClass}`.trim()}
              >
                <div className="about-3d-stack__mobile-panel-gloss" />
                <header className="about-3d-stack__mobile-panel-header">
                  <div className="about-3d-stack__mobile-panel-meta">
                    <span>{card.number}</span>
                    <p>{card.badge}</p>
                  </div>
                  <h2 className="about-3d-stack__mobile-panel-title">{card.title}</h2>
                  <p className="about-3d-stack__mobile-panel-description">{card.description}</p>
                </header>

                <div className="about-3d-stack__mobile-lines">
                  {card.chips.map((chip, chipIndex) => (
                    <MobileOutcomeLine
                      key={chip.label}
                      chip={chip}
                      index={chipIndex}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
