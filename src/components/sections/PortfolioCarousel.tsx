import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { projects, type Project } from "@/data/projects";
import SafeImage from "../SafeImage";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const getElementTop = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;

export function getPortfolioProjectCta(project: Pick<Project, "caseStudyPath">) {
  if (project.caseStudyPath) {
    return {
      href: project.caseStudyPath,
      isRoute: true,
      label: "View Details",
    } as const;
  }

  return {
    href: "/get-started.html",
    isRoute: false,
    label: "Start Similar Project",
  } as const;
}

const PortfolioCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const orbPurpleRef = useRef<HTMLDivElement>(null);
  const orbOrangeRef = useRef<HTMLDivElement>(null);
  const orbBlueRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const prefersReducedMotion = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPrefs = () => {
      prefersReducedMotion.current = motionQuery.matches;
    };

    syncPrefs();
    motionQuery.addEventListener("change", syncPrefs);

    return () => {
      motionQuery.removeEventListener("change", syncPrefs);
    };
  }, []);

  const getDuration = useCallback(
    (duration: number) => (prefersReducedMotion.current ? 0.01 : duration),
    []
  );

  const animateOrbs = useCallback(
    (project: Project) => {
      const duration = getDuration(1);
      if (orbPurpleRef.current) {
        gsap.to(orbPurpleRef.current, {
          backgroundColor: project.blobColors.purple,
          duration,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
      if (orbOrangeRef.current) {
        gsap.to(orbOrangeRef.current, {
          backgroundColor: project.blobColors.orange,
          duration,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
      if (orbBlueRef.current) {
        gsap.to(orbBlueRef.current, {
          backgroundColor: project.blobColors.blue,
          duration,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    },
    [getDuration]
  );

  const animateTitle = useCallback(
    (nextName: string) => {
      if (!titleRef.current) return;
      const duration = getDuration(0.6);

      const oldChars = titleRef.current.querySelectorAll(".char-span");
      if (oldChars.length > 0) {
        gsap.to(oldChars, {
          y: -80,
          opacity: 0,
          duration: duration * 0.5,
          stagger: 0.015,
          ease: "expo.in",
          force3D: true,
          onComplete: () => buildChars(nextName),
        });
      } else {
        buildChars(nextName);
      }

      function buildChars(name: string) {
        if (!titleRef.current) return;

        const words = name.split(" ");
        titleRef.current.innerHTML = words
          .map(
            (word) =>
              `<span class="inline-block mr-[0.3em]">${word
                .split("")
                .map(
                  (ch) =>
                    `<span class="char-span" style="opacity:0;transform:translateY(80px)">${ch}</span>`
                )
                .join("")}</span>`
          )
          .join("");

        const newChars = titleRef.current.querySelectorAll(".char-span");
        gsap.to(newChars, {
          y: 0,
          opacity: 1,
          duration,
          stagger: 0.02,
          ease: "expo.out",
          force3D: true,
          overwrite: "auto",
        });
      }
    },
    [getDuration]
  );

  const animateCards = useCallback(
    (index: number) => {
      if (!cardsContainerRef.current) return;
      const cards = cardsContainerRef.current.querySelectorAll(".portfolio-card");
      const duration = getDuration(0.7);

      cards.forEach((card, cardIndex) => {
        const step = cardIndex - index;
        let x = 0;
        let y = 0;
        let scale = 1;
        let rotateY = 0;
        let opacity = 1;
        let zIndex = 1;

        if (step === 0) {
          scale = 1;
          rotateY = 0;
          opacity = 1;
          zIndex = 3;
          x = 0;
          y = 0;
        } else {
          // Background/inactive cards are completely hidden
          opacity = 0;
          zIndex = 0;
          scale = 0.95;
          // Smooth slide offset depending on direction
          x = step < 0 ? -40 : 40;
          y = 0;
        }

        gsap.to(card, {
          x,
          y,
          scale,
          rotateY,
          opacity,
          zIndex,
          duration,
          ease: "power2.out",
          force3D: true,
          overwrite: "auto",
        });
      });
    },
    [getDuration]
  );

  useGSAP(
    () => {
      if (!containerRef.current || !sectionRef.current || projects.length === 0) return;

      const firstProject = projects[0];
      activeIndexRef.current = 0;
      setActiveIndex(0);
      animateTitle(firstProject.name);
      animateCards(0);
      animateOrbs(firstProject);

      const maxIndex = projects.length - 1;
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: sectionRef.current,
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

          const nextProject = projects[progressIndex];
          animateTitle(nextProject.name);
          animateCards(progressIndex);
          animateOrbs(nextProject);
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
      scope: containerRef,
      dependencies: [animateCards, animateOrbs, animateTitle],
    }
  );

  const snapToProject = useCallback(
    (direction: 1 | -1) => {
      if (!containerRef.current || projects.length <= 1) return;

      const maxIndex = projects.length - 1;
      const nextIndex = Math.min(
        maxIndex,
        Math.max(0, activeIndexRef.current + direction)
      );

      if (nextIndex === activeIndexRef.current) return;

      const containerTop = getElementTop(containerRef.current);
      const scrollDistance = Math.max(
        containerRef.current.offsetHeight - window.innerHeight,
        0
      );
      const targetScroll =
        containerTop + (maxIndex === 0 ? 0 : (nextIndex / maxIndex) * scrollDistance);

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const smoother = ScrollSmoother.get();
      if (smoother) {
        smoother.scrollTo(targetScroll, !prefersReduced);
        return;
      }

      window.scrollTo({
        top: targetScroll,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    },
    []
  );

  const currentProject = projects[activeIndex] ?? projects[0];
  const currentProjectCta = getPortfolioProjectCta(currentProject);

  return (
    <div className="portfolio-carousel__wrapper">
      <div
        ref={containerRef}
        className="portfolio-carousel__pin relative w-full"
        style={{
          height: `${Math.max(projects.length, 1) * 100}vh`,
        }}
      >
        <section
          ref={sectionRef}
          id="portfolio"
          className="portfolio-carousel h-screen w-full overflow-hidden bg-background select-none"
        >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div ref={orbPurpleRef} className="orb h-[500px] w-[500px] -top-20 -left-20" />
          <div ref={orbOrangeRef} className="orb h-[400px] w-[400px] top-1/2 left-1/3" />
          <div ref={orbBlueRef} className="orb h-[450px] w-[450px] -bottom-20 -right-20" />
        </div>

        <div className="portfolio-carousel__overlay dot-grid absolute inset-0 pointer-events-none" />

        <div className="portfolio-carousel__header relative z-10 px-8 md:px-16">
          <h2 className="portfolio-carousel__display text-center text-foreground">
            Our Work
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground md:text-base">
            See how we've helped businesses look professional and attract better clients.
          </p>
        </div>

        <div className="portfolio-carousel__content relative z-10 mx-auto flex w-full max-w-[1280px] flex-col items-center gap-5 px-8 md:flex-row md:items-center md:justify-between md:gap-12 md:px-16 lg:gap-16">
          <div className="relative z-20 flex w-full max-w-xl flex-1 flex-col justify-center md:max-w-[34rem] md:flex-[0_1_34rem]">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              {currentProject.type}
            </p>

            {currentProjectCta.isRoute ? (
              <Link
                className="portfolio-carousel__title-link work-cursor-target"
                to={currentProjectCta.href}
                aria-label={currentProject.name}
              >
                <div
                  ref={titleRef}
                  className="portfolio-carousel__title-frijole leading-tight text-foreground mb-6 min-h-[2.5em]"
                />
              </Link>
            ) : (
              <a
                className="portfolio-carousel__title-link work-cursor-target"
                href={currentProjectCta.href}
                aria-label={currentProject.name}
              >
                <div
                  ref={titleRef}
                  className="portfolio-carousel__title-frijole leading-tight text-foreground mb-6 min-h-[2.5em]"
                />
              </a>
            )}

            <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {currentProject.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-1.5 md:gap-2">
              {currentProject.techStack.map((tech) => (
                <span key={tech} className="tag-pill">
                  {tech}
                </span>
              ))}
            </div>

            {currentProjectCta.isRoute ? (
              <Link className="view-details-btn work-cursor-target w-fit" to={currentProjectCta.href}>
                {currentProjectCta.label}
                <ArrowUpRight size={16} />
              </Link>
            ) : (
              <a className="view-details-btn work-cursor-target w-fit" href={currentProjectCta.href}>
                {currentProjectCta.label}
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>

          <div className="portfolio-carousel__cards-wrap relative z-0 flex w-full flex-1 items-center justify-center md:justify-end md:translate-x-8 lg:translate-x-12">
            <div
              ref={cardsContainerRef}
              className="relative w-[280px] h-[186px] sm:w-[450px] sm:h-[300px] md:w-[480px] md:h-[320px] lg:w-[540px] lg:h-[360px]"
            >
              {projects.map((project, projectIndex) => {
                const projectCta = getPortfolioProjectCta(project);
                const isActiveProject = projectIndex === activeIndex;
                const cardClassName = `portfolio-card portfolio-carousel__card work-cursor-target ${
                  isActiveProject ? "is-active" : "is-inactive"
                } absolute inset-0 overflow-hidden rounded-2xl shadow-2xl`;
                const cardContents = (
                  <>
                    <picture className="block h-full w-full">
                      {project.mobileImage ? (
                        <source
                          media="(max-width: 767px)"
                          srcSet={project.mobileImage}
                        />
                      ) : null}
                      <SafeImage
                        src={project.image}
                        alt={project.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </picture>
                    <div
                      className="portfolio-carousel__image-overlay absolute inset-0"
                      style={{
                        background: `linear-gradient(180deg, transparent 40%, ${project.accentColor.replace(
                          ")",
                          " / 0.3)"
                        )})`,
                      }}
                    />
                  </>
                );

                return projectCta.isRoute ? (
                  <Link
                    key={project.name}
                    className={cardClassName}
                    to={projectCta.href}
                    aria-label={`Open ${project.name} case study`}
                    aria-hidden={!isActiveProject}
                    tabIndex={isActiveProject ? 0 : -1}
                  >
                    {cardContents}
                  </Link>
                ) : (
                  <a
                    key={project.name}
                    className={cardClassName}
                    href={projectCta.href}
                    aria-label={`Open ${project.name} project details`}
                    aria-hidden={!isActiveProject}
                    tabIndex={isActiveProject ? 0 : -1}
                  >
                    {cardContents}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <button
          className={`nav-arrow absolute left-4 top-1/2 z-20 -translate-y-1/2 md:left-8 ${
            activeIndex === 0 || projects.length <= 1 ? "is-disabled" : ""
          }`}
          onClick={() => snapToProject(-1)}
          aria-label="Previous project"
          disabled={activeIndex === 0 || projects.length <= 1}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={`nav-arrow absolute right-4 top-1/2 z-20 -translate-y-1/2 md:right-8 ${
            activeIndex === projects.length - 1 || projects.length <= 1
              ? "is-disabled"
              : ""
          }`}
          onClick={() => snapToProject(1)}
          aria-label="Next project"
          disabled={activeIndex === projects.length - 1 || projects.length <= 1}
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <a href="/get-started.html" className="rounded-full bg-accent px-8 py-3 text-sm font-semibold tracking-wide text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer">
            Ready to Start Your Project?
          </a>
        </div>
        </section>
      </div>
    </div>
  );
};

export default PortfolioCarousel;
