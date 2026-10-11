"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** One stable pin during the reveal, followed by a natural completed layout. */
export function useFounderSequence(sectionRef: RefObject<HTMLElement | null>) {
  const [visiblePanels, setVisiblePanels] = useState(3);
  const [mobileSequence, setMobileSequence] = useState(false);
  const [desktopTransition, setDesktopTransition] = useState(false);
  const [nextVisible, setNextVisible] = useState(true);
  const [spreadVisible, setSpreadVisible] = useState(true);
  const initialAnchorHandled = useRef(false);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 1200px)", mobile: "(max-width: 1199px)",
      motion: "(prefers-reduced-motion: no-preference)",
      fits: "(min-width: 1200px) and (min-height: 800px), (max-width: 1199px) and (min-height: 740px)",
    }, (context) => {
      const section = sectionRef.current;
      if (!section) return;
      const desktop = Boolean(context.conditions?.desktop);
      const comparison = section.querySelector<HTMLDivElement>(".founder-next-panel");
      if (comparison && (!desktop || !context.conditions?.motion || !context.conditions.fits)) {
        // Desktop opacity/visibility must not survive a switch to stacked or static content.
        gsap.set([comparison, ...comparison.querySelectorAll(".founder-next-heading, .founder-heading-stroke, .founder-next-copy, .founder-next-artwork, .founder-next-columns, li")], {
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
      const nextItems = next ? Array.from(next.querySelectorAll<HTMLElement>(".founder-next-heading, .founder-heading-stroke, .founder-next-copy, .founder-next-artwork, .founder-next-columns, li")) : [];
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
      let released = false;
      let updating = false;
      let navigating = false;
      let frame = 0;

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
      const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" }, onUpdate: () => {
        const t = timeline.time();
        show(desktop ? (t >= 1.65 ? 3 : t >= .25 ? 2 : 1) : (t >= 2.15 ? 3 : t >= .75 ? 2 : 1));
        if (desktop) {
          const revealNext = t >= 5.1;
          const revealSpread = t < 3.8;
          if (revealNext !== nextShown) { nextShown = revealNext; setNextVisible(revealNext); }
          if (revealSpread !== spreadShown) { spreadShown = revealSpread; setSpreadVisible(revealSpread); }
          if (t >= 3.15) film.querySelector("video")?.pause();
        }
      } });
      timeline.set(columns, { x: (i: number) => desktop ? (i === 0 ? width() * .35 : width()) : i * width() }, 0)
        .set(lines, { x: () => width(), autoAlpha: 0 }, 0)
        .set(papers, { scaleX: (i: number) => i === 0 ? 1 : i === 1 ? .5 : .3, x: (i: number) => i === 0 ? 0 : width() }, 0);
      if (desktop) {
        timeline.fromTo(intro, { x: () => width() * .35 }, { x: () => width() * .1, duration: 1 }, .25)
          .fromTo(film, { x: () => width() }, { x: () => width() * .55, duration: 1 }, .25)
          .fromTo(papers[0], { scaleX: 1 }, { scaleX: .5, duration: 1 }, .25)
          .fromTo(papers[1], { x: () => width(), scaleX: .5 }, { x: () => width() / 2, duration: 1 }, .25)
          .fromTo(lines[0], { x: () => width(), autoAlpha: 0 }, { x: () => width() / 2, autoAlpha: 1, duration: 1 }, .25)
          .to(intro, { x: 0, duration: 1 }, 1.65)
          .to(film, { x: () => width() * .3, duration: 1 }, 1.65)
          .fromTo(biography, { x: () => width() }, { x: () => width() * .7, duration: 1 }, 1.65)
          .to(papers[0], { scaleX: .3, duration: 1 }, 1.65)
          .to(papers[1], { scaleX: .4, x: () => width() * .3, duration: 1 }, 1.65)
          .fromTo(papers[2], { x: () => width(), scaleX: .3 }, { x: () => width() * .7, duration: 1 }, 1.65)
          .to(lines[0], { x: () => width() * .3, duration: 1 }, 1.65)
          .fromTo(lines[1], { x: () => width(), autoAlpha: 0 }, { x: () => width() * .7, autoAlpha: 1, duration: 1 }, 1.65);
      } else {
        // Equal translations keep adjacent panels touching throughout both moves.
        timeline.fromTo(columns, { x: (i: number) => i * width() }, { x: (i: number) => (i - 1) * width(), duration: 1 }, .25)
          .to(columns, { x: (i: number) => (i - 2) * width(), duration: 1 }, 1.65);
      }
      timeline.to({}, { duration: .35 }, 2.65);
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
          .to(wipe, { autoAlpha: 1, duration: .2 }, 3.15)
          .to(wipe, { borderTopLeftRadius: "0px 0px", borderTopRightRadius: "0px 0px", borderBottomLeftRadius: "0px 0px", borderBottomRightRadius: "0px 0px", duration: .18 }, 3.35)
          .to([...columns, ...lines], { autoAlpha: 0, duration: .45 }, 3.35)
          .to(wipe, { x: 0, y: () => -headerHeight(), scaleX: 1, scaleY: 1, duration: 1.35 }, 3.53)
          .to(tint, { autoAlpha: 1, duration: 1.25 }, 3.83)
          .set(next, { autoAlpha: 1 }, 5.1)
          .to(nextItems, { y: 0, autoAlpha: 1, duration: .45, stagger: .1 }, 5.2)
          .to({}, { duration: .45 });
      }
      const release = () => {
        if (!alive || released || updating || navigating || window.scrollY < pin.end || timeline.progress() < .999) return;
        updating = true;
        released = true;
        // After the final hold, preserve the visible document anchor while removing
        // spent pin space. This never runs inside wheel, touch or keyboard input.
        const before = section.getBoundingClientRect().top + section.offsetHeight;
        pin.getTween()?.pause();
        pin.disable(true);
        timeline.progress(1);
        spread.dataset.scrollMode = "return";
        ScrollTrigger.refresh();
        const after = section.getBoundingClientRect().top + section.offsetHeight;
        window.scrollBy({ top: after - before, behavior: "instant" });
        updating = false;
      };
      const createPin = () => ScrollTrigger.create({
        id: "founder-sequence", trigger: pinTarget, pin: pinTarget, pinType: "fixed",
        start: () => `top top+=${headerHeight()}`, end: () => `+=${spread.clientHeight * 2.2 * (desktop ? timeline.duration() / 3 : 1)}`,
        animation: timeline, scrub: .35, anticipatePin: 1, invalidateOnRefresh: true,
        onLeave: () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(release); },
        onScrubComplete: () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(release); },
      });
      let pin = createPin();
      const rearm = () => {
        updating = true;
        cancelAnimationFrame(frame);
        released = false;
        pin.kill(true, true);
        gsap.set(pinTarget, { y: 0 });
        timeline.invalidate().progress(0);
        show(1);
        spread.dataset.scrollMode = "reveal";
        context.add(() => { pin = createPin(); });
        ScrollTrigger.refresh();
        updating = false;
      };
      const onScroll = () => {
        if (updating) return;
        if (navigating && Math.abs(window.scrollY - pin.start) < 2) navigating = false;
        if (!navigating && !released && window.scrollY >= pin.end && timeline.progress() >= .999) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(release);
        }
        if (!updating && released && pinTarget.getBoundingClientRect().top > window.innerHeight + 32) rearm();
      };
      const navigateFounder = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (!(event.target instanceof Element) || !event.target.closest('a[href="#founder"]')) return;
        event.preventDefault();
        navigating = true;
        if (released) rearm();
        window.history.replaceState(null, "", "#founder");
        window.scrollTo({ top: pin.start, behavior: "smooth" });
      };
      const cancelNavigation = () => {
        // User input may interrupt smooth anchor navigation. Only clear the guard;
        // never alter the pin, timeline or scroll position from an input event.
        if (!navigating) return;
        navigating = false;
      };
      document.addEventListener("click", navigateFounder);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("wheel", cancelNavigation, { passive: true });
      window.addEventListener("touchstart", cancelNavigation, { passive: true });
      window.addEventListener("pointerdown", cancelNavigation, { passive: true });
      window.addEventListener("keydown", cancelNavigation);
      document.fonts.ready.then(() => {
        if (!alive) return;
        ScrollTrigger.refresh();
        if (!initialAnchorHandled.current) {
          initialAnchorHandled.current = true;
          if (window.location.hash === "#founder") window.scrollTo({ top: pin.start, behavior: "instant" });
        }
      });
      return () => {
        alive = false;
        cancelAnimationFrame(frame);

        document.removeEventListener("click", navigateFounder);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("wheel", cancelNavigation);
        window.removeEventListener("touchstart", cancelNavigation);
        window.removeEventListener("pointerdown", cancelNavigation);
        window.removeEventListener("keydown", cancelNavigation);
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
