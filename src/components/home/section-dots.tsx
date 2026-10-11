"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "top", label: "Hero" },
  { id: "reality", label: "Reality Check" },
  { id: "services", label: "Services" },
  { id: "founder", label: "Founder" },
  { id: "work", label: "Selected Works" },
  { id: "articles", label: "Articles" },
  { id: "contact", label: "Get Started" },
];

export function SectionDots() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const probe = window.scrollY + window.innerHeight * 0.35;
        let current = SECTIONS[0].id;
        for (const s of SECTIONS) {
          const el = document.getElementById(s.id);
          if (el && el.offsetTop <= probe) current = s.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center"
          >
            <span
              className={cn(
                "pointer-events-none absolute right-6 whitespace-nowrap border border-border bg-background/95 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:opacity-100",
                isActive && "text-signal"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "block size-2 rotate-45 border transition-all duration-300",
                isActive
                  ? "border-signal bg-signal"
                  : "border-muted-foreground/50 bg-transparent group-hover:border-foreground"
              )}
            >
              <span className="sr-only">{s.label}</span>
            </span>
          </a>
        );
      })}
    </nav>
  );
}
