"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./reveal";

const ARTICLES = [
  {
    "title": "3 Ways to Make Your Website Easier to Use",
    "description": "Help visitors understand your services, find answers and get in touch.",
    "category": "Website Tips",
    "author": "Leon",
    "readingTime": "2 min read",
    "image": "/images/blog/mistakes.png",
    "alt": "Illustration of a laptop showing a broken, glitching website with warning symbols",
    "href": "/blog/3-mistakes-your-business-website-is-making"
  },
  {
    "title": "Three Website Projects: What Changed",
    "description": "A look at a personal website, carrier registration portal and dispatch app.",
    "category": "Case Studies",
    "author": "Leon",
    "readingTime": "2 min read",
    "image": "/images/blog/before-after.png",
    "alt": "Split illustration comparing an outdated cluttered website with a modern glowing redesign",
    "href": "/blog/before-after-website-transformation-case-studies"
  },
  {
    "title": "How Your Website Can Help You Get More Enquiries",
    "description": "Practical ways to make your services clearer and help interested visitors contact you.",
    "category": "Business Growth",
    "author": "Leon",
    "readingTime": "2 min read",
    "image": "/images/blog/inquiries.png",
    "alt": "Illustration of a rising growth chart with glowing inquiry message bubbles",
    "href": "/blog/how-professional-website-increases-inquiries"
  }
];

function ArticleMeta({ author, readingTime }: { author: string; readingTime: string }) {
  return (
    <p className="mt-auto flex flex-wrap items-center gap-x-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      <span>{author}</span>
      <span aria-hidden className="text-signal">
        ·
      </span>
      <span>{readingTime}</span>
    </p>
  );
}

export function Articles() {
  const [featured, ...rest] = ARTICLES;

  return (
    <section id="articles" className="relative scroll-mt-28 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
              <span aria-hidden className="h-px w-8 bg-signal" />
              Insights
            </p>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Recent Articles
            </h2>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Practical advice for planning and improving your website.
            </p>
          </div>
          <a
            href="/blog"
            className="group hidden shrink-0 items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:text-signal md:inline-flex"
          >
            <span className="text-link">View All Posts</span>
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </a>
        </Reveal>

        {/* Asymmetric reading list: one featured spread + two compact rows */}
        <div className="grid gap-12 border-t border-border pt-12 lg:grid-cols-12 lg:gap-14">
          {/* Featured article — image left, editorial text right */}
          <Reveal className="lg:col-span-7">
            <a href={featured.href} className="group flex h-full flex-col gap-8 sm:flex-row">
              <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden border border-border sm:w-[52%]">
                <Image
                  src={featured.image}
                  alt={featured.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw"
                  className="object-cover saturate-[0.9] transition-all duration-700 group-hover:scale-[1.04] group-hover:saturate-100"
                />
              </div>
              <div className="flex flex-col">
                <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
                  <span className="font-semibold text-signal">{featured.category}</span>
                </p>
                <h3 className="text-link mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground decoration-signal decoration-1 underline-offset-[6px] md:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {featured.description}
                </p>
                <div className="mt-6 sm:mt-auto sm:pt-6">
                  <ArticleMeta author={featured.author} readingTime={featured.readingTime} />
                </div>
              </div>
            </a>
          </Reveal>

          {/* Two compact entries — small thumbnails, hairline separated */}
          <div className="flex flex-col border-t border-border pt-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-0 lg:pt-0">
            {rest.map((article, i) => (
              <Reveal key={article.href} delay={0.08 + i * 0.08} className="h-full">
                <a
                  href={article.href}
                  className={`group flex items-start gap-6 py-7 ${
                    i > 0 ? "border-t border-border" : ""
                  } lg:h-full lg:items-center lg:py-9 lg:first:pt-9`}
                >
                  <div className="relative aspect-square w-24 shrink-0 overflow-hidden border border-border sm:w-28 lg:w-32">
                    <Image
                      src={article.image}
                      alt={article.alt}
                      fill
                      sizes="(max-width: 1024px) 30vw, 15vw"
                      className="object-cover saturate-[0.9] transition-all duration-700 group-hover:scale-[1.06] group-hover:saturate-100"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em]">
                      <span className="font-semibold text-signal">{article.category}</span>
                    </p>
                    <h3 className="text-link mt-2.5 font-display text-lg font-semibold leading-snug tracking-tight text-foreground decoration-signal decoration-1 underline-offset-[5px] md:text-xl">
                      {article.title}
                    </h3>
                    <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {article.description}
                    </p>
                    <div className="mt-4">
                      <ArticleMeta author={article.author} readingTime={article.readingTime} />
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>

        {/* mobile view-all */}
        <Reveal delay={0.15} className="mt-12 flex justify-center md:hidden">
          <a
            href="/blog"
            className="group inline-flex h-11 items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:text-signal"
          >
            <span className="text-link">View All Posts</span>
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
