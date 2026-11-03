"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowRight, Check, Download } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { IntakeCursor } from "./intake-cursor";
import { IntakeNavigation } from "./intake-navigation";
import { BrandLogo } from "./brand-logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import styles from "./project-intake.module.css";

const FLOW = ["1", "feedback-1", "2", "3", "feedback-2", "4", "5", "feedback-3", "6", "7", "8"];
const QUESTIONS = [
  { label: "Choose the closest fit", title: "Tell us about yourself", options: [["small-business", "Small Business Owner"], ["creative", "Creative Professional"], ["startup", "Startup Founder"], ["growing", "Growing Brand"]] },
  { label: "Where are you starting from?", title: "What's your current website situation?", options: [["no-website", "No Website Yet"], ["diy-site", "DIY Website"], ["outdated", "Outdated Site"], ["modern", "Modern Site"]] },
  { label: "What's most important to you?", title: "Choose your top priority", options: [["leads", "Get More Enquiries"], ["credibility", "Help People Understand My Business"], ["ecommerce", "Sell Online"], ["portfolio", "Show My Work"]] },
  { label: "How soon do you need this live?", title: "What's your timeline?", options: [["asap", "ASAP (1-2 Weeks)"], ["month", "Within a Month"], ["flexible", "Flexible (2-3 Months)"]] },
  { label: "Choose a range you’re comfortable with", title: "What's your budget?", options: [["budget-low", "KES 30K - 50K"], ["budget-mid", "KES 50K - 100K"], ["budget-high", "KES 100K+"], ["budget-unsure", "Not Sure Yet"]] },
  { label: "Select all that apply", title: "What else matters to you?", options: [["mobile-first", "Works Well on Phones"], ["seo", "Help Search Engines Find My Site"], ["whatsapp", "WhatsApp Contact"], ["analytics", "See How People Use My Site"], ["branding", "Brand Colours and Logo"], ["email", "Email Marketing"], ["support", "Ongoing Support"]] },
];
const FEEDBACK: Record<string, [string, string]> = {
  "feedback-1": ["Let's find the right fit.", "Next, we'll look at your current website and what you want it to achieve."],
  "feedback-2": ["Your goals set the direction.", "A few details about timing and budget will help shape your recommendation."],
  "feedback-3": ["A few more details.", "Choose any additional needs, then tell us how we can reach you."],
};
const TIERS: Record<string, { name: string; presence: string; goal: string; needs: string[]; price: string; features: string[] }> = {
  "custom-website": { name: "A New Website for Your Business", presence: "no-website", goal: "credibility", needs: ["mobile-first", "seo"], price: "KES 50,000 - 100,000", features: ["Pages Designed and Built for Your Business", "Layouts for Phones, Tablets and Computers", "Search Setup and Attention to Loading Speed", "Contact Form and WhatsApp Link", "Work Directly with Leon"] },
  "redesign-modernization": { name: "A Fresh Look for Your Existing Website", presence: "outdated", goal: "leads", needs: ["mobile-first", "seo", "analytics"], price: "KES 75,000 - 120,000", features: ["New Page Designs and Clearer Navigation", "A Rebuilt Website", "Clear Contact Options and Phone-Friendly Pages", "Checks for Loading Speed and Mobile Use", "Work Directly with Leon"] },
  "portals-workflows": { name: "Tools for Your Clients and Team", presence: "modern", goal: "leads", needs: ["analytics", "whatsapp"], price: "KES 100,000+", features: ["Online Accounts for Clients and Your Team", "Enquiries Sent to the Right People", "Connections to Your Existing Tools and Data", "Access Settings for Different Users", "Work Directly with Leon"] },
};
type Draft = { index: number; answers: Record<string, string>; needs: string[]; tier: string; discovery: boolean; contact: { name: string; email: string; phone: string; business: string } };
const EMPTY: Draft = { index: 0, answers: {}, needs: [], tier: "", discovery: false, contact: { name: "", email: "", phone: "", business: "" } };
const STORAGE = "cbl-preview-original-intake-v1";

function recommendation(draft: Draft) {
  if (draft.discovery) return { name: "A Project Call with Leon", price: "Free 20-minute consultation", features: ["A Look at Your Website and What You Need", "Suggested Next Steps", "A Discussion of Costs and What’s Included"] };
  if (TIERS[draft.tier]) return { ...TIERS[draft.tier] };
  if (draft.answers["5"] === "budget-low" || (draft.answers["2"] === "no-website" && draft.answers["5"] === "budget-unsure")) return { name: "Launch Starter", price: "KES 30,000 - 50,000", features: ["3-5 Pages Built for Your Business", "Works on Phones and Computers", "Contact Form and WhatsApp Link", "Google Maps", "1 Month Support"] };
  if (draft.answers["5"] === "budget-high" || draft.answers["3"] === "ecommerce") return { name: "Business Pro", price: "KES 100,000+", features: ["Design Around Your Business", "Additional Features and Online Sales", "Search Visibility Plan", "Visitor Reports", "3 Months Support"] };
  return { name: "Business Growth", price: "KES 50,000 - 100,000", features: ["A Website with Multiple Pages", "Basic Search Setup", "Content You Can Update", "Automatic WhatsApp and Email Updates", "2 Months Support"] };
}

