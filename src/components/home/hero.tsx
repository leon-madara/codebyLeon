"use client";

import { SectionLabel } from "./section-label";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { ParticleCanvas } from "./particle-canvas";
import styles from "./hero.module.css";
import { scrollToPosition } from "@/lib/scroll-to";

const WORDS = ["DRIVEN", "GROWING", "LOCAL", "NEW", "SMALL"] as const;

const EASE = [0.16, 1, 0.3, 1] as const;
const LIFT_DURATION = 2.2;
const LIFT_EASE = [0.65, 0, 0.35, 1] as const;

export function Hero() {
  const [typedWord, setTypedWord] = useState<string>(WORDS[0]);
  const [isLifted, setIsLifted] = useState(false);
  const [particleProgress, setParticleProgress] = useState(0);
  const reduce = useReducedMotion();

  const isLiftedRef = useRef(false);
  const isCompleteRef = useRef(true);
  const pendingLiftRef = useRef(false);
  const curtainRef = useRef<HTMLElement>(null);
  const particleFrameRef = useRef(0);
  const settlingRef = useRef(false);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInputRef = useRef(0);
  const touchingRef = useRef(false);
  const tickRef = useRef<() => void>(() => {});
  const cancelNavigationRef = useRef<(() => void) | undefined>(undefined);

  // Execute the curtain lift animation
  const triggerCurtainLift = useCallback((skipHold = false) => {
    const unlock = () => {
      settlingRef.current = false;
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    };
    if (skipHold) {
      if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
      unlock();
    }
    if (isLiftedRef.current) return;
    settlingRef.current = !skipHold;
    isLiftedRef.current = true;
    setIsLifted(true);

    // Keep the underlying section stationary through lift and a readable hold.
    if (!skipHold) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      const releaseWhenQuiet = () => {
        if (touchingRef.current || performance.now() - lastInputRef.current < 220) {
          releaseTimerRef.current = setTimeout(releaseWhenQuiet, 100);
          return;
        }
        unlock();
      };
      releaseTimerRef.current = setTimeout(releaseWhenQuiet, LIFT_DURATION * 1000 + 1000);
    }

    // Animate particle progress 0 -> 1 during the curtain lift
    const startTime = performance.now();
    const duration = LIFT_DURATION * 1000;

    const animateParticles = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setParticleProgress(progress);
      if (progress < 1) {
        particleFrameRef.current = requestAnimationFrame(animateParticles);
      }
    };
    cancelAnimationFrame(particleFrameRef.current);
    particleFrameRef.current = requestAnimationFrame(animateParticles);
  }, []);

  // When user attempts to scroll: if word is mid-type, delay and wait for it to finish
  const handleScrollAttempt = useCallback((prevent?: () => void) => {
    if (isLiftedRef.current) return;

    if (!isCompleteRef.current) {
      // Word has not finished typing out! Delay animation and wait for completion
      if (prevent) prevent();
      if (pendingLiftRef.current) return;
      pendingLiftRef.current = true;
      // Prompt the typewriter loop to type forward smoothly towards completion
      tickRef.current?.();
    } else {
      // Word is already finished! Lift the curtain immediately
      if (prevent) prevent();
      triggerCurtainLift();
    }
  }, [triggerCurtainLift]);

  // Lower the curtain back down (e.g. when user scrolls back to top and scrolls up)
  const lowerCurtain = useCallback(() => {
    if (!isLiftedRef.current) return;
    isLiftedRef.current = false;
    settlingRef.current = false;
    if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
    window.history.replaceState(null, "", "#top");
    curtainRef.current?.scrollTo({ top: 0, behavior: "instant" });
    setIsLifted(false);
    setTypedWord(WORDS[0]);
    cancelAnimationFrame(particleFrameRef.current);
    pendingLiftRef.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    setParticleProgress(0);

  }, []);

  // Typewriter effect cleanly cycling through all words without getting stuck
  useEffect(() => {
    if (reduce) {
      isCompleteRef.current = true;
      return;
    }

    if (isLifted) return;

    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let wordIdx = 0;
    let charIdx = WORDS[0].length;
    let isDeleting = false;

    isCompleteRef.current = true;

    const tick = () => {
      if (!active || isLiftedRef.current) return;

      const currentWord = WORDS[wordIdx];

      if (!isDeleting) {
        if (charIdx < currentWord.length) {
          // Typing forward
          charIdx++;
          setTypedWord(currentWord.slice(0, charIdx));
          isCompleteRef.current = charIdx === currentWord.length;

          if (isCompleteRef.current && pendingLiftRef.current) {
            // Reached completion while scroll was pending!
            pendingLiftRef.current = false;
            timer = setTimeout(() => {
              if (active) triggerCurtainLift();
            }, 160);
            return;
          }

          // Dynamic speed: accelerate if user is already waiting for the word to complete
          const speed = pendingLiftRef.current ? 45 : 85;
          timer = setTimeout(tick, speed);
        } else {
          // Word is completely typed out!
          isCompleteRef.current = true;

          if (pendingLiftRef.current) {
            pendingLiftRef.current = false;
            timer = setTimeout(() => {
              if (active) triggerCurtainLift();
            }, 160);
            return;
          }

          // Hold the full word for 1.8s
          timer = setTimeout(() => {
            if (!active || isLiftedRef.current) return;
            isDeleting = true;
            isCompleteRef.current = false;
            tick();
          }, 1800);
        }
      } else {
        // Deleting letters
        if (pendingLiftRef.current) {
          // Scroll attempt while deleting: reverse immediately to type forward!
          isDeleting = false;
          timer = setTimeout(tick, 35);
          return;
        }

        if (charIdx > 0) {
          charIdx--;
          setTypedWord(currentWord.slice(0, charIdx));
          isCompleteRef.current = false;
          timer = setTimeout(tick, 45);
        } else {
          // Word cleared! Advance to next word in the list
          isDeleting = false;
          wordIdx = (wordIdx + 1) % WORDS.length;
          isCompleteRef.current = false;
          timer = setTimeout(tick, 250);
        }
      }
    };

    tickRef.current = () => {
      if (timer) clearTimeout(timer);
      tick();
    };

    // Initial pause on the first word ("DRIVEN")
    timer = setTimeout(() => {
      if (!active || isLiftedRef.current) return;
      isDeleting = true;
      isCompleteRef.current = false;
      tick();
    }, 1800);

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [reduce, isLifted, triggerCurtainLift]);

  // Lock body scroll while curtain is down; handle wheel, touch, keyboard, and scroll back up
  useEffect(() => {
    if (reduce) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscroll = document.body.style.overscrollBehavior;
    if ((window.location.hash && window.location.hash !== "#top") || window.scrollY > 0) {
      triggerCurtainLift(true);
    }

    if (!isLiftedRef.current || settlingRef.current) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
    }

    const isInteractive = (target: EventTarget | null) => target instanceof Element &&
      Boolean(target.closest('a, button, input, textarea, select, [contenteditable="true"], [role="dialog"]'));
    const navigationOpen = () => document.documentElement.dataset.navMenuOpen === "true";
    const consumeSettlingInput = (event: Event) => {
      lastInputRef.current = performance.now();
      if (!settlingRef.current) return false;
      event.preventDefault();
      return true;
    };
    const onWheel = (e: WheelEvent) => {
      if (navigationOpen() || (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))) return;
      if (consumeSettlingInput(e)) return;
      if (!isLiftedRef.current) {
        if (e.deltaY > 0) {
          handleScrollAttempt(() => e.preventDefault());
        }
      } else {
        // When lifted, if user is at top of page and scrolls UP, lower the hero curtain
        if (window.scrollY <= 0 && e.deltaY < -20) {
          lowerCurtain();
        }
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchingRef.current = true;
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = () => { touchingRef.current = false; lastInputRef.current = performance.now(); };
    const onTouchMove = (e: TouchEvent) => {
      if (navigationOpen() || (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]'))) return;
      if (consumeSettlingInput(e)) return;
      if (!isLiftedRef.current) {
        const delta = touchStartY - e.touches[0].clientY;
        if (delta > 15) {
          handleScrollAttempt(() => e.preventDefault());
        }
      } else {
        const delta = touchStartY - e.touches[0].clientY;
        if (window.scrollY <= 0 && delta < -25) {
          lowerCurtain();
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || navigationOpen() || isInteractive(e.target)) return;
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key) && consumeSettlingInput(e)) return;
      if (!isLiftedRef.current) {
        if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "End") {
          handleScrollAttempt(() => e.preventDefault());
        }
      }
    };

    const onDocClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target.closest("a") : null;
      if (!target) return;
      const href = target.getAttribute("href");
      if (href === "#top") {
        e.preventDefault();
        window.history.replaceState(null, "", "#top");
        // Arrive at the top before lowering the curtain; never jump past content.
        cancelNavigationRef.current = scrollToPosition(() => 0, lowerCurtain);
      } else if (href && href.startsWith("#") && (!isLiftedRef.current || settlingRef.current)) {
        triggerCurtainLift(true);
      }
    };

    const onHashChange = () => {
      if (window.location.hash && window.location.hash !== "#top") {
        triggerCurtainLift(true);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onDocClick, true);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscroll;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onDocClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [isLifted, handleScrollAttempt, lowerCurtain, triggerCurtainLift, reduce]);

  useEffect(() => () => {
    cancelNavigationRef.current?.();
    cancelAnimationFrame(particleFrameRef.current);
    if (releaseTimerRef.current) clearTimeout(releaseTimerRef.current);
  }, []);

  useEffect(() => { window.dispatchEvent(new Event("hero-curtain-change")); }, [isLifted, reduce]);

  const heroContent = (
    <>
      {/* Studio label — hairlines, mono, signal diamond. No pill. */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className={`${styles.enter} mb-9 flex w-full max-w-md items-center gap-4`}
      >
        <span aria-hidden className="h-px flex-1 bg-border" />
        <span className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          <MapPin className="size-3.5 text-signal" aria-hidden />
          Nairobi-based design studio
        </span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </motion.div>

      {/* Headline: three lines, changing word on its own middle line */}
      <h1 className={`${styles.headline} text-[13vw] leading-[1.02] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-[6.5rem]`}>
        <span className="block">
          <motion.span
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className={`${styles.enter} ${styles.enterHeading} block`}
          >
            <span className={styles.bold}>Bold</span> websites for
          </motion.span>
        </span>

        <span className="my-2 block h-[1.16em] overflow-hidden sm:my-3">
          <span className="sr-only">Driven</span>
          <span aria-hidden="true" className={`${styles.word} block tracking-tight text-signal`}>
            <span className={styles.letters}>
              {Array.from(typedWord).map((letter, index) => (
                <span key={index}>{letter}</span>
              ))}
            </span>
            <span className={styles.cursor}>|</span>
          </span>
        </span>

        <span className="block">
          <motion.span
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className={`${styles.enter} ${styles.enterHeading} block`}
          >
            Brands<span className={styles.dot}>.</span>
          </motion.span>
        </span>
      </h1>

      {/* Supporting text */}
      <motion.p
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
        className={`${styles.enter} ${styles.enterCopy} mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg`}
      >
        Get a website that shows what you do,
        <br className="hidden sm:block" /> works well on phones, and helps customers get in touch.
      </motion.p>

      {/* Tagline */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        className={`${styles.enter} ${styles.enterTagline} mt-6 flex flex-col items-center`}
      >
        <SectionLabel>Made for your business</SectionLabel>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.65, ease: EASE }}
        className={`${styles.enter} ${styles.enterActions} mt-10 flex w-full flex-col items-center justify-center gap-3.5 sm:w-auto sm:flex-row sm:gap-4`}
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
    </>
  );

  // Reduced motion: standard static layout
  if (reduce) {
    return (
      <section
        id="top"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background px-4 pb-24 pt-32 sm:px-6"
      >
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          {heroContent}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Particle Canvas active during the curtain lift transition */}
      {isLifted && particleProgress < 1 && <ParticleCanvas
        progress={particleProgress}
        className="fixed inset-0 z-20 h-full w-full"
      />}

      {/* Front Hero Card that sits in front of RealityCheck and lifts up like a curtain */}
      <motion.section
        ref={curtainRef}
        onAnimationComplete={() => {
          if (!isLiftedRef.current) curtainRef.current?.scrollTo({ top: 0, behavior: "instant" });
        }}
        id="top"
        inert={isLifted}
        aria-hidden={isLifted}
        animate={isLifted ? { y: "-100%" } : { y: "0%" }}
        transition={isLifted
          ? { duration: LIFT_DURATION, ease: LIFT_EASE }
          : { duration: 1.05, ease: EASE }}
        className={`fixed inset-0 z-30 flex min-h-[100svh] flex-col items-center overflow-y-auto bg-background px-4 pb-20 pt-24 sm:px-6 ${styles.heroCard} ${
          isLifted ? "pointer-events-none" : "pointer-events-auto"
        }`}
      >
        {/* dot-grid overlay on the card */}
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute inset-0 opacity-80 [mask-image:radial-gradient(ellipse_90%_65%_at_50%_0%,black_25%,transparent_85%)]"
        />

        {/* local wash that accents the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/4 -z-[1]"
        >
          <div
            className="blob left-1/2 h-[52vw] w-[52vw] -translate-x-1/2 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle at 25% 60%, var(--signal-wash-a), transparent 70%), radial-gradient(circle at 75% 35%, var(--signal-wash-b), transparent 70%)",
            }}
          />
        </div>

        <div className={`relative mx-auto my-auto flex w-full max-w-5xl shrink-0 flex-col items-center text-center ${styles.curtainContent}`}>
          {heroContent}
        </div>

        {/* scroll cue */}
        <button
          type="button"
          onClick={() => handleScrollAttempt()}
          aria-label="Scroll down to explore"
          className="group relative mt-6 flex shrink-0 cursor-pointer flex-col items-center gap-2 border-none bg-transparent"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground transition-colors group-hover:text-signal">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          >
            <ChevronDown className="size-4 text-signal" />
          </motion.div>
        </button>
      </motion.section>
    </>
  );
}
