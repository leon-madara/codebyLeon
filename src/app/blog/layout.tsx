import type { ReactNode } from "react";
import { ArticleTurnProvider } from "@/components/blog/article-turn";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <ArticleTurnProvider>{children}</ArticleTurnProvider>;
}
