import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import { getPortfolioProjectCta } from "./PortfolioCarousel";
import { ArrowUpRight } from "lucide-react";
import "@/styles/sections/portfolio-mobile.css";

const PortfolioCarouselMobile = () => {
  return (
    <section id="portfolio-mobile" className="portfolio-mobile py-20 px-6 relative bg-background overflow-hidden border-y border-border/10">
      <div className="relative z-10">
        <h2 className="font-heading text-4xl leading-tight text-foreground text-center mb-8">
          Our Work
        </h2>

        <div className="portfolio-mobile__scroll-container flex overflow-x-auto snap-x snap-mandatory gap-5 pb-8">
          {projects.map((project) => {
            const cta = getPortfolioProjectCta(project);
            
            return (
              <div key={project.name} className="portfolio-mobile__card snap-center shrink-0 w-[85vw] max-w-[320px] flex flex-col gap-4 rounded-2xl bg-card/40 border border-border/50 p-4 shadow-lg relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `linear-gradient(135deg, ${project.blobColors.purple}, transparent)` }} />
                
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative shadow-sm">
                  {project.mobileImage ? (
                     <img src={project.mobileImage} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                     <img src={project.image} alt={project.name} className="w-full h-full object-cover" loading="lazy" />
                  )}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, transparent 40%, ${project.accentColor.replace(")", " / 0.3)")})`,
                    }}
                  />
                </div>

                <div className="flex flex-col flex-1 z-10 pt-2">
                  <p className="text-[0.65rem] font-bold tracking-[0.15em] text-accent uppercase mb-2">
                    {project.type}
                  </p>
                  
                  <h3 className="font-frijole text-2xl text-foreground mb-3 leading-tight tracking-tight">
                    {project.name}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-5 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="portfolio-mobile__tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {cta.isRoute ? (
                    <Link className="portfolio-mobile__btn flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-colors work-cursor-target" to={cta.href}>
                      {cta.label}
                      <ArrowUpRight size={16} />
                    </Link>
                  ) : (
                    <a className="portfolio-mobile__btn flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-colors work-cursor-target" href={cta.href}>
                      {cta.label}
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioCarouselMobile;
