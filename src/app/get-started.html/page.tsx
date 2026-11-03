import { ProjectIntake } from "@/components/home/project-intake";
import { socialMetadata } from "@/lib/seo";
const title = "Start a Project | CodeByLeon";
const description = "Plan your website or online tool with Leon. Answer a few questions about your business, goals, and budget to find a starting point.";
export const metadata = { title, description, alternates: { canonical: "https://codebyleon.com/get-started.html" }, ...socialMetadata(title, description, "/get-started.html") };
export default function GetStarted() { return <ProjectIntake />; }
