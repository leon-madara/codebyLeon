import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Card data ────────────────────────────────────────────────────────────────
const CARDS = [
  {
    number: "01",
    title: "Branding that drives conversion & funding.",
    description:
      "We clarify positioning, define tone of voice, and build visual systems that work across acquisition and product. Each sprint ships a robust logo, pragmatic brand guidelines, and a social kit so you can launch fast. The goal is simple: perceived value up.",
    testimonial: {
      quote: "Best investment we've made for our brand identity.",
      name: "Jérémy Bendayan",
      role: "COO @Jaws Group",
    },
    bg: "linear-gradient(135deg, hsl(243,64%,36%) 0%, hsl(243,64%,26%) 100%)",
    accentColor: "hsl(243,64%,60%)",
    chips: [
      { label: "INN", color: "#b4f0a7", text: "#1a3312" },
      { label: "HOUSE", color: "#f5e642", text: "#2d2800" },
      { label: "VIO", color: "#ffd166", text: "#2d2000" },
      { label: "FOX", color: "#8b1a1a", text: "#ffd5d5" },
    ],
    shadow: "0 60px 120px -20px rgba(55,48,163,0.55)",
    chipBg: "rgba(255,255,255,0.06)",
  },
  {
    number: "02",
    title: "Product experiences users adopt & keep using.",
    description:
      "Map critical journeys and prototype what moves the needle. We validate assumptions fast so your team ships features that stick, reduce churn, and convert free users to paying customers. Shipping is a feature.",
    testimonial: {
      quote: "Transformed our onboarding — activation up 40%.",
      name: "Théo Cesarini",
      role: "CEO @Incard",
    },
    bg: "linear-gradient(135deg, hsl(22,95%,42%) 0%, hsl(22,95%,30%) 100%)",
    accentColor: "hsl(22,95%,65%)",
    chips: [
      { label: "UX", color: "#fff3e0", text: "#5a2d00" },
      { label: "FLOW", color: "#ffb347", text: "#3a1a00" },
      { label: "TEST", color: "#ff6b35", text: "#fff" },
      { label: "SHIP", color: "#c0392b", text: "#fff" },
    ],
    shadow: "0 60px 120px -20px rgba(234,88,12,0.55)",
    chipBg: "rgba(255,255,255,0.06)",
  },
  {
    number: "03",
    title: "Web Design for growing teams & business.",
    description:
      "Align messaging, page architecture, and UI for clear structure. We build sites that load fast, convert visitors, and scale as your business grows — no bloat, no technical debt. Launch in weeks, not months.",
    testimonial: {
      quote: "Our conversion rate doubled in the first month.",
      name: "Alexis Botaya",
      role: "MD @Sound Experience",
    },
    bg: "linear-gradient(135deg, hsl(0,72%,44%) 0%, hsl(0,72%,30%) 100%)",
    accentColor: "hsl(0,72%,65%)",
    chips: [
      { label: "SEO", color: "#ffeaea", text: "#5a0000" },
      { label: "CRO", color: "#ff9999", text: "#3a0000" },
      { label: "PERF", color: "#e74c3c", text: "#fff" },
      { label: "UI", color: "#922b21", text: "#ffd5d5" },
    ],
    shadow: "0 60px 120px -20px rgba(239,68,68,0.55)",
    chipBg: "rgba(255,255,255,0.06)",
  },
];

// ─── Chip component ────────────────────────────────────────────────────────────
function MockupChip({
  chip,
}: {
  chip: { label: string; color: string; text: string };
}) {
  return (
    <div
      className="flex items-end justify-center rounded-2xl px-2 pb-4 transition-transform duration-300 hover:-translate-y-2 cursor-default select-none"
      style={{
        backgroundColor: chip.color,
        color: chip.text,
        flex: "1 1 0",
        minWidth: 0,
        height: "100%",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.15em",
          opacity: 0.65,
        }}
      >
        {chip.label}
      </span>
    </div>
  );
}

