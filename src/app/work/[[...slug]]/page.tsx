import { notFound } from "next/navigation";
import { WorkPoster } from "@/components/home/work-poster";
import { workFont } from "@/components/home/work-font";
import type { Metadata } from "next";
import { SITE_URL, socialMetadata } from "@/lib/seo";
const slugs = ["legit-logistics", "delivah-dispatch-hub", "kossy-langat"];
export function generateStaticParams() {
  return [{ slug: [] }, ...slugs.map((slug) => ({ slug: [slug] }))];
}
const projects = [
  { title: "Legit Logistics — Dispatch & Live Tracking", description: "A Code by Leon case study: a fleet dispatch and live tracking platform for Legit Logistics." },
  { title: "Delivah Dispatch — Carrier Onboarding", description: "A Code by Leon case study: a freight website and guided carrier onboarding workflow for Delivah Dispatch." },
  { title: "Kossy Langat — Engineering Portfolio", description: "A Code by Leon case study: an engineering portfolio presenting Kossy Langat’s professional history and project credentials." },
];

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug && (slug.length !== 1 || !slugs.includes(slug[0]))) notFound();
  const project = slug ? projects[slugs.indexOf(slug[0])] : undefined;
  const title = `${project?.title ?? "Selected Work & Case Studies"} | Code by Leon`;
  const description = project?.description ?? "Explore websites and online tools built by Code by Leon, including logistics platforms, carrier onboarding, and an engineering portfolio.";
  const path = `/work${slug ? `/${slug[0]}` : ""}`;
  return { title, description, alternates: { canonical: `${SITE_URL}${path}` }, ...socialMetadata(title, description, path) };
}

export default async function WorkPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (slug && (slug.length !== 1 || !slugs.includes(slug[0]))) notFound();
  return <div className={workFont.variable}><WorkPoster key={slug?.[0] ?? "index"} slug={slug?.[0]} /></div>;
}
