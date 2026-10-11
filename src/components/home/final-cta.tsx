"use client";

import { ArrowRight, CalendarCheck, SlidersHorizontal, Zap } from "lucide-react";
import { Reveal } from "./reveal";

export function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-28"
      aria-labelledby="final-cta-heading"
    >
      {/* Full-bleed inverted band — ink in light mode, paper in dark mode */}
      <Reveal>
        <div className="relative overflow-hidden border-t border-border bg-foreground px-4 py-20 text-background sm:px-6 md:py-28">
          {/* restrained dot texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_65%_75%_at_50%_50%,black,transparent_80%)]"
          />

          {/* quiet colour washes — restrained */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-[110px]"
            style={{
              background:
                "radial-gradient(circle at 45% 45%, var(--signal-wash-a), transparent 68%)",
              mixBlendMode: "screen",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-20 h-96 w-96 rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle at 55% 55%, var(--signal-wash-c), transparent 68%)",
              mixBlendMode: "screen",
            }}
          />

          {/* blueprint registration corners */}
          <span aria-hidden className="mark-tl" />
          <span aria-hidden className="mark-tr" />
          <span aria-hidden className="mark-bl" />
          <span aria-hidden className="mark-br" />

          <div className="relative mx-auto max-w-5xl text-center">
            <p className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-signal-inv">
              <Zap className="size-3.5 fill-signal-inv" aria-hidden />
              Tell us what you have in mind.
            </p>

            <h2
              id="final-cta-heading"
              className="text-balance mx-auto mt-8 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
            >
              Ready to Plan Your{" "}
              <em className="font-serif font-medium italic tracking-tight text-signal-inv">
                Website?
              </em>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-background/70 md:text-lg">
              Tell us about your business and what you need your website to do.
              We can discuss the right approach, the scope, and your budget.
            </p>

            <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
              <a
                href="/get-started.html?intent=discovery-call"
                className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[3px] bg-signal px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85 sm:w-auto"
              >
                <CalendarCheck className="size-4" aria-hidden />
                Plan a 20-minute call
              </a>
              <a
                href="/get-started.html"
                className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[3px] border border-background/25 px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-background transition-colors duration-300 hover:border-signal-inv hover:text-signal-inv sm:w-auto"
              >
                <SlidersHorizontal className="size-4" aria-hidden />
                Tell us about your project
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
