import { useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { ProjectModal, type ProjectData } from '../ui/ProjectModal';

gsap.registerPlugin(ScrollTrigger);

// ─── DATA ────────────────────────────────────────────────────────────────────
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

export function Portfolio3DStack() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Background color blobs refs
    const orbsRef = useRef<{ purple: HTMLDivElement | null; orange: HTMLDivElement | null; blue: HTMLDivElement | null }>({
        purple: null, orange: null, blue: null
    });

    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial Blob Colors (from first item)
    // We will animate these with ScrollTrigger too
    const initialBlobs = PORTFOLIO_ITEMS[0].blobColors;

    useGSAP(() => {
        if (!sectionRef.current || !containerRef.current) return;

        const cards = cardsRef.current.filter(Boolean);
        const totalCards = cards.length;

        // PINNING SECTION
        // We pin the section for a distance based on number of cards.
        // e.g. 100vh per card, plus some buffer.
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${totalCards * 100}%`,
            pin: true,
            scrub: 1,
            // anticipatePin: 1
        });

        // ANIMATION LOOP
        // For each card (except the last one which doesn't need to peel away),
        // we create a scrollTrigger that animates it up and out.

        cards.forEach((card, i) => {
            if (!card) return;

            // Set initial z-index: higher index = on top
            gsap.set(card, { zIndex: totalCards - i });

            // If it's not the last card, it peels away
            if (i < totalCards - 1) {
                const nextCard = cards[i + 1];

                // Timeline for this card's "turn"
                // Start: when scroll reaches this card's index-based progress
                // End: after 1 "scroll unit"
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: `top top+=${i * 100}%`,
                        end: `top top+=${(i + 1) * 100}%`,
                        scrub: 1,
                        // markers: true, // DEBUG
                    }
                });

                // 1. Current card peels up and rotates
                tl.to(card, {
                    yPercent: -120,
                    rotation: -5, // slight tilt left
                    opacity: 0,
                    scale: 0.9,
                    ease: "power2.inOut",
                    transformOrigin: "center bottom"
                });

                // 2. Next card (background) scales up and brightens
                if (nextCard) {
                    tl.fromTo(nextCard,
                        { scale: 0.9, filter: "brightness(0.6)" },
                        { scale: 1, filter: "brightness(1)", ease: "power2.inOut" },
                        "<" // Start at same time
                    );
                }

                // 3. Blob Morphing (if colors change)
                const currentItem = PORTFOLIO_ITEMS[i];
                const nextItem = PORTFOLIO_ITEMS[i + 1];

                if (nextItem && nextItem.blobColors) {
                    if (orbsRef.current.purple) {
                        tl.to(orbsRef.current.purple, { backgroundColor: nextItem.blobColors.purple, ease: "power2.inOut" }, "<");
                    }
                    if (orbsRef.current.orange) {
                        tl.to(orbsRef.current.orange, { backgroundColor: nextItem.blobColors.orange, ease: "power2.inOut" }, "<");
                    }
                    if (orbsRef.current.blue) {
                        tl.to(orbsRef.current.blue, { backgroundColor: nextItem.blobColors.blue, ease: "power2.inOut" }, "<");
                    }
                }
            } else {
                // The Last Card
                // It just stays there, but we ensure it starts scaled down if it wasn't the first.
                // Actually the logic above (step 2 of previous iteration) handles its scale up.
                // We just need to make sure initial state is correct for all cards > 0.
            }
        });

        // Set initial states for cards 1..n (only card 0 is fully visible initially)
        cards.forEach((card, i) => {
            if (i > 0) {
                gsap.set(card, {
                    scale: 0.9,
                    filter: "brightness(0.6)"
                });
            }
        });

    }, { scope: sectionRef });

    const openModal = (project: ProjectData) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    return (
        <section ref={sectionRef} className="portfolio-3d-stack relative w-full h-screen overflow-hidden bg-zinc-950 text-white flex flex-col items-center justify-center">

            {/* Background Orbs */}
            {/* Re-using styles from portfolio-stacked or creating new utility classes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div ref={(el) => orbsRef.current.purple = el}
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[100px] opacity-40 transition-colors"
                    style={{ backgroundColor: initialBlobs.purple }} />
                <div ref={(el) => orbsRef.current.orange = el}
                    className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-40 transition-colors"
                    style={{ backgroundColor: initialBlobs.orange }} />
                <div ref={(el) => orbsRef.current.blue = el}
                    className="absolute bottom-[-10%] left-[20%] w-[45vw] h-[45vw] rounded-full blur-[100px] opacity-40 transition-colors"
                    style={{ backgroundColor: initialBlobs.blue }} />
            </div>

            {/* Content Container */}
            <div ref={containerRef} className="relative w-full max-w-[1400px] h-full flex flex-col items-center pt-24 pb-12 px-6">

                {/* Header */}
                <div className="text-center mb-8 z-10 relative">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">Our Work</h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        See how we've helped Kenyan businesses look professional and attract better clients.
                    </p>
                </div>

                {/* Cards Stack */}
                <div className="relative w-full flex-1 flex items-center justify-center perspective-[1000px]">
                    {PORTFOLIO_ITEMS.map((item, index) => (
                        <div
                            key={item.id}
                            ref={(el) => cardsRef.current[index] = el}
                            className="absolute w-full max-w-[1000px] aspect-[16/9] md:aspect-[2/1] rounded-3xl overflow-hidden shadow-2xl origin-bottom"
                            style={{
                                // backdropFilter: 'blur(20px)', // Performance heavy, use with caution
                                backgroundColor: 'rgba(20, 20, 25, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {/* Card Content Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                                {/* Image Section */}
                                <div className="relative h-full overflow-hidden group">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    {/* Mobile/Tablet Overlay Text (only visible if needed, but we have side panel) */}
                                </div>

                                {/* Info Section - Glassmorphism */}
                                <div className="relative p-8 md:p-12 flex flex-col justify-center h-full border-l border-white/5 bg-white/5 backdrop-blur-md">
                                    {/* Accent Badge */}
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-6 w-fit"
                                        style={{ backgroundColor: item.accentColor, color: '#fff' }}>
                                        {item.type}
                                    </div>

                                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                        {item.name}
                                    </h3>

                                    <p className="text-zinc-300 mb-8 leading-relaxed max-w-md">
                                        {item.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-10">
                                        {item.techStack.slice(0, 3).map(tech => (
                                            <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-zinc-300 border border-white/5">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => openModal(item)}
                                        className="group inline-flex items-center gap-2 text-white font-medium hover:text-orange-400 transition-colors"
                                    >
                                        View Case Study
                                        <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </section>
    );
}
