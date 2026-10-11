"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const PROJECTS = [
  {
    "number": "01",
    "label": "Personal Website",
    "client": "Kossy Langat",
    "category": "Structural Engineering & Management",
    "title": "Personal Website & Project Portfolio",
    "description": "A website bringing Kossy Langat's engineering experience, qualifications and projects together in one place.",
    "outcome": "Experience & Projects in One Place",
    "href": "/work/kossy-langat",
    "image": "/images/work/kossy-langat.png",
    "imageAlt": "Blueprint-style illustration for the Kossy Langat personal website"
  },
  {
    "number": "02",
    "label": "Registration Portal",
    "client": "Delivah Dispatch",
    "category": "Freight & Logistics",
    "title": "Carrier Registration & Document Portal",
    "description": "A guided online form where carriers register and upload documents for the dispatch team to review.",
    "outcome": "Online Registration & Document Review",
    "href": "/work/delivah-dispatch-hub",
    "image": "/images/work/delivah-dispatch.png",
    "imageAlt": "Freight-route illustration for the Delivah Dispatch registration portal"
  },
  {
    "number": "03",
    "label": "Dispatch App",
    "client": "Legit Logistics",
    "category": "Logistics & Delivery Tracking",
    "title": "Dispatch Dashboard & Driver App",
    "description": "A dashboard for dispatchers, delivery updates from drivers and online tracking for customers.",
    "outcome": "Connected Delivery Updates",
    "href": "/work/legit-logistics",
    "image": "/images/work/legit-logistics.png",
    "imageAlt": "Dispatch dashboard illustration for the Legit Logistics app"
  }
];

export function Works() {
  const [preview, setPreview] = useState<number | null>(null);
  const reduce = useReducedMotion();

  // cursor-following preview (desktop pointers)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 260, damping: 30, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 260, damping: 30, mass: 0.6 });
  const px = useTransform(sx, (v) =>
    Math.min(v + 32, (typeof window === "undefined" ? 1440 : window.innerWidth) - 372)
  );
  const py = useTransform(sy, (v) => Math.max(v - 218, 96));

  const activeProject = preview !== null ? PROJECTS[preview] : null;

  return (
    <section id="work" className="relative scroll-mt-28 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            label="Selected Works"
            headline={
              <>
                A Few{" "}
                <em className="font-serif font-medium italic tracking-tight text-signal">
                  Projects.
                </em>
              </>
            }
            supporting="Websites and apps built around what each client needed."
            className="mb-0 md:mb-16"
          />
          <Reveal delay={0.1} className="shrink-0 pb-1">
            <a
              href="/work"
              className="group inline-flex h-11 items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:text-signal"
            >
              <span className="text-link">View All Projects</span>
              <ArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </Reveal>
        </div>

        {/* Case index — full-width rows with cursor-following previews */}
        <div
          className="mt-12 md:mt-16"
          onMouseMove={(e) => {
            mx.set(e.clientX);
            my.set(e.clientY);
          }}
          onMouseLeave={() => setPreview(null)}
        >
          {PROJECTS.map((project, i) => (
            <Reveal key={project.number} delay={0.05}>
              <article
                className="group border-t border-border transition-colors duration-300 last:border-b hover:bg-signal/[0.03]"
                onMouseEnter={() => setPreview(i)}
              >
                <div className="grid items-start gap-8 px-1 py-10 md:grid-cols-[110px_1fr_auto] md:gap-10 md:py-12">
                  {/* ghost number */}
                  <div className="hidden select-none md:block" aria-hidden>
                    <p className="ghost-number font-display text-8xl font-bold leading-none lg:text-9xl">
                      {project.number}
                    </p>
                  </div>

                  {/* content */}
                  <div>
                    <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[10px] uppercase tracking-[0.18em] md:text-[11px]">
                      <span className="font-semibold text-signal">{project.label}</span>
                      <span aria-hidden className="text-muted-foreground/50">
                        /
                      </span>
                      <span className="text-muted-foreground">
                        {project.client} — {project.category}
                      </span>
                    </p>

                    {/* mobile compact preview */}
                    <div className="mt-4 md:hidden">
                      { }
                      <img
                        src={project.image}
                        alt={project.imageAlt}
                        loading="lazy"
                        className="aspect-[7/4] w-full border border-border object-cover"
                      />
                    </div>

                    <a
                      href={project.href}
                      className="text-link mt-4 block max-w-3xl font-display text-2xl font-semibold tracking-tight text-foreground decoration-signal decoration-1 underline-offset-8 transition-colors duration-300 hover:text-signal md:text-3xl lg:text-4xl"
                    >
                      {project.title}
                    </a>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {project.description}
                    </p>

                    <p className="mt-5 flex flex-wrap items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/75">
                      <span aria-hidden className="text-signal">
                        ▸
                      </span>
                      {project.outcome}
                      <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground/50 md:hidden">
                        {project.number}
                      </span>
                    </p>
                  </div>

                  {/* action — desktop */}
                  <a
                    href={project.href}
                    className="group/link hidden shrink-0 items-center gap-2.5 self-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-signal md:inline-flex"
                  >
                    <span className="text-link">View Project</span>
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
                      aria-hidden
                    />
                  </a>
                </div>

                {/* action — mobile */}
                <a
                  href={project.href}
                  className="mb-8 ml-1 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-signal md:hidden"
                >
                  View Project
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* floating cursor preview — desktop pointers only */}
      <AnimatePresence>
        {activeProject && !reduce ? (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ x: px, y: py }}
            className="pointer-events-none fixed left-0 top-0 z-40 hidden w-[340px] lg:block"
          >
            <div className="relative border border-border bg-card p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)]">
              <span aria-hidden className="mark-tl" />
              <span aria-hidden className="mark-tr" />
              <span aria-hidden className="mark-bl" />
              <span aria-hidden className="mark-br" />
              { }
              <img
                src={activeProject.image}
                alt=""
                className="aspect-[7/4] w-full object-cover"
              />
              <p className="flex items-baseline justify-between gap-3 px-1.5 pb-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.16em]">
                <span className="text-signal">{activeProject.label}</span>
                <span className="text-muted-foreground">{activeProject.client}</span>
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
