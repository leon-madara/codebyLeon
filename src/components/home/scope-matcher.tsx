"use client";

import { SectionLabel } from "./section-label";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StageValue = "startup" | "sme" | "corporate";
type ObjectiveValue = "flagship" | "rebrand" | "intake" | "retainer";

const STAGES: { value: StageValue; title: string; description: string }[] = [
  {
    value: "startup",
    title: "Starting a Business",
    description: "You’re launching and need a website to introduce your business",
  },
  {
    value: "sme",
    title: "Established Business",
    description: "You have an active business and want your website to reflect it",
  },
  {
    value: "corporate",
    title: "Larger Company",
    description: "Your team needs clear information for clients and partners",
  },
];

const OBJECTIVES: { value: ObjectiveValue; title: string; description: string }[] = [
  {
    value: "flagship",
    title: "Build a New Website",
    description: "Create a website around your services, work, and customers",
  },
  {
    value: "rebrand",
    title: "Update Your Existing Website",
    description: "Refresh your design, content, and navigation",
  },
  {
    value: "intake",
    title: "Make Client Admin Easier",
    description: "Collect details online and reduce repeated follow-ups",
  },
  {
    value: "retainer",
    title: "Keep Your Website Up to Date",
    description: "Get ongoing help with updates, new pages, and features",
  },
];

const DELIVERABLES_BY_TIER: Record<string, string[]> = {
  "custom-website": [
    "Page Designs in Figma",
    "A Website Built for Your Business",
    "Layouts for Phones, Tablets and Computers",
    "Search and Visitor Tracking Setup",
  ],
  "redesign-modernization": [
    "Brand Colours and Typography",
    "New Page Designs",
    "Clear Paths to Contact You",
    "A Plan for Moving to the New Site",
  ],
  "portals-workflows": [
    "A Tool Built Around Your Work",
    "User Accounts and Data Storage",
    "Automatic Updates and Routine Tasks",
    "A Dashboard for Your Team",
  ],
};

const RECOMMENDATIONS: Record<
  ObjectiveValue,
  {
    title: string;
    rationale: string;
    delivery: string;
    tier: string;
  }
> = {
  flagship: {
    title: "A New Website for Your Business",
    rationale:
      "A new website can explain your services, show your work, and give visitors a way to contact you.",
    delivery: "3 – 5 Weeks",
    tier: "custom-website",
  },
  rebrand: {
    title: "A Fresh Look for Your Existing Website",
    rationale:
      "A redesign can bring your current services, work, and contact details together in clearer pages.",
    delivery: "2 – 4 Weeks",
    tier: "redesign-modernization",
  },
  intake: {
    title: "Tools for Your Clients and Team",
    rationale:
      "Online forms and client accounts can help you collect information and keep your team’s work organised.",
    delivery: "3 – 6 Weeks",
    tier: "portals-workflows",
  },
  retainer: {
    title: "Ongoing Website Support",
    rationale:
      "Get help adding features, creating campaign pages, and keeping your website up to date.",
    delivery: "Monthly Updates",
    tier: "portals-workflows",
  },
};

function OptionRow({
  selected,
  onClick,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-4 border-t border-border py-4 text-left transition-colors duration-200 last:border-b hover:bg-signal/[0.03]",
        selected && "bg-signal/[0.04]"
      )}
    >
      {/* square radio marker */}
      <span
        aria-hidden
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center border transition-colors duration-200",
          selected ? "border-signal" : "border-border group-hover:border-signal/60"
        )}
      >
        <span
          className={cn(
            "size-2.5 transition-opacity duration-200",
            selected ? "bg-signal opacity-100" : "opacity-0"
          )}
        />
      </span>
      <span>
        <span
          className={cn(
            "block text-sm font-semibold leading-snug transition-colors",
            selected ? "text-signal" : "text-foreground"
          )}
        >
          {title}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}

export function ScopeMatcher() {
  const [stage, setStage] = useState<StageValue>("sme");
  const [objective, setObjective] = useState<ObjectiveValue>("flagship");

  const recommendation = RECOMMENDATIONS[objective];
  const deliverables = DELIVERABLES_BY_TIER[recommendation.tier];

  const enquiryHref = useMemo(
    () => `/get-started.html?tier=${recommendation.tier}&stage=${stage}&objective=${objective}`,
    [recommendation.tier, stage, objective]
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* Steps — editorial questionnaire */}
      <div className="space-y-12">
        <div>
          <p className="flex items-baseline gap-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-signal">
              Step 01
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Where is your business right now?
            </span>
          </p>
          <div className="mt-5">
            {STAGES.map((s) => (
              <OptionRow
                key={s.value}
                selected={stage === s.value}
                onClick={() => setStage(s.value)}
                title={s.title}
                description={s.description}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="flex flex-wrap items-baseline gap-4">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-signal">
              Step 02
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              What would you like help with?
            </span>
          </p>
          <div className="mt-5">
            {OBJECTIVES.map((o) => (
              <OptionRow
                key={o.value}
                selected={objective === o.value}
                onClick={() => setObjective(o.value)}
                title={o.title}
                description={o.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation — blueprint-framed panel */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${objective}-${stage}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative border border-border bg-card p-7 md:p-8">
              {/* blueprint registration corners */}
              <span aria-hidden className="mark-tl" />
              <span aria-hidden className="mark-tr" />
              <span aria-hidden className="mark-bl" />
              <span aria-hidden className="mark-br" />

              <SectionLabel>Suggested Service</SectionLabel>

              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground">
                <em className="font-serif font-medium italic">{recommendation.title}</em>
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {recommendation.rationale}
              </p>

              {/* spec table — hairline rows */}
              <dl className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em]">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-t border-border py-3.5">
                  <dt className="text-muted-foreground">Estimated delivery</dt>
                  <dd className="text-signal">{recommendation.delivery}</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-t border-border py-3.5">
                  <dt className="text-muted-foreground">Who you work with</dt>
                  <dd className="max-w-[220px] text-right normal-case tracking-normal text-foreground/80">
                    Directly with Leon Madara
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-t border-border py-3.5">
                  <dt className="text-muted-foreground">Focus</dt>
                  <dd className="text-foreground/80">Readable pages, loading speed, and mobile use</dd>
                </div>
              </dl>

              <div className="mt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                  What you get:
                </p>
                <ul className="mt-4">
                  {deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-3 border-t border-border py-3 text-sm font-medium text-foreground/85 first:border-t-0"
                    >
                      <Check className="size-4 shrink-0 text-jade" aria-hidden strokeWidth={2.5} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={enquiryHref}
                className="group mt-7 inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-[3px] bg-signal px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85"
              >
                Tell Us About Your Project
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
