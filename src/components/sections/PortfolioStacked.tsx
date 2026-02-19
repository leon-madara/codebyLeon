import { useState, useRef, useEffect, useMemo, useCallback, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { isVisualTestMode } from '../../utils/runtimeFlags';
import { ProjectModal, type ProjectData } from '../ui/ProjectModal';

type FilterType = 'small-business' | 'creative' | 'saas';
type FilterOption = FilterType | 'all';
type Direction = 'next' | 'prev';

const DEFAULT_ACCENT = 'rgba(217, 117, 26, 0.22)';

// Portfolio items with blob color palettes
const PORTFOLIO_ITEMS: ProjectData[] = [
    {
        id: 1,
        category: 'small-business',
        name: 'Legit Logistics',
        type: 'B2B Logistics Platform',
        image: '/portfolio-legit.png',
        accentColor: 'rgba(217, 117, 26, 0.26)',
        blobColors: {
            purple: 'rgba(217, 117, 26, 0.7)',
            orange: 'rgba(242, 147, 57, 0.7)',
            blue: 'rgba(255, 193, 7, 0.6)'
        },
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
        blobColors: {
            purple: 'rgba(88, 163, 207, 0.7)',
            orange: 'rgba(110, 142, 251, 0.6)',
            blue: 'rgba(72, 219, 251, 0.7)'
        },
        description: 'A comprehensive dashboard for managing student data, attendance, and grading.',
        longDescription: `Schools often struggle with fragmented data across paper logs and excel sheets. This project unifies administration into a single, secure platform.

      The system features role-based access control (Admin, Teacher, Student), real-time attendance tracking, and automated grade calculation. It demonstrates complex state management and secure backend integration.`,
        techStack: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'MUI'],
    },
    {
        id: 3,
        category: 'creative',
        name: 'CodeByLeon',
        type: 'Personal Portfolio',
        image: '/portfolio-me.jpg',
        accentColor: 'rgba(165, 118, 241, 0.24)',
        blobColors: {
            purple: 'rgba(165, 118, 241, 0.7)',
            orange: 'rgba(236, 72, 153, 0.6)',
            blue: 'rgba(139, 92, 246, 0.7)'
        },
        description: 'The standard for modern web development. Performance, accessibility, and aesthetics combined.',
        longDescription: `This portfolio itself is a testament to the "CodeByLeon Standard". It's not just about looking good; it's about performance and user experience.

      Built with a focus on immersive interactions (GSAP animations) without sacrificing load times. It serves as a living laboratory for testing new UI patterns and demonstrating the level of polish we bring to every client project.`,
        techStack: ['React', 'GSAP', 'CSS Modules', 'Vite', 'Responsive Design'],
        repo: 'https://github.com/codebyleon/my-website',
    },
];

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Helper functions from reference code
const MOD = (n: number, total: number) => ((n % total) + total) % total;

