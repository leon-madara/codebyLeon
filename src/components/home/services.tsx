"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Plus } from "lucide-react";
import { ServiceSwitcher } from "./service-switcher";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { ScopeMatcher } from "./scope-matcher";

interface Tier {
  id: string;
  label: string;
  badge?: string;
  title: string;
  description: string;
  idealFor: string;
  timeline: string;
  highlights: string[];
  deliverables: string[];
  action: string;
  href: string;
}

const TIERS: Tier[] = [
  {
    id: "custom-website",
    label: "01 • New Builds",
    badge: "New Website",
    title: "A New Website for Your Business",
    description:
      "A website that explains what you do, shows your work, and helps people get in touch.",
    idealFor:
      "Businesses starting out or creating their first website.",
    timeline: "3 – 5 Weeks",
    highlights: [
      "Pages designed and built around your business",
      "Careful attention to loading speed, especially on phones",
      "Clear navigation so visitors can find what they need",
      "Enquiry forms connected to your email or customer records",
    ],
    deliverables: [
      "Page Designs in Figma",
      "A Website Built for Your Business",
      "Layouts for Phones, Tablets and Computers",
      "Search and Visitor Tracking Setup",
    ],
    action: "Start Your New Website",
    href: "/get-started.html?tier=custom-website",
  },
  {
    id: "redesign-modernization",
    label: "02 • Website Redesign",
    title: "A Fresh Look for Your Existing Website",
    description:
      "Update your website so people can understand your services and see what your business offers today.",
    idealFor:
      "Businesses whose website needs to catch up with their work.",
    timeline: "2 – 4 Weeks",
    highlights: [
      "A review of what visitors find difficult on your current site",
      "Readable text, consistent colours, and clear page layouts",
      "Plain language that explains your services and the next step",
      "A move to the new site with existing pages and search links in mind",
    ],
    deliverables: [
      "Brand Colours and Typography",
      "New Page Designs",
      "Clear Paths to Contact You",
      "A Plan for Moving to the New Site",
    ],
    action: "Plan Your Redesign",
    href: "/get-started.html?tier=redesign-modernization",
  },
  {
    id: "portals-workflows",
    label: "03 • Client & Team Tools",
    title: "Tools for Your Clients and Team",
    description:
      "Online forms, client accounts, and team dashboards that help you manage everyday work.",
    idealFor:
      "Teams spending too much time on repeated admin and follow-ups.",
    timeline: "3 – 6 Weeks",
    highlights: [
      "Online forms that gather the details you need from clients",
      "Accounts that give each person access to the information they need",
      "Automatic document handling, reminders, and updates",
      "Connections between your website and the tools your team uses",
    ],
    deliverables: [
      "A Tool Built Around Your Work",
      "User Accounts and Data Storage",
      "Automatic Updates and Routine Tasks",
      "A Dashboard for Your Team",
    ],
    action: "Discuss Your Team’s Tools",
    href: "/get-started.html?tier=portals-workflows",
  },
];

