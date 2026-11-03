"use client";

import Image from "next/image";

import { SectionLabel } from "./section-label";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  Link2,
  Loader2,
  MailOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { openConfigurator } from "./configurator";

export const OPEN_ARTICLE_EVENT = "cbl:open-article";

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; label?: string; items: string[] }
  | { type: "callout"; title: string; items: string[] };

type Article = {
  slug: string;
  number: string;
  category: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  minutes: number;
  image: string;
  imageAlt: string;
  href: string;
  body: Block[];
};

const ARTICLES: Article[] = [
  {
    "slug": "3-mistakes-your-business-website-is-making",
    "number": "01",
    "category": "Website Tips",
    "title": "3 Ways to Make Your Website Easier to Use",
    "dek": "Help visitors understand your services, find answers and get in touch.",
    "author": "Leon Madara",
    "date": "Aug 2026",
    "minutes": 2,
    "image": "/images/blog/mistakes.png",
    "imageAlt": "Illustration of a laptop showing a broken, glitching website with warning symbols",
    "href": "/blog/3-mistakes-your-business-website-is-making",
    "body": [
      {
        "type": "p",
        "text": "Your website should help people understand what you offer and decide whether to contact you. Start by checking three things: clear information, loading speed and an obvious next step."
      },
      {
        "type": "h2",
        "text": "Make your services clear"
      },
      {
        "type": "p",
        "text": "Visitors may be comparing businesses or looking for a specific answer. Explain what you do, who you help and what they can expect. Use the words your customers use."
      },
      {
        "type": "list",
        "items": [
          "Describe your main service in a short sentence.",
          "Show relevant work or qualifications that you can verify.",
          "Explain your process, likely timeline and what affects the price."
        ]
      },
      {
        "type": "p",
        "text": "Ask someone unfamiliar with your business to read your homepage. Can they explain your service and find the information they need? Their questions can show you where to improve."
      },
      {
        "type": "h2",
        "text": "Check the website on a phone"
      },
      {
        "type": "p",
        "text": "Large images and unnecessary scripts can make pages slow to load. Check your website on a phone using mobile data, rather than relying only on your office connection."
      },
      {
        "type": "list",
        "items": [
          "Resize and compress images without making them unclear.",
          "Load the most useful content first.",
          "Check that text, forms and buttons work on small screens."
        ]
      },
      {
        "type": "h2",
        "text": "Give visitors a clear next step"
      },
      {
        "type": "p",
        "text": "Choose the main action that fits your business: an enquiry, a booking or a purchase. Make it easy to find and explain what happens after someone takes that step."
      },
      {
        "type": "p",
        "text": "Other links can still be useful. Keep the main action clear so visitors can contact you when they are ready."
      },
      {
        "type": "callout",
        "title": "Key takeaways",
        "items": [
          "Use plain words to explain your service.",
          "Check loading speed and usability on a phone.",
          "Keep your main contact or booking action easy to find."
        ]
      },
      {
        "type": "p",
        "text": "If you would like help reviewing your website, tell us what you offer and what you want visitors to do. We can discuss where changes would be most useful."
      }
    ]
  },
  {
    "slug": "before-after-website-transformation-case-studies",
    "number": "02",
    "category": "Case Studies",
    "title": "Three Website Projects: What Changed",
    "dek": "A look at a personal website, carrier registration portal and dispatch app.",
    "author": "Leon Madara",
    "date": "Sep 2026",
    "minutes": 2,
    "image": "/images/blog/before-after.png",
    "imageAlt": "Split illustration comparing an outdated cluttered website with a modern glowing redesign",
    "href": "/blog/before-after-website-transformation-case-studies",
    "body": [
      {
        "type": "p",
        "text": "Different businesses need different websites. These three projects show how the work can support a specific task: presenting experience, collecting registrations or tracking deliveries."
      },
      {
        "type": "h2",
        "text": "Kossy Langat: bring experience together"
      },
      {
        "type": "p",
        "text": "The starting point was engineering experience and project details spread across PDFs and a listing site. The aim was to make that information easier to find and browse."
      },
      {
        "type": "p",
        "text": "The website brings qualifications, a career timeline and a project gallery together. Visitors can explore the work on a phone or a larger screen."
      },
      {
        "type": "h2",
        "text": "Delivah Dispatch: collect carrier registrations online"
      },
      {
        "type": "p",
        "text": "Carrier registration relied on calls, paper forms and email attachments. The team needed a clearer way to collect information and review documents."
      },
      {
        "type": "p",
        "text": "The portal includes a step-by-step registration form, document uploads and a staff dashboard. Carrier details and documents are gathered together for review."
      },
      {
        "type": "h2",
        "text": "Legit Logistics: connect delivery updates"
      },
      {
        "type": "p",
        "text": "Dispatch information was spread across calls, spreadsheets and separate records. The aim was to connect bookings and delivery updates."
      },
      {
        "type": "p",
        "text": "The app brings together a dispatch dashboard, driver updates, customer tracking and automatic status notifications. Each part supports a different person involved in a delivery."
      },
      {
        "type": "h2",
        "text": "Start with the task your website needs to support"
      },
      {
        "type": "list",
        "items": [
          "List the questions your customers ask most often.",
          "Identify information your team repeatedly collects or sends.",
          "Choose the most useful task to improve first.",
          "Check the result with the people who will use it."
        ]
      },
      {
        "type": "callout",
        "title": "Key takeaways",
        "items": [
          "A portfolio can help people explore your experience.",
          "Online forms can keep registrations and documents together.",
          "Connected updates can make delivery progress easier to follow."
        ]
      },
      {
        "type": "p",
        "text": "These examples describe the features built, rather than promise the same results for every business. Tell us what your customers and team need, and we can discuss a suitable approach."
      }
    ]
  },
  {
    "slug": "how-professional-website-increases-inquiries",
    "number": "03",
    "category": "Business Growth",
    "title": "How Your Website Can Help You Get More Enquiries",
    "dek": "Practical ways to make your services clearer and help interested visitors contact you.",
    "author": "Leon Madara",
    "date": "Oct 2026",
    "minutes": 2,
    "image": "/images/blog/inquiries.png",
    "imageAlt": "Illustration of a rising growth chart with glowing inquiry message bubbles",
    "href": "/blog/how-professional-website-increases-inquiries",
    "body": [
      {
        "type": "p",
        "text": "A website can help interested visitors get in touch. Clear services, relevant examples and a straightforward enquiry form are useful places to start. Results depend on your audience, traffic and how you respond."
      },
      {
        "type": "h2",
        "text": "Explain what you offer"
      },
      {
        "type": "p",
        "text": "Use your homepage to answer three questions: what do you do, who is it for and how can someone contact you? Avoid making visitors decode technical terms or broad promises."
      },
      {
        "type": "h2",
        "text": "Show useful evidence"
      },
      {
        "type": "p",
        "text": "Use real projects, relevant qualifications and client feedback you have permission to share. Explain the work in enough detail for someone to decide whether it relates to their needs."
      },
      {
        "type": "h2",
        "text": "Make contacting you straightforward"
      },
      {
        "type": "list",
        "items": [
          "Keep required form fields to the information you need to start a conversation.",
          "Explain what happens after an enquiry is sent.",
          "Check the form and contact links on a phone.",
          "Provide a contact option that your team can reliably monitor."
        ]
      },
      {
        "type": "h2",
        "text": "Follow up thoughtfully"
      },
      {
        "type": "p",
        "text": "A useful enquiry needs a response. Agree who receives messages and how your team will follow up. A confirmation message can help people know their enquiry has arrived."
      },
      {
        "type": "h2",
        "text": "Measure what changes"
      },
      {
        "type": "p",
        "text": "Compare visitor numbers and genuine enquiries before and after a change. Look at which pages and contact options people use. Avoid assuming that a redesign alone caused an increase."
      },
      {
        "type": "callout",
        "title": "Key takeaways",
        "items": [
          "Explain your services in familiar words.",
          "Use specific, verifiable examples of your work.",
          "Make contact options easy to find and use.",
          "Track enquiries and review how your team responds."
        ]
      },
      {
        "type": "p",
        "text": "There is no fixed percentage increase that applies to every website. If you want to improve yours, start with the questions your visitors need answered and the next step you want to make easier."
      }
    ]
  }
];

