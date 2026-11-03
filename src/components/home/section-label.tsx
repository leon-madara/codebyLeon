import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./section-label.module.css";

interface SectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  inverse?: boolean;
}

/** Decorative pre-title label. Metadata, navigation and form labels keep their own styles. */
export function SectionLabel({ children, className, inverse = false, ...props }: SectionLabelProps) {
  return (
    <span {...props} data-section-label className={cn(styles.label, inverse && styles.inverse, className)}>
      <span>{children}</span>
      <svg aria-hidden="true" viewBox="0 0 240 16" className={styles.squiggle} fill="none">
        <path pathLength="1" d="M3 10 C18 1 29 15 44 8 S69 2 83 9 S108 14 123 7 S148 2 163 9 S188 14 203 7 S226 4 237 8" />
      </svg>
    </span>
  );
}
