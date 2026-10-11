"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./hero.module.css";

const WORDS = ["DRIVEN", "GROWING", "LOCAL", "NEW", "SMALL"];

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [typedWord, setTypedWord] = useState(WORDS[0]);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ repeat: -1 });
      WORDS.forEach((word, index) => {
        const previous = WORDS[(index + WORDS.length - 1) % WORDS.length];
        if (index === 0) timeline.call(() => setTypedWord(""));
        else {
          for (let length = previous.length - 1; length >= 0; length--) {
            timeline.call(() => setTypedWord(previous.slice(0, length)), [], "+=0.05");
          }
          timeline.to({}, { duration: 0.5 });
        }
        for (let length = 1; length <= word.length; length++) {
          timeline.call(() => setTypedWord(word.slice(0, length)), [], "+=0.09");
        }
        timeline.to({}, { duration: 1.5 });
      });
      const last = WORDS[WORDS.length - 1];
      for (let length = last.length - 1; length >= 0; length--) {
        timeline.call(() => setTypedWord(last.slice(0, length)), [], "+=0.05");
      }
      timeline.to({}, { duration: 0.5 });
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" });
    });
    media.add("(prefers-reduced-motion: reduce)", () => setTypedWord(WORDS[0]));
    return () => media.revert();
  }, { scope: sectionRef });

  // scroll-driven cinematic exit: fade, shrink, soften, layered parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const contentBlurValue = useTransform(scrollYProgress, [0, 0.5], [0, 7]);
  const contentBlur = useMotionTemplate`blur(${contentBlurValue}px)`;

  const lineOneY = useTransform(scrollYProgress, [0, 1], [0, -52]);
  const wordLineY = useTransform(scrollYProgress, [0, 1], [0, -118]);
  const lineThreeY = useTransform(scrollYProgress, [0, 1], [0, -78]);
  const supportY = useTransform(scrollYProgress, [0, 1], [0, -34]);

  const heroWashY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-24 pt-32 sm:px-6"
    >
      {/* local wash that parallax-drifts on scroll (restrained) */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: heroWashY }}
        className="pointer-events-none absolute inset-x-0 top-1/4 -z-[1]"
      >
        <div
          className="blob left-1/2 h-[52vw] w-[52vw] -translate-x-1/2 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle at 25% 60%, var(--signal-wash-a), transparent 70%), radial-gradient(circle at 75% 35%, var(--signal-wash-b), transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div
        style={
          reduce
            ? undefined
            : { opacity: contentOpacity, scale: contentScale, filter: contentBlur }
        }
        className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center"
      >
        {/* Studio label — hairlines, mono, signal diamond. No pill. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-9 flex w-full max-w-md items-center gap-4"
        >
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="h-px flex-1 origin-right bg-border"
          />
          <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            <MapPin className="size-3.5 text-signal" aria-hidden />
            Nairobi-based design studio
          </span>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="h-px flex-1 origin-left bg-border"
          />
        </motion.div>

        {/* Headline: three lines, changing word on its own middle line */}
        <h1 className={`${styles.headline} text-[13vw] leading-[1.02] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-[6.5rem]`}>
          <motion.span style={reduce ? undefined : { y: lineOneY }} className="block">
            <motion.span
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="block"
            >
              <span className={styles.bold}>Bold</span> Websites for
            </motion.span>
          </motion.span>

          <motion.span
            style={reduce ? undefined : { y: wordLineY }}
            className="my-2 block h-[1.16em] overflow-hidden sm:my-3"
          >
            <span className="sr-only">Driven</span>
            <span aria-hidden="true" className={`${styles.word} block tracking-tight text-signal`}>
              <span className={styles.letters}>{Array.from(typedWord).map((letter, index) => <span key={index}>{letter}</span>)}</span><span ref={cursorRef} className={styles.cursor}>|</span>
            </span>
          </motion.span>

          <motion.span style={reduce ? undefined : { y: lineThreeY }} className="block">
            <motion.span
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="block"
            >
              Brands<span className={styles.dot}>.</span>
            </motion.span>
          </motion.span>
        </h1>

        {/* Supporting text — two-line grouping preserved */}
        <motion.p
          style={reduce ? undefined : { y: supportY }}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Get a website that shows what you do,
          <br className="hidden sm:block" /> works well on phones, and helps customers get in touch.
        </motion.p>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-6 flex items-center gap-3"
        >
          <span aria-hidden className="h-px w-10 bg-border" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.34em] text-foreground">
            Made for your business
          </span>
          <span aria-hidden className="h-px w-10 bg-border" />
        </motion.div>

        {/* Actions — order preserved */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
          className="mt-10 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row sm:gap-4"
        >
          <a
            href="/get-started.html"
            className={`${styles.cta} group inline-flex h-12 w-full items-center justify-center gap-2.5 bg-signal px-8 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-signal-foreground hover:bg-signal/85 sm:w-auto`}
          >
            Start Your Project
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </a>
          <a
            href="/work"
            className={`${styles.cta} ${styles.secondary} group inline-flex h-12 w-full items-center justify-center gap-2.5 border border-border bg-transparent px-8 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground sm:w-auto`}
          >
            View Previous Work
          </a>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        style={reduce ? undefined : { opacity: cueOpacity }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          Scroll
        </span>
        <motion.div
          animate={reduce ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <ChevronDown className="size-4 text-signal" />
        </motion.div>
      </motion.div>
    </section>
  );
}
