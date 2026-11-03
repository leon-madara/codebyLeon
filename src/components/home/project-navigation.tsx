"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OPEN_CONFIGURATOR_EVENT } from "./configurator";
import { scrollToPosition } from "@/lib/scroll-to";
export function ProjectNavigation() {
  const router = useRouter();
  useEffect(() => {
    let cancelNavigation: (() => void) | undefined;
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link || link.download || (link.target && link.target !== "_self")) return;
      const hash = link.getAttribute("href") ?? "";
      // The curtain and pinned sections own their special destinations.
      if (["#top", "#founder", "#services"].includes(hash)) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, "", hash);
      cancelNavigation = scrollToPosition(() => {
        const offset = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        return target.getBoundingClientRect().top + window.scrollY - offset;
      });
    };
    // Bubble after document-level curtain and section handlers have run.
    window.addEventListener("click", navigate);
    return () => { cancelNavigation?.(); window.removeEventListener("click", navigate); };
  }, []);
  useEffect(() => {
    let active = true;
    let frame = 0;
    // Route returns and reloads must resolve anchors after fonts and pins settle.
    document.fonts.ready.then(() => {
      if (!active) return;
      frame = requestAnimationFrame(() => {
        const hash = window.location.hash;
        if (!hash || !document.getElementById(hash.slice(1))) return;
        const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
          .find((anchor) => anchor.getAttribute("href") === hash);
        link?.click();
      });
    });
    return () => { active = false; cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const capture = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.download || (link.target && link.target !== "_self")) return;
      const target = new URL(link.href);
      if (target.origin !== location.origin || target.pathname !== "/get-started.html") return;
      event.preventDefault();
      router.push(target.pathname + target.search, { scroll: false });
    };
    const open = (event: Event) => {
      const href = (event as CustomEvent<string>).detail;
      const destination = typeof href === "string" && /^\/get-started\.html(?:\?|$)/.test(href) ? href : "/get-started.html";
      router.push(destination, { scroll: false });
    };
    document.addEventListener("click", capture);
    window.addEventListener(OPEN_CONFIGURATOR_EVENT, open);
    return () => { document.removeEventListener("click", capture); window.removeEventListener(OPEN_CONFIGURATOR_EVENT, open); };
  }, [router]);
  return null;
}
