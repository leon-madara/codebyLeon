"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import "./navbar.css";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { OPEN_COMMAND_EVENT } from "./command-palette";

const NAV_LINKS = [
  { label: "Reality Check", href: "#reality", id: "reality" },
  { label: "Services", href: "#services", id: "services" },
  { label: "Founder", href: "#founder", id: "founder" },
  { label: "Work", href: "#work", id: "work" },
  { label: "Articles", href: "#articles", id: "articles" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuInnerRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const movement = useRef({ height: 0 });
  const animation = useRef<gsap.core.Tween | null>(null);
  const scrollAnimation = useRef<gsap.core.Tween | null>(null);
  const locked = useRef(false);
  const instantClose = useRef(false);
  const fixedPins = useRef<Array<{ element: HTMLElement; marginTop: number }>>([]);
  const pendingLink = useRef<HTMLAnchorElement | null>(null);
  const replayingLink = useRef(false);

  const restorePins = () => {
    fixedPins.current.forEach(({ element, marginTop }) => gsap.set(element, { marginTop }));
    fixedPins.current = [];
  };
  const capturePins = () => {
    const seen = new Set<HTMLElement>();
    ScrollTrigger.getAll().forEach((trigger) => {
      const element = trigger.pin;
      if (!(element instanceof HTMLElement) || seen.has(element) || getComputedStyle(element).position !== "fixed") return;
      seen.add(element);
      fixedPins.current.push({ element, marginTop: Number.parseFloat(getComputedStyle(element).marginTop) || 0 });
    });
  };
  const applyPush = (height: number) => {
    gsap.set(document.documentElement, { "--nav-menu-push": `${height}px` });
    if (menuRef.current) gsap.set(menuRef.current, { height, autoAlpha: height > 0 ? 1 : 0 });
    fixedPins.current.forEach(({ element, marginTop }) => gsap.set(element, { marginTop: marginTop + height }));
  };
  const lockPage = (value: boolean) => {
    locked.current = value;
    gsap.set(document.documentElement, { attr: { "data-nav-menu-open": value ? "true" : "false" } });
    gsap.set(document.querySelectorAll("[data-nav-push]"), { inert: value });
  };

  useGSAP(() => {
    const cancelScroll = () => scrollAnimation.current?.kill();
    const onScrollKey = (event: KeyboardEvent) => {
      if (["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) cancelScroll();
    };
    // Measure refreshed pins in their normal geometry, then restore the visual push.
    // Relative page offsets preserve the containing block used by fixed pinning.
    const beforeRefresh = () => {
      if (!locked.current) return;
      gsap.set(document.documentElement, { "--nav-menu-push": "0px" });
      restorePins();
    };
    const afterRefresh = () => {
      if (!locked.current) return;
      capturePins();
      applyPush(movement.current.height);
    };
    ScrollTrigger.addEventListener("refreshInit", beforeRefresh);
    ScrollTrigger.addEventListener("refresh", afterRefresh);
    window.addEventListener("wheel", cancelScroll, { passive: true });
    window.addEventListener("touchstart", cancelScroll, { passive: true });
    window.addEventListener("pointerdown", cancelScroll, { passive: true });
    window.addEventListener("keydown", onScrollKey);
    return () => {
      animation.current?.kill();
      scrollAnimation.current?.kill();
      applyPush(0);
      restorePins();
      lockPage(false);
      ScrollTrigger.removeEventListener("refreshInit", beforeRefresh);
      ScrollTrigger.removeEventListener("refresh", afterRefresh);
      window.removeEventListener("wheel", cancelScroll);
      window.removeEventListener("touchstart", cancelScroll);
      window.removeEventListener("pointerdown", cancelScroll);
      window.removeEventListener("keydown", onScrollKey);
    };
  }, { scope: headerRef });

  useGSAP((context) => {
    animation.current?.kill();
    const expanded = open && window.innerWidth < 1024;
    const wasLocked = locked.current;
    if (expanded && !wasLocked) {
      scrollAnimation.current?.kill();
      capturePins();
      lockPage(true);
    }
    const navHeight = headerRef.current?.querySelector("nav")?.getBoundingClientRect().height ?? 64;
    const targetHeight = expanded ? Math.min((menuInnerRef.current?.getBoundingClientRect().height ?? 0) + 1, window.innerHeight - navHeight) : 0;
    const immediate = instantClose.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.innerWidth >= 1024;
    instantClose.current = false;
    animation.current = gsap.to(movement.current, {
      height: targetHeight, duration: immediate ? 0 : .38, ease: "power2.inOut",
      onUpdate: () => applyPush(movement.current.height),
      onComplete: () => {
        applyPush(targetHeight);
        if (expanded) return;
        restorePins();
        lockPage(false);
        if (wasLocked && window.innerWidth < 1024) toggleRef.current?.focus({ preventScroll: true });
        const link = pendingLink.current;
        pendingLink.current = null;
        if (link?.isConnected) {
          const href = link.getAttribute("href") ?? "";
          const target = href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
          if (target && href !== "#founder" && href !== "#services") {
            if (window.location.hash !== href) window.history.pushState(null, "", href);
            let previous = 0;
            const scrollProgress = { value: 0 };
            context.add(() => {
              scrollAnimation.current = gsap.to(scrollProgress, {
                value: 1, duration: immediate ? 0 : .65, ease: "power2.inOut",
                onUpdate: () => {
                  // Remaining distance is measured again each frame because a
                  // section may discard spent pin space during this navigation.
                  const fraction = previous >= 1 ? 1 : (scrollProgress.value - previous) / (1 - previous);
                  window.scrollBy({ top: (target.getBoundingClientRect().top - navHeight) * fraction, behavior: "instant" });
                  previous = scrollProgress.value;
                },
              });
            });
            return;
          }
          // Replay after closing so existing section-specific anchor handlers see
          // the original page geometry, with no menu offset or scroll lock.
          replayingLink.current = true;
          link.click();
          replayingLink.current = false;
        }
      },
    });
  }, { scope: headerRef, dependencies: [open] });

  useEffect(() => {
    const onResize = () => {
      if (!locked.current) return;
      instantClose.current = true;
      pendingLink.current = null;
      setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      pendingLink.current = null;
      setOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scrollspy — highlight the section currently in the reading zone
  useEffect(() => {
    const ids = ["top", ...NAV_LINKS.map((l) => l.id), "contact"];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const probe = window.scrollY + window.innerHeight * 0.35;
        let current: string | null = null;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= probe) current = id;
        }
        // near the very bottom, pin to the last nav section
        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 4
        ) {
          current = "articles";
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:h-[72px]"
      >
        {/* Brand — square mark + wordmark */}
        <a
          href="#top"
          className="group flex items-center gap-3"
          aria-label="CodeByLeon — back to top"
        >
          <BrandLogo />
        </a>

        {/* Desktop nav — mono labels, underline on hover, scrollspy state */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "text-link font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-200 hover:text-foreground",
                    isActive ? "nav-link-active text-foreground" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2.5">
          {/* command palette trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COMMAND_EVENT))}
            aria-label="Open command palette (Ctrl K)"
            className="hidden h-10 items-center gap-2.5 rounded-[3px] border border-border px-3 text-muted-foreground transition-colors duration-300 hover:border-signal hover:text-signal md:flex"
          >
            <Search className="size-3.5" aria-hidden />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em]">Search</span>
            <span className="kbd-hint" aria-hidden>
              Ctrl K
            </span>
          </button>

          <ThemeToggle />

          <a
            href="/get-started.html"
            className="group hidden items-center gap-2 rounded-[3px] bg-signal px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85 sm:inline-flex"
          >
            Start a Project
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => { pendingLink.current = null; setOpen((v) => !v); }}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-[3px] border border-border text-foreground transition-colors hover:border-signal hover:text-signal lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — numbered index rows */}
      <div
        ref={menuRef}
        id="mobile-navigation"
        inert={!open}
        aria-hidden={open ? undefined : true}
        className="nav-push-menu border-b border-border bg-background/95 backdrop-blur-md lg:hidden"
      >
        <ul ref={menuInnerRef} className="px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link, i) => {
            const isActive = active === link.id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => {
                    if (replayingLink.current || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    event.stopPropagation();
                    pendingLink.current = event.currentTarget;
                    setOpen(false);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex items-baseline gap-4 border-t border-border py-3.5 text-base font-medium transition-colors first:border-t-0",
                    isActive ? "text-signal" : "text-foreground hover:text-signal"
                  )}
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-signal">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </a>
              </li>
            );
          })}
          <li className="mt-3 border-t border-border pt-4">
            <a
              href="/get-started.html"
              onClick={(event) => {
                if (replayingLink.current || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                event.stopPropagation();
                pendingLink.current = event.currentTarget;
                setOpen(false);
              }}
              className="flex items-center justify-center gap-2 rounded-[3px] bg-signal px-4 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-signal-foreground"
            >
              Start a Project
              <ArrowUpRight className="size-4" />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

