"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./article-turn.module.css";

type Cube = { scene: HTMLDivElement; rotor: HTMLDivElement; incoming: HTMLDivElement; top: number; depth: number };
type Turn = { path: string; index: number; from: number; direction: number; overlay: HTMLDivElement | null; article?: Cube; number?: Cube; timer: ReturnType<typeof setTimeout>; started: boolean };
type Controls = { busy: boolean; from: number | null; goTo: (index: number, slug: string) => void };
const TurnContext = createContext<Controls | null>(null);

function snapshot(source: HTMLElement, width: number, offset: number) {
  const copy = source.cloneNode(true) as HTMLElement;
  copy.removeAttribute("id");
  copy.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
  copy.inert = true;
  Object.assign(copy.style, { width: `${width}px`, margin: "0", position: "relative", top: `${offset}px` });
  return copy;
}

function cube(source: HTMLElement, top: number, height: number, direction: number, overlay: HTMLElement): Cube {
  const rect = source.getBoundingClientRect();
  const scene = document.createElement("div");
  const rotor = document.createElement("div");
  const outgoing = document.createElement("div");
  const incoming = document.createElement("div");
  const depth = rect.width / 2;
  scene.className = styles.scene;
  rotor.className = styles.rotor;
  outgoing.className = incoming.className = styles.face;
  Object.assign(scene.style, { left: `${rect.left}px`, top: `${top}px`, width: `${rect.width}px`, height: `${height}px` });
  rotor.style.transform = `translateZ(${-depth}px)`;
  outgoing.style.transform = `translateZ(${depth}px)`;
  incoming.style.transform = `rotateY(${90 * direction}deg) translateZ(${depth}px)`;
  outgoing.append(snapshot(source, rect.width, rect.top - top));
  rotor.append(outgoing, incoming);
  scene.append(rotor);
  overlay.append(scene);
  return { scene, rotor, incoming, top, depth };
}

export function useArticleTurn() {
  const controls = useContext(TurnContext);
  if (!controls) throw new Error("Article controls require the blog layout");
  return controls;
}

