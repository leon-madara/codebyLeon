/* =============================================
   SERVICES PREVIEW TYPING ANIMATION
   Using GSAP & ScrollTrigger
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        /**
         * Helper function to split text into characters and wrap them in spans
         * to allow for character-by-character typing animation.
         */
        function splitTextToChars(element) {
            if (!element) return;
            
            const text = element.textContent.trim();
            const chars = text.split('');
            
            element.innerHTML = '';
            
            chars.forEach((char) => {
                const charSpan = document.createElement('span');
                charSpan.className = 'typing-char';
                charSpan.style.display = 'inline-block';
                // Preserve spaces
                if (char === ' ') {
                    charSpan.innerHTML = '&nbsp;';
                } else {
                    charSpan.textContent = char;
                }
                element.appendChild(charSpan);
            });
        }

        /**
         * Create and append blinking cursor element
         */
        function createCursor(element) {
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.textContent = '|';
            cursor.style.opacity = '0';
            element.appendChild(cursor);
            return cursor;
        }

        // Select target elements
        const servicesPreviewSection = document.querySelector('#services-preview');
        const headline = document.querySelector('#services-preview .section-headline');

        if (!headline || !servicesPreviewSection) {
            return;
        }

        // Apply character splitting
        splitTextToChars(headline);

        // Create cursor element
        const cursor = createCursor(headline);

        // Get all character spans
        const chars = headline.querySelectorAll('.typing-char');

        // Set initial state: all characters invisible
        gsap.set(chars, { opacity: 0 });
        gsap.set(cursor, { opacity: 0 });

        // Calculate total animation duration
        // For "Solutions That Fit Your Business" (33 chars) with 0.06s stagger: ~2s
        const staggerDelay = 0.06;
        const totalDuration = chars.length * staggerDelay;

        // Create Main Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: servicesPreviewSection,
                start: 'top 50%',  // When section top reaches 50% of viewport
                toggleActions: 'play none none none'  // Play once, no reverse
            },
            defaults: { ease: 'power1.out' }  // Slight ease
        });

        // Animate characters appearing one by one
        tl.to(chars, {
            opacity: 1,
            duration: 0.3,
            stagger: staggerDelay,
            ease: 'power1.out'
        });

        // Show cursor after all characters have appeared
        tl.to(cursor, {
            opacity: 1,
            duration: 0.2
        }, `+=0.1`);  // Small delay after last character

    } else {
        console.warn('GSAP or ScrollTrigger not loaded');
    }
});
