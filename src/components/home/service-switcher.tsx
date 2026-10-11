"use client";

import { useRef, useState, type ReactNode } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./service-switcher.module.css";

interface ServiceSwitcherProps {
  tiers: ReactNode;
  matcher: ReactNode;
}

function ServicePanelContent({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(contentRef.current, { autoAlpha: 0, y: 14 }, {
        autoAlpha: 1, y: 0, duration: .45, ease: "power2.out",
      });
    });
    return () => media.revert();
  }, { scope: contentRef });
  return <div ref={contentRef} data-service-content>{children}</div>;
}

export function ServiceSwitcher({ tiers, matcher }: ServiceSwitcherProps) {
  const [active, setActive] = useState("tiers");
  const rootRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(indicatorRef.current, {
      xPercent: active === "tiers" ? 0 : 100,
      duration: reduce ? 0 : .45,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, { scope: rootRef, dependencies: [active] });

  useGSAP(() => {
    // Switching panels changes the document's height. Keep the upstream pin
    // and later anchor positions in sync with the newly mounted content.
    let frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, { scope: rootRef, dependencies: [active], revertOnUpdate: true });

  return (
    <div ref={rootRef}>
      <Tabs.Root className={styles.root} value={active} onValueChange={setActive}>
        <Tabs.List className={styles.list} aria-label="Explore services">
          <Tabs.Trigger className={styles.trigger} value="tiers">
            <span className={styles.index} aria-hidden>01</span>
            All Services
          </Tabs.Trigger>
          <Tabs.Trigger className={styles.trigger} value="matcher">
            <span className={styles.index} aria-hidden>02</span>
            Find Your Starting Point
          </Tabs.Trigger>
          <span ref={indicatorRef} className={styles.indicator} aria-hidden />
        </Tabs.List>
        <Tabs.Content value="tiers" className={styles.panel}>
          <ServicePanelContent>{tiers}</ServicePanelContent>
        </Tabs.Content>
        <Tabs.Content value="matcher" className={styles.panel}>
          <ServicePanelContent>{matcher}</ServicePanelContent>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
