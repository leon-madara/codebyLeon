"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import reference from "./work-reference.json";
import { workFont } from "./work-font";
import "./work-poster.css";

/** Shared approved index for the homepage and the standalone Work route. */
export function WorkIndex({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const rows = contentRef.current?.querySelectorAll<HTMLElement>(".swiss-index-row");
    const cleanups = Array.from(rows ?? [], (row) => {
      const title = row.querySelector<HTMLElement>(".swiss-index-title");
      const lines = Array.from(title?.querySelectorAll<HTMLElement>(":scope > span, :scope > em") ?? []);
      const originals = lines.map((line) => line.textContent ?? "");
      // Keep the accessible title unchanged while its visual overlay scrambles.
      title?.setAttribute("aria-label", originals.join(" "));
      let frame = 0;
      const restore = () => {
        cancelAnimationFrame(frame);
        lines.forEach((line) => line.removeAttribute("data-scramble"));
      };
      const start = () => {
        restore();
        if (reducedMotion.matches || !desktop.matches) return;
        const started = performance.now();
        const lineDuration = 300;
        let lastUpdate = -Infinity;
        const tick = (now: number) => {
          const elapsed = now - started;
          if (elapsed >= lineDuration * lines.length || reducedMotion.matches || !desktop.matches) { restore(); return; }
          if (now - lastUpdate >= 28) {
            lines.forEach((line, lineIndex) => {
              if (lineIndex !== Math.floor(elapsed / lineDuration)) {
                line.removeAttribute("data-scramble");
                return;
              }
              const text = originals[lineIndex];
              // Only a narrow band changes; the complete title stays readable.
              const head = (elapsed % lineDuration) / lineDuration * (text.length + 4) - 2;
              line.dataset.scramble = Array.from(text, (letter, i) =>
                /[A-Z0-9]/i.test(letter) && i >= head - 2 && i <= head + 2
                  ? alphabet[Math.floor(Math.random() * alphabet.length)] : letter
              ).join("");
            });
            lastUpdate = now;
          }
          frame = requestAnimationFrame(tick);
        };
        tick(started);
      };
      const focusIn = (event: FocusEvent) => {
        if (!(event.relatedTarget instanceof Node) || !row.contains(event.relatedTarget)) start();
      };
      const focusOut = (event: FocusEvent) => {
        if (!(event.relatedTarget instanceof Node) || !row.contains(event.relatedTarget)) restore();
      };
      const pointerEnter = (event: PointerEvent) => { if (event.pointerType !== "touch") start(); };
      row.addEventListener("pointerenter", pointerEnter);
      row.addEventListener("pointerleave", restore);
      row.addEventListener("focusin", focusIn);
      row.addEventListener("focusout", focusOut);
      return () => {
        restore();
        row.removeEventListener("pointerenter", pointerEnter);
        row.removeEventListener("pointerleave", restore);
        row.removeEventListener("focusin", focusIn);
        row.removeEventListener("focusout", focusOut);
      };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);


  const Heading = embedded ? "h2" : "h1";
  const Content = embedded ? "div" : "main";
  const markup = embedded
    ? reference["tpl-overview"].replaceAll('<h2 class="swiss-index-title">', '<h3 class="swiss-index-title">').replaceAll("</h2>", "</h3>")
    : reference["tpl-overview"];
  return <div className={`${workFont.variable} work-poster work-picker${embedded ? " work-embedded" : ""}`}>
    <div className="page-layout">
      <Content id={embedded ? "home-work-content" : "work-content"} onClick={event => {
        const row = (event.target as HTMLElement).closest<HTMLElement>("[data-select-article]");
        const slugs = ["legit-logistics", "delivah-dispatch-hub", "kossy-langat"];
        const slug = row && slugs[Number(row.dataset.selectArticle)];
        if (slug) router.push(`/work/${slug}`);
      }}>
        <Heading className="work-index-heading">Selected <em>Work.</em></Heading>
        <div ref={contentRef} dangerouslySetInnerHTML={{ __html: markup }} />
      </Content>
    </div>
  </div>;
}
