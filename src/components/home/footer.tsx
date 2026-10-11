"use client";

import { useEffect, useState } from "react";
import { ArrowUp, ArrowRight, Check, Loader2, MailOpen, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

const FOOTER_LINKS = [
  { label: "Reality Check", href: "#reality" },
  { label: "Services", href: "#services" },
  { label: "Founder", href: "#founder" },
  { label: "Selected Works", href: "#work" },
  { label: "Articles", href: "#articles" },
];

const DESTINATION_LINKS = [
  { label: "Case Studies", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "Get Started", href: "/get-started.html" },
];

type SubscribeState = "idle" | "loading" | "done" | "error";

function FieldNotes() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubscribeState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    setMessage(null);
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; already?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        setState("error");
        setMessage(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setState("done");
      setMessage(
        data.already
          ? "You're already subscribed. Thanks for staying in touch."
          : "You're subscribed. Thanks for joining."
      );
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error — please check your connection and retry.");
    }
  };

  return (
    <div className="mt-12 grid gap-6 border-t border-border pt-8 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
      <div>
        <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          <MailOpen className="size-3.5 text-signal" aria-hidden />
          Website Notes
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Practical notes on planning, building, and improving your website, sent to your inbox.
        </p>
      </div>

      <div>
        {state === "done" ? (
          <p
            role="status"
            className="flex items-center gap-3 border border-jade/40 bg-jade/[0.06] px-4 py-3.5 text-sm font-medium text-foreground"
          >
            <span className="grid size-6 shrink-0 place-items-center border border-jade text-jade">
              <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
            </span>
            {message}
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-2.5 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="field-notes-email" className="sr-only">
                Email address
              </label>
              <input
                id="field-notes-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="you@company.com"
                aria-invalid={state === "error"}
                aria-describedby={state === "error" ? "field-notes-error" : undefined}
                className={cn(
                  "h-11 w-full rounded-[3px] border bg-background/70 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:outline-none",
                  state === "error"
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-signal"
                )}
              />
            </div>
            <button
              type="submit"
              disabled={state === "loading"}
              className="group inline-flex h-11 shrink-0 items-center justify-center gap-2.5 rounded-[3px] bg-signal px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85 disabled:cursor-wait disabled:opacity-70"
            >
              {state === "loading" ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <>
                  Subscribe
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </>
              )}
            </button>
          </form>
        )}
        {state === "error" && message ? (
          <p id="field-notes-error" role="alert" className="mt-2 text-xs text-destructive">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function Footer() {
  const [nairobiTime, setNairobiTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Nairobi",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setNairobiTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative mt-auto border-t border-border bg-background/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          {/* brand */}
          <div>
            <a
              href="#top"
              className="group flex w-fit items-center gap-3"
              aria-label="CodeByLeon — back to top"
            >
              <BrandLogo />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Beyond the Blueprint. Custom websites, digital identities, and operational web
              applications — handcrafted in clean React &amp; TypeScript.
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              <MapPin className="size-3.5 text-signal" aria-hidden />
              <span>Based in Nairobi, Kenya</span>
              {nairobiTime ? (
                <span className="tabular-nums text-foreground/70">{nairobiTime} EAT</span>
              ) : null}
            </p>
          </div>

          {/* sections */}
          <nav aria-label="Footer sections">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <span aria-hidden className="h-px w-5 bg-signal" />
              Sections
            </p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link, i) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-signal"
                  >
                    <span className="mr-2 font-mono text-[10px] text-signal/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* destinations */}
          <nav aria-label="Footer destinations">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <span aria-hidden className="h-px w-5 bg-signal" />
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {DESTINATION_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-signal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* back to top */}
          <div className="flex items-start md:justify-end">
            <a
              href="#top"
              aria-label="Back to top"
              className="group grid size-11 place-items-center border border-border text-muted-foreground transition-colors duration-300 hover:border-signal hover:text-signal"
            >
              <ArrowUp
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>
        </div>

        {/* Website Notes — newsletter signup with persistence */}
        <FieldNotes />

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">© 2026 CodeByLeon. All rights reserved.</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
            Design / Websites / Online Tools
          </p>
        </div>
      </div>
    </footer>
  );
}

