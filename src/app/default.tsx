import { notFound } from "next/navigation";

// The intake parallel slot has a catch-all. Unknown main-page URLs stay 404s.
export default function DefaultPage() {
  notFound();
}
