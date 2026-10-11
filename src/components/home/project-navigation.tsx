"use client";
import { useEffect } from "react";
import { OPEN_CONFIGURATOR_EVENT } from "./configurator";
export function ProjectNavigation() {
  useEffect(() => {
    const open = (event: Event) => {
      const href = (event as CustomEvent<string>).detail;
      window.location.assign(typeof href === "string" && /^\/get-started\.html(?:\?|$)/.test(href) ? href : "/get-started.html");
    };
    window.addEventListener(OPEN_CONFIGURATOR_EVENT, open);
    return () => window.removeEventListener(OPEN_CONFIGURATOR_EVENT, open);
  }, []);
  return null;
}
