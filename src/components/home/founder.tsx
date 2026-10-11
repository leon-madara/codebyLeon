"use client";

import { useEffect, useRef, useState } from "react";
import { Gauge, Layers, MapPin, Palette, Smartphone } from "lucide-react";
import "./founder.css";
import { useFounderSequence } from "./use-founder-sequence";
import { Reveal } from "./reveal";
import { VideoPlayer } from "./video-player";

function useNairobiTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Nairobi",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

const WEBSITE_APPROACHES = [
  {
    title: "Only what you need",
    summary: "Your goals guide the pages and features, keeping the website focused on what your business needs.",
    problem: "Extra features that add clutter.",
    Icon: Layers,
  },
  {
    title: "Speed checked before launch",
    summary: "Page speed checks help us find and fix slow-loading content before your website goes live.",
    problem: "Slow pages that make visitors wait.",
    Icon: Gauge,
  },
  {
    title: "Designed around your business",
    summary: "Your content and brand guide the layout, helping customers understand what you offer.",
    problem: "Generic layouts with little room for your brand.",
    Icon: Palette,
  },
  {
    title: "Easy to use on every screen",
    summary: "Layouts are checked on phones, tablets, and desktops, with clear content and next steps.",
    problem: "Pages that are awkward to use on a phone.",
    Icon: Smartphone,
  },
];

const STANDARDS = [
  {
    highlight: "Yours",
    label: "Design for your business",
    supporting: "Your content and goals guide the layout and features.",
  },
  {
    highlight: "Speed",
    label: "Less waiting",
    supporting: "Page speed checks help us find and fix slow-loading content.",
  },
  {
    highlight: "Care",
    label: "Thoughtful movement",
    supporting: "Animations guide visitors, with a quieter option for reduced motion.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Leon turned my professional history and project credentials into a clean, narrative-led brand that communicates trust instantly.",
    name: "Kossy Langat",
    role: "Structural Engineer & GM",
  },
  {
    quote:
      "The guided intake wizard qualified carrier prospects and captured DOT compliance files without manual paperwork.",
    name: "Faith",
    role: "Owner, Delivah Dispatch",
  },
  {
    quote:
      "Leon built a custom dispatch engine that replaces phone tag and scattered records with guided digital workflows.",
    name: "Ken Madara",
    role: "Owner, Legit Logistics",
  },
];

