"use client";

import { useLayoutEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

const legacyAnchors: Record<string, string> = {
  "#hero": "#top",
  "#portfolio": "#work",
  "#about": "#founder",
};

/** Preserve shared links from the former homepage without changing its sections. */
export function LegacyAnchors() {
  useLayoutEffect(() => {
    let cancelled = false;
    let frame = 0;
    const navigate = async () => {
      const original = window.location.hash;
      const hash = legacyAnchors[original] ?? original;
      if (!legacyAnchors[original] && original !== "#services") return;
      if (hash !== original) {
        window.history.replaceState(null, "", hash);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
      await document.fonts.ready;
      if (cancelled || window.location.hash !== hash) return;
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        const services = hash === "#services" ? ScrollTrigger.getById("reality-sequence") : undefined;
        const top = hash === "#top" ? 0 : services?.end ?? target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "instant" });
      });
    };
    void navigate();
    window.addEventListener("hashchange", navigate);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", navigate);
    };
  }, []);
  return null;
}
