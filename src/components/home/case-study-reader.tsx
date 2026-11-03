"use client";

import Image from "next/image";

import { SectionLabel } from "./section-label";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { openConfigurator } from "./configurator";

type Project = {
  slug: string;
  number: string;
  label: string;
  client: string;
  category: string;
  title: string;
  description: string;
  challenge: string;
  architecture: string;
  outcome: string;
  deliverables: string[];
  image: string;
  imageAlt: string;
  tierHref: string;
};

const PROJECTS: Project[] = [
  {
    "slug": "kossy-langat",
    "number": "01",
    "label": "Personal Website",
    "client": "Kossy Langat",
    "category": "Structural Engineering & Management",
    "title": "Personal Website & Project Portfolio",
    "description": "A website bringing Kossy Langat's engineering experience, qualifications and projects together in one place.",
    "challenge": "Experience and project details were spread across PDFs and a listing site, making them harder to browse.",
    "architecture": "A personal website with a qualifications timeline, project gallery and layouts for phones and larger screens.",
    "outcome": "Visitors can browse experience, qualifications and projects in one place.",
    "deliverables": [
      "Visual Identity",
      "Project Portfolio",
      "Qualifications Timeline",
      "Search Setup & Visitor Analytics"
    ],
    "image": "/images/work/kossy-langat.png",
    "imageAlt": "Blueprint-style illustration for the Kossy Langat personal website",
    "tierHref": "/get-started.html?tier=custom-website"
  },
  {
    "slug": "delivah-dispatch-hub",
    "number": "02",
    "label": "Registration Portal",
    "client": "Delivah Dispatch",
    "category": "Freight & Logistics",
    "title": "Carrier Registration & Document Portal",
    "description": "A guided online form where carriers register and upload documents for the dispatch team to review.",
    "challenge": "Carrier registration relied on phone calls, paper forms and email attachments. The team needed a clearer way to collect and review information.",
    "architecture": "A step-by-step registration form, document uploads, requirement checks and a dashboard for staff to review applications.",
    "outcome": "Carrier details and documents are collected together for staff to review.",
    "deliverables": [
      "Online Registration Portal",
      "Step-by-Step Form",
      "Document Uploads & Storage",
      "Staff Review Dashboard"
    ],
    "image": "/images/work/delivah-dispatch.png",
    "imageAlt": "Freight-route illustration for the Delivah Dispatch registration portal",
    "tierHref": "/get-started.html?tier=portals-workflows"
  },
  {
    "slug": "legit-logistics",
    "number": "03",
    "label": "Dispatch App",
    "client": "Legit Logistics",
    "category": "Logistics & Delivery Tracking",
    "title": "Dispatch Dashboard & Driver App",
    "description": "A dashboard for dispatchers, delivery updates from drivers and online tracking for customers.",
    "challenge": "Bookings and delivery updates were spread across calls, spreadsheets and separate records.",
    "architecture": "A dispatch dashboard connected to a driver app, customer tracking and automatic delivery notifications.",
    "outcome": "Dispatchers, drivers and customers can follow delivery progress through connected tools.",
    "deliverables": [
      "Dispatch Dashboard",
      "Driver App",
      "Customer Delivery Tracking",
      "Automatic Status Notifications"
    ],
    "image": "/images/work/legit-logistics.png",
    "imageAlt": "Dispatch dashboard illustration for the Legit Logistics app",
    "tierHref": "/get-started.html?tier=portals-workflows"
  }
];

type View = { type: "overview" } | { type: "project"; index: number } | null;

/** Programmatic opener (e.g. command palette). */
export function openCaseStudy(href: string) {
  window.location.assign(href === "/work" || href.startsWith("/work/") ? href : "/work");
}

function viewForHref(href: string): View {
  if (href === "/work") return { type: "overview" };
  const slug = href.replace("/work/", "").replace(/\/$/, "");
  const index = PROJECTS.findIndex((p) => p.slug === slug);
  return index >= 0 ? { type: "project", index } : { type: "overview" };
}

