"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  disabled?: boolean;
}

export function Reveal({ children, className, delay = 0, y = 28, disabled = false }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={disabled || reduce ? false : { opacity: 0, y }}
      animate={disabled ? { opacity: 1, y: 0 } : undefined}
      whileInView={disabled ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: disabled || reduce ? 0 : 0.7, delay: disabled || reduce ? 0 : delay, ease: [0.65, 0, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
