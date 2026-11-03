"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import styles from "./code-block.module.css";

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }
  return <div className={styles.panel}>
    <div className={styles.header}>
      <span className={styles.label}>Ink &amp; Signal <span>{"// "}{language || "Code"}</span></span>
      <button type="button" onClick={copy} className={styles.copy}>
        {status === "copied" ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
        {status === "copied" ? "Copied" : "Copy code"}
      </button>
    </div>
    <pre className={styles.pre} tabIndex={0} aria-label={`${language || "Code"} example`}><code>{code.split("\n").map((line, index) =>
      <span className={styles.line} key={index}><span className={styles.number} aria-hidden>{index + 1}</span><span>{line || " "}</span></span>
    )}</code></pre>
    <div className={styles.footer}><span>{code.split("\n").length} lines</span><span role="status">{status === "failed" ? "Copy unavailable. Select the code to copy." : status === "copied" ? "Code copied to clipboard" : "Code example"}</span></div>
  </div>;
}