// ─── Main PeelingStack ─────────────────────────────────────────────────────────
export function About3DStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardRefs.current.filter(Boolean);
    if (cards.length === 0) return;

    // ── Set initial 3D state ──────────────────────────────────
    cards.forEach((card, i) => {
      if (!card) return;
      gsap.set(card, {
        y: i * 28,
        scale: 1 - i * 0.04,
        filter: `brightness(${1 - i * 0.18})`,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        force3D: true,
      });
    });

    // ── Build scroll timeline ─────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${CARDS.length * 150}vh`,
        pin: true,
        pinSpacing: true,
        scrub: 2.5,
        pinType: "transform",
        invalidateOnRefresh: true,
      },
    });

    for (let i = 0; i < CARDS.length - 1; i++) {
      const card = cards[i]!;
      const belowCards = cards.slice(i + 1) as HTMLDivElement[];
      const beatStart = i * 3.5;

      // Peel away current card
      tl.to(
        card,
        {
          y: "-115vh",
          rotationX: 28,
          rotationZ: -4,
          opacity: 0,
          scale: 0.94,
          duration: 1.8,
          ease: "power1.inOut",
          force3D: true,
        },
        beatStart
      );

      // Bring remaining cards up
      belowCards.forEach((bc, j) => {
        tl.to(
          bc,
          {
            y: j * 28,
            scale: 1 - j * 0.04,
            filter: `brightness(${1 - j * 0.18})`,
            rotationX: 0,
            rotationZ: 0,
            duration: 1.8,
            ease: "power1.inOut",
            force3D: true,
          },
          beatStart
        );
      });

      // Hold — card visible for a long moment
      tl.to({}, { duration: 1.7 }, beatStart + 1.8);
    }

    // Final hold on last card
    tl.to({}, { duration: 3 });

    // Refresh layout
    ScrollTrigger.refresh();
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about about-3d-stack relative overflow-hidden h-screen"
      style={{ backgroundColor: "var(--color-canvas-light)" }}
    >
      {/* ── Orb atmosphere ───────────────────────────────────────── */}
      <div className="about__orbs absolute inset-0 z-[1] pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: "60vw",
            height: "60vw",
            top: "-15%",
            left: "-15%",
            background: "var(--orb-purple)",
            opacity: 0.45,
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "50vw",
            height: "50vw",
            bottom: "-10%",
            right: "-10%",
            background: "var(--orb-orange)",
            opacity: 0.4,
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "40vw",
            height: "40vw",
            top: "25%",
            right: "5%",
            background: "var(--orb-blue)",
            opacity: 0.35,
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* ── Frosted glass + dot grid overlay ─────────────────────── */}
      <div className="about__overlay--3d absolute inset-0 z-[2]" />

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="relative z-[10] flex flex-col items-center h-full">
        {/* Header */}
        <header className="text-center pt-[8vh] px-6 w-full max-w-4xl mx-auto flex-shrink-0">
          <h1
            className="about__headline font-black leading-[1.08] mb-5"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 3.5rem)",
              letterSpacing: "-0.025em",
              color: "var(--text-primary)",
            }}
          >
            Helping Kenyan Businesses{" "}
            <em
              className="italic"
              style={{
                color: "var(--hero-accent)",
                fontFamily: "'Gladolia DEMO', serif",
              }}
            >
              Look Professional Online
            </em>
          </h1>
          <p
            className="about__subheadline"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.88rem, 1.4vw, 1.05rem)",
              color: "var(--text-secondary)",
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: "550px",
              margin: "0 auto",
            }}
          >
            I design websites and visuals that help Kenyan businesses look
            professional, get more inquiries, and build trust online.
          </p>
        </header>

        {/* ── Card Stack ─────────────────────────────────────────── */}
        <div
          className="relative w-full flex-1"
          style={{
            perspective: "2000px",
            perspectiveOrigin: "50% 35%",
            marginTop: "2vh",
          }}
        >
          {CARDS.map((card, i) => (
            <article
              key={card.number}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-1/2 flex flex-col"
              style={{
                width: "min(1100px, 92vw)",
                aspectRatio: "2.4 / 1",
                maxHeight: "70vh",
                borderRadius: "2.5rem",
                transform: `translateX(-50%)`,
                zIndex: CARDS.length - i,
                boxShadow: card.shadow,
                overflow: "hidden",
                top: 0,
              }}
            >
              {/* Card BG */}
              <div
                className="absolute inset-0"
                style={{ background: card.bg }}
              />

              {/* Subtle inner noise/texture */}
              <div className="about__card-noise" />

              {/* Highlight gloss on top edge */}
              <div className="about__card-gloss" />

              {/* Content */}
              <div className="relative z-10 h-full grid grid-cols-[1fr_0.82fr] gap-6 p-8 md:p-12">
                {/* LEFT */}
                <div
                  className="flex flex-col justify-between overflow-hidden"
                  style={{ color: "white" }}
                >
                  {/* Number */}
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.22em",
                      opacity: 0.5,
                    }}
                  >
                    ({card.number})
                  </div>

                  {/* Title */}
                  <h2
                    className="font-black"
                    style={{
                      fontFamily: "'Gladolia DEMO', serif",
                      fontSize: "clamp(1.25rem, 2.6vw, 2.25rem)",
                      fontStyle: "italic",
                      lineHeight: 1.08,
                      letterSpacing: "-0.02em",
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      paddingBlock: "clamp(0.5rem, 1vw, 1rem)",
                    }}
                  >
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.72rem, 1vw, 0.88rem)",
                      fontWeight: 300,
                      lineHeight: 1.7,
                      opacity: 0.75,
                    }}
                  >
                    {card.description}
                  </p>

                  {/* Testimonial */}
                  <div
                    className="mt-4 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.65rem, 0.85vw, 0.75rem)",
                        fontStyle: "italic",
                        opacity: 0.55,
                        marginBottom: "6px",
                      }}
                    >
                      "{card.testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-full flex items-center justify-center font-bold shrink-0 text-white"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgba(255,255,255,0.18)",
                          fontSize: "10px",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {card.testimonial.name[0]}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(0.62rem, 0.82vw, 0.75rem)",
                          fontWeight: 500,
                        }}
                      >
                        {card.testimonial.name}
                        <span
                          style={{ opacity: 0.45, fontWeight: 300 }}
                        >
                          {" "}
                          · {card.testimonial.role}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT: Chips */}
                <div
                  className="flex flex-row items-stretch gap-2 min-h-0 overflow-hidden"
                  style={{ borderRadius: "1.5rem" }}
                >
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
