import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, type Project } from "@/data/projects";
import { getPortfolioProjectCta } from "./PortfolioCarousel";
import "@/styles/sections/portfolio-mobile.css";

gsap.registerPlugin(ScrollTrigger);

const projectProof: Record<Project["name"], string> = {
  "Legit Logistics":
    "A logistics business needed more than a brochure. This proof cut shows how dispatch, driver updates, proof collection, and customer tracking became one usable operating system.",
  "Kossy Langat":
    "A professional brand needed to feel trustworthy before the first conversation. This proof cut shows how identity, authority, mentorship, and project credibility were shaped into a site people can believe in.",
  "Delivah Dispatch":
    "A freight service needed a clearer path from interest to intake. This proof cut shows how services, registration, document collection, and admin review became one conversion funnel.",
};

const formatProgress = (index: number) =>
  `${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;

const PortfolioCarouselMobile = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!introRef.current || !galleryRef.current || !trackRef.current) return;

      const getHorizontalDistance = () =>
        Math.max(trackRef.current!.scrollWidth - galleryRef.current!.clientWidth, 0);

      const introTrigger = ScrollTrigger.create({
        trigger: introRef.current,
        start: "top top",
        end: "+=55%",
        pin: introRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      const galleryTween = gsap.to(trackRef.current, {
        x: () => -getHorizontalDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "top top",
          end: () => `+=${Math.max(getHorizontalDistance(), window.innerHeight * 1.35)}`,
          pin: galleryRef.current,
          scrub: 0.7,
          snap: {
            snapTo: projects.length > 1 ? 1 / (projects.length - 1) : 1,
            duration: { min: 0.18, max: 0.45 },
            delay: 0.06,
            ease: "power1.inOut",
          },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      const refresh = () => ScrollTrigger.refresh();
      const images = Array.from(trackRef.current.querySelectorAll("img"));
      images.forEach((image) => {
        if (!image.complete) image.addEventListener("load", refresh, { once: true });
      });

      return () => {
        images.forEach((image) => image.removeEventListener("load", refresh));
        introTrigger.kill();
        galleryTween.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="portfolio-mobile"
      aria-labelledby="portfolio-mobile-title"
    >
      <div ref={introRef} className="portfolio-mobile__intro-chapter">
        <div className="portfolio-mobile__atmosphere" aria-hidden="true" />

        <div className="portfolio-mobile__intro-inner">
          <p className="portfolio-mobile__eyebrow">Selected proof</p>
          <h2 id="portfolio-mobile-title" className="portfolio-mobile__heading">
            Our Work
          </h2>
          <p className="portfolio-mobile__intro-lede">
            Three projects, three business problems, and three ways strategy, design, and engineering
            turned into digital systems people can trust, understand, and use.
          </p>
          <p className="portfolio-mobile__intro-copy">
            Swipe through the proof cuts next. Each one is a short preview of the problem, the shape
            of the solution, and the article-style case study waiting behind the arrow.
          </p>

          <div className="portfolio-mobile__intro-projects" aria-label="Projects included in Our Work">
            {projects.map((project, index) => (
              <div key={project.name} className="portfolio-mobile__intro-project">
                <span className="portfolio-mobile__intro-project-count">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="portfolio-mobile__intro-project-name">{project.name}</span>
                <span className="portfolio-mobile__intro-project-type">{project.type}</span>
              </div>
            ))}
          </div>

          <div className="portfolio-mobile__scroll-cue" aria-hidden="true">
            <span>Drop into the work</span>
            <ArrowDown size={16} />
          </div>
        </div>
      </div>

      <div
        ref={galleryRef}
        className="portfolio-mobile__proof-gallery"
        aria-label="Swipe through project proof cuts"
      >
        <div ref={trackRef} className="portfolio-mobile__proof-track" tabIndex={0}>
          {projects.map((project, projectIndex) => {
            const cta = getPortfolioProjectCta(project);
            const imageSrc = project.mobileImage || project.image;
            const actionLabel = cta.isRoute
              ? `View ${project.name} case study`
              : `View ${project.name} project`;

            return (
              <article key={project.name} className="portfolio-mobile__proof-panel">
                <div className="portfolio-mobile__proof-image">
                  <img
                    src={imageSrc}
                    alt={project.name}
                    loading={projectIndex === 0 ? "eager" : "lazy"}
                  />
                </div>

                <div className="portfolio-mobile__proof-content">
                  <div className="portfolio-mobile__proof-meta">
                    <span>{formatProgress(projectIndex)}</span>
                    <span>{project.type}</span>
                  </div>

                  <h3 className="portfolio-mobile__proof-title">{project.name}</h3>
                  <p className="portfolio-mobile__proof-description">
                    {projectProof[project.name]}
                  </p>

                  <Link
                    className="portfolio-mobile__proof-action"
                    to={cta.href}
                    aria-label={actionLabel}
                  >
                    <span>{cta.label}</span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PortfolioCarouselMobile;
