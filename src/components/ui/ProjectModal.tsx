import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X, ExternalLink, Github } from 'lucide-react';

export interface ProjectData {
    id: number;
    category: string;
    name: string;
    type: string;
    description: string;
    longDescription: string;
    techStack: string[];
    image: string;
    accentColor?: string;
    link?: string;
    repo?: string;
}

interface ProjectModalProps {
    project: ProjectData | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Animate In
            const tl = gsap.timeline();

            tl.to(overlayRef.current, {
                opacity: 1,
                duration: 0.3,
                pointerEvents: 'auto',
                ease: 'power2.out'
            })
                .fromTo(modalRef.current,
                    { y: 50, opacity: 0, scale: 0.95 },
                    { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.2)' },
                    '-=0.2'
                )
                .fromTo(contentRef.current?.children || [],
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: 'power2.out' },
                    '-=0.2'
                );

        } else {
            // Allow body scroll
            document.body.style.overflow = '';

            // Animate Out
            if (overlayRef.current) {
                gsap.to(overlayRef.current, {
                    opacity: 0,
                    duration: 0.2,
                    pointerEvents: 'none',
                    ease: 'power2.in'
                });
            }
            if (modalRef.current) {
                gsap.to(modalRef.current, {
                    y: 20,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.2,
                    ease: 'power2.in'
                });
            }
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!project) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md opacity-0 pointer-events-none"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--canvas-base)] border border-[var(--glass-border)] rounded-2xl shadow-2xl custom-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-sm"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero Image */}
                <div className="relative h-48 md:h-72 w-full overflow-hidden">
                    {/* Use img tag directly for now, assuming public assets */}
                    <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--canvas-base)] to-transparent opacity-80" />

                    <div className="absolute bottom-6 left-6 md:left-10">
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider uppercase bg-[var(--hero-accent)] text-black rounded-full">
                            {project.category}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">{project.name}</h2>
                    </div>
                </div>

                {/* Content */}
                <div ref={contentRef} className="p-6 md:p-10 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--hero-accent)] mb-2">The Challenge & Solution</h3>
                                <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                                    {project.longDescription}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[var(--hero-accent)] mb-3">Technologies Built With</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 text-sm bg-[var(--surface-highlight)] text-[var(--text-primary)] border border-[var(--glass-border)] rounded-md"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-5 rounded-xl bg-[var(--surface-highlight)] border border-[var(--glass-border)]">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">Project Actions</h3>
                                <div className="space-y-3">
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-black bg-[var(--hero-accent)] rounded-lg hover:opacity-90 transition-opacity"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Visit Live Site
                                        </a>
                                    )}
                                    {project.repo && (
                                        <a
                                            href={project.repo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-[var(--text-primary)] bg-transparent border border-[var(--glass-border)] rounded-lg hover:bg-[var(--glass-border)] transition-colors"
                                        >
                                            <Github className="w-4 h-4" />
                                            View Code
                                        </a>
                                    )}
                                    {!project.link && !project.repo && (
                                        <span className="block text-center text-sm text-[var(--text-secondary)] italic">
                                            Internal Project / Private Repo
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
