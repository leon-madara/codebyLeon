"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Square, hairline-bordered light/dark switch — matches the editorial
 * "Ink & Signal" chrome.
 *
 * The applied state is read straight from the <html> class attribute via
 * useSyncExternalStore + MutationObserver, so the label, icon and click
 * action always reflect the theme that is actually applied (including
 * the pre-hydration inline script default), independent of context
 * hydration timing.
 */

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme } = useTheme();

  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        className ??
        "grid size-10 place-items-center rounded-[3px] border border-border text-muted-foreground transition-colors duration-200 hover:border-signal hover:text-signal"
      }
    >
      {isDark ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
    </button>
  );
}
