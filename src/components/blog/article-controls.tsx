"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Github, Link2, Linkedin } from "lucide-react";
import { BrandLogo } from "@/components/home/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import styles from "./blog.module.css";
import { ArticleSelector } from "./article-selector";
import { useArticleTurn } from "./article-turn";

type Note = { slug: string; title: string; category: string };

export function BlogHeader({ posts, activeIndex = -1 }: { posts: Note[]; activeIndex?: number }) {
  const { busy, from } = useArticleTurn();
  const shown = busy && from !== null ? from : activeIndex;
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = headerRef.current;
    const page = header?.parentElement;
    if (!header || !page) return;
    const update = () => page.style.setProperty("--blog-header-height", `${header.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(update);
    observer.observe(header);
    update();
    return () => { observer.disconnect(); page.style.removeProperty("--blog-header-height"); };
  }, []);
  useEffect(() => {
    // A persistent sticky header can prevent Next's automatic scroll reset.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeIndex]);
  return <header ref={headerRef} className={styles.header}>
    <div className={styles.brandRow}>
      <Link href="/" aria-label="Code by Leon home"><BrandLogo /></Link>
      <Link href="/blog" className={styles.archiveLink}>Articles / Field notes</Link>
      <ThemeToggle />
    </div>
    {activeIndex >= 0 && <ArticleSelector posts={posts} activeIndex={activeIndex} />}
    {activeIndex >= 0 && <div className={styles.studioStrip}>
      <span className={styles.studioEdge}>{posts[shown].category} / Issue {String(shown + 1).padStart(2, "0")}</span>
      <span className={styles.studioBrand}><span className={styles.studioDot} aria-hidden="true" />The Studio.</span>
      <span className={styles.studioEdge}>Archive 2026</span>
    </div>}
  </header>;
}

export function ReadingRail({ slug, title }: { slug: string; title: string }) {
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const url = `https://codebyleon.com/blog/${slug}`;
  useEffect(() => {
    const update = () => {
      const article = document.getElementById("article-body");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      setProgress(Math.round(Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height)) * 100));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [slug]);
  return <aside className={styles.rail} aria-label="Article sharing">
    <div className={styles.backWrap}>
      <Link href="/blog" className={styles.back} aria-describedby="all-articles-hint"><ArrowLeft size={17} aria-hidden="true" /><span>Back</span></Link>
      <span id="all-articles-hint" role="tooltip" className={styles.backHint}>To All Articles</span>
    </div>
    <span className={styles.shareLabel}>Share</span>
    <a className={`${styles.shareButton} ${styles.shareX}`} href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">X</a>
    <a className={`${styles.shareButton} ${styles.shareLinkedin}`} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><Linkedin size={17} /></a>
    <a className={`${styles.shareButton} ${styles.shareGithub}`} href="https://github.com/leon-madara" target="_blank" rel="noopener noreferrer" aria-label="Leon on GitHub"><Github size={17} /></a>
    <button className={`${styles.shareButton} ${styles.shareCopy} ${message === "Link copied" ? styles.shareCopied : ""}`} type="button" aria-label="Copy article link" onClick={async () => {
      try { await navigator.clipboard.writeText(url); setMessage("Link copied"); }
      catch { setMessage("Copy this article’s address from your browser."); }
    }}>{message === "Link copied" ? <Check size={17} /> : <Link2 size={17} />}</button>
    <span role="status" className={styles.copyStatus}>{message}</span>
    <span className={styles.readProgress} aria-label={`${progress}% read`}>{progress}% read</span>
  </aside>;
}
