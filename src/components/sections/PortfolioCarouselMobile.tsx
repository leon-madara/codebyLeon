import { useRef, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";
import { getPortfolioProjectCta } from "./PortfolioCarousel";
import { ArrowUpRight } from "lucide-react";
import "@/styles/sections/portfolio-mobile.css";

gsap.registerPlugin(ScrollTrigger);

const PortfolioCarouselMobile = () => {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const prefersReducedMotion = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      prefersReducedMotion.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const getDuration = useCallback(
    (d: number) => (prefersReducedMotion.current ? 0.01 : d),
    []
  );

  const animateCards = useCallback(
    (index: number) => {
      if (!cardStageRef.current) return;
      const cards =
        cardStageRef.current.querySelectorAll<HTMLElement>(
          ".portfolio-mobile__card"
        );
      const duration = getDuration(0.5);

      cards.forEach((card, i) => {
        const step = i - index;

        if (step === 0) {
          // Active card — visible and centered
          gsap.to(card, {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            zIndex: 3,
            duration,
            ease: "power2.out",
            force3D: true,
            overwrite: "auto",
          });
        } else {
          // Inactive — faded out and offset
          gsap.to(card, {
            y: step < 0 ? -30 : 30,
            autoAlpha: 0,
            scale: 0.97,
            zIndex: 0,
            duration,
            ease: "power2.out",
            force3D: true,
            overwrite: "auto",
          });
        }
      });
    },
    [getDuration]
  );

  useGSAP(
    () => {
      if (
        !scrollWrapperRef.current ||
        !pinnedRef.current ||
        projects.length === 0
      )
        return;

      // Initialize first card
      activeIndexRef.current = 0;
      setActiveIndex(0);
      animateCards(0);

      const maxIndex = projects.length - 1;

      const trigger = ScrollTrigger.create({
        trigger: scrollWrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinnedRef.current,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progressIndex = Math.min(
            maxIndex,
            Math.max(0, Math.round(self.progress * maxIndex))
          );

          if (progressIndex === activeIndexRef.current) return;

          activeIndexRef.current = progressIndex;
          setActiveIndex(progressIndex);
          animateCards(progressIndex);
        },
      });

      const handleRefresh = () => {
        animateCards(activeIndexRef.current);
      };

      ScrollTrigger.addEventListener("refresh", handleRefresh);

      return () => {
        ScrollTrigger.removeEventListener("refresh", handleRefresh);
        trigger.kill();
      };
    },
    {
      scope: scrollWrapperRef,
      dependencies: [animateCards],
    }
  );

  return (
    <div
      ref={scrollWrapperRef}
      className="portfolio-mobile__scroll-wrapper"
      style={{
        height: `${Math.max(projects.length, 1) * 100}vh`,
      }}
    >
      <div ref={pinnedRef} className="portfolio-mobile__pinned portfolio-mobile">
        <h2 className="portfolio-mobile__heading">Our Work</h2>

        <div ref={cardStageRef} className="portfolio-mobile__card-stage">
          {projects.map((project, projectIndex) => {
            const cta = getPortfolioProjectCta(project);

            const cardContent = (
              <>
                {/* Image */}
                <div className="portfolio-mobile__image-wrap">
                  <span className="portfolio-mobile__chip">
                    {project.type}
                  </span>
                  <img
                    src={project.mobileImage || project.image}
                    alt={project.name}
                    loading={projectIndex === 0 ? "eager" : "lazy"}
                  />
                  <div
                    className="portfolio-mobile__image-overlay"
                    style={{
                      background: `linear-gradient(180deg, transparent 50%, ${project.accentColor.replace(
                        ")",
                        " / 0.25)"
                      )})`,
                    }}
                  />
                </div>

                {/* Text */}
                <div className="portfolio-mobile__text">
                  <h3 className="portfolio-mobile__name">{project.name}</h3>
                  <p className="portfolio-mobile__description">
                    {project.description}
                  </p>
                  <span className="portfolio-mobile__arrow" aria-hidden="true">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </>
            );

            const isActive = projectIndex === activeIndex;

            return cta.isRoute ? (
              <Link
                key={project.name}
                className="portfolio-mobile__card"
                to={cta.href}
                aria-label={`View ${project.name} case study`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
              >
                {cardContent}
              </Link>
            ) : (
              <a
                key={project.name}
                className="portfolio-mobile__card"
                href={cta.href}
                aria-label={`View ${project.name} project`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
              >
                {cardContent}
              </a>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="portfolio-mobile__dots" aria-label="Project indicators">
          {projects.map((project, i) => (
            <span
              key={project.name}
              className={`portfolio-mobile__dot${
                i === activeIndex ? " portfolio-mobile__dot--active" : ""
              }`}
              aria-current={i === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCarouselMobile;
