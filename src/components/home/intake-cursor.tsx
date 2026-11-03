"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./project-intake.module.css";

/** The original stop-and-go colour cycle, scoped to the alternate intake. */
export function IntakeCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const colors = ["var(--signal)", "#2380d9", "var(--jade)", "var(--signal)"];
      let colorIndex = 0;
      let lastMove = 0;
      let visible = false;
      const xTo = gsap.quickTo(cursor, "x", { duration: 0.16, ease: "power3.out" });
      const yTo = gsap.quickTo(cursor, "y", { duration: 0.16, ease: "power3.out" });
      const hide = () => {
        cursor.style.opacity = "0";
        visible = false;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") { hide(); return; }
        if (event.target instanceof Element && event.target.closest('input, textarea, select, nav[aria-label="Project navigation"] button')) {
          hide();
          return;
        }
        const now = performance.now();
        if (now - lastMove > 150) {
          cursor.style.backgroundColor = colors[colorIndex];
          colorIndex = (colorIndex + 1) % colors.length;
        }
        lastMove = now;
        if (!visible) {
          gsap.set(cursor, { x: event.clientX - 7, y: event.clientY - 7 });
          visible = true;
          cursor.style.opacity = "1";
        }
        xTo(event.clientX - 7);
        yTo(event.clientY - 7);
      };
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", hide);
      window.addEventListener("blur", hide);
      return () => {
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", hide);
        window.removeEventListener("blur", hide);
        xTo.tween.kill();
        yTo.tween.kill();
        hide();
      };
    });
    return () => media.revert();
  }, { scope: cursorRef });

  return <div ref={cursorRef} aria-hidden="true" className={styles.cursor} />;
}