/** Programmatic opener (command palette, etc.). */
export function openArticle(href: string) {
  window.dispatchEvent(new CustomEvent(OPEN_ARTICLE_EVENT, { detail: href }));
}

type View = { type: "index" } | { type: "article"; index: number } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function viewForHref(href: string): View {
  if (href === "/blog" || !href.startsWith("/blog/")) return { type: "index" };
  const slug = href.replace("/blog/", "").replace(/\/$/, "");
  const index = ARTICLES.findIndex((a) => a.slug === slug);
  return index >= 0 ? { type: "article", index } : { type: "index" };
}

export function ArticleReader({ initialHref }: { initialHref?: string } = {}) {
  const router = useRouter();
  const { toast } = useToast();

  const [view, setView] = useState<View>(() => initialHref ? viewForHref(initialHref) : null);
  const [filter, setFilter] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const openHref = useCallback((href: string) => {
    setView(viewForHref(href));
  }, []);

  // Programmatic opens (command palette, etc.)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const href = (e as CustomEvent<string>).detail;
      openHref(typeof href === "string" ? href : "/blog");
    };
    window.addEventListener(OPEN_ARTICLE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ARTICLE_EVENT, onOpen);
  }, [openHref]);

  // Intercept plain left-clicks on /blog destination links
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        "a[href]"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/blog")) return;
      e.preventDefault();
      openHref(href);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [openHref]);

  // Reset scroll + progress whenever the view changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = 0;
      setProgress(0);
    });
    return () => cancelAnimationFrame(frame);
  }, [view]);

  // rAF-throttled reading progress
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const el = scrollRef.current;
      if (!el) return;
      const denom = el.scrollHeight - el.clientHeight;
      setProgress(denom > 8 ? Math.min(1, Math.max(0, el.scrollTop / denom)) : 1);
    });
  }, []);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        if (initialHref) {
          router.push("/#articles", { scroll: false });
          return;
        }
        setView(null);
        window.setTimeout(() => setFilter(null), 250);
      }
    },
    [initialHref, router]
  );

  const copyLink = useCallback(
    async (href: string) => {
      const url = `${window.location.origin}${href}`;
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
          ok = true;
        }
      } catch {
        ok = false;
      }
      if (!ok) {
        try {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          ok = true;
        } catch {
          ok = false;
        }
      }
      toast({
        title: ok ? "Link copied" : "Couldn't copy the link",
        description: ok ? url : "Copy it from the address bar instead.",
      });
    },
    [toast]
  );

  const minutes =
    view?.type === "article" ? ARTICLES[view.index].minutes : 0;
  const finished = progress >= 0.97;
  const minsLeft = Math.max(0, Math.ceil(minutes * (1 - progress)));

  const open = view !== null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-describedby="article-reader-desc"
        className="top-[50%] flex max-h-[88vh] w-full max-w-[calc(100%-1.5rem)] translate-y-[-50%] flex-col gap-0 overflow-hidden rounded-[3px] border-border bg-card p-0 duration-300 sm:max-w-2xl [&>[data-slot=dialog-close]]:z-30"
      >
        <DialogTitle className="sr-only">Field Notes article</DialogTitle>
        <DialogDescription id="article-reader-desc" className="sr-only">
          Read the full article, keep reading related notes, or start a project.
        </DialogDescription>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scroll-slim flex min-h-0 flex-1 flex-col overflow-y-auto"
        >
          <AnimatePresence mode="wait" initial={false}>
            {view?.type === "index" ? (
              <IndexView
                key="index"
                filter={filter}
                onFilter={setFilter}
                onOpen={(index) => setView({ type: "article", index })}
              />
            ) : view?.type === "article" ? (
              <ArticleView
                key={`article-${view.index}`}
                article={ARTICLES[view.index]}
                progress={progress}
                minsLeft={minsLeft}
                finished={finished}
                onBack={() => setView({ type: "index" })}
                onOpenArticle={(index) => setView({ type: "article", index })}
                onCopy={copyLink}
              />
            ) : null}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Blog index                                                          */
