import { useState, useRef, useEffect, useMemo, useCallback, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { isVisualTestMode } from '../../utils/runtimeFlags';
import { ProjectModal, type ProjectData } from '../ui/ProjectModal';

type FilterType = 'all' | 'small-business' | 'creative' | 'saas';
type Direction = 'next' | 'prev';

const INPUT_COOLDOWN_MS = 650;
const WHEEL_THRESHOLD = 36;
const SWIPE_THRESHOLD = 48;
const DEFAULT_ACCENT = 'rgba(217, 117, 26, 0.22)';

const PORTFOLIO_ITEMS: ProjectData[] = [
  {
    id: 1,
    category: 'small-business',
    name: 'Legit Logistics',
    type: 'B2B Logistics Platform',
    image: '/portfolio-legit.png',
    accentColor: 'rgba(217, 117, 26, 0.26)',
    description: 'A high-performance delivery service platform designed for immediate B2B conversion.',
    longDescription: `Legit Logistics needed a professional presence to target Rhode Island businesses for same-day delivery. The challenge was to build trust instantly and provide a seamless "Get a Quote" flow.

      We engineered a Next.js application with a video-first hero section that immediately demonstrates capability. By integrating real-time contact options (WhatsApp) and a streamlined quote form, we reduced the friction for business owners to almost zero.`,
    techStack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Hook Form'],
    link: 'https://legitlogistics.vercel.app',
    repo: 'https://github.com/codebyleon/legitlogistics',
  },
  {
    id: 2,
    category: 'saas',
    name: 'School Management',
    type: 'Educational Platform',
    image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop',
    accentColor: 'rgba(88, 163, 207, 0.25)',
    description: 'A comprehensive dashboard for managing student data, attendance, and grading.',
    longDescription: `Schools often struggle with fragmented data across paper logs and excel sheets. This project unifies administration into a single, secure platform.

      The system features role-based access control (Admin, Teacher, Student), real-time attendance tracking, and automated grade calculation. It demonstrates complex state management and secure backend integration.`,
    techStack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'MUI'],
  },
  {
    id: 3,
    category: 'creative',
    name: 'CodeByLeon V1',
    type: 'Personal Portfolio',
    image: '/portfolio-me.jpg',
    accentColor: 'rgba(165, 118, 241, 0.24)',
    description: 'The standard for modern web development. Performance, accessibility, and aesthetics combined.',
    longDescription: `This portfolio itself is a testament to the "CodeByLeon Standard". It's not just about looking good; it's about performance and user experience.

      Built with a focus on immersive interactions (GSAP animations) without sacrificing load times. It serves as a living laboratory for testing new UI patterns and demonstrating the level of polish we bring to every client project.`,
    techStack: ['React', 'GSAP', 'CSS Modules', 'Vite', 'Responsive Design'],
    repo: 'https://github.com/codebyleon/my-website',
  },
];

const MOD = (n: number, total: number) => ((n % total) + total) % total;

