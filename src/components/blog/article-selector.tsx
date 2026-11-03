"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useArticleTurn } from "./article-turn";
import styles from "./article-selector.module.css";

type Note = { slug: string; title: string; category: string };

export function ArticleSelector({ posts, activeIndex, basePath = "/blog", itemName = "article" }: { posts: Note[]; activeIndex: number; basePath?: string; itemName?: string }) {
  const { busy, from, goTo } = useArticleTurn();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const selected = useRef<{ index: number; slug: string } | null>(null);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const shown = busy && from !== null ? from : activeIndex;
  const selectorLabel = itemName === "article" ? "Article selector" : "Case study selector";
  const move = (step: number) => {
    const index = activeIndex + step;
    if (!busy && index >= 0 && index < posts.length) goTo(index, posts[index].slug);
  };
  useEffect(() => {
    for (const index of [activeIndex - 1, activeIndex + 1]) {
      if (posts[index]) router.prefetch(`${basePath}/${posts[index].slug}`);
    }
  }, [activeIndex, posts, router, basePath]);

  return <nav className={`${styles.selector}${itemName === "case study" ? ` ${styles.caseStudy}` : ""}`} aria-label={selectorLabel} aria-busy={busy}>
    <div className={styles.label}>{selectorLabel}<span>Choose by title</span></div>
    <div className={styles.controls}>
      <button type="button" className={styles.arrow} disabled={busy || activeIndex === 0} aria-label={`Previous ${itemName}`} onClick={() => move(-1)}><ArrowLeft size={18} aria-hidden /></button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button type="button" data-article-number className={styles.number} disabled={busy}
            aria-label={`Choose ${itemName} by title, current ${itemName} ${shown + 1} of ${posts.length}`}
            title="Choose by title. On touch screens, swipe left for next or right for previous."
            onKeyDown={event => {
              swiped.current = false;
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
            }}
            onPointerDown={event => {
              swiped.current = false;
              if (event.pointerType === "mouse") return;
              gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { gesture.current = null; swiped.current = true; }}
            onPointerUp={event => {
              const start = gesture.current;
              gesture.current = null;
              if (!start || start.id !== event.pointerId) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { swiped.current = true; move(dx < 0 ? 1 : -1); }
            }}
            onClick={event => { if (swiped.current) { swiped.current = false; event.preventDefault(); } }}
          ><span data-article-digit>{shown + 1}</span></button>
        </DialogTrigger>
        <DialogContent className={styles.dialog} onCloseAutoFocus={() => {
          const choice = selected.current;
          selected.current = null;
          if (choice) requestAnimationFrame(() => goTo(choice.index, choice.slug));
        }}>
          <DialogTitle>{itemName === "article" ? "Choose an article" : `Choose a ${itemName}`}</DialogTitle>
          <DialogDescription>Read in order, or jump to the topic you need.</DialogDescription>
          <ol className={styles.list}>{posts.map((post, index) => <li key={post.slug}>
            <Link prefetch={false} href={`${basePath}/${post.slug}`} aria-current={index === activeIndex ? "page" : undefined} onClick={event => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              selected.current = { index, slug: post.slug };
              setOpen(false);
            }}>
              <span className={styles.listNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span><small>{post.category}</small>{post.title}</span>
              {index === activeIndex && <Check size={16} aria-hidden />}
            </Link>
          </li>)}</ol>
        </DialogContent>
      </Dialog>
      <button type="button" className={styles.arrow} disabled={busy || activeIndex === posts.length - 1} aria-label={`Next ${itemName}`} onClick={() => move(1)}><ArrowRight size={18} aria-hidden /></button>
    </div>
    <span className={styles.count} aria-live="polite" aria-atomic="true">{shown + 1} of {posts.length}</span>
  </nav>;
}