export function CaseStudyReader({ initialHref }: { initialHref?: string } = {}) {
  const router = useRouter();
  const [view, setView] = useState<View>(() => initialHref ? viewForHref(initialHref) : null);

  const openHref = useCallback((href: string) => {
    setView(viewForHref(href));
  }, []);

  // Programmatic opens (command palette, etc.)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      openHref(typeof href === "string" ? href : "/work");
    };
    window.addEventListener("cbl:open-case-study", onOpen);
    return () => window.removeEventListener("cbl:open-case-study", onOpen);
  }, [openHref]);

  // Intercept plain left-clicks on /work destination links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/work")) return;
      e.preventDefault();
      openHref(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openHref]);

  const handleOpenChange = (next: boolean) => {
    if (!next && initialHref) {
      router.push("/#work", { scroll: false });
      return;
    }
    if (!next) setView(null);
  };

  const open = view !== null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-describedby="case-study-desc"
        className="top-[50%] flex max-h-[88vh] w-full max-w-[calc(100%-1.5rem)] translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-[3px] border-border bg-card p-0 duration-300 sm:max-w-2xl"
      >
        <DialogTitle className="sr-only">Case study</DialogTitle>
        <DialogDescription id="case-study-desc" className="sr-only">
          Project details and what was built.
        </DialogDescription>

        <AnimatePresence mode="wait" initial={false}>
          {view?.type === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="scroll-slim max-h-[88vh] overflow-y-auto px-6 py-7 sm:px-8"
            >
              <SectionLabel>All Case Studies</SectionLabel>
              <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                The{" "}
                <em className="font-serif font-medium italic text-signal">Index.</em>
              </h3>
              <div className="mt-6">
                {PROJECTS.map((p, i) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => setView({ type: "project", index: i })}
                    className="group flex w-full items-center gap-5 border-t border-border py-5 text-left transition-colors duration-200 last:border-b hover:bg-signal/[0.04]"
                  >
                    <span
                      aria-hidden
                      className="ghost-number font-display text-4xl font-bold leading-none"
                    >
                      {p.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                        {p.label}
                      </span>
                      <span className="mt-1 block truncate font-display text-base font-semibold tracking-tight text-foreground">
                        {p.title}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {p.client} — {p.category}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-signal"
                      aria-hidden
                    />
                  </button>
                ))}
              </div>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                Choose a project to see what was built.
              </p>
            </motion.div>
          ) : view?.type === "project" ? (
            <ProjectView
              key="project"
              project={PROJECTS[view.index]}
              onBrowseAll={() => setView({ type: "overview" })}
              onStartSimilar={() => {
                setView(null);
                window.setTimeout(
                  () => openConfigurator(PROJECTS[view.index].tierHref),
                  180
                );
              }}
            />
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function ProjectView({
  project,
  onBrowseAll,
  onStartSimilar,
}: {
  project: Project;
  onBrowseAll: () => void;
  onStartSimilar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-slim max-h-[88vh] overflow-y-auto"
    >
      {/* cover */}
      <div className="relative border-b border-border">
        <Image
          src={project.image}
          alt={project.imageAlt}
          width={1344}
          height={768}
          sizes="(max-width: 672px) calc(100vw - 24px), 672px"
          loading="eager"
          className="aspect-[7/3] w-full object-cover"
        />
        <span aria-hidden className="mark-tl" />
        <span aria-hidden className="mark-tr" />
      </div>

      <div className="px-6 py-7 sm:px-8">
        <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="font-semibold text-signal">{project.label}</span>
          <span aria-hidden className="text-muted-foreground/50">
            /
          </span>
          <span className="text-muted-foreground">
            {project.client} — {project.category}
          </span>
        </p>

        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
          <em className="font-serif font-medium italic">{project.title}</em>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        {/* ledger: challenge / architecture / outcome */}
        <dl className="mt-7">
          {[
            { label: "The Challenge", value: project.challenge },
            { label: "What We Built", value: project.architecture },
            { label: "What It Helps With", value: project.outcome },
          ].map((row) => (
            <div
              key={row.label}
              className="grid gap-2 border-t border-border py-4 sm:grid-cols-[132px_1fr] sm:gap-6"
            >
              <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-signal">
                {row.label}
              </dt>
              <dd className="text-sm leading-relaxed text-foreground/80">{row.value}</dd>
            </div>
          ))}
        </dl>

        {/* deliverables */}
        <div className="mt-3 border-t border-border pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            What Was Included
          </p>
          <ul className="mt-4 grid gap-x-8 sm:grid-cols-2">
            {project.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-center gap-3 border-t border-border py-2.5 text-sm font-medium text-foreground first:border-t-0 sm:first:border-t"
              >
                <Check className="size-4 shrink-0 text-jade" aria-hidden strokeWidth={2.5} />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* actions */}
        <div className="mt-7 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onStartSimilar}
            className="group inline-flex h-11 items-center justify-center gap-2.5 rounded-[3px] bg-signal px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85"
          >
            Start a Similar Project
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={onBrowseAll}
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 hover:text-signal"
          >
            <span className="text-link">Browse All Case Studies</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