export function Founder() {
  const nairobiTime = useNairobiTime();
  const sectionRef = useRef<HTMLElement>(null);
  const { visiblePanels, mobileSequence, desktopTransition, nextVisible, spreadVisible } = useFounderSequence(sectionRef);

  return (
    <section ref={sectionRef} id="founder" className="founder-section">
      <div className="founder-stage">
      <div className="founder-spread" inert={desktopTransition && !spreadVisible} aria-hidden={desktopTransition && !spreadVisible ? true : undefined}>
        <div className="founder-paper founder-paper-first" aria-hidden="true" />
        <div className="founder-paper founder-paper-middle" aria-hidden="true" />
        <div className="founder-paper founder-paper-last" aria-hidden="true" />
        <div className="founder-divider founder-divider-first" aria-hidden="true" />
        <div className="founder-divider founder-divider-second" aria-hidden="true" />
        <div className="founder-column founder-introduction" inert={mobileSequence && visiblePanels !== 1} aria-hidden={mobileSequence && visiblePanels !== 1 ? true : undefined}>
          <div className="founder-introduction-inner">
            <p className="founder-label founder-intro-label">02 / Meet Leon</p>
            <h2 className="founder-headline"><span className="founder-headline-opening">A Website Built Around</span> <em>Your Business.</em></h2>
            <p className="founder-supporting">Your website should explain what you do and help people take the next step. I work with you on the design, content, and features that make that possible.</p>
          </div>
        </div>
        <div className="founder-column founder-film" inert={visiblePanels < 2 || (mobileSequence && visiblePanels === 3)} aria-hidden={visiblePanels < 2 || (mobileSequence && visiblePanels === 3) ? true : undefined}>
          <div className="founder-film-inner">
            <h3 className="founder-film-heading"><span className="founder-film-opening">First impressions happen in seconds.</span><em>Let’s make yours stick.</em></h3>
            <p className="founder-film-caption">My message to you.</p>
            <VideoPlayer src="/videos/codebyleon-intro.mp4" className="founder-video" />
            <p className="founder-film-supporting">Work directly with Leon, from your first conversation through design and development.</p>
          </div>
        </div>
        <div className="founder-column founder-biography" inert={visiblePanels < 3} aria-hidden={visiblePanels < 3 ? true : undefined}>
          <div>
            <aside className="founder-profile">
              <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                Founder, Designer &amp; Developer
              </p>

              <h3 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Leon <span className="text-signal">Madara</span>
              </h3>

              <p className="mt-5 flex items-center gap-2.5 text-[13px] font-medium text-jade">
                <span className="relative flex size-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade opacity-50" />
                  <span className="relative inline-flex size-2 rounded-full bg-jade" />
                </span>
                Let&apos;s discuss your project
              </p>

              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                I design and build websites for businesses, along with online tools for tasks like
                enquiries, bookings, and keeping records. You work with me directly, so you can
                ask questions, share feedback, and know who is building your website.
              </p>

              <dl className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em]">
                <div className="flex items-center gap-3 border-t border-border py-3.5">
                  <MapPin className="size-4 shrink-0 text-signal" aria-hidden />
                  <dt className="sr-only">Location</dt>
                  <dd className="text-foreground/85">Based in Nairobi, Kenya</dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 border-t border-border py-3.5">
                  <dt className="text-muted-foreground">Local Studio Time:</dt>
                  <dd className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold tabular-nums text-foreground">
                      {nairobiTime ?? "--:--:--"}
                    </span>
                    <span className="text-muted-foreground">EAT</span>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </div>
      <div className="founder-wipe" aria-hidden="true"><div className="founder-wipe-tint" /></div>
      <div className="founder-next-panel" inert={desktopTransition && !nextVisible} aria-hidden={desktopTransition && !nextVisible ? true : undefined}>
        <div className="founder-next-reveal">
          <div className="founder-comparison">
            <div className="founder-comparison-intro">
              <h3 className="founder-next-heading">
                <span>Built Around</span><span>What You</span><span>Need !</span>
              </h3>
              <img className="founder-heading-stroke" src="/images/custom-website-underline.svg" width="240" height="15" alt="" aria-hidden="true" />
              <p className="founder-next-copy">
                A ready-made template can be a useful starting point. When it does not fit your
                needs, a custom website gives you more control over the design and features.
              </p>
              <img className="founder-next-artwork" src="/images/custom-website-assembly.svg" width="703" height="410" alt="A designer fitting custom content into a website, beside a growing plant." />
            </div>
            <div className="founder-comparison-solutions">
              <h3 className="founder-next-columns">How I Build Your Website</h3>
              <ul className="founder-solution-list">
                {WEBSITE_APPROACHES.map(({ title, summary, problem, Icon }) => (
                  <li key={title} className="founder-solution-card">
                    <div className="founder-solution-content">
                      <div className="founder-solution-header">
                        <span className="founder-solution-check" aria-hidden="true"><Icon strokeWidth={1.7} /></span>
                        <h4>{title}</h4>
                      </div>
                      <p className="founder-solution-summary">{summary}</p>
                    </div>
                    <div className="founder-solution-problem">
                      <p className="founder-card-label">Common problem</p>
                      <p>{problem}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
      </div>
      <div className="founder-details">
      <div className="mx-auto max-w-7xl">
        {/* What Goes Into Your Website — hairline spec strip */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <h3 className="border-t border-border pt-10 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              What Goes Into Your Website
            </h3>
          </Reveal>
          <div className="mt-2 grid border-t border-border md:grid-cols-3 md:divide-x md:divide-border">
            {STANDARDS.map((standard, i) => (
              <Reveal key={standard.label} delay={i * 0.08}>
                <div className="py-8 md:px-8 md:first:pl-0">
                  <p className="font-display text-5xl font-bold tracking-tight text-signal md:text-6xl">
                    {standard.highlight}
                  </p>
                  <p className="mt-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    {standard.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {standard.supporting}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Testimonials — hairline-separated trio with serif quote marks */}
        <div className="mt-20 md:mt-28">
          <Reveal>
            <h3 className="border-t border-border pt-10 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              What Clients Say
            </h3>
          </Reveal>
          <div className="mt-2 grid border-t border-border md:grid-cols-3 md:divide-x md:divide-border">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <figure className="group flex h-full flex-col py-8 transition-colors duration-300 md:px-8 md:first:pl-0">
                  <span
                    aria-hidden
                    className="font-serif text-5xl font-medium italic leading-none text-signal transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <span
                      aria-hidden
                      className="size-1.5 rotate-45 bg-signal/50 transition-colors duration-300 group-hover:bg-signal"
                    />
                    <span>
                      <span className="block font-display text-base font-semibold text-foreground">
                        {t.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {t.role}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}


