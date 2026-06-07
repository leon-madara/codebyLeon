export interface Project {
  name: string;
  type: string;
  category: "Small Business" | "SaaS" | "Creative";
  description: string;
  image: string;
  caseStudyPath?: string;
  accentColor: string;
  techStack: string[];
  blobColors: {
    purple: string;
    orange: string;
    blue: string;
  };
}

export const projects: Project[] = [
  {
    name: "Legit Logistics",
    type: "Delivery Operations Platform",
    category: "SaaS",
    description:
      "A custom logistics system that connects dispatch, driver updates, proof collection, and customer self-service tracking.",
    image: "/portfolio-legit.png",
    caseStudyPath: "/work/legit-logistics",
    accentColor: "hsl(28 78% 48%)",
    techStack: ["React", "TypeScript", "Supabase", "Realtime"],
    blobColors: {
      purple: "hsl(152 45% 25%)",
      orange: "hsl(28 78% 48%)",
      blue: "hsl(195 65% 38%)",
    },
  },
  {
    name: "Kossy Langat",
    type: "Professional Brand Website",
    category: "Small Business",
    description:
      "A cinematic personal brand site for a structural engineer, built around trust, authority, mentorship, and a clear path to conversation.",
    image: "/portfolio/kossy-langat.png",
    caseStudyPath: "/work/kossy-langat",
    accentColor: "hsl(28 78% 48%)",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    blobColors: {
      purple: "hsl(165 48% 18%)",
      orange: "hsl(28 78% 48%)",
      blue: "hsl(52 86% 44%)",
    },
  },
  {
    name: "Delivah Dispatch",
    type: "Freight Dispatch Funnel",
    category: "Small Business",
    description:
      "A customer-acquisition and carrier intake platform for an American truck dispatch business, connecting services, registration, document upload, and admin review.",
    image: "/portfolio/delivah-dispatch.png",
    caseStudyPath: "/work/delivah-dispatch-hub",
    accentColor: "hsl(143 40% 21%)",
    techStack: ["React", "TypeScript", "Supabase", "EmailJS"],
    blobColors: {
      purple: "hsl(143 40% 21%)",
      orange: "hsl(41 100% 55%)",
      blue: "hsl(198 52% 32%)",
    },
  },
];