export function ArticleTurnProvider({ children, basePath = "/blog", itemName = "Article", overlayClassName }: { children: ReactNode; basePath?: string; itemName?: string; overlayClassName?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const scope = useRef<HTMLDivElement>(null);
  const pending = useRef<Turn | null>(null);
  const [state, setState] = useState<{ busy: boolean; from: number | null }>({ busy: false, from: null });
  const [message, setMessage] = useState("");
  const { contextSafe } = useGSAP({ scope, dependencies: [pathname], revertOnUpdate: true });

  const finish = useCallback((outcome: "done" | "cancel" | "failed" = "done") => {
    const turn = pending.current;
    if (!turn) return;
    pending.current = null;
    clearTimeout(turn.timer);
    if (turn.article) gsap.killTweensOf(turn.article.rotor);
    if (turn.number) gsap.killTweensOf(turn.number.rotor);
    turn.overlay?.remove();
    const article = scope.current?.querySelector<HTMLElement>("[data-article-index]");
    if (article) article.inert = false;
    setState({ busy: false, from: null });
    setMessage(outcome === "failed" ? `The ${itemName.toLowerCase()} is taking longer to open. You can try again or choose another title.` : outcome === "done" ? `${itemName} ${turn.index + 1} opened.` : "");
    if (outcome === "done") requestAnimationFrame(() => scope.current?.querySelector<HTMLElement>("[data-article-number]")?.focus({ preventScroll: true }));
  }, [itemName]);

  const goTo = useCallback((index: number, slug: string) => {
    if (pending.current) return;
    const article = scope.current?.querySelector<HTMLElement>("[data-article-index]");
    if (!article) return;
    const from = Number(article.dataset.articleIndex);
    if (from === index) return;
    const direction = index > from ? 1 : -1;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const number = scope.current?.querySelector<HTMLElement>("[data-article-number]");
    let overlay: HTMLDivElement | null = null;
    let articleCube: Cube | undefined;
    let numberCube: Cube | undefined;
    if (!reduced && number) {
      overlay = document.createElement("div");
      overlay.className = [styles.overlay, overlayClassName].filter(Boolean).join(" ");
      if (overlayClassName) {
        const computed = getComputedStyle(article);
        for (const name of ["--font-syne", "--font-display", "--font-serif", "--font-sans", "--font-mono"]) {
          overlay.style.setProperty(name, computed.getPropertyValue(name));
        }
      }
      overlay.setAttribute("aria-hidden", "true");
      document.body.append(overlay);
      const header = scope.current?.querySelector("header");
      const top = (header?.getBoundingClientRect().bottom ?? 0) + 24;
      const rail = scope.current?.querySelector("aside");
      const bottom = rail && getComputedStyle(rail).position === "fixed" ? rail.getBoundingClientRect().top : window.innerHeight;
      articleCube = cube(article, top, Math.max(1, bottom - top), direction, overlay);
      const rect = number.getBoundingClientRect();
      numberCube = cube(number, rect.top, rect.height, direction, overlay);
    }
    pending.current = {
      path: `${basePath}/${slug}`, index, from, direction, overlay, article: articleCube, number: numberCube,
      timer: setTimeout(() => finish("failed"), 10000), started: false,
    };
    article.inert = true;
    setState({ busy: true, from });
    setMessage(`Opening ${itemName.toLowerCase()} ${index + 1}.`);
    router.push(`${basePath}/${slug}`, { scroll: false });
  }, [router, finish, basePath, itemName, overlayClassName]);

  useEffect(() => {
    const turn = pending.current;
    if (!turn) return;
    if (pathname !== turn.path) { finish("cancel"); return; }
    if (turn.started) return;
    turn.started = true;
    clearTimeout(turn.timer);
    turn.timer = setTimeout(() => finish("failed"), 4000);
    const routedArticle = scope.current?.querySelector<HTMLElement>("[data-article-index]");
    if (routedArticle) routedArticle.inert = true;
    let disposed = false;
    const play = contextSafe(() => {
      if (disposed || pending.current !== turn) return;
      window.scrollTo({ top: 0, behavior: "instant" });
      const article = scope.current?.querySelector<HTMLElement>("[data-article-index]");
      const number = scope.current?.querySelector<HTMLElement>("[data-article-number]");
      if (!article || !number) { finish("failed"); return; }
      if (!turn.article || !turn.number || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
      const nextArticle = snapshot(article, turn.article.depth * 2, article.getBoundingClientRect().top - turn.article.top);
      const nextNumber = snapshot(number, turn.number.depth * 2, 0);
      const digit = nextNumber.querySelector("[data-article-digit]");
      if (digit) digit.textContent = String(turn.index + 1);
      turn.article.incoming.append(nextArticle);
      turn.number.incoming.append(nextNumber);
      const timeline = gsap.timeline({ onComplete: () => finish() });
      for (const face of [turn.article, turn.number]) {
        timeline.fromTo(face.rotor, { z: -face.depth, rotationY: 0 }, { z: -face.depth, rotationY: -90 * turn.direction, duration: .7, ease: "power2.inOut" }, 0);
      }
    });
    // Wait for the routed DOM and its fonts/image before exposing the incoming face.
    const ready = async () => {
      const image = scope.current?.querySelector<HTMLImageElement>("[data-article-index] header img");
      const assets = Promise.all([document.fonts.ready, image?.decode().catch(() => undefined)]);
      let assetTimer: ReturnType<typeof setTimeout> | undefined;
      await Promise.race([assets, new Promise(resolve => { assetTimer = setTimeout(resolve, 1500); })]);
      clearTimeout(assetTimer);
      if (!disposed) requestAnimationFrame(play);
    };
    void ready();
    return () => { disposed = true; };
  }, [pathname, contextSafe, finish]);

  useEffect(() => {
    const resized = () => finish("cancel");
    window.addEventListener("resize", resized);
    return () => {
      window.removeEventListener("resize", resized);
      const turn = pending.current;
      if (turn) { clearTimeout(turn.timer); turn.overlay?.remove(); pending.current = null; }
    };
  }, [finish]);

  return <TurnContext.Provider value={{ ...state, goTo }}>
    <div ref={scope}>{children}<span className="sr-only" role="status">{message}</span></div>
  </TurnContext.Provider>;
}

export function ArticleTurnLink({ index, slug, className, children }: { index: number; slug: string; className?: string; children: ReactNode }) {
  const { busy, goTo } = useArticleTurn();
  return <Link href={`/blog/${slug}`} prefetch={false} className={className} aria-disabled={busy || undefined} onClick={event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!busy) goTo(index, slug);
  }}>{children}</Link>;
}