export function Portfolio() {
  const visualTestMode = isVisualTestMode();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionIndex, setTransitionIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const currentContentRef = useRef<HTMLDivElement>(null);
  const incomingContentRef = useRef<HTMLDivElement>(null);
  const currentMediaRef = useRef<HTMLDivElement>(null);
  const incomingMediaRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<FilterType, HTMLButtonElement>>(new Map());
  const transitionDirectionRef = useRef<1 | -1>(1);
  const touchStartYRef = useRef(0);
  const inputCooldownUntilRef = useRef(0);
  const transitionTlRef = useRef<gsap.core.Timeline | null>(null);

  const scrollAnimationConfig = useMemo(
    () => ({
      start: 'top top',
      animateHeadline: true,
      animateSubheadline: true,
      animateFilters: true,
      animateItems: false,
      headlineSelector: '.portfolio__title',
      subheadlineSelector: '.portfolio__subtitle',
      filtersSelector: '.portfolio__filters',
    }),
    []
  );

  useScrollAnimation(sectionRef, scrollAnimationConfig);

  const filteredItems = useMemo(
    () =>
      activeFilter === 'all'
        ? PORTFOLIO_ITEMS
        : PORTFOLIO_ITEMS.filter((item) => {
      if (activeFilter === 'small-business' && item.category === 'small-business') return true;
      if (activeFilter === 'creative' && item.category === 'creative') return true;
      if (activeFilter === 'saas' && item.category === 'saas') return true;
      return false;
          }),
    [activeFilter]
  );

  const items = filteredItems.length > 0 ? filteredItems : PORTFOLIO_ITEMS;
  const clampedActiveIndex = Math.min(activeIndex, Math.max(0, items.length - 1));
  const activeItem = items[clampedActiveIndex];
  const incomingItem = transitionIndex !== null ? items[transitionIndex] : null;
  const activeAccent = activeItem?.accentColor ?? DEFAULT_ACCENT;

  const updateSliderPosition = (filter: FilterType) => {
    const button = buttonRefs.current.get(filter);
    const slider = sliderRef.current;
    const filtersContainer = filtersRef.current;

    if (!button || !slider || !filtersContainer) return;

    const filtersRect = filtersContainer.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    const left = buttonRect.left - filtersRect.left;
    const width = buttonRect.width;

    slider.style.width = `${width}px`;
    slider.style.left = `${left}px`;
  };

  useEffect(() => {
    const id = window.setTimeout(() => updateSliderPosition(activeFilter), 100);
    return () => window.clearTimeout(id);
  }, [activeFilter]);

  useEffect(() => {
    const handleResize = () => updateSliderPosition(activeFilter);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeFilter]);

  useEffect(() => {
    setActiveIndex(0);
    setTransitionIndex(null);
    setIsAnimating(false);
    transitionTlRef.current?.kill();
  }, [activeFilter]);

  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, items.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    setReducedMotion(media.matches);

    if (media.addEventListener) {
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    }

    media.addListener(onChange);
    return () => media.removeListener(onChange);
  }, []);

  useEffect(() => {
    return () => {
      transitionTlRef.current?.kill();
    };
  }, []);

  const isSectionInteractive = useCallback(() => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    return rect.top <= viewportHeight * 0.92 && rect.bottom >= viewportHeight * 0.08;
  }, []);

  const go = useCallback(
    (direction: Direction) => {
      if (isAnimating || items.length <= 1 || !activeItem) return;

      const delta = direction === 'next' ? 1 : -1;
      const nextIndex = MOD(clampedActiveIndex + delta, items.length);

      if (visualTestMode || reducedMotion) {
        setActiveIndex(nextIndex);
        setTransitionIndex(null);
        setIsAnimating(false);
        return;
      }

      transitionDirectionRef.current = delta;
      setTransitionIndex(nextIndex);
      setIsAnimating(true);
    },
    [activeItem, clampedActiveIndex, isAnimating, items.length, reducedMotion, visualTestMode]
  );

  useEffect(() => {
    if (transitionIndex === null) return;

    const currentContent = currentContentRef.current;
    const incomingContent = incomingContentRef.current;
    const currentMedia = currentMediaRef.current;
    const incomingMedia = incomingMediaRef.current;
    const showcase = showcaseRef.current;
    const nextItem = items[transitionIndex];

    if (!currentContent || !incomingContent || !currentMedia || !incomingMedia || !showcase || !nextItem) {
      setActiveIndex(transitionIndex);
      setTransitionIndex(null);
      setIsAnimating(false);
      return;
    }

    const dir = transitionDirectionRef.current;
    const durationOut = 0.42;
    const durationIn = 0.56;

    transitionTlRef.current?.kill();
    gsap.set(incomingContent, { autoAlpha: 0, y: 28 * dir, x: 12 * dir });
    gsap.set(incomingMedia, { autoAlpha: 0, x: 32 * dir, scale: 1.03, rotate: 1.2 * dir });

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIndex(transitionIndex);
        setTransitionIndex(null);
        setIsAnimating(false);
        gsap.set([currentContent, incomingContent, currentMedia, incomingMedia], { clearProps: 'all' });
      },
    });

    transitionTlRef.current = tl;

    tl.to(
      currentContent,
      {
        autoAlpha: 0,
        y: -22 * dir,
        x: -10 * dir,
        duration: durationOut,
        ease: 'power2.inOut',
      },
      0
    )
      .to(
        currentMedia,
        {
          autoAlpha: 0,
          x: -30 * dir,
          scale: 0.985,
          rotate: -1 * dir,
          duration: durationOut + 0.04,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        showcase,
        {
          '--portfolio-showcase-accent': nextItem.accentColor ?? DEFAULT_ACCENT,
          duration: 0.62,
          ease: 'power2.inOut',
        } as Record<string, unknown>,
        0
      )
      .to(
        incomingContent,
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          duration: durationIn,
          ease: 'power3.out',
        },
        0.1
      )
      .to(
        incomingMedia,
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          rotate: 0,
          duration: durationIn,
          ease: 'power3.out',
        },
        0.08
      );
  }, [items, transitionIndex]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (isModalOpen || !isSectionInteractive()) return;
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD) return;

      const now = Date.now();
      if (now < inputCooldownUntilRef.current || isAnimating) return;

      inputCooldownUntilRef.current = now + INPUT_COOLDOWN_MS;
      go(event.deltaY > 0 ? 'next' : 'prev');
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [go, isAnimating, isModalOpen, isSectionInteractive]);

  useEffect(() => {
    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (isModalOpen || !isSectionInteractive()) return;

      const endY = event.changedTouches[0]?.clientY ?? touchStartYRef.current;
      const deltaY = touchStartYRef.current - endY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;

      const now = Date.now();
      if (now < inputCooldownUntilRef.current || isAnimating) return;

      inputCooldownUntilRef.current = now + INPUT_COOLDOWN_MS;
      go(deltaY > 0 ? 'next' : 'prev');
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [go, isAnimating, isModalOpen, isSectionInteractive]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen || isAnimating || !isSectionInteractive()) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') go('next');
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') go('prev');
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [go, isAnimating, isModalOpen, isSectionInteractive]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const openModal = (project: ProjectData) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section id="portfolio" className="portfolio" ref={sectionRef}>
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* LAYER 2: Abstract Orbs */}
      <div className="portfolio__orbs">
        <div className="portfolio__orb portfolio__orb--purple"></div>
        <div className="portfolio__orb portfolio__orb--orange"></div>
        <div className="portfolio__orb portfolio__orb--blue"></div>
      </div>

      {/* LAYER 3: Frosted Overlay */}
      <div className="portfolio__overlay"></div>

      {/* LAYER 4: Content */}
      <div className="portfolio__container">
        <h2 className="portfolio__title">Our Work</h2>
        <p className="portfolio__subtitle">
          See how we've helped Kenyan businesses look professional and attract better clients.
        </p>

        <div className="portfolio__filters-wrap">
          <div className="portfolio__filters" ref={filtersRef}>
            <div className="portfolio__filter-slider" ref={sliderRef}></div>
            <button
              ref={(el) => el && buttonRefs.current.set('all', el)}
              className={`portfolio__filter-btn ${activeFilter === 'all' ? 'is-active' : ''}`}
              onClick={() => handleFilterClick('all')}
            >
              All Projects
            </button>
            <button
              ref={(el) => el && buttonRefs.current.set('small-business', el)}
              className={`portfolio__filter-btn ${activeFilter === 'small-business' ? 'is-active' : ''}`}
              onClick={() => handleFilterClick('small-business')}
            >
              Small Business
            </button>
            <button
              ref={(el) => el && buttonRefs.current.set('saas', el)}
              className={`portfolio__filter-btn ${activeFilter === 'saas' ? 'is-active' : ''}`}
              onClick={() => handleFilterClick('saas')}
            >
              SaaS & Apps
            </button>
            <button
              ref={(el) => el && buttonRefs.current.set('creative', el)}
              className={`portfolio__filter-btn ${activeFilter === 'creative' ? 'is-active' : ''}`}
              onClick={() => handleFilterClick('creative')}
            >
              Creative
            </button>
          </div>
        </div>

        {activeItem && (
          <article
            className="portfolio__showcase"
            ref={showcaseRef}
            style={{ '--portfolio-showcase-accent': activeAccent } as CSSProperties}
            tabIndex={0}
            aria-label={`${activeItem.name} project showcase`}
          >
            <div className="portfolio__showcase-inner">
              <div className="portfolio__showcase-content-track" aria-live="polite">
                <div className="portfolio__showcase-content-pane" ref={currentContentRef}>
                  <p className="portfolio__showcase-kicker">{activeItem.type}</p>
                  <h3 className="portfolio__showcase-title" data-testid="portfolio-active-title">
                    {activeItem.name}
                  </h3>
                  <p className="portfolio__showcase-description">{activeItem.description}</p>
                  <div className="portfolio__showcase-tech">
                    {activeItem.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="portfolio__showcase-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="portfolio__showcase-action"
                    onClick={() => openModal(activeItem)}
                  >
                    View Details
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {incomingItem && (
                  <div className="portfolio__showcase-content-pane portfolio__showcase-content-pane--incoming" ref={incomingContentRef}>
                    <p className="portfolio__showcase-kicker">{incomingItem.type}</p>
                    <h3 className="portfolio__showcase-title">{incomingItem.name}</h3>
                    <p className="portfolio__showcase-description">{incomingItem.description}</p>
                    <div className="portfolio__showcase-tech">
                      {incomingItem.techStack.slice(0, 4).map((tech) => (
                        <span key={tech} className="portfolio__showcase-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="portfolio__showcase-action"
                      onClick={() => openModal(incomingItem)}
                    >
                      View Details
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="portfolio__showcase-media-track">
                <div className="portfolio__showcase-media-pane" ref={currentMediaRef}>
                  <div className="portfolio__showcase-depth-layer portfolio__showcase-depth-layer--rear"></div>
                  <div className="portfolio__showcase-depth-layer portfolio__showcase-depth-layer--front"></div>
                  <div className="portfolio__showcase-image">
                    <img src={activeItem.image} alt={activeItem.name} />
                  </div>
                </div>

                {incomingItem && (
                  <div className="portfolio__showcase-media-pane portfolio__showcase-media-pane--incoming" ref={incomingMediaRef}>
                    <div className="portfolio__showcase-depth-layer portfolio__showcase-depth-layer--rear"></div>
                    <div className="portfolio__showcase-depth-layer portfolio__showcase-depth-layer--front"></div>
                    <div className="portfolio__showcase-image">
                      <img src={incomingItem.image} alt={incomingItem.name} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="portfolio__showcase-nav">
              <button
                type="button"
                className="portfolio__showcase-nav-btn"
                onClick={() => go('prev')}
                disabled={isAnimating || items.length <= 1}
                aria-label="Show previous project"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <p className="portfolio__showcase-counter" data-testid="portfolio-active-counter">
                {clampedActiveIndex + 1} / {items.length}
              </p>
              <button
                type="button"
                className="portfolio__showcase-nav-btn"
                onClick={() => go('next')}
                disabled={isAnimating || items.length <= 1}
                aria-label="Show next project"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        )}

        <div className="portfolio__cta">
          <a href="/get-started.html" className="btn-primary">Ready to Start Your Project?</a>
        </div>
      </div>
    </section>
  );
}
