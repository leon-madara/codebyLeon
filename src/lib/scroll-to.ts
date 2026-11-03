"use client";

import { gsap } from "@/lib/gsap";

let cancelActive: (() => void) | undefined;

/** Explicit navigation only; wheel and touch scrolling stay native. */
export function scrollToPosition(destination: () => number, onComplete?: () => void) {
  cancelActive?.();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: destination(), behavior: "instant" });
    onComplete?.();
    return () => {};
  }

  let previous = 0;
  const progress = { value: 0 };
  let tween: gsap.core.Tween | undefined;
  const cancel = () => {
    tween?.kill();
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("pointerdown", cancel);
    window.removeEventListener("keydown", onKey);
    if (cancelActive === cancel) cancelActive = undefined;
  };
  const onKey = (event: KeyboardEvent) => {
    if (["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) cancel();
  };
  cancelActive = cancel;
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  window.addEventListener("pointerdown", cancel, { passive: true });
  window.addEventListener("keydown", onKey);
  tween = gsap.to(progress, {
    value: 1,
    duration: Math.min(1.6, Math.max(.65, Math.abs(destination() - window.scrollY) / 7000)),
    ease: "power2.inOut",
    onUpdate: () => {
      // Re-measure as refreshed pins or responsive content change the geometry.
      const fraction = previous >= 1 ? 1 : (progress.value - previous) / (1 - previous);
      window.scrollBy({ top: (destination() - window.scrollY) * fraction, behavior: "instant" });
      previous = progress.value;
    },
    onComplete: () => { cancel(); onComplete?.(); },
  });
  return cancel;
}
