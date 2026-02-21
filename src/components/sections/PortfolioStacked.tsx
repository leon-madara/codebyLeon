import { useState, useRef, useEffect, useCallback, type CSSProperties } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
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
gsap.registerPlugin(ScrollTrigger, Observer);

// Helper functions from reference code
const MOD = (n: number, total: number) => ((n % total) + total) % total;

// Calculate card position properties based on step offset from active card
interface CardPosition {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
    zIndex: number;
}

const getCardPosition = (step: number, containerHeight: number): CardPosition => {
    const absStep = Math.abs(step);

    // Position configurations matching reference implementation
    // Blur removed for performance
    const positions = [
        { x: -0.35, y: -0.95, rot: -30, s: 1.35, o: 0 },    // far back (-2)
        { x: -0.18, y: -0.5, rot: -15, s: 1.15, o: 0.4 },   // near back (-1)
        { x: 0, y: 0, rot: 0, s: 1, o: 1 },                  // active (0)
        { x: -0.06, y: 0.5, rot: 15, s: 0.75, o: 0.4 },     // near front (+1)
        { x: -0.12, y: 0.95, rot: 30, s: 0.55, o: 0 }       // far front (+2)
    ];

    const idx = Math.max(0, Math.min(4, step + 2));
    const p = positions[idx];

    return {
        x: p.x * containerHeight,
        y: p.y * containerHeight,
        rotation: p.rot,
        scale: p.s,
        opacity: p.o,
        zIndex: absStep === 0 ? 3 : absStep === 1 ? 2 : 1
    };
};