export function ProjectIntake({ onExit, scrollContainer }: { onExit?: () => void; scrollContainer?: RefObject<HTMLElement | null> } = {}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [ready, setReady] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [navigationError, setNavigationError] = useState("");
  const [navigating, setNavigating] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const didResetRef = useRef(false);
  const aboutRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const step = FLOW[draft.index];
  const question = QUESTIONS[Number(step) - 1];
  const result = recommendation(draft);
  const reasons = [
    draft.tier ? `Based on your selected service: ${TIERS[draft.tier]?.name}` : "",
    draft.answers["2"] === "no-website" ? "You’re starting with a new website" : draft.answers["2"] === "outdated" ? "You want to update your current website" : draft.answers["2"] === "diy-site" ? "You want help with a website you built yourself" : "",
    draft.answers["4"] === "flexible" ? "Your timing allows room to plan and review" : "",
    ({ leads: "A clear way for visitors to make enquiries", credibility: "Clear information about your business", ecommerce: "A place for customers to buy online", portfolio: "A gallery to show your work" } as Record<string, string>)[draft.answers["3"]] ?? "",
  ].filter(Boolean);
  const feedback = FEEDBACK[step];
  const progress = step.startsWith("feedback") ? Number(step.slice(-1)) * 2 - 1 : Number(step);
  const contactValid = draft.contact.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email.trim());
  const canContinue = Boolean(feedback || step === "6" || (step === "7" ? contactValid : draft.answers[step]));
  const canGoBack = draft.index > 0 && !(draft.discovery && step === "7" && Object.keys(draft.answers).length === 0);

  useEffect(() => {
    let initial = EMPTY;
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE) ?? "null") as Draft | null;
      if (saved && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < FLOW.length && saved.answers && Array.isArray(saved.needs) && saved.contact && Object.values(saved.contact).every(value => typeof value === "string")) initial = saved;
    } catch { /* An invalid or unavailable saved draft starts fresh. */ }
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier") ?? "";
    const discovery = params.get("intent") === "discovery-call";
    if (discovery && !initial.discovery) initial = { ...EMPTY, discovery: true, index: FLOW.indexOf("7") };
    else if (TIERS[tier] && initial.tier !== tier) initial = { ...EMPTY, tier, answers: { "2": TIERS[tier].presence, "3": TIERS[tier].goal }, needs: TIERS[tier].needs };
    // Restore browser-only storage after hydration, keeping the server's initial markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(STORAGE, JSON.stringify(draft)); }
    catch {
      // Reflect failure of the external browser storage API in the persistence label.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageAvailable(false);
    }
  }, [draft, ready]);

  useGSAP(() => {
    if (!ready) return;
    (scrollContainer?.current ?? window).scrollTo({ top: 0, behavior: "instant" });
    headingRef.current?.focus({ preventScroll: true });
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => { gsap.fromTo(panelRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }); });
    return () => media.revert();
  }, { scope: panelRef, dependencies: [draft.index, ready], revertOnUpdate: true });

  function select(value: string) {
    setDraft(current => step === "6" ? { ...current, needs: current.needs.includes(value) ? current.needs.filter(item => item !== value) : [...current.needs, value] } : { ...current, answers: { ...current.answers, [step]: value } });
  }
  function saveBeforeNavigation() {
    try {
      sessionStorage.setItem(STORAGE, JSON.stringify(draft));
      setStorageAvailable(true);
      setNavigationError("");
      return true;
    } catch {
      setStorageAvailable(false);
      setNavigationError("Your progress could not be saved in this tab. Please try again. You can also use the home logo to leave without saving.");
      return false;
    }
  }
  function returnToPreviousPage() {
    if (onExit) { onExit(); return; }
    // The browser history preserves the exact originating page and scroll position.
    // A direct visit (or an external referrer) returns to the studio homepage.
    const referrer = document.referrer ? new URL(document.referrer) : null;
    if (referrer?.origin === window.location.origin && referrer.pathname !== window.location.pathname) {
      if (window.history.length > 1) window.history.back();
      else router.push(referrer.pathname + referrer.search + referrer.hash);
    } else router.push("/");
  }
  function goBack() {
    if (canGoBack) {
      setDraft(current => {
        let previous = current.index - 1;
        while (previous > 0 && FLOW[previous].startsWith("feedback")) previous--;
        return { ...current, index: previous };
      });
    }
  }
  function clearAnswers() {
    didResetRef.current = true;
    setDraft(EMPTY);
    setNavigationError("");
    if (aboutRef.current) aboutRef.current.open = false;
    (scrollContainer?.current ?? window).scrollTo({ top: 0, behavior: "instant" });
    // Remove entry presets so refreshing cannot reapply a service or call shortcut.
    if (window.location.search) router.replace("/get-started.html", { scroll: false });
  }
  function download() {
    const labels = QUESTIONS.map((item, index) => `${item.title}: ${index === 5 ? item.options.filter(([value]) => draft.needs.includes(value)).map(([, label]) => label).join(", ") || "None selected" : item.options.find(([value]) => value === draft.answers[String(index + 1)])?.[1] ?? "Not specified"}`);
    const blob = new Blob([`CodeByLeon — Project Brief\n\n${labels.join("\n")}\n\n${Object.entries(draft.contact).map(([key, value]) => `${key}: ${value}`).join("\n")}\n\nRecommendation: ${result.name}\nIndicative range: ${result.price}\nScope and price to be confirmed with Leon.\nLocal preview only — no enquiry sent.`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "codebyleon-project-brief.txt"; anchor.click(); URL.revokeObjectURL(url);
  }

  return <AlertDialog open={resetOpen} onOpenChange={setResetOpen}><div className={`${styles.page} text-foreground`} data-contact-step={step === "7"}>
    <div aria-hidden="true" className={styles.atmosphere}>
      <span className={styles.orangeWash} />
      <span className={styles.blueWash} />
      <span className={styles.softWash} />
      <div className={styles.frost} />
      <div className={`dot-grid ${styles.grid}`} />
    </div>
    <IntakeCursor />
    <header className="relative mx-auto flex max-w-7xl items-center justify-between border-b border-border px-4 py-4 sm:px-6">
      <a href="/" aria-label="Code by Leon home"><BrandLogo /></a>
      <ThemeToggle />
    </header>
    <IntakeNavigation ready={ready} canGoBack={canGoBack} canReview={step === "7"} onReview={() => setDraft(current => ({ ...current, index: 0 }))} beforeNavigate={saveBeforeNavigation} onBack={goBack} onExit={returnToPreviousPage} onBusyChange={setNavigating} />
    <main className={styles.main} inert={navigating}>
      <div className={styles.content}>
        {navigationError && <p role="alert" className="mb-6 border-l-2 border-signal pl-4 text-sm text-foreground">{navigationError}</p>}
        <div className="mb-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><span>Start a Project</span><span>Step {String(progress).padStart(2, "0")} / 08</span></div>
        <div aria-label={`Step ${progress} of 8`} className="mb-10 grid grid-cols-8 gap-2">{Array.from({ length: 8 }, (_, index) => <span key={index} className={cn("h-0.5", index < progress ? "bg-signal" : "bg-border")} />)}</div>
        <div ref={panelRef}>
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-signal">{feedback ? "Your project so far" : step === "7" ? "Almost there" : step === "8" ? "Your recommendation" : question?.label}</p>
          <h1 ref={headingRef} tabIndex={-1} className={`${styles.heading} mb-8 text-center font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl`}>{feedback?.[0] ?? (step === "7" ? "How can we reach you?" : step === "8" ? result.name : question?.title)}</h1>
          {!ready ? <p className="text-center">Loading your project brief…</p> : feedback ? <p className="mx-auto max-w-xl text-center text-lg leading-relaxed text-muted-foreground">{feedback[1]}</p> : question ? <div className="grid gap-3 sm:grid-cols-2">{question.options.map(([value, label], index) => {
            const selected = step === "6" ? draft.needs.includes(value) : draft.answers[step] === value;
            return <button key={value} type="button" aria-pressed={selected} onClick={() => select(value)} className={cn("flex min-h-24 items-center justify-between gap-4 border px-5 py-5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal", selected ? "border-signal bg-signal/10" : "border-border bg-card/30 hover:border-signal/60")}><span><span className="mb-2 block font-mono text-[10px] tracking-widest text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-base font-medium">{label}</span></span>{selected && <Check aria-hidden className="size-4 shrink-0 text-signal" />}</button>;
          })}</div> : step === "7" ? <form onSubmit={event => { event.preventDefault(); if (contactValid) setDraft(current => ({ ...current, index: FLOW.indexOf("8") })); }} className="grid gap-5 sm:grid-cols-2">
            {([ ["name", "Your Name", "text", true], ["email", "Email Address", "email", true], ["phone", "Phone (WhatsApp)", "tel", false], ["business", "Business Name", "text", false] ] as const).map(([key, label, type, required]) => <label key={key} className="block"><span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}{required ? " *" : ""}</span><input required={required} type={type} maxLength={160} autoComplete={key === "business" ? "organization" : key === "phone" ? "tel" : key} value={draft.contact[key]} onChange={event => setDraft(current => ({ ...current, contact: { ...current.contact, [key]: event.target.value } }))} className="h-12 w-full border border-border bg-card/50 px-3 outline-none focus:border-signal" /></label>)}
            <p className="text-sm text-muted-foreground sm:col-span-2">This preview prepares your recommendation locally. No enquiry is sent.</p>
          </form> : <div>
            <p className="mb-6 font-mono text-lg text-signal">{result.price}</p><p className="mb-6 text-sm text-muted-foreground">This is a starting estimate. Confirm what’s included, the final price, and timing with Leon.</p>
            {reasons.length > 0 && <><h2 className="mb-3 font-display text-xl">Why this may fit</h2><ul className="mb-6 list-inside list-disc space-y-2 text-sm text-muted-foreground">{reasons.map(reason => <li key={reason}>{reason}</li>)}</ul></>}
            <h2 className="mb-3 font-display text-xl">What’s included</h2><ul className="space-y-3">{result.features.map(feature => <li key={feature} className="flex items-start gap-3 text-sm"><Check aria-hidden className="size-4 shrink-0 text-signal" />{feature}</li>)}</ul>
            <div className="mt-8 flex flex-wrap gap-4"><button onClick={download} className="flex items-center gap-2 rounded-[3px] bg-signal px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-signal-foreground"><Download className="size-4" />Download project brief</button><a href="https://calendly.com/codebyleon/discovery-call" target="_blank" rel="noopener noreferrer" className="border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-widest hover:border-signal">Book a Free Project Call ↗</a></div>
            <p className="mt-5 text-sm text-muted-foreground">Your brief is ready. Email delivery is not connected in this preview.</p>
          </div>}
        </div>
      </div>
    </main>
    <footer className={styles.footer} inert={navigating}>
      <div className={styles.footerInner}>
        {step === "7" && <p id="intake-contact-help" className={styles.contactHelp} aria-live="polite">{!contactValid ? "Enter your name and email to continue." : ""}</p>}
        <div className="flex items-center justify-center">
          {step !== "8" && <button disabled={!ready || !canContinue} aria-describedby={step === "7" && !contactValid ? "intake-contact-help" : undefined} onClick={() => setDraft(current => ({ ...current, index: current.index + 1 }))} className={styles.continueButton}>
            <span aria-hidden="true" className={styles.continueCircles}><span /><span /><span /><span /><span /></span>
            <span className={styles.continueLabel}>{step === "7" ? "View recommendation" : "Continue"}<ArrowRight aria-hidden="true" className="size-4" /></span>
          </button>}
        </div>
      <details ref={aboutRef} className={styles.about}>
        <summary className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">About your brief</summary>
        <aside className={styles.aboutPanel}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">Let’s Plan Your Website</p><h2 className="mt-5 font-serif text-3xl italic">A clear brief. A thoughtful start.</h2><p className="mt-5 text-sm leading-relaxed text-muted-foreground">Tell us where you are today and what you want to achieve. We’ll help you find a practical direction for your project.</p>
        {draft.tier && <p className="mt-6 border-t border-border pt-5 text-sm">Selected service: {TIERS[draft.tier]?.name}</p>}
        <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{storageAvailable ? "Progress saved in this tab" : "Progress stays here until you leave"}</p>
        <AlertDialogTrigger asChild><button type="button" className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground underline underline-offset-4">Clear answers and start over</button></AlertDialogTrigger>
        </aside>
      </details>
      </div>
    </footer>
  </div>
    <AlertDialogContent className="rounded-[3px] border-border" onCloseAutoFocus={event => {
      if (didResetRef.current) {
        event.preventDefault();
        didResetRef.current = false;
        headingRef.current?.focus({ preventScroll: true });
      }
    }}>
      <AlertDialogHeader>
        <AlertDialogTitle className="font-display">Clear your answers?</AlertDialogTitle>
        <AlertDialogDescription>This clears your choices and contact details in this tab and returns you to the first question.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="rounded-[3px]">Keep my answers</AlertDialogCancel>
        <AlertDialogAction onClick={clearAnswers} className="rounded-[3px] bg-signal text-signal-foreground hover:bg-signal/90">Clear answers</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}
