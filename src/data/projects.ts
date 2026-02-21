import projectLogistics from "@/assets/project-logistics.jpg";
import projectCreative from "@/assets/project-creative.jpg";
import projectSaas from "@/assets/project-saas.jpg";
import projectRestaurant from "@/assets/project-restaurant.jpg";
import projectFintech from "@/assets/project-fintech.jpg";

export interface Project {
  name: string;
  type: string;
  category: "Small Business" | "SaaS" | "Creative";
  description: string;
  image: string;
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
    type: "B2B Logistics Platform",
    category: "Small Business",
    description:
      "A high-performance delivery service platform designed for immediate B2B conversion. Real-time tracking, fleet management, and automated dispatch.",
    image: projectLogistics,
    accentColor: "hsl(210 90% 50%)",
    techStack: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"],
    blobColors: {
      purple: "hsl(230 70% 45%)",
      orange: "hsl(200 80% 50%)",
      blue: "hsl(190 90% 45%)",
    },
  },
  {
    name: "Bloom Studio",
    type: "Creative Agency",
    category: "Creative",
    description:
      "An immersive portfolio for a design studio specializing in brand identity, digital experiences, and motion design for premium clients.",
    image: projectCreative,
    accentColor: "hsl(330 80% 55%)",
    techStack: ["React", "GSAP", "Three.js", "Styled Components"],
    blobColors: {
      purple: "hsl(330 70% 50%)",
      orange: "hsl(25 95% 55%)",
      blue: "hsl(280 60% 50%)",
    },
  },
  {
    name: "CloudSync Pro",
    type: "SaaS Dashboard",
    category: "SaaS",
    description:
      "Enterprise-grade analytics dashboard with real-time data pipelines, customizable widgets, and AI-powered insights for decision-makers.",
    image: projectSaas,
    accentColor: "hsl(270 60% 55%)",
    techStack: ["Vue 3", "D3.js", "WebSocket", "PostgreSQL"],
    blobColors: {
      purple: "hsl(270 70% 50%)",
      orange: "hsl(260 60% 45%)",
      blue: "hsl(220 80% 55%)",
    },
  },
  {
    name: "Artisan Eats",
    type: "Restaurant Platform",
    category: "Small Business",
    description:
      "A luxury dining reservation and delivery platform featuring chef profiles, seasonal menus, and real-time table availability.",
    image: projectRestaurant,
    accentColor: "hsl(35 90% 50%)",
    techStack: ["React Native", "Node.js", "Stripe", "Firebase"],
    blobColors: {
      purple: "hsl(15 70% 40%)",
      orange: "hsl(35 90% 50%)",
      blue: "hsl(45 80% 45%)",
    },
  },
  {
    name: "NexGen Finance",
    type: "Fintech Application",
    category: "SaaS",
    description:
      "A next-generation trading platform with real-time market data, portfolio management, and AI-driven investment recommendations.",
    image: projectFintech,
    accentColor: "hsl(150 70% 40%)",
    techStack: ["Angular", "RxJS", "Chart.js", "Kubernetes"],
    blobColors: {
      purple: "hsl(160 60% 35%)",
      orange: "hsl(140 70% 40%)",
      blue: "hsl(170 80% 35%)",
    },
  },
];
