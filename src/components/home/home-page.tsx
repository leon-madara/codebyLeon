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
import { ArticleNavigation } from "@/components/home/article-navigation";
import { BackToTop } from "@/components/home/back-to-top";

export function HomeContent() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <BackgroundFX />
      <ScrollProgress />
      <Navbar />
      <CommandPalette />
      <ProjectNavigation />
      <ArticleNavigation />
      <SectionDots />
      <BackToTop />
      <main data-nav-push className="relative flex-1">
        <Hero />
        <RealityCheck services={<Services />} />
        <Founder />
        <Works />
        <Articles />
        <FinalCTA />
      </main>
      <div data-nav-push className="sm:pb-14"><Footer /></div>
      {/* Desktop/tablet static capability strip (except on get-started page) */}
      <div
        role="region"
        aria-label="Studio capabilities"
        className="fixed bottom-0 inset-x-0 z-30 hidden sm:block bg-background/90 shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.22)] dark:shadow-[0_-6px_20px_-8px_rgba(0,0,0,0.65)] backdrop-blur-md"
      >
        <CapabilityTicker />
      </div>
    </div>
  );
}
