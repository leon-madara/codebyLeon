import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { isVisualTestMode } from "../../utils/runtimeFlags";

gsap.registerPlugin(ScrollTrigger);

const PIN_SCROLL_DISTANCE = 120;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px) and (pointer: fine)";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const splitWords = (text: string) =>
  text.split(/\s+/).map((word, index) => (
    <span key={`${word}-${index}`} className="build-brands__word-wrapper">
      <span className="build-brands__word">{word}</span>
    </span>
  ));

export function BuildBrands() {
  const visualTestMode = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const primaryLineRef = useRef<HTMLSpanElement>(null);
  const accentLineRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const sectionActiveRef = useRef(false);
  const [desktopCapable, setDesktopCapable] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const desktopFxEnabled = desktopCapable && pageReady && !visualTestMode;

  useEffect(() => {
    if (visualTestMode) return;

    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const motionQuery = window.matchMedia(MOTION_QUERY);

    const syncCapability = () => {
      setDesktopCapable(desktopQuery.matches && !motionQuery.matches);
    };

    syncCapability();
    desktopQuery.addEventListener("change", syncCapability);
    motionQuery.addEventListener("change", syncCapability);

    return () => {
      desktopQuery.removeEventListener("change", syncCapability);
      motionQuery.removeEventListener("change", syncCapability);
    };
  }, [visualTestMode]);

  useEffect(() => {
    if (visualTestMode) return;

    let isCancelled = false;
    let loadHandler: (() => void) | null = null;

    const waitForLoad =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            loadHandler = () => {
              window.removeEventListener("load", loadHandler as () => void);
              resolve();
            };
            window.addEventListener("load", loadHandler, { once: true });
          });

    const waitForFonts =
      "fonts" in document
        ? (document as Document & { fonts: FontFaceSet }).fonts.ready.catch(() => undefined)
        : Promise.resolve();

    Promise.all([waitForLoad, waitForFonts]).then(() => {
      if (isCancelled) return;
      setPageReady(true);
    });

    return () => {
      isCancelled = true;
      if (loadHandler) window.removeEventListener("load", loadHandler);
    };
  }, [visualTestMode]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const accent = accentRef.current;
      const primaryLine = primaryLineRef.current;
      const accentLine = accentLineRef.current;
      const subtitle = subtitleRef.current;
      if (!section || !accent || !primaryLine || !accentLine || !subtitle) return;

      const primaryWords = primaryLine.querySelectorAll<HTMLElement>(".build-brands__word");
      const accentWords = accentLine.querySelectorAll<HTMLElement>(".build-brands__word");
      const subtitleWords = subtitle.querySelectorAll<HTMLElement>(".build-brands__word");

      sectionActiveRef.current = false;

      if (desktopFxEnabled) {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${PIN_SCROLL_DISTANCE}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          onEnter: () => {
            sectionActiveRef.current = true;
          },
          onEnterBack: () => {
            sectionActiveRef.current = true;
          },
          onLeave: () => {
            sectionActiveRef.current = false;
          },
          onLeaveBack: () => {
            sectionActiveRef.current = false;
          },
        });

        gsap.set(accent, {
          scaleX: 0.82,
          opacity: 0.25,
          transformOrigin: "50% 50%",
        });
        gsap.set(subtitleWords, {
          yPercent: 32,
          opacity: 0,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            defaults: { ease: "power2.out" },
          })
          .to(
            accent,
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.4,
            },
            0
          )
          .to(
            subtitleWords,
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.32,
              stagger: 0.02,
            },
            0.14
          );

        return;
      }

      gsap.set(accent, {
        scaleX: 0.7,
        opacity: 0.2,
        transformOrigin: "50% 50%",
      });
      gsap.set([...primaryWords, ...accentWords], {
        yPercent: 110,
        opacity: 0,
      });
      gsap.set(subtitleWords, {
        yPercent: 40,
        opacity: 0,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power2.out" },
        })
        .to(
          accent,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.42,
          },
          0
        )
        .to(
          primaryWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.08,
          },
          0.1
        )
        .to(
          accentWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.46,
            stagger: 0.12,
          },
          0.32
        )
        .to(
          subtitleWords,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.02,
          },
          0.5
        );
    },
    { scope: sectionRef, dependencies: [desktopFxEnabled] }
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section || !desktopFxEnabled) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    type TextParticle = {
      homeX: number;
      homeY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    };

    type AmbientParticle = {
      x: number;
      y: number;
      depth: number;
      vx: number;
      vy: number;
      size: number;
    };

    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let introStarted = false;
    let introStartTime = 0;
    let mouseX = 0;
    let mouseY = 0;
    let width = 0;
    let height = 0;

    let textParticles: TextParticle[] = [];
    let ambientParticles: AmbientParticle[] = [];

    const getResponsiveTextSize = (base: number, min: number, max: number) =>
      Math.max(min, Math.min(max, width * base));

    const createScene = () => {
      width = Math.max(1, Math.floor(section.clientWidth));
      height = Math.max(1, Math.floor(section.clientHeight));
      canvas.width = width;
      canvas.height = height;

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      const lineOneSize = getResponsiveTextSize(0.125, 62, 170);
      const lineTwoSize = getResponsiveTextSize(0.145, 76, 198);
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const lineOneY = centerY - lineOneSize * 0.42;
      const lineTwoY = centerY + lineTwoSize * 0.34;

      offCtx.clearRect(0, 0, width, height);
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.font = `700 ${lineOneSize}px VTKSNoise, Georgia, serif`;
      offCtx.fillStyle = "rgb(226, 234, 246)";
      offCtx.fillText("We Build", centerX, lineOneY);
      offCtx.font = `700 ${lineTwoSize}px VTKSNoise, Georgia, serif`;
      offCtx.fillStyle = "rgb(217, 117, 26)";
      offCtx.fillText("Brands", centerX, lineTwoY);

      const image = offCtx.getImageData(0, 0, width, height).data;
      const sampleStep = width >= 1600 ? 6 : 7;
      const maxTextParticles = 3800;
      const nextTextParticles: TextParticle[] = [];

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const index = (y * width + x) * 4;
          const alpha = image[index + 3];
          if (alpha < 120) continue;

          const red = image[index];
          const green = image[index + 1];
          const blue = image[index + 2];
          nextTextParticles.push({
            homeX: x,
            homeY: y,
            x: x + (Math.random() - 0.5) * 480,
            y: y + (Math.random() - 0.5) * 480,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.8 + 0.6,
            alpha: 0,
            color: `rgb(${red}, ${green}, ${blue})`,
          });

          if (nextTextParticles.length >= maxTextParticles) break;
        }
        if (nextTextParticles.length >= maxTextParticles) break;
      }

      const ambientCount = 68;
      const nextAmbientParticles: AmbientParticle[] = Array.from({ length: ambientCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        depth: Math.random() * 0.55 + 0.45,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.7 + 0.4,
      }));

      textParticles = nextTextParticles;
      ambientParticles = nextAmbientParticles;

      mouseX = width * 0.5;
      mouseY = height * 0.5;
      introStarted = false;
      introStartTime = 0;
    };

    const updateAmbientParticle = (particle: AmbientParticle) => {
      const parallaxX = (mouseX - width * 0.5) * 0.0012 * particle.depth;
      const parallaxY = (mouseY - height * 0.5) * 0.0012 * particle.depth;

      particle.x += particle.vx + parallaxX;
      particle.y += particle.vy + parallaxY;

      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;
      if (particle.y < -8) particle.y = height + 8;
      if (particle.y > height + 8) particle.y = -8;
    };

    const updateTextParticle = (particle: TextParticle, introComplete: boolean) => {
      if (!introComplete) {
        particle.alpha = Math.min(1, particle.alpha + 0.028);
        particle.vx += (particle.homeX - particle.x) * 0.05;
        particle.vy += (particle.homeY - particle.y) * 0.05;
      } else {
        const dx = mouseX - particle.homeX;
        const dy = mouseY - particle.homeY;
        const distance = Math.hypot(dx, dy);
        const influenceRadius = 96;

        if (distance < influenceRadius) {
          const force = (influenceRadius - distance) / influenceRadius;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 2.4;
          particle.vy -= Math.sin(angle) * force * 2.4;
        }

        particle.vx += (particle.homeX - particle.x) * 0.042;
        particle.vy += (particle.homeY - particle.y) * 0.042;
      }

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.88;
      particle.vy *= 0.88;
    };

    const drawFrame = (time: number) => {
      rafId = window.requestAnimationFrame(drawFrame);
      if (!sectionActiveRef.current) return;

      if (!introStarted) {
        introStarted = true;
        introStartTime = time;
      }

      const introComplete = time - introStartTime >= 1900;

      context.clearRect(0, 0, width, height);

      for (const particle of ambientParticles) {
        updateAmbientParticle(particle);
        context.beginPath();
        context.fillStyle = `rgba(156, 173, 204, ${0.08 + particle.depth * 0.14})`;
        context.arc(particle.x, particle.y, particle.size * particle.depth, 0, Math.PI * 2);
        context.fill();
      }

      for (const particle of textParticles) {
        updateTextParticle(particle, introComplete);
        context.beginPath();
        context.fillStyle = particle.color;
        context.globalAlpha = particle.alpha;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };

    const resetMouse = () => {
      mouseX = width * 0.5;
      mouseY = height * 0.5;
    };

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        createScene();
        ScrollTrigger.refresh();
      }, 180);
    };

    createScene();
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", resetMouse);
    window.addEventListener("resize", handleResize);
    rafId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", resetMouse);
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      sectionActiveRef.current = false;
    };
  }, [desktopFxEnabled]);

  return (
    <section
      ref={sectionRef}
      id="build-brands"
      className={`build-brands ${desktopFxEnabled ? "build-brands--desktop-fx" : ""}`.trim()}
      aria-labelledby="build-brands-title"
    >
      <div className="build-brands__pattern" aria-hidden="true" />
      <canvas ref={canvasRef} className="build-brands__canvas" aria-hidden="true" />

      <div className="build-brands__content">
        <span ref={accentRef} className="build-brands__accent" aria-hidden="true" />

        <h2 id="build-brands-title" className="build-brands__title">
          <span ref={primaryLineRef} className="build-brands__line build-brands__line--primary">
            {splitWords("We Build")}
          </span>
          <span ref={accentLineRef} className="build-brands__line build-brands__line--accent">
            {splitWords("Brands")}
          </span>
        </h2>

        <p ref={subtitleRef} className="build-brands__subtitle">
          {splitWords("Crafting digital experiences that convert visitors into loyal customers.")}
        </p>
      </div>
    </section>
  );
}