/* ------------------------------------------------------------------ */

function IndexView({
  filter,
  onFilter,
  onOpen,
}: {
  filter: string | null;
  onFilter: (category: string | null) => void;
  onOpen: (index: number) => void;
}) {
  const categories = Array.from(new Set(ARTICLES.map((a) => a.category)));
  const visible = filter
    ? ARTICLES.filter((a) => a.category === filter)
    : ARTICLES;

  const countFor = (cat: string | null) =>
    cat ? ARTICLES.filter((a) => a.category === cat).length : ARTICLES.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="px-5 py-7 sm:px-7"
    >
      <SectionLabel>Field Notes — All Articles</SectionLabel>
      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-foreground">
        The{" "}
        <em className="font-serif font-medium italic text-signal">Index.</em>
      </h3>

      {/* category filter — editorial underline tabs */}
      <div
        role="tablist"
        aria-label="Filter articles by category"
        className="mt-6 flex flex-wrap gap-x-5 gap-y-1 border-b border-border"
      >
        {[null, ...categories].map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat ?? "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onFilter(cat)}
              className={cn(
                "-mb-px border-b-2 pb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                active
                  ? "border-signal text-signal"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {cat ?? "All"}
              <span
                className={cn(
                  "ml-1.5 tabular-nums",
                  active ? "text-signal/70" : "text-muted-foreground/50"
                )}
              >
                {String(countFor(cat)).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      {/* article rows */}
      <div className="mt-1">
        {visible.map((a) => {
          const index = ARTICLES.indexOf(a);
          return (
            <button
              key={a.slug}
              type="button"
              onClick={() => onOpen(index)}
              className="group flex w-full items-center gap-5 border-b border-border py-5 text-left transition-colors duration-200 hover:bg-signal/[0.04]"
            >
              <div className="relative hidden w-20 shrink-0 overflow-hidden border border-border sm:block">
                <Image
                  src={a.image}
                  alt=""
                  width={1344}
                  height={768}
                  sizes="80px"
                  loading="lazy"
                  className="aspect-square w-full object-cover saturate-[0.85] transition-all duration-500 group-hover:scale-[1.05] group-hover:saturate-100"
                />
              </div>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-signal">{a.number}</span>
                  <span className="text-muted-foreground">{a.category}</span>
                </span>
                <span className="mt-1.5 block font-display text-base font-semibold leading-snug tracking-tight text-foreground">
                  {a.title}
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {a.author} · {a.date} · {a.minutes} min read
                </span>
              </span>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
        Practical notes on websites, design and working with clients.
      </p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Article reading view                                                */
/* ------------------------------------------------------------------ */

function ArticleView({
  article,
  progress,
  minsLeft,
  finished,
  onBack,
  onOpenArticle,
  onCopy,
}: {
  article: Article;
  progress: number;
  minsLeft: number;
  finished: boolean;
  onBack: () => void;
  onOpenArticle: (index: number) => void;
  onCopy: (href: string) => void;
}) {
  const related = ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* sticky reading bar with progress + copy link */}
      <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3 py-3 pl-4 pr-14 sm:pl-5">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:text-signal"
          >
            <ChevronLeft
              className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden
            />
            All Notes
          </button>
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.16em] tabular-nums",
                finished ? "text-jade" : "text-muted-foreground"
              )}
            >
              {finished ? "Finished" : `${minsLeft} min left`}
            </span>
            <button
              type="button"
              onClick={() => onCopy(article.href)}
              aria-label="Copy article link"
              title="Copy article link"
              className="grid size-7 place-items-center border border-border text-muted-foreground transition-colors duration-300 hover:border-signal hover:text-signal"
            >
              <Link2 className="size-3.5" aria-hidden />
            </button>
          </div>
        </div>
        {/* reading progress */}
        <div aria-hidden className="h-[2px] w-full bg-border">
          <div
            className="h-full bg-signal transition-[width] duration-200 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* cover */}
      <div className="relative border-b border-border">
        <Image
          src={article.image}
          alt={article.imageAlt}
          width={1344}
          height={768}
          sizes="(max-width: 672px) calc(100vw - 24px), 672px"
          loading="eager"
          className="aspect-[7/3] w-full object-cover"
        />
        <span aria-hidden className="mark-tl" />
        <span aria-hidden className="mark-tr" />
      </div>

      {/* reading column */}
      <div className="mx-auto w-full max-w-[36rem] px-5 py-8 sm:px-7 sm:py-10">
        <p className="flex flex-wrap items-baseline gap-x-3 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="font-semibold text-signal">{article.category}</span>
          <span aria-hidden className="text-muted-foreground/50">
            /
          </span>
          <span className="text-muted-foreground">
            {article.author} · {article.date}
          </span>
        </p>

        <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-[2rem]">
          {article.title}
        </h3>

        <p className="mt-4 font-serif text-base italic leading-relaxed text-muted-foreground">
          {article.dek}
        </p>

        <div className="mt-8 border-t border-border pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
            {article.minutes} min read · Beyond the Blueprint
          </p>
        </div>

        <ArticleBody blocks={article.body} />

        {/* end mark */}
        <div className="mt-10 flex items-center justify-center gap-3" aria-hidden>
          <span className="h-px w-10 bg-border" />
          <span className="size-1.5 rotate-45 bg-signal" />
          <span className="h-px w-10 bg-border" />
        </div>

        {/* inline newsletter */}
        <InlineSubscribe />

        {/* related reading */}
        <div className="mt-12">
          <SectionLabel>Keep Reading</SectionLabel>
          <div className="mt-5">
            {related.map((rel) => (
              <button
                key={rel.slug}
                type="button"
                onClick={() => onOpenArticle(ARTICLES.indexOf(rel))}
                className="group flex w-full items-center gap-5 border-t border-border py-4 text-left transition-colors duration-200 last:border-b hover:bg-signal/[0.04]"
              >
                <div className="relative hidden w-20 shrink-0 overflow-hidden border border-border sm:block">
                  <Image
                    src={rel.image}
                    alt=""
                    width={1344}
                    height={768}
                    sizes="80px"
                    loading="lazy"
                    className="aspect-square w-full object-cover saturate-[0.85] transition-all duration-500 group-hover:scale-[1.05] group-hover:saturate-100"
                  />
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
                    {rel.category}
                  </span>
                  <span className="mt-1 block font-display text-sm font-semibold leading-snug tracking-tight text-foreground">
                    {rel.title}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {rel.minutes} min read
                  </span>
                </span>
                <ArrowUpRight
                  className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal"
                  aria-hidden
                />
              </button>
            ))}
          </div>
        </div>

        {/* CTA band */}
        <div className="relative mt-12 border border-border bg-foreground/[0.03] p-6 sm:p-7 dark:bg-foreground/[0.05]">
          <span aria-hidden className="mark-tl" />
          <span aria-hidden className="mark-tr" />
          <span aria-hidden className="mark-bl" />
          <span aria-hidden className="mark-br" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-signal">
            Have a website in mind?
          </p>
          <p className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground">
            Let's plan{" "}
            <em className="font-serif font-medium italic text-signal">
              it.
            </em>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Tell us what you need. Answer a few questions to see a suggested
            starting point for your project.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => openConfigurator("/get-started.html")}
              className="group inline-flex h-11 items-center justify-center gap-2.5 rounded-[3px] bg-signal px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-signal-foreground transition-colors duration-300 hover:bg-signal/85"
            >
              Start Your Project
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </button>
            <button
              type="button"
              onClick={() =>
                openConfigurator("/get-started.html?intent=discovery-call")
              }
              className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors duration-300 hover:text-signal"
            >
              <span className="text-link">or arrange a call</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Article body renderer                                               */
/* ------------------------------------------------------------------ */

function ArticleBody({ blocks }: { blocks: Block[] }) {
  const firstParagraphIndex = blocks.findIndex((block) => block.type === "p");

  return (
    <div className="mt-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p": {
            const isFirst = i === firstParagraphIndex;
            return (
              <p
                key={i}
                className={cn(
                  "mt-6 text-[15px] leading-[1.85] text-foreground/85",
                  isFirst && "drop-cap mt-0 text-foreground"
                )}
              >
                {block.text}
              </p>
            );
          }
          case "h2": {
            const h2Index = blocks.slice(0, i + 1).filter((item) => item.type === "h2").length;
            return (
              <div key={i} className="mt-12 border-t border-border pt-6">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-signal">
                  {String(h2Index).padStart(2, "0")}
                </p>
                <h4 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {block.text}
                </h4>
              </div>
            );
          }
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-10 border-l-2 border-signal pl-6 sm:pl-8"
              >
                <p className="font-serif text-xl italic leading-snug text-foreground sm:text-2xl">
                  {block.text}
                </p>
              </blockquote>
            );
          case "list":
            return (
              <div key={i} className="mt-8">
                {block.label ? (
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    {block.label}
                  </p>
                ) : null}
                <ul className="mt-4">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3.5 border-t border-border py-3 text-[15px] leading-[1.8] text-foreground/85"
                    >
                      <span
                        aria-hidden
                        className="mt-[9px] size-1.5 shrink-0 rotate-45 bg-jade"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "callout":
            return (
              <aside
                key={i}
                className="mt-12 border border-jade/40 bg-jade/[0.06] p-6 sm:p-7"
              >
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-jade">
                  {block.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                    >
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-jade"
                        strokeWidth={2.5}
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inline newsletter signup                                            */
/* ------------------------------------------------------------------ */

function InlineSubscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "loading") return;
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      setMessage("Please enter a valid email address.");
      return;
    }
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
          ? "You're already subscribed."
          : "You're subscribed. Thank you."
      );
    } catch {
      setState("error");
      setMessage("Network error — please check your connection and retry.");
    }
  };

  return (
    <div className="mt-12 border-t border-border pt-7">
      <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        <MailOpen className="size-3.5 text-signal" aria-hidden />
        Field Notes
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Get practical notes about websites, design and lessons from projects.
      </p>
      {state === "done" ? (
        <p
          role="status"
          className="mt-4 flex items-center gap-3 border border-jade/40 bg-jade/[0.06] px-4 py-3 text-sm font-medium text-foreground"
        >
          <span className="grid size-6 shrink-0 place-items-center border border-jade text-jade">
            <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
          </span>
          {message}
        </p>
      ) : (
        <form onSubmit={submit} noValidate className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="article-notes-email" className="sr-only">
              Email address
            </label>
            <input
              id="article-notes-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="you@company.com"
              aria-invalid={state === "error"}
              aria-describedby={state === "error" ? "article-notes-error" : undefined}
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
        <p id="article-notes-error" role="alert" className="mt-2 text-xs text-destructive">
          {message}
        </p>
      ) : null}
    </div>
  );
}