function TierRow({ tier, index }: { tier: Tier; index: number }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <Reveal delay={index * 0.06}>
      <article className="group border-t border-border transition-colors duration-300 last:border-b hover:bg-signal/[0.03]">
        <div className="grid gap-6 px-1 py-10 md:grid-cols-[96px_1fr] md:gap-10 md:py-12">
          {/* ghost index number */}
          <div aria-hidden className="hidden select-none md:block">
            <p className="ghost-number font-display text-7xl font-bold leading-none lg:text-8xl">
              {String(index + 1).padStart(2, "0")}
            </p>
          </div>

          <div>
            {/* label + annotation */}
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground md:hidden">
                {tier.label}
              </span>
              <span className="hidden font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground md:inline">
                {tier.label}
              </span>
              {tier.badge ? (
                <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-signal">
                  <span aria-hidden className="size-1.5 rotate-45 bg-signal" />
                  {tier.badge}
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
              {tier.title}
            </h3>

            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {tier.description}
            </p>

            {/* spec meta line */}
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>
                <span className="text-foreground/40">Ideal for —</span>{" "}
                <span className="normal-case tracking-normal text-muted-foreground">
                  {tier.idealFor}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-foreground/40">Timeline</span>
                <span className="text-signal">{tier.timeline}</span>
              </span>
            </p>

            {/* row actions */}
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() => setOpen((v) => !v)}
                className="group/trigger inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-signal"
              >
                <span
                  className="grid size-6 place-items-center border border-border transition-colors group-hover/trigger:border-signal"
                  aria-hidden
                >
                  <Plus
                    className={`size-3.5 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                  />
                </span>
                See what’s included
              </button>

              <a
                href={tier.href}
                className="group/action inline-flex h-11 items-center gap-2.5 rounded-[3px] border border-border px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-signal hover:text-signal"
              >
                {tier.action}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover/action:translate-x-1"
                  aria-hidden
                />
              </a>
            </div>

            {/* expandable scope ledger */}
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={detailsId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 grid gap-10 border-t border-border pt-8 md:grid-cols-2 md:gap-12">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        How it helps
                      </p>
                      <ul className="mt-5">
                        {tier.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-3.5 border-t border-border py-3.5 text-sm leading-relaxed text-foreground/80 first:border-t-0"
                          >
                            <span
                              aria-hidden
                              className="mt-[7px] size-1.5 shrink-0 rotate-45 bg-signal"
                            />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                        What you get
                      </p>
                      <ul className="mt-5">
                        {tier.deliverables.map((d) => (
                          <li
                            key={d}
                            className="flex items-center gap-3.5 border-t border-border py-3.5 text-sm font-medium text-foreground first:border-t-0"
                          >
                            <Check
                              className="size-4 shrink-0 text-jade"
                              aria-hidden
                              strokeWidth={2.5}
                            />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Services() {
  return (
    <section id="services" className="relative scroll-mt-28 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div data-services-reveal><SectionHeading
          label="01 / Website Services"
          headline={
            <>
              Websites and Tools That{" "}
              <em className="font-serif font-medium italic tracking-tight text-signal">
                Work for Your Business.
              </em>
            </>
          }
        /></div>

        {/* Editorial statement — type only, no box */}
        <div data-services-reveal><Reveal className="mb-14 md:mb-16">
          <div className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
            <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl">
              Help people understand your business.{" "}
              <em className="font-serif font-medium italic">
                Give them a clear next step
              </em>{" "}
              with a website designed around what you offer.
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              You get clear pages, readable text, and layouts that work on different screens.
              Choose a new website, a redesign, or a tool that helps your team manage work.
            </p>
          </div>
        </Reveal></div>

        {/* Content choices: tiers or matcher — underline tabs */}
        <div data-services-reveal><Reveal className="mb-10 md:mb-12">
          <ServiceSwitcher
            tiers={
              <div>
                {TIERS.map((tier, i) => (
                  <TierRow key={tier.id} tier={tier} index={i} />
                ))}
              </div>
            }
            matcher={<ScopeMatcher />}
          />
        </Reveal></div>

        {/* Plan Your Project invitation — signal-edged band */}
        <div data-services-reveal><Reveal delay={0.05}>
          <div className="border-y border-border border-l-2 border-l-signal py-9 pl-7 md:pl-9">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  <span aria-hidden className="size-1.5 rotate-45 bg-signal" />
                  Plan Your Project
                </p>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  Not Sure Where to Start?
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                  Answer a few questions about your business, goals, and budget.
                  You’ll get a suggested starting point to discuss with Leon.
                </p>
                <p className="mt-5 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  <span>Go at your own pace</span>
                  <span aria-hidden className="text-signal">
                    /
                  </span>
                  <span>Suggested project and budget range</span>
                  <span aria-hidden className="text-signal">
                    /
                  </span>
                  <span>7 guided questions</span>
                </p>
              </div>

              <a
                href="/get-started.html"
                className="group inline-flex h-12 shrink-0 items-center justify-center gap-2.5 rounded-[3px] bg-signal px-8 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85"
              >
                Plan Your Project
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </a>
            </div>
          </div>
        </Reveal></div>
      </div>
    </section>
  );
}
