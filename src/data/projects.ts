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
    accentColor: "hsl(28 78% 48%)",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    blobColors: {
      purple: "hsl(165 48% 18%)",
      orange: "hsl(28 78% 48%)",
      blue: "hsl(52 86% 44%)",
    },
  },
  {
    name: "Reverie Reveal",
    type: "Luxury Commerce Experience",
    category: "Small Business",
    description:
      "A refined home and living storefront concept with soft editorial motion, product storytelling, and a premium furniture browsing experience.",
    image: "/portfolio/reverie-reveal.png",
    accentColor: "hsl(37 43% 59%)",
    techStack: ["TanStack Start", "React", "Tailwind CSS", "GSAP"],
    blobColors: {
      purple: "hsl(26 28% 26%)",
      orange: "hsl(37 43% 59%)",
      blue: "hsl(32 18% 72%)",
    },
  },
  {
    name: "Leon Madara Portfolio",
    type: "Case Study System",
    category: "SaaS",
    description:
      "A portfolio system shaped around deep case studies, project proof, and structured storytelling for product-minded web work.",
    image: "/portfolio/leon-madara-portfolio.png",
    accentColor: "hsl(214 88% 62%)",
    techStack: ["React", "Vite", "TypeScript", "GSAP"],
    blobColors: {
      purple: "hsl(155 74% 25%)",
      orange: "hsl(0 72% 42%)",
      blue: "hsl(214 88% 62%)",
    },
  },
  {
    name: "CodeByLeon",
    type: "Studio Website",
    category: "Creative",
    description:
      "The current CodeByLeon site: a bold, animated studio presence designed to show craft, positioning, and conversion-ready web direction.",
    image: "/portfolio/codebyleon.png",
    accentColor: "hsl(18 88% 52%)",
    techStack: ["React", "Vite", "TypeScript", "GSAP"],
    blobColors: {
      purple: "hsl(246 86% 68%)",
      orange: "hsl(18 88% 52%)",
      blue: "hsl(204 87% 67%)",
    },
  },
];