export function PortfolioStacked() {
    const visualTestMode = isVisualTestMode();
    const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);

    // We update this state to trigger re-renders for text content, 
    // but the animation loop uses the refs below to avoid React batching issues.
    const [displayedIndex, setDisplayedIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false); // For button disabled state

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

    // ─── Animation Refs ──────────────────────────────────────────────────────────
    const currentIndex = useRef(0);
    const isAnimating = useRef(false); // Internal guard for logic, not render
    const currentTween = useRef<gsap.core.Timeline | null>(null);
    const currentTitleTween = useRef<gsap.core.Timeline | null>(null);
    const containerHeight = useRef(0);
    const lastScrollTime = useRef(0);
    const pendingDirection = useRef<Direction | null>(null);

    // We store 'total' and 'go' in refs to keep useGSAP dependencies empty/stable
    const totalRef = useRef(0);
    const goRef = useRef<((dir: Direction) => void) | null>(null);
    // ─────────────────────────────────────────────────────────────────────────────

    const orbsRef = useRef<{ purple: HTMLDivElement | null; orange: HTMLDivElement | null; blue: HTMLDivElement | null }>({
        purple: null,
        orange: null,
        blue: null
    });

    // Glass ball cursor refs
    const cursorRef = useRef<HTMLDivElement>(null);
    const xTo = useRef<gsap.QuickToFunc | null>(null);
    const yTo = useRef<gsap.QuickToFunc | null>(null);
    const cursorVisible = useRef(false);
    const suppressCursorRef = useRef(false);

    const filteredItems = activeFilters.length > 0
        ? PORTFOLIO_ITEMS.filter((item) => activeFilters.includes(item.category))
        : [];

    const items = filteredItems.length > 0 ? filteredItems : PORTFOLIO_ITEMS;
    const total = items.length;

    // Update ref for the stable observer
    useEffect(() => {
        totalRef.current = total;
    }, [total]);

    // Derived for render
    const activeItem = items[displayedIndex];

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
        if (!titleRef.current) return gsap.timeline();

        // Interruption: Instant cleanup of previous transition
        if (currentTitleTween.current) {
            currentTitleTween.current.kill(); // Stop the previous tween

            // If we have "pending" old lines (from a kill), remove them
            const pendings = titleRef.current.querySelectorAll('.title-line');
            pendings.forEach(el => {
                if (el !== currentTitleLineRef.current) el.remove();
            });

            // Ensure current line is processed as the "old" line for next animation
            if (currentTitleLineRef.current) {
                gsap.set(currentTitleLineRef.current, { clearProps: 'all' });
                currentTitleLineRef.current.style.cssText = 'position:relative;width:100%';
                gsap.set(currentTitleLineRef.current.querySelectorAll('span > span'), { clearProps: 'all' });
            }
        }

        // If no current line exists (initial load), just set it and return
        if (!currentTitleLineRef.current) {
            const { line } = buildLine(newText);
            line.classList.add('title-line');
            titleRef.current.appendChild(line);
            currentTitleLineRef.current = line;
            return gsap.timeline();
        }

        const oldH = titleRef.current.offsetHeight;
        const dir = direction === 'next' ? 1 : -1;
        const oldLine = currentTitleLineRef.current;

        // Mark as a line we manage
        oldLine.classList.add('title-line');

        const oldChars = [...oldLine.querySelectorAll('span > span')];

        // Build the new line and measure its natural height before showing it
        const { line: newLine, chars: newChars } = buildLine(newText);
        newLine.classList.add('title-line');
        newLine.style.cssText = 'position:absolute;top:0;left:0;width:100%;visibility:hidden';
        titleRef.current.appendChild(newLine);
        const newH = newLine.offsetHeight;
        newLine.style.visibility = '';

        // Lock container to old height, position old line absolutely
        titleRef.current.style.height = `${oldH}px`;
        oldLine.style.cssText = 'position:absolute;top:0;left:0;width:100%';

        // Start new chars off-screen
        gsap.set(newChars, { y: oldH * dir });

        const duration = reducedMotion ? 0.01 : 0.55;
        const stagger = reducedMotion ? 0 : 0.03;

        const tl = gsap.timeline({
            onComplete: () => {
                oldLine.remove();
                newLine.style.cssText = 'position:relative;width:100%'; // Reset to relative flow
                gsap.set(newChars, { clearProps: 'all' });
                if (titleRef.current) titleRef.current.style.height = '';
                currentTitleLineRef.current = newLine;
                currentTitleTween.current = null;
            }
        });

        // Animate container height old → new simultaneously with chars
        tl.to(titleRef.current, { height: newH, duration, ease: 'expo.inOut' }, 0);
        tl.to(oldChars, { y: -oldH * dir, stagger, duration, ease: 'expo.inOut', force3D: true }, 0);
        tl.to(newChars, { y: 0, stagger, duration, ease: 'expo.inOut', force3D: true }, 0);

        currentTitleTween.current = tl;
        return tl;
    }, [reducedMotion]);

    // Position a single slide card
    const positionSlide = useCallback((slide: HTMLDivElement, step: number) => {
        const h = containerHeight.current || (imagesRef.current?.offsetHeight || 500);
        const props = getCardPosition(step, h);

        gsap.set(slide, {
            xPercent: -50,
            yPercent: -50,
            x: props.x,
            y: props.y,
            rotation: props.rotation,
            scale: props.scale,
            opacity: props.opacity,
            zIndex: props.zIndex,
            force3D: true
            // REMOVED BLUR
        });
    }, []);

    // Build the carousel with visible cards
    const buildCarousel = useCallback(() => {
        if (!imagesRef.current) return;

        // Only if we need a full rebuild (e.g. initial load or filter change)
        imagesRef.current.innerHTML = '';
        slideEls.current = [];

        // Cache height
        containerHeight.current = imagesRef.current.offsetHeight;

        // Render cards within visible range (-1 to +1 for 3 total cards)
        for (let step = -1; step <= 1; step++) {
            const idx = MOD(currentIndex.current + step, total);
            const item = items[idx];

            const slide = document.createElement('div');
            slide.className = 'portfolio-stacked__slide';
            // contain: layout style paint for performance
            slide.style.cssText = 'position:absolute;top:50%;left:50%;contain:layout style paint;will-change:transform,opacity';

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:brightness(0.9)';

            slide.appendChild(img);
            imagesRef.current.appendChild(slide);
            positionSlide(slide, step);
            slideEls.current.push({ el: slide, step: step });
        }
    }, [items, total, positionSlide]);

    // Animate carousel transition
    const animateCarousel = useCallback(async (direction: Direction) => {
        if (!imagesRef.current || imagesRef.current.offsetHeight === 0) return gsap.timeline();

        // Interruption: Kill current tween
        if (currentTween.current) {
            currentTween.current.kill();
        }

        const shift = direction === 'next' ? -1 : 1;
        const enterStep = direction === 'next' ? 2 : -2;
        const newIdx = direction === 'next' ? MOD(currentIndex.current + 2, total) : MOD(currentIndex.current - 2, total);
        const newItem = items[newIdx];

        const h = containerHeight.current;
        const duration = reducedMotion ? 0.01 : 0.55;

        // Create entering slide
        const newSlide = document.createElement('div');
        newSlide.className = 'portfolio-stacked__slide';
        // contain: layout style paint for performance
        newSlide.style.cssText = 'position:absolute;top:50%;left:50%;contain:layout style paint;will-change:transform,opacity';
        const img = document.createElement('img');
        img.src = newItem.image;
        img.alt = newItem.name;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;filter:brightness(0.9)';

        // Pre-decode the image to prevent main thread jank
        try {
            await img.decode();
        } catch (e) {
            // ignore error, proceed anyway
        }

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

                // Reset will-change to auto to save memory
                slideEls.current.forEach(s => {
                    gsap.set(s.el, { willChange: 'auto' });
                });

                currentTween.current = null;
                // NOTE: We do NOT set isAnimating.current = false here. 
                // That is owned by the master timeline to prevent race/stuck states.
            }
        });

        // Animate all slides to new positions
        slideEls.current.forEach((s) => {
            // Apply will-change before animating
            gsap.set(s.el, { willChange: 'transform, opacity' });

            const props = getCardPosition(s.step, h);
            s.el.style.zIndex = String(props.zIndex);

            tl.to(s.el, {
                x: props.x,
                y: props.y,
                rotation: props.rotation,
                scale: props.scale,
                opacity: props.opacity,
                // REMOVED BLUR
                duration: duration,
                ease: 'power2.inOut',
                force3D: true
            }, 0);
        });

        currentTween.current = tl;
        return tl;
    }, [items, total, reducedMotion, positionSlide]);

    // Morph blob background colors
    const morphBlobColors = useCallback((item: ProjectData) => {
        if (!item.blobColors || !orbsRef.current.purple) return gsap.timeline();

        // Match duration to carousel (0.55s)
        const duration = reducedMotion ? 0.01 : 0.55;
        const tl = gsap.timeline();

        // Use backgroundColor instead of background shorthand for performance
        if (orbsRef.current.purple) {
            tl.to(orbsRef.current.purple, {
                backgroundColor: item.blobColors.purple,
                duration,
                ease: 'power2.inOut',
                force3D: true
            }, 0);
        }
        if (orbsRef.current.orange) {
            tl.to(orbsRef.current.orange, {
                backgroundColor: item.blobColors.orange,
                duration,
                ease: 'power2.inOut',
                force3D: true
            }, 0);
        }
        if (orbsRef.current.blue) {
            tl.to(orbsRef.current.blue, {
                backgroundColor: item.blobColors.blue,
                duration,
                ease: 'power2.inOut',
                force3D: true
            }, 0);
        }

        return tl;
    }, [reducedMotion]);

    // Main navigation function
    const go = useCallback(async (direction: Direction) => {
        // Allow interruption
        if (total <= 1) return;
        if (direction === 'prev' && currentIndex.current === 0) return;
        if (direction === 'next' && currentIndex.current === total - 1) return;

        isAnimating.current = true;
        setIsTransitioning(true);

        const delta = direction === 'next' ? 1 : -1;
        const nextIdx = Math.max(0, Math.min(total - 1, currentIndex.current + delta));
        const nextItem = items[nextIdx];

        currentIndex.current = nextIdx;
        setDisplayedIndex(nextIdx); // Sync Text UI (triggers render, but we prevent buildCarousel)

        const master = gsap.timeline({
            onComplete: () => {
                isAnimating.current = false;
                setIsTransitioning(false);
                if (pendingDirection.current) {
                    const dir = pendingDirection.current;
                    pendingDirection.current = null;
                    if (goRef.current) goRef.current(dir);
                }
            }
        });

        master.add(animateTitle(nextItem.name, direction), 0);

        // animateCarousel is async because of img.decode()
        const carouselTl = await animateCarousel(direction);
        master.add(carouselTl as gsap.core.Timeline, 0);

        master.add(morphBlobColors(nextItem), 0);
    }, [items, total, reducedMotion, animateTitle, animateCarousel, morphBlobColors]);

    // Store go in ref for Observer
    useEffect(() => {
        goRef.current = go;
    }, [go]);

    // Initialize component
    useEffect(() => {
        const activeItem = items[currentIndex.current];
        if (activeItem && titleRef.current) {
            setTitle(activeItem.name);
        }
        // Force layout read once
        if (imagesRef.current) containerHeight.current = imagesRef.current.offsetHeight;

        // Check if we need to rebuild (only if slideEls is empty or on init)
        if (slideEls.current.length === 0) {
            buildCarousel();
        }

        const onResize = () => {
            if (imagesRef.current) containerHeight.current = imagesRef.current.offsetHeight;
            // Reposition existing slides instead of full rebuild
            slideEls.current.forEach(s => {
                positionSlide(s.el, s.step);
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [items, setTitle, buildCarousel, positionSlide]);

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
            if (isModalOpen) return;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') go('next');
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') go('prev');
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [go, isModalOpen]);

    // ScrollTrigger pin — holds the section in place while we use Observer for navigation
    useGSAP(() => {
        if (!sectionRef.current) return;

        // Create a trigger solely for pinning. 
        const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%',
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
        });

        // Observer with no dependencies - totally stable
        const observer = Observer.create({
            target: window,
            type: "wheel,touch,pointer",
            wheelSpeed: 1.5,
            tolerance: 5, // Tuned tolerance
            // remove blanket preventDefault: true
            onUp: (self) => {
                if (!st.isActive) return;

                // 600ms Cooldown
                const now = Date.now();
                if (now - lastScrollTime.current < 600) return;

                if (isAnimating.current) {
                    pendingDirection.current = 'next';
                    return;
                }

                // Scrolling down / swiping up -> Next
                if (currentIndex.current < totalRef.current - 1) {
                    lastScrollTime.current = now;
                    if (goRef.current) goRef.current('next');
                }
            },
            onDown: (self) => {
                if (!st.isActive) return;

                // 600ms Cooldown
                const now = Date.now();
                if (now - lastScrollTime.current < 600) return;

                if (isAnimating.current) {
                    pendingDirection.current = 'prev';
                    return;
                }

                // Scrolling up / swiping down -> Prev
                if (currentIndex.current > 0) {
                    lastScrollTime.current = now;
                    if (goRef.current) goRef.current('prev');
                }
            }
        });

        scrollTriggerRef.current = st;
        return () => {
            observer.kill();
            st.kill();
            scrollTriggerRef.current = null;
        };
    }, { scope: sectionRef }); // EMPTY DEPENDENCIES - STABLE


    // Handle filter change
    const handleFilterClick = (filter: FilterOption) => {
        if (filter === 'all') {
            setActiveFilters([]);
            currentIndex.current = 0;
            setDisplayedIndex(0);
            return;
        }

        setActiveFilters((prev) => {
            if (prev.includes(filter)) {
                return prev.filter((item) => item !== filter);
            }
            return [...prev, filter];
        });
        currentIndex.current = 0;
        setDisplayedIndex(0);
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
    useGSAP(() => {
        if (!cursorRef.current) return;

        // Use quickTo for optimized loop-free updates
        xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.2, ease: "power3" });
        yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.2, ease: "power3" });

        const section = sectionRef.current;
        if (!section) return;

        const onMouseMove = (e: MouseEvent) => {
            // Only update if visible to save resources
            if (xTo.current && yTo.current) {
                xTo.current(e.clientX);
                yTo.current(e.clientY);
            }

            // When hovering interactive UI (e.g. filter/nav), keep tracking position but hide custom cursor.
            if (suppressCursorRef.current) {
                if (cursorVisible.current) {
                    cursorVisible.current = false;
                    cursorRef.current?.classList.remove('is-visible');
                }
                return;
            }
            if (!cursorVisible.current) {
                cursorVisible.current = true;
                cursorRef.current?.classList.add('is-visible');
            }
        };

        const onMouseEnter = () => {
            if (suppressCursorRef.current) return;
            cursorVisible.current = true;
            cursorRef.current?.classList.add('is-visible');
        };

        const onMouseLeave = () => {
            cursorVisible.current = false;
            cursorRef.current?.classList.remove('is-visible');
        };

        section.addEventListener('mousemove', onMouseMove);
        section.addEventListener('mouseenter', onMouseEnter);
        section.addEventListener('mouseleave', onMouseLeave);

        return () => {
            section.removeEventListener('mousemove', onMouseMove);
            section.removeEventListener('mouseenter', onMouseEnter);
            section.removeEventListener('mouseleave', onMouseLeave);
        };
    }, { scope: sectionRef });

    // Helper for JSX to use
    const suppressCustomCursor = (suppress: boolean) => {
        suppressCursorRef.current = suppress;
    };

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
                disabled={isTransitioning || total <= 1 || currentIndex.current === 0}
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
                disabled={isTransitioning || total <= 1 || currentIndex.current === total - 1}
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
