import React, { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTheme } from '../contexts/ThemeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const TorchEffect = () => {
    const { theme } = useTheme();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Track mouse position
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Only update position if NOT expanding (scroll is at top)
            // We check a CSS variable or a ref to know if we are 'locked'
            const isLocked = document.body.classList.contains('torch-expanding');

            if (!isLocked) {
                // Update state for React renders (Lottie position)
                setMousePos({ x: e.clientX, y: e.clientY });

                // Update CSS variables for performance (Mask position)
                if (containerRef.current) {
                    containerRef.current.style.setProperty('--x', `${e.clientX}px`);
                    containerRef.current.style.setProperty('--y', `${e.clientY}px`);
                }
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
        updateIsMobile();
        window.addEventListener('resize', updateIsMobile);
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    // Handle scroll expansion
    useEffect(() => {
        if (theme !== 'dark' || isMobile || !containerRef.current) return;

        // Initialize radius variable
        containerRef.current.style.setProperty('--radius', '250px');
        const lottieContainer = containerRef.current.nextElementSibling as HTMLElement;

        const anim = gsap.to(containerRef.current, {
            '--radius': '250vmax', // Use vmax to ensuring covering screen regardless of aspect ratio
            ease: 'none',
            scrollTrigger: {
                trigger: 'body', // Use body instead of .hero to avoid pinning conflicts
                start: 'top top',
                end: '+=100', // Absolute 100px of scroll from start
                scrub: 0.1,
                onUpdate: (self) => {
                    if (self.progress > 0.01) {
                        // Started expanding: Lock position & Show Cursor
                        document.body.classList.add('torch-expanding');
                        document.body.style.cursor = 'auto'; // Restore cursor

                        // Hide custom cursor elements
                        if (lottieContainer) lottieContainer.style.opacity = '0';
                    } else {
                        // Reset: Unlock position & Hide Cursor
                        document.body.classList.remove('torch-expanding');
                        document.body.style.cursor = 'none'; // Hide cursor again

                        // Show custom cursor elements
                        if (lottieContainer) lottieContainer.style.opacity = '1';
                    }
                }
            }
        });

        return () => {
            anim.kill();
            document.body.classList.remove('torch-expanding');
            document.body.style.cursor = 'auto'; // Safety cleanup
        };
    }, [theme]);

    // Handle cursor visibility (Initial & Toggle)
    useEffect(() => {
        if (theme === 'dark' && !isMobile) {
            // Default state at mount/theme switch should be hidden if at top
            const isScrolled = window.scrollY > 10;
            document.body.style.cursor = isScrolled ? 'auto' : 'none';

            // Also hide cursor on all interactive elements to be safe (only when not expanding)
            const style = document.createElement('style');
            style.id = 'cursor-style';
            // Only apply 'none' if NOT expanding class
            style.innerHTML = 'body:not(.torch-expanding) *, body:not(.torch-expanding) { cursor: none !important; } .torch-expanding, .torch-expanding * { cursor: auto !important; }';
            document.head.appendChild(style);

            return () => {
                document.body.style.cursor = 'auto';
                const existingStyle = document.getElementById('cursor-style');
                if (existingStyle) existingStyle.remove();
            };
        } else {
            document.body.style.cursor = 'auto';
        }
    }, [theme]);

    if (theme !== 'dark' || isMobile) return null;

    return (
        <>
            {/* Dark Overlay with Hole */}
            <div
                ref={containerRef}
                className="torch-overlay"
            />

            {/* Lottie Character following cursor */}
            <div
                className="torch-cursor"
                style={{
                    '--cursor-x': `${mousePos.x}px`,
                    '--cursor-y': `${mousePos.y}px`,
                } as React.CSSProperties}
            >
                <DotLottieReact
                    src="https://lottie.host/9cdec955-2e0c-4145-9d9c-354e140e9106/ORLDJ6dgGw.lottie"
                    loop
                    autoplay
                />
            </div>
        </>
    );
};
