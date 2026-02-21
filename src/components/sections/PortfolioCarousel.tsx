import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { projects, type Project } from "@/data/projects";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ["All", "Small Business", "SaaS", "Creative"] as const;
const getElementTop = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;

const PortfolioCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const filterControlsRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const filterRailRef = useRef<HTMLDivElement>(null);
  const filterPillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const filterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const filterAnimationReadyRef = useRef(false);
  const orbPurpleRef = useRef<HTMLDivElement>(null);
  const orbOrangeRef = useRef<HTMLDivElement>(null);
  const orbBlueRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cursorXTo = useRef<gsap.QuickToFunc | null>(null);
  const cursorYTo = useRef<gsap.QuickToFunc | null>(null);
  const activeIndexRef = useRef(0);
  const prefersReducedMotion = useRef(false);
  const isCoarsePointer = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [cursorVisible, setCursorVisible] = useState(true);
  const cursorVisibleRef = useRef(true);

  const filteredProjects = useMemo(
    () =>
      activeFilter === "All"
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter]
  );

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: coarse)");

    const syncPrefs = () => {
      prefersReducedMotion.current = motionQuery.matches;
      isCoarsePointer.current = pointerQuery.matches;
      if (pointerQuery.matches) {
        cursorVisibleRef.current = false;
        setCursorVisible(false);
      } else {
        cursorVisibleRef.current = true;
        setCursorVisible(true);
      }
    };

    syncPrefs();
    motionQuery.addEventListener("change", syncPrefs);
    pointerQuery.addEventListener("change", syncPrefs);

    return () => {
      motionQuery.removeEventListener("change", syncPrefs);
      pointerQuery.removeEventListener("change", syncPrefs);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
    setFilterOpen(false);
    ScrollTrigger.refresh();
  }, [filteredProjects.length]);

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
      const duration = getDuration(0.8);
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

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
        } else if (step === -1) {
          scale = 1.05;
          rotateY = -12;
          opacity = 0.5;
          zIndex = 2;
          x = isDesktop ? -88 : -40;
          y = isDesktop ? -12 : -30;
        } else if (step === -2) {
          scale = 1.1;
          rotateY = -22;
          opacity = 0.2;
          zIndex = 1;
          x = isDesktop ? -148 : -70;
          y = isDesktop ? -22 : -55;
        } else if (step === 1) {
          scale = 0.85;
          rotateY = 12;
          opacity = 0.5;
          zIndex = 2;
          x = isDesktop ? 84 : -30;
          y = isDesktop ? 16 : 40;
        } else if (step === 2) {
          scale = 0.7;
          rotateY = 22;
          opacity = 0.2;
          zIndex = 1;
          x = isDesktop ? 142 : -50;
          y = isDesktop ? 28 : 70;
        } else {
          opacity = 0;
          zIndex = 0;
          scale = step < 0 ? 1.2 : 0.5;
          rotateY = step < 0 ? -30 : 30;
          x = step < 0 ? (isDesktop ? -188 : -90) : isDesktop ? 184 : -60;
          y = step < 0 ? (isDesktop ? -32 : -80) : isDesktop ? 46 : 100;
        }

        gsap.to(card, {
          x,
          y,
          scale,
          rotateY,
          opacity,
          zIndex,
          duration,
          ease: "expo.inOut",
          force3D: true,
          overwrite: "auto",
        });
      });
    },
    [getDuration]
  );

  useGSAP(
    () => {
      if (!cursorRef.current || !sectionRef.current || isCoarsePointer.current) return;

      cursorXTo.current = gsap.quickTo(cursorRef.current, "x", {
        duration: 0.3,
        ease: "power3",
      });
      cursorYTo.current = gsap.quickTo(cursorRef.current, "y", {
        duration: 0.3,
        ease: "power3",
      });

      const interactiveSelector = "button, a, .filter-pill, .nav-arrow, .view-details-btn";

      const handleMove = (event: MouseEvent) => {
        cursorXTo.current?.(event.clientX - 32);
        cursorYTo.current?.(event.clientY - 32);
        const hoveredElement = document.elementFromPoint(
          event.clientX,
          event.clientY
        ) as HTMLElement | null;
        const overInteractive = !!hoveredElement?.closest(interactiveSelector);
        const nextVisible = !overInteractive;
        if (nextVisible !== cursorVisibleRef.current) {
          cursorVisibleRef.current = nextVisible;
          setCursorVisible(nextVisible);
        }
      };

      cursorVisibleRef.current = true;
      setCursorVisible(true);

      window.addEventListener("mousemove", handleMove);

      return () => {
        window.removeEventListener("mousemove", handleMove);
      };
    },
    { scope: sectionRef, dependencies: [filterOpen, filteredProjects.length] }
  );

  useGSAP(
    () => {
      if (!filterControlsRef.current || !filterTriggerRef.current || !filterRailRef.current) return;

      const controls = filterControlsRef.current;
      const triggerButton = filterTriggerRef.current;
      const rail = filterRailRef.current;
      const pills = filterPillRefs.current.filter(
        (pill): pill is HTMLButtonElement => Boolean(pill)
      );

      const getTargetWidth = () => {
        const controlsWidth = controls.getBoundingClientRect().width;
        const triggerWidth = triggerButton.getBoundingClientRect().width;
        const gap = 12;
        const availableWidth = Math.max(controlsWidth - triggerWidth - gap, 0);
        const naturalWidth = rail.scrollWidth;

        if (availableWidth === 0) return naturalWidth;
        return Math.min(naturalWidth, availableWidth);
      };

      const setClosedState = () => {
        gsap.set(rail, {
          width: 0,
          autoAlpha: 0,
          overflowX: "hidden",
          pointerEvents: "none",
        });
        gsap.set(pills, { x: -14, autoAlpha: 0 });
      };

      filterTimelineRef.current?.kill();

      if (!filterAnimationReadyRef.current) {
        filterAnimationReadyRef.current = true;
        if (filterOpen) {
          gsap.set(rail, {
            width: getTargetWidth(),
            autoAlpha: 1,
            overflowX: "auto",
            pointerEvents: "auto",
          });
          gsap.set(pills, { x: 0, autoAlpha: 1 });
        } else {
          setClosedState();
        }
      } else if (filterOpen) {
        const targetWidth = getTargetWidth();
        const openTl = gsap.timeline();

        openTl
          .set(rail, { overflowX: "hidden", pointerEvents: "auto" })
          .to(rail, {
            width: targetWidth,
            autoAlpha: 1,
            duration: getDuration(0.32),
            ease: "power3.out",
          })
          .to(
            pills,
            {
              x: 0,
              autoAlpha: 1,
              duration: getDuration(0.24),
              stagger: 0.04,
              ease: "power2.out",
              overwrite: "auto",
            },
            0.08
          )
          .set(rail, { overflowX: "auto" });

        filterTimelineRef.current = openTl;
      } else {
        const closeTl = gsap.timeline({
          onComplete: () => {
            rail.scrollLeft = 0;
            gsap.set(rail, { overflowX: "hidden", pointerEvents: "none" });
          },
        });

        closeTl
          .to(pills, {
            x: -14,
            autoAlpha: 0,
            duration: getDuration(0.2),
            stagger: { each: 0.03, from: "end" },
            ease: "power2.in",
            overwrite: "auto",
          })
          .to(
            rail,
            {
              width: 0,
              autoAlpha: 0,
              duration: getDuration(0.22),
              ease: "power3.in",
            },
            0
          );

        filterTimelineRef.current = closeTl;
      }

      const handleResize = () => {
        if (!filterOpen) return;
        gsap.set(rail, { width: getTargetWidth() });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        filterTimelineRef.current?.kill();
      };
    },
    { scope: sectionRef, dependencies: [filterOpen, getDuration] }
  );

  useGSAP(
    () => {
      if (!containerRef.current || !sectionRef.current || filteredProjects.length === 0) return;

      const firstProject = filteredProjects[0];
      activeIndexRef.current = 0;
      setActiveIndex(0);
      animateTitle(firstProject.name);
      animateCards(0);
      animateOrbs(firstProject);

      const maxIndex = filteredProjects.length - 1;
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

          const nextProject = filteredProjects[progressIndex];
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
      dependencies: [filteredProjects, animateCards, animateOrbs, animateTitle],
    }
  );

  const snapToProject = useCallback(
    (direction: 1 | -1) => {
      if (!containerRef.current || filteredProjects.length <= 1) return;

      const maxIndex = filteredProjects.length - 1;
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
    [filteredProjects.length]
  );

  const currentProject = filteredProjects[activeIndex] ?? filteredProjects[0] ?? projects[0];

  return (
    <div className="portfolio-carousel__wrapper">
      <div
        ref={containerRef}
        className="portfolio-carousel__pin relative w-full"
        style={{
          height: `${Math.max(filteredProjects.length, 1) * 100}vh`,
        }}
      >
        <section
          ref={sectionRef}
          id="portfolio"
          className="portfolio-carousel h-screen w-full overflow-hidden bg-background select-none"
        >
        <div
          ref={cursorRef}
          className="glass-cursor fixed left-0 top-0 z-[100] flex h-16 w-16 items-center justify-center rounded-full transition-opacity duration-200 pointer-events-none"
          style={{ opacity: cursorVisible ? 1 : 0 }}
        >
          <span className="text-[10px] font-bold tracking-widest text-foreground/70 uppercase">
            Scroll
          </span>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div ref={orbPurpleRef} className="orb h-[500px] w-[500px] -top-20 -left-20" />
          <div ref={orbOrangeRef} className="orb h-[400px] w-[400px] top-1/2 left-1/3" />
          <div ref={orbBlueRef} className="orb h-[450px] w-[450px] -bottom-20 -right-20" />
        </div>

        <div className="portfolio-carousel__overlay dot-grid absolute inset-0 pointer-events-none" />

        <div className="relative z-10 px-8 pt-8 md:px-16">
          <h2 className="portfolio-carousel__display text-2xl text-center text-foreground md:text-3xl">
            Our Work
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground md:text-base">
            See how we've helped businesses look professional and attract better clients.
          </p>
        </div>

        <div className="relative z-10 mt-6 px-8 md:px-16">
          <div ref={filterControlsRef} className="portfolio-carousel__filters">
            <button
              ref={filterTriggerRef}
              className="filter-pill flex items-center gap-2"
              aria-controls="portfolio-filter-rail"
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((open) => !open)}
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>

            <div
              id="portfolio-filter-rail"
              ref={filterRailRef}
              className={`portfolio-carousel__filter-rail ${filterOpen ? "is-open" : ""}`}
              aria-hidden={!filterOpen}
            >
              {CATEGORIES.map((category, index) => (
                <button
                  key={category}
                  ref={(node) => {
                    filterPillRefs.current[index] = node;
                  }}
                  tabIndex={filterOpen ? 0 : -1}
                  className={`filter-pill ${activeFilter === category ? "active" : ""}`}
                  onClick={() => {
                    setActiveFilter(category);
                    setFilterOpen(false);
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex h-[calc(100vh-200px)] w-full max-w-[1280px] flex-col items-center gap-8 px-8 md:flex-row md:items-center md:justify-between md:gap-12 md:px-16 lg:gap-16">
          <div className="flex w-full max-w-xl flex-1 flex-col justify-center md:max-w-[34rem] md:flex-[0_1_34rem]">
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              {currentProject.type}
            </p>

            <div
              ref={titleRef}
              className="portfolio-carousel__display text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl mb-6 min-h-[2.5em]"
            />

            <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {currentProject.description}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {currentProject.techStack.map((tech) => (
                <span key={tech} className="tag-pill">
                  {tech}
                </span>
              ))}
            </div>

            <button className="view-details-btn w-fit">
              View Details
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="portfolio-carousel__cards-wrap flex w-full flex-1 items-center justify-center md:justify-end md:translate-x-8 lg:translate-x-12">
            <div
              ref={cardsContainerRef}
              className="relative h-[420px] w-[320px] sm:h-[500px] sm:w-[380px] md:h-[500px] md:w-[360px] lg:h-[560px] lg:w-[420px]"
            >
              {filteredProjects.map((project) => (
                <div
                  key={project.name}
                  className="portfolio-card portfolio-carousel__card absolute inset-0 overflow-hidden rounded-2xl shadow-2xl"
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="portfolio-carousel__image-overlay absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, transparent 40%, ${project.accentColor.replace(
                        ")",
                        " / 0.3)"
                      )})`,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className={`nav-arrow absolute left-4 top-1/2 z-20 -translate-y-1/2 md:left-8 ${
            activeIndex === 0 ? "is-disabled" : ""
          }`}
          onClick={() => snapToProject(-1)}
          aria-label="Previous project"
          disabled={activeIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={`nav-arrow absolute right-4 top-1/2 z-20 -translate-y-1/2 md:right-8 ${
            activeIndex === filteredProjects.length - 1 ? "is-disabled" : ""
          }`}
          onClick={() => snapToProject(1)}
          aria-label="Next project"
          disabled={activeIndex === filteredProjects.length - 1}
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <button className="rounded-full bg-accent px-8 py-3 text-sm font-semibold tracking-wide text-accent-foreground transition-opacity hover:opacity-90 cursor-pointer">
            Ready to Start Your Project?
          </button>
        </div>
        </section>
      </div>
    </div>
  );
};

export default PortfolioCarousel;
