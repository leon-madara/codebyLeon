"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Retain programmatic article opens while the full reader lives on its own route. */
export function ArticleNavigation() {
  const router = useRouter();
  useEffect(() => {
    const open = (event: Event) => {
      const href = (event as CustomEvent<unknown>).detail;
      if (typeof href === "string" && (href === "/blog" || href.startsWith("/blog/"))) router.push(href);
    };
    window.addEventListener("cbl:open-article", open);
    return () => window.removeEventListener("cbl:open-article", open);
  }, [router]);
  return null;
}
