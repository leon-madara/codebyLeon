"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Loader2,
  Send,
  SlidersHorizontal,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const OPEN_CONFIGURATOR_EVENT = "cbl:open-configurator";

type Intent = "configurator" | "discovery-call";
type TierValue = "custom-website" | "redesign-modernization" | "portals-workflows";
type StageValue = "startup" | "sme" | "corporate";
type ObjectiveValue = "flagship" | "rebrand" | "intake" | "retainer";

/** Open the configurator from anywhere (e.g. command palette). */
export function openConfigurator(href?: string) {
  window.dispatchEvent(
    new CustomEvent(OPEN_CONFIGURATOR_EVENT, {
      detail: href ?? "/get-started.html",
    })
  );
}

const STEPS = 7;

const TIER_OPTIONS: {
  value: TierValue;
  title: string;
  meta: string;
  delivery: string;
}[] = [
  {
    value: "custom-website",
    title: "A Brand-New Custom Website",
    meta: "New Builds • 3 – 5 weeks",
    delivery: "3 – 5 Weeks",
  },
  {
    value: "redesign-modernization",
    title: "Complete Website Redesign & Modernization",
    meta: "Redesign & Overhaul • 2 – 4 weeks",
    delivery: "2 – 4 Weeks",
  },
  {
    value: "portals-workflows",
    title: "Custom Portals & Automated Workflows",
    meta: "Systems & Portals • 3 – 6 weeks",
    delivery: "3 – 6 Weeks",
  },
];

const STAGE_OPTIONS: { value: StageValue; title: string; description: string }[] = [
  {
    value: "startup",
    title: "Starting a Business",
    description: "A new business ready for its first website",
  },
  {
    value: "sme",
    title: "Established Business",
    description: "An established business ready to improve its website",
  },
  {
    value: "corporate",
    title: "Larger Company",
    description: "A larger team with more detailed website needs",
  },
];

const OBJECTIVE_OPTIONS: {
  value: ObjectiveValue;
  title: string;
  description: string;
}[] = [
  {
    value: "flagship",
    title: "Build a New Website",
    description: "Create a website around your business and customers",
  },
  {
    value: "rebrand",
    title: "Update Your Existing Website",
    description: "Transform an outdated site to look modern and credible",
  },
  {
    value: "intake",
    title: "Make Customer Sign-Up Easier",
    description: "Collect customer details through online forms and tools",
  },
  {
    value: "retainer",
    title: "Get Ongoing Website Support",
    description: "Keep your pages and features up to date",
  },
];

const TIMELINE_OPTIONS = [
  "ASAP — urgent build",
  "Within the next month",
  "This quarter",
  "Flexible — quality first",
];

const BUDGET_OPTIONS = [
  "Under $2,000",
  "$2,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet — advise me",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function OptionRow({
  selected,
  onClick,
  title,
  meta,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  meta: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-start gap-4 border-t border-border py-3.5 text-left transition-colors duration-200 last:border-b hover:bg-signal/[0.04]",
        selected && "bg-signal/[0.05]"
      )}
    >
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
        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {meta}
        </span>
      </span>
    </button>
  );
}