const throttle = (callback: Function, limit: number) => {
    let waiting = false;
    return function (this: any, ...args: any[]) {
        if (!waiting) {
            callback.apply(this, args);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
};

// Calculate card position properties based on step offset from active card
interface CardPosition {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    blur: number;
    opacity: number;
    zIndex: number;
}

const getCardPosition = (step: number, containerHeight: number): CardPosition => {
    const absStep = Math.abs(step);

    // Position configurations matching reference implementation
    const positions = [
        { x: -0.35, y: -0.95, rot: -30, s: 1.35, b: 16, o: 0 },    // far back (-2)
        { x: -0.18, y: -0.5, rot: -15, s: 1.15, b: 8, o: 0.55 },   // near back (-1)
        { x: 0, y: 0, rot: 0, s: 1, b: 0, o: 1 },                  // active (0)
        { x: -0.06, y: 0.5, rot: 15, s: 0.75, b: 6, o: 0.55 },     // near front (+1)
        { x: -0.12, y: 0.95, rot: 30, s: 0.55, b: 14, o: 0 }       // far front (+2)
    ];

    const idx = Math.max(0, Math.min(4, step + 2));
    const p = positions[idx];

    return {
        x: p.x * containerHeight,
        y: p.y * containerHeight,
        rotation: p.rot,
        scale: p.s,
        blur: p.b,
        opacity: p.o,
        zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1
    };
};

export function PortfolioStacked() {
    const visualTestMode = isVisualTestMode();
    const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const sectionRef = useRef<HTMLElement>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const currentTitleLineRef = useRef<HTMLDivElement | null>(null);
    const imagesRef = useRef<HTMLDivElement>(null);
    const slideEls = useRef<{ el: HTMLDivElement; step: number }[]>([]);
    const orbsRef = useRef<{ purple: HTMLDivElement | null; orange: HTMLDivElement | null; blue: HTMLDivElement | null }>({
        purple: null,
        orange: null,
        blue: null
    });

    // Glass ball cursor refs
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorPos = useRef({ x: 0, y: 0 });
    const cursorTarget = useRef({ x: 0, y: 0 });
    const cursorVisible = useRef(false);
    const cursorRotation = useRef(0);
    const cursorRafId = useRef<number>(0);
    const suppressCursorRef = useRef(false);
    const cursorScale = useRef(1);
    const targetIndexRef = useRef<number>(0);

    const suppressCustomCursor = useCallback((suppressed: boolean) => {
        suppressCursorRef.current = suppressed;
        const cursor = cursorRef.current;
        if (!cursor) return;
        if (suppressed) {
            cursorVisible.current = false;
            cursor.classList.remove('is-visible');
        }
    }, []);

    const filteredItems = useMemo(
        () =>
            activeFilters.length === 0
                ? PORTFOLIO_ITEMS
                : PORTFOLIO_ITEMS.filter((item) => activeFilters.includes(item.category as FilterType)),
        [activeFilters]
    );

    const items = filteredItems.length > 0 ? filteredItems : PORTFOLIO_ITEMS;
    const total = items.length;
    const activeItem = items[current];

    // Build a line div: words are inline-block (no mid-word break),
    // characters inside each word are individually wrapped for GSAP animation.
    const buildLine = (text: string): { line: HTMLDivElement; chars: HTMLSpanElement[] } => {
        const line = document.createElement('div');
        line.style.cssText = 'position:relative;width:100%';
        const chars: HTMLSpanElement[] = [];

        text.split(' ').forEach((word, wi) => {
            // Word wrapper — inline-block keeps the whole word together
            const wordEl = document.createElement('span');
            wordEl.style.cssText = 'display:inline-block;white-space:nowrap;vertical-align:top';

            // Add a space before every word except the first
            if (wi > 0) {
                const space = document.createElement('span');
                space.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top';
                const spaceInner = document.createElement('span');
                spaceInner.style.display = 'inline-block';
                spaceInner.textContent = '\u00A0';
                space.appendChild(spaceInner);
                chars.push(spaceInner);
                line.appendChild(space);
            }

            // Character spans inside the word
            [...word].forEach((ch) => {
                const wrapper = document.createElement('span');
                wrapper.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top';
                const inner = document.createElement('span');
                inner.style.display = 'inline-block';
                inner.textContent = ch;
                wrapper.appendChild(inner);
                wordEl.appendChild(wrapper);
                chars.push(inner);
            });

            line.appendChild(wordEl);
        });

        return { line, chars };
    };

    // Set initial title text
    const setTitle = useCallback((text: string) => {
        if (!titleRef.current) return null;
        titleRef.current.innerHTML = '';
        const { line } = buildLine(text);
        titleRef.current.appendChild(line);
        currentTitleLineRef.current = line;
        return line;
    }, []);

    // Animate title with character-by-character transition
    const animateTitle = useCallback((newText: string, direction: Direction) => {
        if (!titleRef.current || !currentTitleLineRef.current) return gsap.timeline();

        const oldH = titleRef.current.offsetHeight;
        const dir = direction === 'next' ? 1 : -1;
        const oldLine = currentTitleLineRef.current;
        const oldChars = [...oldLine.querySelectorAll('span > span')];

        // Build the new line and measure its natural height before showing it
        const { line: newLine, chars: newChars } = buildLine(newText);
        newLine.style.cssText = 'position:absolute;top:0;left:0;width:100%;visibility:hidden';
        titleRef.current.appendChild(newLine);
        const newH = newLine.offsetHeight;
        newLine.style.visibility = '';

        // Lock container to old height, position old line absolutely
        titleRef.current.style.height = `${oldH}px`;
        oldLine.style.cssText = 'position:absolute;top:0;left:0;width:100%';

        // Start new chars off-screen
        gsap.set(newChars, { y: oldH * dir });

        const duration = reducedMotion ? 0.01 : 1;
        const stagger = reducedMotion ? 0 : 0.04;

        const tl = gsap.timeline({
            onComplete: () => {
                oldLine.remove();
                newLine.style.cssText = '';
                gsap.set(newChars, { clearProps: 'all' });
                if (titleRef.current) titleRef.current.style.height = '';
                currentTitleLineRef.current = newLine;
            }
        });

        // Animate container height old → new simultaneously with chars
        tl.to(titleRef.current, { height: newH, duration, ease: 'expo.inOut' }, 0);
        tl.to(oldChars, { y: -oldH * dir, stagger, duration, ease: 'expo.inOut' }, 0);
        tl.to(newChars, { y: 0, stagger, duration, ease: 'expo.inOut' }, 0);

        return tl;
    }, [reducedMotion]);

    // Position a single slide card
    const positionSlide = useCallback((slide: HTMLDivElement, step: number) => {
        if (!imagesRef.current) return;
        const h = imagesRef.current.offsetHeight;
        const props = getCardPosition(step, h);

        gsap.set(slide, {
            xPercent: -50,
            yPercent: -50,
            x: props.x,
            y: props.y,
            rotation: props.rotation,
            scale: props.scale,
            opacity: props.opacity,
            filter: `blur(${props.blur}px)`,
            zIndex: props.zIndex
        });
    }, []);

    // Build the carousel with visible cards
    const buildCarousel = useCallback(() => {
        if (!imagesRef.current || imagesRef.current.offsetHeight === 0) return;

        imagesRef.current.innerHTML = '';
        slideEls.current = [];

        // Render cards within visible range (-1 to +1 for 3 total cards)
        for (let step = -1; step <= 1; step++) {
            const idx = MOD(current + step, total);
            const item = items[idx];

            const slide = document.createElement('div');
            slide.className = 'portfolio-stacked__slide';
            slide.style.cssText = 'position:absolute;top:50%;left:50%;will-change:transform,filter,opacity';

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:brightness(0.9)';

            slide.appendChild(img);
            imagesRef.current.appendChild(slide);
            positionSlide(slide, step);
            slideEls.current.push({ el: slide, step: step });
        }
    }, [current, items, total, positionSlide]);

    // Animate carousel transition
    const animateCarousel = useCallback((direction: Direction) => {
        if (!imagesRef.current || imagesRef.current.offsetHeight === 0) return gsap.timeline();

        const shift = direction === 'next' ? -1 : 1;
        const enterStep = direction === 'next' ? 2 : -2;
        const newIdx = direction === 'next' ? MOD(current + 2, total) : MOD(current - 2, total);
        const newItem = items[newIdx];

        const h = imagesRef.current.offsetHeight;
        const duration = reducedMotion ? 0.01 : 1.2;

        // Create entering slide
        const newSlide = document.createElement('div');
        newSlide.className = 'portfolio-stacked__slide';
        newSlide.style.cssText = 'position:absolute;top:50%;left:50%;will-change:transform,filter,opacity';
        const img = document.createElement('img');
        img.src = newItem.image;
        img.alt = newItem.name;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:brightness(0.9)';
        newSlide.appendChild(img);

        imagesRef.current.appendChild(newSlide);
        positionSlide(newSlide, enterStep);
        slideEls.current.push({ el: newSlide, step: enterStep });

        // Update all slide steps
        slideEls.current.forEach((s) => {
            s.step += shift;
        });

        const tl = gsap.timeline({
            onComplete: () => {
                // Remove slides outside visible range
                slideEls.current = slideEls.current.filter((s) => {
                    if (Math.abs(s.step) >= 2) {
                        s.el.remove();
                        return false;
                    }
                    return true;
                });
            }
        });

        // Animate all slides to new positions
        slideEls.current.forEach((s) => {
            const props = getCardPosition(s.step, h);
            s.el.style.zIndex = String(props.zIndex);

            tl.to(s.el, {
                x: props.x,
                y: props.y,
                rotation: props.rotation,
                scale: props.scale,
                opacity: props.opacity,
                filter: `blur(${props.blur}px)`,
                duration: duration,
                ease: 'power3.inOut'
            }, 0);
        });

        return tl;
    }, [current, items, total, reducedMotion, positionSlide]);

    // Morph blob background colors
    const morphBlobColors = useCallback((item: ProjectData) => {
        if (!item.blobColors || !orbsRef.current.purple) return gsap.timeline();

        const duration = reducedMotion ? 0.01 : 1.2;
        const tl = gsap.timeline();

        if (orbsRef.current.purple) {
            tl.to(orbsRef.current.purple, {
                background: item.blobColors.purple,
                duration,
                ease: 'power2.inOut'
            }, 0);
        }
        if (orbsRef.current.orange) {
            tl.to(orbsRef.current.orange, {
                background: item.blobColors.orange,
                duration,
                ease: 'power2.inOut'
            }, 0);
        }
        if (orbsRef.current.blue) {
            tl.to(orbsRef.current.blue, {
                background: item.blobColors.blue,
                duration,
                ease: 'power2.inOut'
            }, 0);
        }

        return tl;
    }, [reducedMotion]);

    // Main navigation function
    const go = useCallback((direction: Direction) => {
        if (animating || total <= 1) return;

        if (direction === 'prev' && current === 0) return;
        if (direction === 'next' && current === total - 1) return;

        const delta = direction === 'next' ? 1 : -1;
        const nextIdx = Math.max(0, Math.min(total - 1, current + delta));
        const nextItem = items[nextIdx];

        if (visualTestMode || reducedMotion) {
            setCurrent(nextIdx);
            buildCarousel();
            if (titleRef.current) setTitle(nextItem.name);
            return;
        }

        setAnimating(true);

        const master = gsap.timeline({
            onComplete: () => {
                setCurrent(nextIdx);
                setAnimating(false);
            }
        });

        master.add(animateTitle(nextItem.name, direction), 0);
        master.add(animateCarousel(direction), 0);
        master.add(morphBlobColors(nextItem), 0);
    }, [animating, current, items, total, visualTestMode, reducedMotion, animateTitle, animateCarousel, morphBlobColors, buildCarousel, setTitle]);

    // Initialize component
    useEffect(() => {
        if (activeItem && titleRef.current) {
            setTitle(activeItem.name);
        }
        buildCarousel();
    }, [activeItem, setTitle, buildCarousel]);

    // Reduced motion detection
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;

        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
        setReducedMotion(media.matches);

        if (media.addEventListener) {
            media.addEventListener('change', onChange);
            return () => media.removeEventListener('change', onChange);
        }
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (isModalOpen || animating) return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') go('next');
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') go('prev');
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [go, animating, isModalOpen]);

    // Wheel/touch navigation — only active when NOT inside the pinned section
    // (ScrollTrigger handles navigation while pinned)
    useEffect(() => {
        const onWheel = throttle((e: WheelEvent) => {
            // If the section is pinned and active, ScrollTrigger handles it
            if (scrollTriggerRef.current?.isActive) return;
            if (animating) return;
            go(e.deltaY > 0 ? 'next' : 'prev');
        }, 1800);

        window.addEventListener('wheel', onWheel as EventListener, { passive: true });
        return () => window.removeEventListener('wheel', onWheel as EventListener);
    }, [go, animating]);

    // Keep a stable ref to `go` so ScrollTrigger onUpdate never has stale closure
    const goRef = useRef(go);
    useEffect(() => { goRef.current = go; }, [go]);

    // ScrollTrigger pin — fires once on mount, refreshes when item count changes
    useGSAP(() => {
        if (!sectionRef.current) return;

        const scrollPerCard = window.innerHeight * 0.6; // 60vh per card
        const totalScroll = total * scrollPerCard;

        let lastProgress = 0;

        const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${totalScroll}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.8,
            onUpdate: (self) => {
                // Roll the cursor ball based on scroll delta
                const delta = self.progress - lastProgress;
                cursorRotation.current += delta * 720; // full rotation over each card
                lastProgress = self.progress;

                // Which segment (0-based) are we in?
                const segment = Math.min(
                    Math.floor(self.progress * total),
                    total - 1
                );
                targetIndexRef.current = Math.max(0, segment);
                if (animating) return;
                if (targetIndexRef.current === current) return;
                goRef.current(targetIndexRef.current > current ? 'next' : 'prev');
            },
        });

        scrollTriggerRef.current = st;
        return () => { st.kill(); scrollTriggerRef.current = null; };
    }, { scope: sectionRef, dependencies: [total] });

    // If the user scrolls quickly across multiple segments, catch up one step at a time after each animation completes.
    useEffect(() => {
        if (animating) return;
        if (targetIndexRef.current === current) return;
        go(targetIndexRef.current > current ? 'next' : 'prev');
    }, [animating, current, go]);

    // Handle filter change
    const handleFilterClick = (filter: FilterOption) => {
        if (filter === 'all') {
            setActiveFilters([]);
            setCurrent(0);
            return;
        }

        setActiveFilters((prev) => {
            if (prev.includes(filter)) {
                return prev.filter((item) => item !== filter);
            }
            return [...prev, filter];
        });
        setCurrent(0);
    };

    // Close filter dropdown when clicking outside
    useEffect(() => {
        if (!isFilterOpen) return;
        const onClickOutside = (e: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsFilterOpen(false);
        };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onEscape);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onEscape);
        };
    }, [isFilterOpen]);

    const openModal = (project: ProjectData) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // ── Glass ball cursor ──────────────────────────────────
    useEffect(() => {
        const section = sectionRef.current;
        const cursor = cursorRef.current;
        if (!section || !cursor) return;

        const onMouseMove = (e: MouseEvent) => {
            cursorTarget.current = { x: e.clientX, y: e.clientY };
            // When hovering interactive UI (e.g. filter/nav), keep tracking position but hide custom cursor.
            if (suppressCursorRef.current) {
                if (cursorVisible.current) {
                    cursorVisible.current = false;
                    cursor.classList.remove('is-visible');
                }
                return;
            }
            if (!cursorVisible.current) {
                cursorVisible.current = true;
                cursor.classList.add('is-visible');
            }
        };

        const onMouseEnter = () => {
            if (suppressCursorRef.current) return;
            cursorVisible.current = true;
            cursor.classList.add('is-visible');
        };

        const onMouseLeave = () => {
            cursorVisible.current = false;
            cursor.classList.remove('is-visible');
        };

        // Lerp animation loop — gives the ball a smooth, floaty follow
        const filterEl = filterRef.current;
        const onFilterEnter = () => {
            suppressCustomCursor(true);
        };
        const onFilterLeave = () => {
            suppressCustomCursor(false);
        };

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
        const animate = () => {
            // Capture previous position to calculate delta
            const prevX = cursorPos.current.x;
            const prevY = cursorPos.current.y;

            // Slightly higher follow factor reduces perceived jitter/lag.
            cursorPos.current.x = lerp(cursorPos.current.x, cursorTarget.current.x, 0.16);
            cursorPos.current.y = lerp(cursorPos.current.y, cursorTarget.current.y, 0.16);

            // Calculate movement delta
            const dx = cursorPos.current.x - prevX;
            const dy = cursorPos.current.y - prevY;
            const speedScale = Math.min(1.25, 1 + Math.sqrt(dx * dx + dy * dy) / 150);
            cursorScale.current = lerp(cursorScale.current, speedScale, 0.12);

            // Apply rolling rotation based on movement (speed factor 2.5)
            if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
                cursorRotation.current += (dx + dy) * 2.5;
            }

            cursor.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%) scale(${cursorScale.current})`;
            // Apply rolling rotation to the inner text
            const inner = cursor.querySelector('.ps-cursor__text') as HTMLElement;
            if (inner) inner.style.transform = `rotate(${cursorRotation.current}deg)`;
            cursorRafId.current = requestAnimationFrame(animate);
        };
        cursorRafId.current = requestAnimationFrame(animate);

        section.addEventListener('mousemove', onMouseMove);
        section.addEventListener('mouseenter', onMouseEnter);
        section.addEventListener('mouseleave', onMouseLeave);
        filterEl?.addEventListener('mouseenter', onFilterEnter);
        filterEl?.addEventListener('mouseleave', onFilterLeave);

        return () => {
            cancelAnimationFrame(cursorRafId.current);
            section.removeEventListener('mousemove', onMouseMove);
            section.removeEventListener('mouseenter', onMouseEnter);
            section.removeEventListener('mouseleave', onMouseLeave);
            filterEl?.removeEventListener('mouseenter', onFilterEnter);
            filterEl?.removeEventListener('mouseleave', onFilterLeave);
        };
    }, []);

    return (
        <section id="portfolio-stacked" className="portfolio-stacked" ref={sectionRef}>
            {/* Glass ball cursor */}
            <div ref={cursorRef} className="ps-cursor">
                <span className="ps-cursor__text">scroll</span>
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Background Orbs */}
            <div className="portfolio-stacked__orbs">
                <div ref={(el) => orbsRef.current.purple = el} className="portfolio__orb portfolio__orb--purple"></div>
                <div ref={(el) => orbsRef.current.orange = el} className="portfolio__orb portfolio__orb--orange"></div>
                <div ref={(el) => orbsRef.current.blue = el} className="portfolio__orb portfolio__orb--blue"></div>
            </div>

            {/* Frosted Overlay */}
            <div className="portfolio__overlay"></div>

            {/* Side Navigation */}
            <button
                type="button"
                className="portfolio-stacked__side-nav portfolio-stacked__side-nav--left"
                onClick={() => go('prev')}
                onMouseEnter={() => suppressCustomCursor(true)}
                onMouseLeave={() => suppressCustomCursor(false)}
                disabled={animating || total <= 1 || current === 0}
                aria-label="Previous project"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            <button
                type="button"
                className="portfolio-stacked__side-nav portfolio-stacked__side-nav--right"
                onClick={() => go('next')}
                onMouseEnter={() => suppressCustomCursor(true)}
                onMouseLeave={() => suppressCustomCursor(false)}
                disabled={animating || total <= 1 || current === total - 1}
                aria-label="Next project"
            >
                <ArrowRight className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="portfolio-stacked__container">
                <h2 className="portfolio__title">Our Work</h2>
                <p className="portfolio__subtitle">
                    See how we've helped Kenyan businesses look professional and attract better clients.
                </p>

                {/* Collapsible Filter — white pill with "Filter" label */}
                <div className="ps-filter" ref={filterRef}>
                    <button
                        type="button"
                        className={`ps-filter__trigger ${isFilterOpen ? 'is-open' : ''} ${activeFilters.length > 0 ? 'has-active' : ''}`}
                        onClick={() => setIsFilterOpen(o => !o)}
                        aria-expanded={isFilterOpen}
                        aria-haspopup="true"
                    >
                        <svg className="ps-filter__icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span className="ps-filter__label">{isFilterOpen ? 'All Projects' : 'Filter'}</span>
                    </button>

                    <div className={`ps-filter__dropdown ${isFilterOpen ? 'is-open' : ''}`} role="group" aria-label="Project filters">
                        {([
                            { value: 'small-business', label: 'Small Business' },
                            { value: 'saas', label: 'SaaS & Apps' },
                            { value: 'creative', label: 'Creative' },
                        ] as { value: FilterOption; label: string }[]).map(({ value, label }) => {
                            const isActive = activeFilters.includes(value as FilterType);

                            return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={isActive}
                                className={`ps-filter__option ${isActive ? 'is-active' : ''}`}
                                onClick={() => handleFilterClick(value)}
                            >
                                {label}
                            </button>
                        );
                        })}

                        {activeFilters.length > 0 && (
                            <button
                                type="button"
                                className="ps-filter__clear"
                                onClick={() => handleFilterClick('all')}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {activeItem && (
                    <div className="portfolio-stacked__body">
                        {/* Left: Text Content */}
                        <div className="portfolio-stacked__left">
                            <p className="portfolio-stacked__kicker">{activeItem.type}</p>
                            <h1 ref={titleRef} className="portfolio-stacked__title"></h1>

                            <div className="portfolio-stacked__info">
                                <p className="portfolio-stacked__description">{activeItem.description}</p>
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
                        </div>

                        {/* Right: Card Stack */}
                        <div className="portfolio-stacked__right">
                            <div ref={imagesRef} className="portfolio-stacked__images"></div>
                        </div>
                    </div>
                )}

                {/* Bottom Center CTA (replaces bottom nav row) */}
                <div className="portfolio-stacked__bottom">
                    <div className="portfolio__cta">
                        <a href="/get-started.html" className="btn-primary">Ready to Start Your Project?</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
