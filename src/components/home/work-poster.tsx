"use client";

import { useEffect, useRef, useState, type MouseEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Navbar } from "./navbar";
import { CommandPalette } from "./command-palette";
import { ArticleSelector } from "@/components/blog/article-selector";
import { useArticleTurn } from "@/components/blog/article-turn";
import reference from "./work-reference.json";
import { WorkIndex } from "./work-index";
import "./work-poster.css";

export const WORK_SLUGS = ["legit-logistics", "delivah-dispatch-hub", "kossy-langat"];
const CLIENTS = ["Legit Logistics", "Delivah Dispatch", "Kossy Langat"];
const CASES = WORK_SLUGS.map((slug, i) => ({ slug, title: CLIENTS[i], category: ["Dispatch & live tracking", "Carrier onboarding", "Engineering portfolio"][i] }));

/** Static markup is imported from the supplied local design, never from a user/API response. */
export function WorkPoster({ slug }: { slug?: string }) {
  const router = useRouter();
  const index = slug ? WORK_SLUGS.indexOf(slug) : -1;
  const { busy, from } = useArticleTurn();
  const shown = busy && from !== null ? from : index;
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState("story");
  const [notice, setNotice] = useState("");
  const key = index < 0 ? "tpl-overview" : `tpl-proj-${index}`;
  const markup = reference[key as keyof typeof reference];

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => header.parentElement?.style.setProperty("--work-header-height", `${header.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(update);
    observer.observe(header);
    update();
    return () => observer.disconnect();
  }, []);

  async function handleAction(event: MouseEvent<HTMLElement>) {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-select-article], [data-switch-pill], [data-copy-code]");
    if (!target) return;
    if (target.dataset.selectArticle !== undefined) {
      router.push(`/work/${WORK_SLUGS[Number(target.dataset.selectArticle)]}`);
    } else if (target.dataset.switchPill) {
      setPill(target.dataset.switchPill);
    } else if (target.dataset.copyCode !== undefined) {
      try {
        await navigator.clipboard.writeText(target.dataset.copyCode);
        setNotice("Code copied.");
      } catch {
        setNotice("Could not copy. Select the code to copy it manually.");
      }
    }
  }

  function handleChapterKey(event: KeyboardEvent<HTMLElement>) {
    const tab = (event.target as HTMLElement).closest('[role="tab"]');
    if (!tab || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.indexOf(tab as HTMLButtonElement);
    const next = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setPill(tabs[next].dataset.switchPill ?? "story");
    tabs[next].focus();
  }

  // Preserve the imported navigation DOM so the selection can slide between tabs.
  useEffect(() => {
    const root = contentRef.current;
    const tabs = Array.from(root?.querySelectorAll<HTMLButtonElement>(".swiss-pill-seg") ?? []);
    const selected = tabs.findIndex((tab) => tab.dataset.switchPill === pill);
    const nav = root?.querySelector<HTMLElement>(".swiss-pill-nav");
    const previous = nav?.style.getPropertyValue("--chapter-index");
    nav?.style.setProperty("--chapter-index", String(Math.max(0, selected)));
    if (nav && previous && previous !== String(selected)
      && window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
      nav.getAnimations().filter((animation) => animation.id === "chapter-press").forEach((animation) => animation.cancel());
      const shadow = getComputedStyle(nav).boxShadow;
      const border = getComputedStyle(nav).borderTopColor;
      const press = nav.animate([
        { transform: "translateY(0)", boxShadow: shadow },
        { transform: "translateY(3px)", boxShadow: `0 2px 0 ${border}`, offset: .4 },
        { transform: "translateY(0)", boxShadow: shadow },
      ], { duration: 200, easing: "ease-out" });
      press.id = "chapter-press";
    }
    tabs.forEach((tab) => {
      const active = tab.dataset.switchPill === pill;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    root?.querySelectorAll<HTMLElement>(".swiss-pill-panel").forEach((panel) => {
      panel.style.display = panel.dataset.panel === pill ? "block" : "none";
    });
  }, [pill, markup]);

  if (index < 0) return <><Navbar sectionPage /><CommandPalette /><WorkIndex /></>;

  // Initial semantics are static; selection changes update the existing nodes.
  const content = markup
    .replace(/(<button[^>]*data-switch-pill="([^"]+)"[^>]*)(>)/g, (match, start, id, end) => {
      if (!start.includes("swiss-pill-seg")) return match;
      return start.replace(/\sactive\b/, "").replace(/\saria-selected="[^"]*"/, "")
        .replace('class="swiss-pill-seg', `class="swiss-pill-seg${id === "story" ? " active" : ""}`)
        + ` aria-selected="${id === "story"}" tabindex="${id === "story" ? 0 : -1}" id="chapter-${id}" aria-controls="panel-${id}"` + end;
    })
    .replace(/(<div class="swiss-pill-panel" data-panel="([^"]+)" style=")[^"]*(")/g,
      (_, start, id, end) => `${start}display:${id === "story" ? "block" : "none"};${end} role="tabpanel" id="panel-${id}" aria-labelledby="chapter-${id}"`);

  return (
    <>
    <div className={`work-poster${index < 0 ? " work-picker" : ""}`} data-nav-push data-work-turning={busy || undefined}>
      {index >= 0 && <header ref={headerRef} className="top-header">
        <div className="work-header-row">
        <div className="top-header-inner">
          <Link href="/" aria-label="Code by Leon — home"><BrandLogo /></Link>
          <ThemeToggle />
        </div>
        <div className="work-header-selector"><ArticleSelector posts={CASES} activeIndex={index} basePath="/work" itemName="case study" /></div>
        </div>
        <div className="work-studio-strip">
          <span>{CASES[shown]?.title} / Case {String(shown + 1).padStart(2, "0")}</span>
          <Link href="/work" className="work-studio-brand">Client Work.</Link>
          <span>{shown + 1} of {CASES.length}</span>
        </div>
      </header>}
      <div className="page-layout">
        {index >= 0 && <aside className="clean-rail" aria-label="Work navigation">
          <Link className="back-btn kin-lift" href={index < 0 ? "/" : "/work"}>
            ← {index < 0 ? "HOME" : "ALL WORK"}
          </Link>
          {index >= 0 && <button className="work-copy-link" type="button" onClick={async () => {
            try { await navigator.clipboard.writeText(window.location.href); setNotice("Link copied."); }
            catch { setNotice("Could not copy. Copy the address from your browser."); }
          }}>COPY LINK</button>}
          <p className="work-notice" role="status">{notice}</p>
        </aside>}
        <main id="work-content" data-article-index={index >= 0 ? index : undefined} onClick={handleAction} onKeyDown={handleChapterKey}>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: content }} />
        </main>
      </div>
    </div>
    </>
  );
}
