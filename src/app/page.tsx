import { Navbar } from "@/components/home/navbar";
import { Hero } from "@/components/home/hero";
import { CapabilityTicker } from "@/components/home/capability-ticker";
import { RealityCheck } from "@/components/home/reality-check";
import { Services } from "@/components/home/services";
import { Founder } from "@/components/home/founder";
import { Works } from "@/components/home/works";
import { Articles } from "@/components/home/articles";
import { FinalCTA } from "@/components/home/final-cta";
import { Footer } from "@/components/home/footer";
import { BackgroundFX } from "@/components/home/background";
import { ScrollProgress } from "@/components/home/scroll-progress";
import { SectionDots } from "@/components/home/section-dots";
import { CommandPalette } from "@/components/home/command-palette";
import { ProjectNavigation } from "@/components/home/project-navigation";
import { CaseStudyReader } from "@/components/home/case-study-reader";
import { BackToTop } from "@/components/home/back-to-top";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <BackgroundFX />
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <ProjectNavigation />
      <CaseStudyReader />
      <SectionDots />
      <BackToTop />
      <main data-nav-push className="relative flex-1">
        <Hero />
        <CapabilityTicker />
        <RealityCheck services={<Services />} />
        <Founder />
        <Works />
        <Articles />
        <FinalCTA />
      </main>
      <div data-nav-push><Footer /></div>
    </div>
  );
}
