"use client";

import { SectionLabel } from "./section-label";
import { ParticleCanvas } from "./particle-canvas";
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll-to";
import styles from "./reality-check.module.css";

const PROBLEM_POINTS = [
  "Slow pages and confusing menus can make visitors leave before they find what they need.",
  "A generic design may not show what makes your business different.",
  "Unclear descriptions make it hard to understand what you offer and who it helps.",
  "Too many plugins can make updates and maintenance harder to manage.",
];

const STANDARD_POINTS = [
  "Pages built to load quickly, so visitors can get straight to what they need.",
  "A design that reflects your business and makes your services easy to understand.",
  "Clear next steps that help visitors ask a question, book a call, or get in touch.",
  "Work directly with Leon, from the first conversation through design and development.",
];

export function RealityCheck({ services }: { services: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const comparisonContentRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLUListElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const [focusStep, setFocusStep] = useState<number | null>(null);
  const activeStep = hoverStep ?? focusStep ?? scrollStep;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current, start: "top 75%", end: "top 10%",
          scrub: .45,
        },
      });
      intro.from("[data-intro-label]", { y: 16, autoAlpha: 0, duration: .3, ease: "power2.out" }, 0);
      intro.from("[data-title-word]", { y: 28, autoAlpha: 0, stagger: .055, duration: .4, ease: "power2.out" }, .1);
      intro.from("[data-intro-reveal]", { y: 18, autoAlpha: 0, stagger: .12, duration: .4, ease: "power2.out" }, .65);
    });

    media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const frame = frameRef.current;
      const comparison = comparisonRef.current;
      const content = comparisonContentRef.current;
      const servicesPanel = servicesRef.current;
      const section = sectionRef.current;
      if (!frame || !comparison || !content || !servicesPanel || !section) return;
      let reservedHeight = -1;
      const reserveSpace = () => {
        const height = Math.max(0, servicesPanel.offsetHeight + 72 - frame.clientHeight);
        if (height === reservedHeight) return false;
        reservedHeight = height;
        gsap.set(section, { paddingBottom: height });
        return true;
      };
      reserveSpace();
      const sizeObserver = new ResizeObserver(() => {
        if (reserveSpace()) ScrollTrigger.refresh(true);
      });
      sizeObserver.observe(servicesPanel);
      gsap.set(servicesPanel, { y: () => frame.clientHeight, clipPath: "inset(0 18% 0 18% round 28px 28px 0 0)" });
      gsap.set(servicesPanel.firstElementChild, { autoAlpha: 0 });
      gsap.set(servicesPanel.querySelectorAll("[data-services-reveal]"), { autoAlpha: 0, y: 24 });
      const overflow = () => {
        const padding = getComputedStyle(comparison);
        return Math.max(0, content.scrollHeight - frame.clientHeight
          + parseFloat(padding.paddingTop) + parseFloat(padding.paddingBottom));
      };
      const select = gsap.utils.selector(sectionRef);
      const problems = select("[data-problem-row]");
      const timeline = gsap.timeline({
        paused: true, defaults: { ease: "power1.inOut" },
        onUpdate: function () {
          setScrollStep(Math.max(0, Math.min(3, Math.floor((this.time() - 2.35) / .24))));
        },
      });
      // A refresh must measure from the original state, not the currently scrubbed one.
      timeline.set(trackRef.current, { x: 0, autoAlpha: 1 }, 0);
      timeline.set(servicesPanel, { y: () => frame.clientHeight }, 0);
      timeline.set(servicesPanel.firstElementChild, { autoAlpha: 0 }, 0);
      timeline.set(servicesPanel.querySelectorAll("[data-services-reveal]"), { autoAlpha: 0, y: 24 }, 0);
      timeline.to(trackRef.current, { x: () => -frame.clientWidth, duration: 1, ease: "power1.inOut" }, 1.1);
      timeline.from("[data-comparison-head]", {
        autoAlpha: 0, y: 18, stagger: .08, duration: .3,
      }, 1.95);
      for (let i = 0; i < problems.length; i++) {
        timeline.from(problems[i], {
          autoAlpha: .12, x: 18, duration: .32,
        }, 2.35 + i * .24);
        timeline.from(select(`[data-row-number='${i}']`), {
          scale: .8, duration: .32,
        }, 2.35 + i * .24);
      }
      timeline.to(content, { y: () => -overflow(), duration: 1.15 }, 2.55);
      timeline.from("[data-comparison-result]", { autoAlpha: 0, y: 12, duration: .3 }, 3.6);
      // A full reading interval after the comparison, before Services peeks in.
      timeline.to({}, { duration: 1.4 }, 3.9);
      // The next section remains a full-size surface: clip its edges instead of scaling text.
      timeline.to(servicesPanel, { y: () => frame.clientHeight - 90, duration: .55, ease: "power1.inOut" }, 5.3);
      timeline.to(servicesPanel, { y: 72, duration: 1.2, ease: "power2.inOut" }, 5.85);
      timeline.fromTo(servicesPanel, { clipPath: "inset(0% 18% 0% 18% round 28px 28px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: 1.2, ease: "power2.inOut", immediateRender: false }, 5.85);
      timeline.to(trackRef.current, { autoAlpha: 0, duration: .85 }, 5.95);
      timeline.to(servicesPanel.firstElementChild, { autoAlpha: 1, duration: .55 }, 6.7);
      timeline.to(servicesPanel.querySelectorAll("[data-services-reveal]"), { autoAlpha: 1, y: 0, stagger: .1, duration: .4 }, 6.7);
      timeline.to({}, { duration: 1 }, 7.25);
      ScrollTrigger.create({
        id: "reality-sequence", trigger: section, pin: frame,
        start: "top top", end: () => `+=${frame.clientHeight * timeline.duration() * (5 / 5.6)}`,
        animation: timeline, scrub: .6, anticipatePin: 1, invalidateOnRefresh: true,
      });
      let cancelNavigation: (() => void) | undefined;
      const navigateServices = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = (event.target as Element)?.closest?.('a[href="#services"]');
        if (!link || !timeline.scrollTrigger) return;
        event.preventDefault();
        window.history.replaceState(null, "", "#services");
        cancelNavigation = scrollToPosition(() => timeline.scrollTrigger?.end ?? window.scrollY);
      };
      document.addEventListener("click", navigateServices, true);
      return () => { cancelNavigation?.(); sizeObserver.disconnect(); document.removeEventListener("click", navigateServices, true); };
    });

    media.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-problem-row]", sectionRef.current);
      rows.forEach((row) => gsap.from(row, {
        autoAlpha: .2, y: 16, duration: .55, ease: "power2.out",
        scrollTrigger: { trigger: row, start: "top 90%", toggleActions: "play none none reverse" },
      }));
    });
    media.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      ScrollTrigger.create({
        trigger: stepsRef.current, start: "top 70%", end: "bottom 35%",
        onUpdate: () => {
          const rows = stepsRef.current?.querySelectorAll("[data-standard-row]");
          if (!rows) return;
          let closest = 0;
          let distance = Infinity;
          rows.forEach((row, index) => {
            const rect = row.getBoundingClientRect();
            const next = Math.abs(rect.top + rect.height / 2 - window.innerHeight * .5);
            if (next < distance) { distance = next; closest = index; }
          });
          setScrollStep(closest);
        },
      });
    });
    // Font loading can change the comparison's natural height after hydration.
    let active = true;
    document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    return () => { active = false; media.revert(); };
  }, { scope: sectionRef });

  return (
    <section id="reality" ref={sectionRef} className={styles.section} aria-labelledby="reality-title">
      <div ref={frameRef} className={styles.frame}>
        <div ref={trackRef} className={styles.track}>
          <div className={`${styles.panel} ${styles.intro}`}>
            <ParticleCanvas progress={0} ambient brandColors className={styles.particles} />
            <div className={styles.introContent}>
              <div className={styles.heading}>
                <SectionLabel data-intro-label>The Reality Check</SectionLabel>
                <h2 id="reality-title" className="text-balance font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  <span className={`${styles.introTitle} block`}>
                    <span className="sr-only">Your Business Is Established. </span>
                    <span aria-hidden="true">{"Your Business Is Established.".split(" ").map((word, index) => <span key={word}><span data-title-word className={styles.titleWord}>{word}</span>{index < 3 ? " " : ""}</span>)}</span>
                  </span>
              <em className={`${styles.introQuestion} block font-serif font-medium italic tracking-tight text-signal`}>
                <span className="sr-only">Does Your Website Look Like It?</span>
                <span aria-hidden="true">{"Does Your Website Look Like It?".split(" ").map((word, index) => <span key={`${word}-${index}`}><span data-title-word className={styles.titleWord}>{word}</span>{index < 5 ? " " : ""}</span>)}</span>
              </em>
                </h2>
                <p data-intro-reveal className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">You have put years of work into your business. Your website should help people understand what you do, see your work, and know how to contact you.</p>
              </div>
              <p data-intro-reveal className={styles.continuation}><span>Scroll to explore the gap</span><ArrowRight size={16} aria-hidden /></p>
            </div>
          </div>
          <div ref={comparisonRef} className={`${styles.panel} ${styles.comparison}`}>
            <div ref={comparisonContentRef} className={styles.comparisonContent}>

        {/* Asymmetric ledger: plain problem column vs inverted standard panel */}
        <div className={`${styles.comparisonGrid} relative grid gap-12 lg:grid-cols-[1fr_1.08fr] lg:gap-0`}>
          {/* central vertical hairline with a signal diamond marker */}
          <div
            aria-hidden
            className={`${styles.divider} absolute left-[48%] top-0 hidden h-full w-px bg-border lg:block`}
          />
          <div
            aria-hidden
            className={`${styles.divider} absolute left-[48%] top-10 hidden -translate-x-1/2 lg:block`}
          >
            <span className="block size-2 rotate-45 bg-signal" />
          </div>

          {/* ------------------------- The problem: plain type ------------------------- */}
          <div className={`${styles.problemColumn} lg:pr-14`}>
            <article>
              <SectionLabel data-comparison-head>Where Websites Fall Short</SectionLabel>

              <h3 data-comparison-head className={`${styles.titleLine} mt-6 text-2xl tracking-tight text-foreground md:text-3xl`}>
                When Your Website Falls Behind
              </h3>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                People may already know your work through recommendations or meeting you in person.
                When they visit your website, they should find that same care: clear information,
                examples of your work, and a page that works well on their phone.
              </p>

              <ul className="mt-8">
                {PROBLEM_POINTS.map((point, i) => (
                  <li
                    key={point}
                    data-problem-row
                    className={`${styles.row} flex items-start gap-4 border-t border-border py-4 first:border-t-0`}
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center border border-border text-destructive">
                      <X className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      <span data-row-number={i} className={`${styles.number} mr-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground/60`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <p data-comparison-result className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-foreground">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-destructive">
                  Result:
                </span>{" "}
                Visitors may leave without understanding your business or getting in touch.
              </p>
            </article>
          </div>

          {/* ------------------ The standard: inverted ink panel ------------------ */}
          <div className="lg:pl-14">
            <article className="relative border border-foreground bg-foreground p-7 text-background md:p-10">
              {/* blueprint registration corners */}
              <span aria-hidden className="mark-tl" />
              <span aria-hidden className="mark-tr" />
              <span aria-hidden className="mark-bl" />
              <span aria-hidden className="mark-br" />

              <SectionLabel data-comparison-head inverse>What You Get With CodeByLeon</SectionLabel>

              <h3 data-comparison-head className="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                Built For Your Business.{" "}
                <em className="font-serif font-medium italic">Designed For Your Customers.</em>
              </h3>

              <p className="mt-4 leading-relaxed text-background/70">
                Your website is designed and built around what your business needs.
                You get clear pages, a design that feels like you, and useful ways for
                customers to contact you, with room to update your content and add features over time.
              </p>

              <ul ref={stepsRef} className={`${styles.steps} mt-8`}>
                {STANDARD_POINTS.map((point, i) => (
                  <li
                    key={point}
                    data-standard-row
                    className={styles.stepRow}
                    data-active={activeStep === i}
                  >
                    <button type="button" className={styles.stepButton}
                      aria-pressed={activeStep === i}
                      onPointerEnter={(event) => { if (event.pointerType !== "touch") setHoverStep(i); }}
                      onPointerLeave={() => setHoverStep(null)}
                      onFocus={() => { setHoverStep(null); setFocusStep(i); }}
                      onBlur={() => setFocusStep(null)}
                      onClick={() => setScrollStep(i)}>
                      <span className={styles.stepBadge} aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="sr-only">Step {i + 1}: </span>
                      <span className={styles.stepText}>{point}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <p data-comparison-result className="mt-6 border-t border-background/15 pt-5 text-sm leading-relaxed">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-signal-inv">
                  Result:
                </span>{" "}
                A website that explains your offer and helps customers take the next step.
              </p>
            </article>
          </div>
        </div>

        <div data-comparison-result className={`${styles.exit} flex justify-center`}>
          <a
            href="#services"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-signal"
          >
            See how we fix it
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </a>
        </div>
            </div>
          </div>
        </div>
        <div ref={servicesRef} className={styles.servicesPanel}>{services}</div>
      </div>
    </section>
  );
}
