"use client";

import { useState, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToPosition } from "@/lib/scroll-to";

/** Keep one scroll range so forward, reverse and anchor navigation share geometry. */
export function useFounderSequence(sectionRef: RefObject<HTMLElement | null>) {
  const [visiblePanels, setVisiblePanels] = useState(3);
  const [mobileSequence, setMobileSequence] = useState(false);
  const [desktopTransition, setDesktopTransition] = useState(false);
  const [nextVisible, setNextVisible] = useState(true);
  const [spreadVisible, setSpreadVisible] = useState(true);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 1200px)", mobile: "(max-width: 1199px)",
      boardDesktop: "(min-width: 1000px)",
      motion: "(prefers-reduced-motion: no-preference)",
      fits: "(min-width: 1200px) and (min-height: 800px), (max-width: 1199px) and (min-height: 740px)",
    }, (context) => {
      const section = sectionRef.current;
      if (!section) return;
      const desktop = Boolean(context.conditions?.desktop);
      const comparison = section.querySelector<HTMLDivElement>(".founder-next-panel");
      const board = section.querySelector<HTMLDivElement>(".founder-ivory-board");
      let assembly: gsap.core.Timeline | undefined;
      if (board && context.conditions?.boardDesktop && context.conditions?.motion) {
        gsap.set(board, { attr: { "data-assembling": "true" }, "--board-surface": 0, "--board-divider": 0 });
        const edges = board.querySelectorAll(".founder-board-edge");
        const header = board.querySelectorAll(".founder-board-header > *");
        const rows = board.querySelectorAll(".founder-solution-card");
        assembly = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
          .fromTo(edges, { autoAlpha: 0, x: (i: number) => i === 1 ? 32 : i === 3 ? -32 : 0, y: (i: number) => i === 0 ? -28 : i === 2 ? 28 : 0 }, { autoAlpha: 1, x: 0, y: 0, duration: .32 }, 0)
          .to(board, { "--board-surface": 1, duration: .22 }, .16)
          .fromTo(header, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .24 }, .24)
          .to(board, { "--board-divider": 1, duration: .28 }, .3)
          .fromTo(rows, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: .24, stagger: .045 }, .37);
        if (!desktop || !context.conditions.fits) {
          ScrollTrigger.create({ trigger: board, start: "top 85%", animation: assembly, once: true });
        }
      }
      if (comparison && (!desktop || !context.conditions?.motion || !context.conditions.fits)) {
        // Desktop opacity/visibility must not survive a switch to stacked or static content.
        gsap.set([comparison, ...comparison.querySelectorAll(".founder-next-heading, .founder-heading-stroke, .founder-next-copy, .founder-next-artwork")], {
          clearProps: "opacity,visibility,transform,translate,rotate,scale",
        });
      }
      if (!context.conditions?.motion || !context.conditions.fits) return;
      const spread = section?.querySelector<HTMLDivElement>(".founder-spread");
      if (!section || !spread) return;
      const columns = Array.from(spread.querySelectorAll<HTMLDivElement>(".founder-column"));
      const papers = Array.from(spread.querySelectorAll<HTMLDivElement>(".founder-paper"));
      const lines = Array.from(spread.querySelectorAll<HTMLDivElement>(".founder-divider"));
      const [intro, film, biography] = columns;
      if (columns.length !== 3 || papers.length !== 3 || lines.length !== 2) return;
      const stage = section.querySelector<HTMLDivElement>(".founder-stage");
      const wipe = section.querySelector<HTMLDivElement>(".founder-wipe");
      const tint = section.querySelector<HTMLDivElement>(".founder-wipe-tint");
      const next = section.querySelector<HTMLDivElement>(".founder-next-panel");
      const videoFrame = film.querySelector<HTMLDivElement>(".video-stage");
      if (desktop && (!stage || !wipe || !tint || !next || !videoFrame)) return;
      const pinTarget = desktop && stage ? stage : spread;
      const nextItems = next ? Array.from(next.querySelectorAll<HTMLElement>(".founder-next-heading, .founder-heading-stroke, .founder-next-copy, .founder-next-artwork")) : [];
      const headerHeight = () => document.querySelector('nav[aria-label="Primary"]')?.getBoundingClientRect().height ?? 72;
      const width = () => spread.clientWidth;
      const videoWidth = () => videoFrame?.getBoundingClientRect().width ?? 0;
      const videoHeight = () => videoFrame?.getBoundingClientRect().height ?? 0;
      const videoTop = () => (videoFrame?.getBoundingClientRect().top ?? 0) - spread.getBoundingClientRect().top;
      const wipeRadius = () => {
        const radius = videoFrame ? Number.parseFloat(getComputedStyle(videoFrame).borderTopLeftRadius) || 0 : 0;
        return `${radius * width() / videoWidth()}px ${radius * window.innerHeight / videoHeight()}px`;
      };
      let alive = true;

      let shown = 1;
      let nextShown = !desktop;
      let spreadShown = true;
      setMobileSequence(!desktop);
      setVisiblePanels(1);
      setDesktopTransition(desktop);
      setNextVisible(!desktop);
      setSpreadVisible(true);
      gsap.set(spread, { attr: { "data-animated": "true", "data-scroll-mode": "reveal", "data-layout": desktop ? "desktop" : "mobile" } });
      if (desktop && stage) gsap.set(stage, { attr: { "data-desktop-transition": "true" } });
      const show = (count: number) => {
        if (count === shown) return;
        shown = count;
        setVisiblePanels(count);
        if (!desktop && count !== 2) film.querySelector("video")?.pause();
      };
      // Stable content widths avoid text rewrapping and video resizing per frame.
      gsap.set(columns, { x: (i: number) => desktop ? (i === 0 ? width() * .35 : width()) : i * width() });
      gsap.set(lines, { x: () => width(), autoAlpha: 0 });
      gsap.set(papers, { transformOrigin: "left center", scaleX: (i: number) => i === 0 ? 1 : i === 1 ? .5 : .3, x: (i: number) => i === 0 ? 0 : width() });
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "power1.inOut" }, onUpdate: () => {
        const t = timeline.time();
        if (t >= 7 && assembly?.paused()) assembly.play();
        show(desktop ? (t >= 2.55 ? 3 : t >= .7 ? 2 : 1) : (t >= 3.05 ? 3 : t >= 1.2 ? 2 : 1));
        if (desktop) {
          const revealNext = t >= 7;
          const revealSpread = t < 5.7;
          if (revealNext !== nextShown) { nextShown = revealNext; setNextVisible(revealNext); }
          if (revealSpread !== spreadShown) { spreadShown = revealSpread; setSpreadVisible(revealSpread); }
          if (t >= 5.05) film.querySelector("video")?.pause();
        }
      } });
      timeline.set(columns, { x: (i: number) => desktop ? (i === 0 ? width() * .35 : width()) : i * width() }, 0)
        .set(lines, { x: () => width(), autoAlpha: 0 }, 0)
        .set(papers, { scaleX: (i: number) => i === 0 ? 1 : i === 1 ? .5 : .3, x: (i: number) => i === 0 ? 0 : width() }, 0);
      if (desktop) {
        timeline.fromTo(intro, { x: () => width() * .35 }, { x: () => width() * .1, duration: 1 }, .7)
          .fromTo(film, { x: () => width() }, { x: () => width() * .55, duration: 1 }, .7)
          .fromTo(papers[0], { scaleX: 1 }, { scaleX: .5, duration: 1 }, .7)
          .fromTo(papers[1], { x: () => width(), scaleX: .5 }, { x: () => width() / 2, duration: 1 }, .7)
          .fromTo(lines[0], { x: () => width(), autoAlpha: 0 }, { x: () => width() / 2, autoAlpha: 1, duration: 1 }, .7)
          .to(intro, { x: 0, duration: 1 }, 2.55)
          .to(film, { x: () => width() * .3, duration: 1 }, 2.55)
          .fromTo(biography, { x: () => width() }, { x: () => width() * .7, duration: 1 }, 2.55)
          .to(papers[0], { scaleX: .3, duration: 1 }, 2.55)
          .to(papers[1], { scaleX: .4, x: () => width() * .3, duration: 1 }, 2.55)
          .fromTo(papers[2], { x: () => width(), scaleX: .3 }, { x: () => width() * .7, duration: 1 }, 2.55)
          .to(lines[0], { x: () => width() * .3, duration: 1 }, 2.55)
          .fromTo(lines[1], { x: () => width(), autoAlpha: 0 }, { x: () => width() * .7, autoAlpha: 1, duration: 1 }, 2.55);
      } else {
        // Equal translations keep adjacent panels touching throughout both moves.
        timeline.fromTo(columns, { x: (i: number) => i * width() }, { x: (i: number) => (i - 1) * width(), duration: 1 }, .7)
          .to(columns, { x: (i: number) => (i - 2) * width(), duration: 1 }, 2.55);
      }
      // Hold the completed spread for 1.5 timeline units before the wipe.
      // Scroll distance scales with duration, so holds never steal travel from motion.
      timeline.to({}, { duration: 1.5 }, 3.55);
      if (desktop && wipe && tint && next) {
        // The black surface starts at the portrait frame, not the player controls.
        // A separate theme-aware tint blends color without stretching any content.
        timeline.set(wipe, {
          x: () => (width() - videoWidth()) / 2, y: videoTop,
          scaleX: () => videoWidth() / width(), scaleY: () => videoHeight() / window.innerHeight,
          borderTopLeftRadius: wipeRadius, borderTopRightRadius: wipeRadius,
          borderBottomLeftRadius: wipeRadius, borderBottomRightRadius: wipeRadius,
          autoAlpha: 0,
        }, 0)
          .set(tint, { autoAlpha: 0 }, 0)
          .set(next, { autoAlpha: 0 }, 0)
          .set(nextItems, { y: 24, autoAlpha: 0 }, 0)
          .to(wipe, { autoAlpha: 1, duration: .2 }, 5.05)
          .to(wipe, { borderTopLeftRadius: "0px 0px", borderTopRightRadius: "0px 0px", borderBottomLeftRadius: "0px 0px", borderBottomRightRadius: "0px 0px", duration: .18 }, 5.25)
          .to([...columns, ...lines], { autoAlpha: 0, duration: .45 }, 5.25)
          .to(wipe, { x: 0, y: () => -headerHeight(), scaleX: 1, scaleY: 1, duration: 1.35 }, 5.43)
          .to(tint, { autoAlpha: 1, duration: 1.25 }, 5.73)
          .set(next, { autoAlpha: 1 }, 7)
          .to(nextItems, { y: 0, autoAlpha: 1, duration: .45, stagger: .1 }, 7.1)
          .to({}, { duration: 1.1 });
      }
      const pin = ScrollTrigger.create({
        id: "founder-sequence", trigger: pinTarget, pin: pinTarget, pinType: "fixed",
        start: () => `top top+=${headerHeight()}`, end: () => `+=${spread.clientHeight * (2.2 / 3) * timeline.duration()}`,
        animation: timeline, scrub: .65, anticipatePin: 1, invalidateOnRefresh: true,
      });
      let cancelNavigation: (() => void) | undefined;
      const navigateFounder = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!(event.target instanceof Element) || !event.target.closest('a[href="#founder"]')) return;
        event.preventDefault();
        window.history.replaceState(null, "", "#founder");
        cancelNavigation = scrollToPosition(() => pin.start);
      };
      document.addEventListener("click", navigateFounder);
      document.fonts.ready.then(() => {
        if (!alive) return;
        ScrollTrigger.refresh();
      });
      return () => {
        cancelNavigation?.();
        alive = false;

        document.removeEventListener("click", navigateFounder);
        setVisiblePanels(3);
        setMobileSequence(false);
        setDesktopTransition(false);
        setNextVisible(true);
        setSpreadVisible(true);
      };
    });
    return () => media.revert();
  }, { scope: sectionRef });
  return { visiblePanels, mobileSequence, desktopTransition, nextVisible, spreadVisible };
}
