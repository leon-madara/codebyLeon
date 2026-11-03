import type { ReactNode } from "react";
import { ArticleTurnProvider } from "@/components/blog/article-turn";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return <ArticleTurnProvider basePath="/work" itemName="Case study" overlayClassName="work-poster work-turn-overlay">{children}</ArticleTurnProvider>;
}
