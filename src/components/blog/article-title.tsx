"use client";

import { useLayoutEffect, useRef } from "react";
import styles from "./article-title.module.css";

/** Fit both complete title lines together; never wrap or truncate either colour. */
export function ArticleTitle({ title, accent, as: Tag = "h3", className = "" }: {
  title: string; accent?: string; as?: "h1" | "h2" | "h3"; className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const heading = ref.current;
    if (!heading) return;
    const fit = () => {
      if (!heading.isConnected || heading.clientWidth <= 1) return;
      const scale = Number(heading.style.getPropertyValue("--title-scale")) || 1;
      const widest = Math.max(...Array.from(heading.children, line => line.getBoundingClientRect().width / scale));
      if (widest <= 0) return;
      const next = Math.min(1, (heading.clientWidth - 1) / widest);
      if (Math.abs(next - scale) > .002) heading.style.setProperty("--title-scale", String(next));
    };
    const observer = new ResizeObserver(fit);
    observer.observe(heading);
    void document.fonts.ready.then(fit);
    fit();
    return () => observer.disconnect();
  }, [title, accent]);
  return <Tag ref={ref} className={`${styles.title} ${className}`}>
    <span>{title}</span>{accent && <em>{accent}</em>}
  </Tag>;
}
