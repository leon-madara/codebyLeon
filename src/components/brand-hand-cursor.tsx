"use client";

import { useEffect } from "react";

/** Colour the native hand shape without replacing text, drag or resize cursors. */
export function BrandHandCursor() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    let current: Element | null = null;
    let frame = 0;
    const clear = () => {
      current?.removeAttribute("data-brand-hand");
      current = null;
    };
    const isBlue = (color: string) => {
      const channels = color.match(/[\d.]+/g)?.map(Number);
      if (!channels || channels.length < 3 || channels[3] === 0) return false;
      const [r, g, b] = channels;
      return b - r > 35 && b > g * 1.05;
    };
    const update = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      if (!desktop.matches || event.pointerType !== "mouse" || !(event.target instanceof Element)) {
        clear();
        return;
      }
      const target = event.target;
      frame = requestAnimationFrame(() => {
        // Remove our override before checking the element's intended cursor.
        clear();
        const style = getComputedStyle(target);
        if (style.cursor !== "pointer") return;
        let blue = isBlue(style.color) || isBlue(style.fill);
        for (let node: Element | null = target; node; node = node.parentElement) {
          const background = getComputedStyle(node).backgroundColor;
          blue ||= isBlue(background);
          // Stop at the first opaque surface beneath the pointer.
          const alpha = background.match(/[\d.]+/g)?.map(Number);
          if (alpha && (alpha.length === 3 || alpha[3] === 1)) break;
        }
        current = target;
        current.setAttribute("data-brand-hand", blue ? "orange" : "blue");
      });
    };
    const reset = () => { cancelAnimationFrame(frame); clear(); };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) reset(); };
    document.addEventListener("pointermove", update, { passive: true });
    document.addEventListener("pointerover", update, { passive: true });
    document.addEventListener("pointerout", leave);
    window.addEventListener("blur", reset);
    desktop.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("pointermove", update);
      document.removeEventListener("pointerover", update);
      document.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", reset);
      desktop.removeEventListener("change", reset);
    };
  }, []);
  return null;
}
