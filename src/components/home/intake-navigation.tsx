"use client";

import { useRef, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./intake-navigation.module.css";

type Props = {
  ready: boolean;
  canGoBack: boolean;
  canReview: boolean;
  onReview: () => void;
  beforeNavigate: () => boolean;
  onBack: () => void;
  onExit: () => void;
  onBusyChange: (busy: boolean) => void;
};

export function IntakeNavigation({ ready, canGoBack, canReview, onReview, beforeNavigate, onBack, onExit, onBusyChange }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const lockedRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const { contextSafe } = useGSAP({ scope: rootRef });

  function navigate(kind: "back" | "exit") {
    contextSafe(() => {
      if (lockedRef.current || (kind === "back" && !canGoBack)) return;
      if (kind === "exit" && !beforeNavigate()) return;
      lockedRef.current = true;
      setBusy(true);
      onBusyChange(true);

      const finish = () => {
        if (kind === "back") onBack();
        else onExit();
        gsap.set("[data-back-button], [data-back-arrow], [data-exit-icon]", { clearProps: "all" });
        lockedRef.current = false;
        setBusy(false);
        onBusyChange(false);
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }

      const timeline = gsap.timeline({ onComplete: finish });
      if (kind === "back") {
        const palette = getComputedStyle(rootRef.current!);
        const color = (token: string) => palette.getPropertyValue(token).trim();
        timeline
          .to("[data-back-button]", { backgroundColor: color("--signal"), borderColor: color("--signal"), color: color("--signal-foreground"), duration: 0.14 }, 0)
          .to("[data-back-arrow]", { x: -5, duration: 0.14, ease: "power2.out" }, 0)
          .to({}, { duration: 0.08 })
          .to("[data-back-arrow]", { x: 0, duration: 0.18, ease: "power2.out" })
          .to("[data-back-button]", { backgroundColor: color("--foreground"), borderColor: color("--foreground"), color: color("--background"), duration: 0.18 }, "<");
      } else {
        timeline.to("[data-exit-icon]", { autoAlpha: 0, scale: 0.2, duration: 0.2 }, 0);
        rootRef.current?.querySelectorAll<HTMLElement>("[data-vapor]").forEach((particle, index) => {
          const angle = index * Math.PI * 2 / 18;
          const distance = 35 + (index % 4) * 12;
          timeline.fromTo(particle,
            { x: 0, y: 0, autoAlpha: 0.85, scale: 0.3 },
            { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, autoAlpha: 0, scale: 1.3, duration: 0.5 + (index % 3) * 0.08, ease: "power2.out" },
            0.04,
          );
        });
      }
    })();
  }

  return (
    <nav ref={rootRef} aria-label="Project navigation" className={styles.controls} data-busy={busy}>
      <div className={styles.backGroup}>
        <div className={styles.backWrap}>
          <button type="button" disabled={!ready || !canGoBack || busy} aria-label="Previous question" aria-describedby="intake-back-hint" data-back-button data-available={canGoBack} className={styles.back} onClick={() => navigate("back")}>
            <ArrowLeft data-back-arrow aria-hidden="true" className={styles.backArrow} size={18} />
          </button>
          <span role="tooltip" id="intake-back-hint" className={`${styles.hint} ${styles.backHint}`}>Previous question</span>
        </div>
        {canReview && <>
          <button type="button" disabled={!ready || busy} onClick={onReview} aria-describedby="intake-review-hint" className={styles.review}>Review from the beginning</button>
          <span id="intake-review-hint" className="sr-only">Your answers and contact details will be kept.</span>
        </>}
      </div>
      <div className={styles.exitWrap}>
        <button type="button" disabled={!ready || busy} aria-label="Save & exit" aria-describedby="intake-exit-hint" className={styles.exit} onClick={() => navigate("exit")}>
          <span data-exit-icon className={styles.exitIcon}><X aria-hidden="true" size={19} strokeWidth={1.6} /></span>
        </button>
        <span role="tooltip" id="intake-exit-hint" className={styles.hint}>Save &amp; exit</span>
        <span aria-hidden="true" className={styles.vapor}>
          {Array.from({ length: 18 }, (_, index) => <span key={index} data-vapor className={styles.particle} />)}
        </span>
      </div>
    </nav>
  );
}