export function Configurator() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<Intent>("configurator");

  const [tier, setTier] = useState<TierValue | null>(null);
  const [stage, setStage] = useState<StageValue | null>(null);
  const [objective, setObjective] = useState<ObjectiveValue | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [contactError, setContactError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const isDiscovery = intent === "discovery-call";

  const reset = useCallback(() => {
    setStep(0);
    setIntent("configurator");
    setTier(null);
    setStage(null);
    setObjective(null);
    setTimeline(null);
    setBudget(null);
    setDetails("");
    setName("");
    setEmail("");
    setCompany("");
    setContactError(null);
    setSubmitting(false);
    setReference(null);
  }, []);

  /** Parse a /get-started.html href into wizard state and open. */
  const startFrom = useCallback(
    (href: string) => {
      const query = href.includes("?") ? href.slice(href.indexOf("?") + 1) : "";
      const params = new URLSearchParams(query);

      const nextIntent: Intent =
        params.get("intent") === "discovery-call" ? "discovery-call" : "configurator";
      const paramTier = params.get("tier");
      const paramStage = params.get("stage");
      const paramObjective = params.get("objective");

      const nextTier =
        paramTier === "custom-website" ||
        paramTier === "redesign-modernization" ||
        paramTier === "portals-workflows"
          ? paramTier
          : null;
      const nextStage =
        paramStage === "startup" || paramStage === "sme" || paramStage === "corporate"
          ? paramStage
          : null;
      const nextObjective =
        paramObjective === "flagship" ||
        paramObjective === "rebrand" ||
        paramObjective === "intake" ||
        paramObjective === "retainer"
          ? paramObjective
          : null;

      setIntent(nextIntent);
      setTier(nextTier);
      setStage(nextStage);
      setObjective(nextObjective);
      setReference(null);
      setContactError(null);

      // land where the visitor already has answers:
      // discovery-call → start clean; matcher links → jump to timeline; tier links → stage.
      let nextStep = 0;
      if (nextIntent === "configurator") {
        if (nextTier && nextStage && nextObjective) nextStep = 3;
        else if (nextTier) nextStep = 1;
      }
      setStep(nextStep);
      setOpen(true);
    },
    []
  );

  // Intercept plain left-clicks on any /get-started.html link (progressive enhancement)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/get-started.html")) return;
      e.preventDefault();
      startFrom(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [startFrom]);

  // Programmatic opens (command palette, etc.)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      startFrom(typeof href === "string" ? href : "/get-started.html");
    };
    window.addEventListener(OPEN_CONFIGURATOR_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONFIGURATOR_EVENT, onOpen);
  }, [startFrom]);

  const tierDelivery = useMemo(
    () => TIER_OPTIONS.find((t) => t.value === tier)?.delivery ?? null,
    [tier]
  );

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return tier !== null;
      case 1:
        return stage !== null;
      case 2:
        return objective !== null;
      case 3:
        return timeline !== null;
      case 4:
        return budget !== null;
      case 5:
        return true;
      case 6:
        return name.trim().length >= 2 && EMAIL_RE.test(email.trim());
      default:
        return false;
    }
  }, [step, tier, stage, objective, timeline, budget, name, email]);

  const submit = async () => {
    if (!canContinue || submitting) return;
    setContactError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent,
          tier,
          stage,
          objective,
          timeline,
          budget,
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || null,
          projectDetails: details.trim() || null,
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; reference?: string; error?: string }
        | null;
      if (!res.ok || !data?.ok || !data.reference) {
        setContactError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setReference(data.reference);
      toast({
        title: `Brief received — ${data.reference}`,
        description: "Your request has been saved for Leon to review.",
      });
    } catch {
      setContactError("Network error — please check your connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) window.setTimeout(reset, 250);
  };

  const stepMeta = [
    { key: "tier", label: "Engagement" },
    { key: "stage", label: "Business stage" },
    { key: "objective", label: "Priority" },
    { key: "timeline", label: "Launch" },
    { key: "budget", label: "Budget" },
    { key: "details", label: "Details" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!reference}
        aria-describedby="configurator-desc"
        className="top-[50%] flex max-h-[88vh] w-full max-w-[calc(100%-1.5rem)] translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-[3px] border-border bg-card p-0 duration-300 sm:max-w-4xl"
      >
        <DialogTitle className="sr-only">
          {isDiscovery ? "Plan a call" : "Plan your project"}
        </DialogTitle>
        <DialogDescription id="configurator-desc" className="sr-only">
          Answer seven questions about your business, budget, and plans.
        </DialogDescription>

        {reference ? (
          <SuccessScreen
            reference={reference}
            isDiscovery={isDiscovery}
            onClose={() => handleOpenChange(false)}
          />
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-border px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <p className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  <span aria-hidden className="size-1.5 rotate-45 bg-signal" />
                  {isDiscovery ? "About Your Call" : "About Your Project"}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Step <span className="text-signal">{String(step + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="mx-1.5 text-muted-foreground/50">
                    /
                  </span>
                  {String(STEPS).padStart(2, "0")}
                </p>
              </div>
              <h3 className="mt-2.5 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {isDiscovery ? (
                  <>
                    Book Your{" "}
                    <em className="font-serif font-medium italic text-signal">
                      20-Minute Call.
                    </em>
                  </>
                ) : (
                  <>
                    Plan Your{" "}
                    <em className="font-serif font-medium italic text-signal">Project.</em>
                  </>
                )}
              </h3>
              {/* segmented progress hairlines */}
              <div aria-hidden className="mt-4 flex gap-1.5">
                {Array.from({ length: STEPS }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-[3px] flex-1 transition-colors duration-500",
                      i < step ? "bg-signal/45" : i === step ? "bg-signal" : "bg-border"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="grid flex-1 overflow-hidden lg:grid-cols-[1fr_264px]">
              {/* question pane */}
              <div className="scroll-slim overflow-y-auto px-5 py-6 sm:px-7">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <StepBody
                      step={step}
                      tier={tier}
                      setTier={setTier}
                      stage={stage}
                      setStage={setStage}
                      objective={objective}
                      setObjective={setObjective}
                      timeline={timeline}
                      setTimeline={setTimeline}
                      budget={budget}
                      setBudget={setBudget}
                      details={details}
                      setDetails={setDetails}
                      name={name}
                      setName={setName}
                      email={email}
                      setEmail={setEmail}
                      company={company}
                      setCompany={setCompany}
                      contactError={contactError}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* blueprint summary rail */}
              <aside
                aria-label="Project summary"
                className="hidden border-l border-border px-6 py-6 lg:block"
              >
                <div className="relative border border-border bg-background/60 p-5">
                  <span aria-hidden className="mark-tl" />
                  <span aria-hidden className="mark-tr" />
                  <span aria-hidden className="mark-bl" />
                  <span aria-hidden className="mark-br" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    Project Summary
                  </p>
                  <dl className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em]">
                    <SummaryRow label="Service" value={tierTitle(tier)} />
                    <SummaryRow label="Stage" value={stageTitle(stage)} />
                    <SummaryRow label="Priority" value={objectiveTitle(objective)} />
                    <SummaryRow label="Launch" value={timeline} />
                    <SummaryRow label="Budget" value={budget} />
                    <div className="mt-1 border-t-2 border-border pt-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-muted-foreground">Est. delivery</dt>
                        <dd className="text-signal">{tierDelivery ?? "—"}</dd>
                      </div>
                    </div>
                  </dl>
                  <p className="mt-5 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
                    Your answers help Leon understand what you need before discussing the details.
                  </p>
                </div>
              </aside>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-border bg-background/50 px-5 py-3.5 sm:px-7">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className={cn(
                  "inline-flex h-10 items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors",
                  step === 0
                    ? "pointer-events-none text-muted-foreground/30"
                    : "text-muted-foreground hover:text-signal"
                )}
              >
                <ArrowLeft className="size-4" aria-hidden />
                Back
              </button>

              {step < STEPS - 1 ? (
                <button
                  type="button"
                  onClick={() => canContinue && setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className={cn(
                    "group inline-flex h-10 items-center gap-2.5 rounded-[3px] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
                    canContinue
                      ? "bg-signal text-signal-foreground hover:bg-signal/85"
                      : "cursor-not-allowed bg-muted text-muted-foreground/50"
                  )}
                >
                  Continue
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={!canContinue || submitting}
                  className={cn(
                    "group inline-flex h-10 items-center gap-2.5 rounded-[3px] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
                    canContinue && !submitting
                      ? "bg-signal text-signal-foreground hover:bg-signal/85"
                      : "cursor-not-allowed bg-muted text-muted-foreground/50"
                  )}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                      Sending
                    </>
                  ) : (
                    <>
                      {isDiscovery ? (
                        <CalendarCheck className="size-4" aria-hidden />
                      ) : (
                        <Send className="size-4" aria-hidden />
                      )}
                      {isDiscovery ? "Request a Call" : "Send Project Details"}
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepBody(props: {
  step: number;
  tier: TierValue | null;
  setTier: (v: TierValue) => void;
  stage: StageValue | null;
  setStage: (v: StageValue) => void;
  objective: ObjectiveValue | null;
  setObjective: (v: ObjectiveValue) => void;
  timeline: string | null;
  setTimeline: (v: string) => void;
  budget: string | null;
  setBudget: (v: string) => void;
  details: string;
  setDetails: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  contactError: string | null;
}) {
  const questionLabel = (
    <>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-signal">
        Question {String(props.step + 1).padStart(2, "0")}
      </span>
      <span className="sr-only"> — </span>
    </>
  );

  switch (props.step) {
    case 0:
      return (
        <fieldset>
          <legend className="sr-only">What do you need help with?</legend>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            {questionLabel} What do you need help with?
          </p>
          <div className="mt-5">
            {TIER_OPTIONS.map((o) => (
              <OptionRow
                key={o.value}
                selected={props.tier === o.value}
                onClick={() => props.setTier(o.value)}
                title={o.title}
                meta={o.meta}
              />
            ))}
          </div>
        </fieldset>
      );
    case 1:
      return (
        <fieldset>
          <legend className="sr-only">Where is your business right now?</legend>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            {questionLabel} Where is your business right now?
          </p>
          <div className="mt-5">
            {STAGE_OPTIONS.map((o) => (
              <OptionRow
                key={o.value}
                selected={props.stage === o.value}
                onClick={() => props.setStage(o.value)}
                title={o.title}
                meta={o.description}
              />
            ))}
          </div>
        </fieldset>
      );
    case 2:
      return (
        <fieldset>
          <legend className="sr-only">What would you like to achieve?</legend>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            {questionLabel} What would you like to achieve?
          </p>
          <div className="mt-5">
            {OBJECTIVE_OPTIONS.map((o) => (
              <OptionRow
                key={o.value}
                selected={props.objective === o.value}
                onClick={() => props.setObjective(o.value)}
                title={o.title}
                meta={o.description}
              />
            ))}
          </div>
        </fieldset>
      );
    case 3:
      return (
        <fieldset>
          <legend className="sr-only">When should we go live?</legend>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            {questionLabel} When should we go live?
          </p>
          <div className="mt-5">
            {TIMELINE_OPTIONS.map((o) => (
              <OptionRow
                key={o}
                selected={props.timeline === o}
                onClick={() => props.setTimeline(o)}
                title={o}
                meta="Timeline preference"
              />
            ))}
          </div>
        </fieldset>
      );
    case 4:
      return (
        <fieldset>
          <legend className="sr-only">What budget are you planning?</legend>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            {questionLabel} What budget are you planning?
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            A rough budget helps us suggest a practical starting point. It is fine if you are not sure yet.
          </p>
          <div className="mt-5">
            {BUDGET_OPTIONS.map((o) => (
              <OptionRow
                key={o}
                selected={props.budget === o}
                onClick={() => props.setBudget(o)}
                title={o}
                meta="Budget range"
              />
            ))}
          </div>
        </fieldset>
      );
    case 5:
      return (
        <div>
          <label
            htmlFor="config-details"
            className="font-display text-lg font-semibold tracking-tight text-foreground"
          >
            {questionLabel} Anything else Leon should know?
          </label>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Optional — links to a current site, references you admire, or the one problem
            this project must solve.
          </p>
          <textarea
            id="config-details"
            value={props.details}
            onChange={(e) => props.setDetails(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="e.g. Our current site loses enquiries on mobile; we need the new build to feel as sharp as our offline reputation…"
            className="mt-5 w-full resize-none rounded-[3px] border border-border bg-background/70 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-signal focus:outline-none"
          />
          <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">
            {props.details.length} / 2000
          </p>
        </div>
      );
    case 6:
      return (
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            {questionLabel} How can Leon contact you?
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="config-name"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Your name <span className="text-signal">*</span>
              </label>
              <input
                id="config-name"
                autoComplete="name"
                value={props.name}
                onChange={(e) => props.setName(e.target.value)}
                placeholder="Jane Wanjiru"
                className="mt-2 w-full border-b border-border bg-transparent pb-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-signal focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="config-company"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Company <span className="text-muted-foreground/50">(optional)</span>
              </label>
              <input
                id="config-company"
                autoComplete="organization"
                value={props.company}
                onChange={(e) => props.setCompany(e.target.value)}
                placeholder="Acme Group Ltd"
                className="mt-2 w-full border-b border-border bg-transparent pb-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-signal focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="config-email"
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                Email <span className="text-signal">*</span>
              </label>
              <input
                id="config-email"
                type="email"
                autoComplete="email"
                value={props.email}
                onChange={(e) => props.setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="mt-2 w-full border-b border-border bg-transparent pb-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-signal focus:outline-none"
              />
            </div>
          </div>
          {props.contactError ? (
            <p role="alert" className="mt-5 border-l-2 border-destructive pl-4 text-sm text-destructive">
              {props.contactError}
            </p>
          ) : null}
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
            One reply from Leon — no lists, no spam, ever.
          </p>
        </div>
      );
    default:
      return null;
  }
}

function SummaryRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="border-t border-border py-2.5 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-3">
        <dt className="text-muted-foreground">{label}</dt>
        <dd
          className={cn(
            "max-w-[150px] text-right normal-case tracking-normal",
            value ? "text-foreground/85" : "text-muted-foreground/40"
          )}
        >
          {value ?? "—"}
        </dd>
      </div>
    </div>
  );
}

function SuccessScreen({
  reference,
  isDiscovery,
  onClose,
}: {
  reference: string;
  isDiscovery: boolean;
  onClose: () => void;
}) {
  return (
    <div className="scroll-slim max-h-[88vh] overflow-y-auto px-6 py-12 text-center sm:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-md"
      >
        <span className="mx-auto grid size-14 place-items-center border-2 border-jade text-jade">
          <Check className="size-7" strokeWidth={2.5} aria-hidden />
        </span>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
          {isDiscovery ? "Call request received" : "Project brief received"}
        </p>
        <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground">
          Reference{" "}
          <span className="bg-signal/10 px-2 py-1 font-mono text-xl tracking-[0.12em] text-signal">
            {reference}
          </span>
        </p>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Leon can now review your request. Keep your reference handy if you need to follow up.
        </p>
        <div className="mt-8 border-t border-border pt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
            Next — a short reply from Leon, personally.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex h-11 items-center justify-center gap-2.5 rounded-[3px] border border-border px-8 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-colors duration-300 hover:border-signal hover:text-signal"
        >
          {isDiscovery ? (
            <CalendarCheck className="size-4" aria-hidden />
          ) : (
            <SlidersHorizontal className="size-4" aria-hidden />
          )}
          Back to the studio
        </button>
      </motion.div>
    </div>
  );
}

function tierTitle(tier: TierValue | null): string | null {
  if (!tier) return null;
  const found = TIER_OPTIONS.find((t) => t.value === tier);
  return found ? found.title : null;
}

function stageTitle(stage: StageValue | null): string | null {
  const found = STAGE_OPTIONS.find((s) => s.value === stage);
  return found ? found.title : null;
}

function objectiveTitle(objective: ObjectiveValue | null): string | null {
  const found = OBJECTIVE_OPTIONS.find((o) => o.value === objective);
  return found ? found.title : null;
}
