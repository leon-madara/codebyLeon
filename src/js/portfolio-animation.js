/* =============================================
   PORTFOLIO ENTRANCE ANIMATIONS
   Using GSAP & ScrollTrigger
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        /**
         * Helper function to split text into words and wrap them in spans
         * to allow for overflow:hidden reveal.
         */
        function splitTextToWords(element) {
            if (!element) return;
            
            const text = element.textContent.trim();
            const words = text.split(/\s+/);
            
            element.innerHTML = '';
            
            words.forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'split-word-wrapper';
                wordSpan.style.display = 'inline-block';
                wordSpan.style.overflow = 'hidden';
                wordSpan.style.verticalAlign = 'top';
                
                const innerSpan = document.createElement('span');
                innerSpan.className = 'split-word-inner';
                innerSpan.style.display = 'inline-block';
                innerSpan.textContent = word;
                
                wordSpan.appendChild(innerSpan);
                element.appendChild(wordSpan);
                
                // Add space between words
                if (index < words.length - 1) {
                    element.appendChild(document.createTextNode(' '));
                }
            });
        }

        // Select target elements
        const portfolioSection = document.querySelector('#portfolio');
        const headline = document.querySelector('#portfolio .section-headline');
        const subheadline = document.querySelector('#portfolio .section-subheadline');
        const filters = document.querySelector('#portfolio .portfolio-filters');
        const items = document.querySelectorAll('#portfolio .portfolio-item');

        // Apply splitting
        if (headline) splitTextToWords(headline);
        if (subheadline) splitTextToWords(subheadline);

        // Set initial visibility
        // We do this via JS to ensure they are visible if GSAP fails to load
        gsap.set([headline, subheadline, filters], { opacity: 1 });

        // Create Main Timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: portfolioSection,
                start: 'top 80%', 
                toggleActions: 'play none none none'
            },
            defaults: { ease: 'power3.out' }
        });

        // 1. Headline Animation
        if (headline) {
            const innerWords = headline.querySelectorAll('.split-word-inner');
            tl.from(innerWords, {
                y: '100%',
                duration: 1,
                stagger: 0.08,
                ease: 'expo.out'
            }, 0);
        }

        // 2. Subheadline Animation
        if (subheadline) {
            const innerWordsSub = subheadline.querySelectorAll('.split-word-inner');
            tl.from(innerWordsSub, {
                y: '100%',
                opacity: 0,
                duration: 0.8,
                stagger: 0.03
            }, 0.2);
        }

        // 3. Filters Animation
        if (filters) {
            tl.from(filters, {
                y: 30,
                opacity: 0,
                duration: 0.8
            }, 0.5);
        }

        // 4. Portfolio Items Animation
        if (items.length > 0) {
            tl.from(items, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out',
                clearProps: 'transform,opacity'
            }, 0.6);
        }
    } else {
        console.warn('GSAP or ScrollTrigger not loaded');
    }
});
