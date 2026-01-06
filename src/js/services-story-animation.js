/* =============================================
   SERVICES STORY CARD ANIMATION
   Using GSAP & ScrollTrigger
   Horizontal scrollable narrative journey
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Register ScrollTrigger plugin
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Select services section and story card elements
        const servicesSection = document.querySelector('#services');
        const storyCard = document.querySelector('.story-card[data-story-card="launch-10-days"]');
        if (!storyCard || !servicesSection) {
            return;
        }

        const storyBeatsContainer = storyCard.querySelector('.story-beats-container');
        const storyBeats = storyCard.querySelectorAll('.story-beat');
        const progressMarkers = storyCard.querySelectorAll('.progress-marker');
        const progressLines = storyCard.querySelectorAll('.progress-line');
        const progressFill = storyCard.querySelector('[data-progress-fill]');
        const progressText = storyCard.querySelector('[data-progress-text]');
        const scrollHint = storyCard.querySelector('.scroll-hint');

        if (!storyBeatsContainer || storyBeats.length === 0) {
            return;
        }

        // Check if mobile (vertical layout)
        const isMobile = window.matchMedia('(max-width: 900px)').matches;

        // Store horizontalScroll in scope for beat animations
        let horizontalScroll;

        if (isMobile) {
            // Mobile: Vertical scroll animations
            initMobileAnimations();
        } else {
            // Desktop: Horizontal scroll animations
            const beatWidth = storyBeatsContainer.offsetWidth;
            const totalBeats = storyBeats.length;
            const totalScrollDistance = (totalBeats - 1) * beatWidth;

            // Main horizontal scroll timeline
            horizontalScroll = gsap.timeline({
                scrollTrigger: {
                    trigger: servicesSection,
                    start: 'top top',
                    end: () => `+=${totalScrollDistance}`,
                    pin: servicesSection,
                    scrub: 1,
                    snap: {
                        snapTo: (progress) => {
                            // Find closest snap point
                            const snapProgress = progress * (totalBeats - 1);
                            const snapIndex = Math.round(snapProgress);
                            return snapIndex / (totalBeats - 1);
                        },
                        duration: { min: 0.2, max: 0.6 },
                        delay: 0.1,
                        inertia: false
                    },
                    onUpdate: (self) => {
                        updateProgressIndicators(self.progress);
                        updateColorSaturation(self.progress);
                        updateProgressBar(self.progress);
                        updateProgressText(self.progress);
                    }
                }
            });

            // Animate horizontal scroll
            horizontalScroll.to(storyBeatsContainer, {
                x: -totalScrollDistance,
                ease: 'none',
                duration: 1
            });

            // Initialize beat animations
            initBeatAnimations(horizontalScroll);

            // Hide scroll hint after first interaction
            let hasScrolled = false;
            storyBeatsContainer.addEventListener('scroll', () => {
                if (!hasScrolled && scrollHint) {
                    hasScrolled = true;
                    gsap.to(scrollHint, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            if (scrollHint) scrollHint.style.display = 'none';
                        }
                    });
                }
            }, { once: true });
        }

        /**
         * Mobile: Vertical scroll animations
         */
        function initMobileAnimations() {
            // Create ScrollTrigger for each beat
            storyBeats.forEach((beat, index) => {
                const beatContent = beat.querySelector('.story-beat-content');
                const beatElements = beatContent.querySelectorAll('.beat-icon, .beat-icon-step, .beat-headline, .beat-subheadline, .beat-body, .timeline-item, .mockup-preview, .mockup-icon');

                // Animate beat entrance
                gsap.timeline({
                    scrollTrigger: {
                        trigger: beat,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                })
                .from(beatElements, {
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                });

                // Update progress indicators
                ScrollTrigger.create({
                    trigger: beat,
                    start: 'top 60%',
                    onEnter: () => {
                        updateActiveMarker(index + 1);
                        updateProgressText(index + 1, storyBeats.length);
                    },
                    onEnterBack: () => {
                        updateActiveMarker(index + 1);
                        updateProgressText(index + 1, storyBeats.length);
                    }
                });
            });

            // Update color saturation on scroll
            ScrollTrigger.create({
                trigger: storyCard,
                start: 'top 80%',
                end: 'bottom 20%',
                onUpdate: (self) => {
                    updateColorSaturation(self.progress);
                }
            });
        }

        /**
         * Initialize beat-specific animations
         */
        function initBeatAnimations(horizontalScrollTimeline) {
            storyBeats.forEach((beat, index) => {
                const beatNumber = index + 1;
                const beatContent = beat.querySelector('.story-beat-content');

                // Beat 1: Problem
                if (beatNumber === 1) {
                    const icon = beatContent.querySelector('.beat-icon');
                    const headline = beatContent.querySelector('.beat-headline');
                    const body = beatContent.querySelector('.beat-body');

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: beat,
                            start: 'left 80%',
                            end: 'left 20%',
                            scrub: 1,
                            containerAnimation: horizontalScrollTimeline
                        }
                    })
                    .to(icon, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0)
                    .to(headline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.2)
                    .to(body, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.4)
                    .to(icon, {
                        scale: 1.1,
                        duration: 0.3,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power1.inOut'
                    }, 0.8);
                }

                // Beat 2: Turning Point
                if (beatNumber === 2) {
                    const icons = beatContent.querySelectorAll('.beat-icon-step');
                    const headline = beatContent.querySelector('.beat-headline');
                    const subheadline = beatContent.querySelector('.beat-subheadline');
                    const body = beatContent.querySelector('.beat-body');

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: beat,
                            start: 'left 80%',
                            end: 'left 20%',
                            scrub: 1,
                            containerAnimation: horizontalScrollTimeline
                        }
                    })
                    .to(icons, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.4,
                        stagger: 0.15,
                        ease: 'back.out(1.7)'
                    }, 0)
                    .to(headline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.3)
                    .to(subheadline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    }, 0.5)
                    .to(body, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.6);
                }

                // Beat 3: Build
                if (beatNumber === 3) {
                    const timelineItems = beatContent.querySelectorAll('.timeline-item');
                    const headline = beatContent.querySelector('.beat-headline');
                    const subheadline = beatContent.querySelector('.beat-subheadline');
                    const body = beatContent.querySelector('.beat-body');

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: beat,
                            start: 'left 80%',
                            end: 'left 20%',
                            scrub: 1,
                            containerAnimation: horizontalScrollTimeline
                        }
                    })
                    .to(timelineItems, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.2,
                        ease: 'power2.out'
                    }, 0)
                    .to(headline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.4)
                    .to(subheadline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    }, 0.6)
                    .to(body, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.7);
                }

                // Beat 4: Launch
                if (beatNumber === 4) {
                    const mockupPreview = beatContent.querySelector('.mockup-preview');
                    const mockupIcons = beatContent.querySelectorAll('.mockup-icon');
                    const headline = beatContent.querySelector('.beat-headline');
                    const subheadline = beatContent.querySelector('.beat-subheadline');
                    const body = beatContent.querySelector('.beat-body');

                    gsap.timeline({
                        scrollTrigger: {
                            trigger: beat,
                            start: 'left 80%',
                            end: 'left 20%',
                            scrub: 1,
                            containerAnimation: horizontalScrollTimeline
                        }
                    })
                    .to(mockupPreview, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: 'back.out(1.2)'
                    }, 0)
                    .to(mockupIcons, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.15,
                        ease: 'back.out(1.7)'
                    }, 0.4)
                    .to(headline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.5)
                    .to(subheadline, {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: 'power2.out'
                    }, 0.7)
                    .to(body, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: 'power2.out'
                    }, 0.8)
                    // Removed box-shadow animation - no card styling
                }
            });
        }

        /**
         * Update progress indicators based on scroll progress
         */
        function updateProgressIndicators(progress) {
            const totalBeats = storyBeats.length;
            const currentBeatIndex = Math.min(
                Math.floor(progress * totalBeats),
                totalBeats - 1
            );
            const currentBeat = currentBeatIndex + 1;

            // Update active marker
            updateActiveMarker(currentBeat);

            // Update completed markers
            progressMarkers.forEach((marker, index) => {
                const markerNumber = parseInt(marker.getAttribute('data-marker'));
                if (markerNumber < currentBeat) {
                    marker.setAttribute('data-completed', 'true');
                    marker.setAttribute('data-active', 'false');
                } else if (markerNumber === currentBeat) {
                    marker.setAttribute('data-active', 'true');
                    marker.removeAttribute('data-completed');
                } else {
                    marker.setAttribute('data-active', 'false');
                    marker.removeAttribute('data-completed');
                }
            });

            // Update progress lines
            progressLines.forEach((line, index) => {
                const lineProgress = Math.max(0, Math.min(1, (progress * totalBeats) - index));
                if (lineProgress > 0 && lineProgress <= 1) {
                    line.style.setProperty('--line-progress', `${lineProgress * 100}%`);
                } else if (lineProgress <= 0) {
                    line.style.setProperty('--line-progress', '0%');
                }
            });
        }

        /**
         * Update active marker
         */
        function updateActiveMarker(beatNumber) {
            progressMarkers.forEach((marker) => {
                const markerNumber = parseInt(marker.getAttribute('data-marker'));
                if (markerNumber === beatNumber) {
                    marker.setAttribute('data-active', 'true');
                } else if (markerNumber < beatNumber) {
                    marker.setAttribute('data-completed', 'true');
                    marker.setAttribute('data-active', 'false');
                } else {
                    marker.setAttribute('data-active', 'false');
                    marker.removeAttribute('data-completed');
                }
            });
        }

        /**
         * Update color saturation based on scroll progress
         */
        function updateColorSaturation(progress) {
            // Map progress (0-1) to saturation (0.3-1.0)
            const saturation = 0.3 + (progress * 0.7);
            
            storyBeats.forEach((beat, index) => {
                const beatProgress = (progress * storyBeats.length) - index;
                const beatSaturation = Math.max(0.3, Math.min(1.0, 0.3 + (beatProgress * 0.7)));
                
                const beatBg = beat.querySelector('.story-beat-bg');
                if (beatBg) {
                    gsap.to(beatBg, {
                        '--beat-saturation': beatSaturation,
                        duration: 0.5,
                        ease: 'power1.out'
                    });
                }
            });
        }

        /**
         * Update progress bar fill (Beat 3)
         */
        function updateProgressBar(progress) {
            if (!progressFill) return;

            // Calculate progress for beat 3 (between 0.5 and 0.75 of total progress)
            const beat3Start = 2 / storyBeats.length; // 0.5 for 4 beats
            const beat3End = 3 / storyBeats.length;   // 0.75 for 4 beats
            
            if (progress >= beat3Start && progress <= beat3End) {
                const beat3Progress = (progress - beat3Start) / (beat3End - beat3Start);
                gsap.to(progressFill, {
                    width: `${beat3Progress * 100}%`,
                    duration: 0.3,
                    ease: 'power1.out'
                });
            } else if (progress > beat3End) {
                gsap.to(progressFill, {
                    width: '100%',
                    duration: 0.3,
                    ease: 'power1.out'
                });
            }
        }

        /**
         * Update progress text
         */
        function updateProgressText(progressOrBeat, totalBeats = null) {
            if (!progressText) return;

            let currentBeat;
            if (typeof progressOrBeat === 'number' && progressOrBeat < 1) {
                // progress is 0-1
                currentBeat = Math.min(
                    Math.floor(progressOrBeat * storyBeats.length) + 1,
                    storyBeats.length
                );
            } else {
                // beat number provided
                currentBeat = progressOrBeat;
            }

            const total = totalBeats || storyBeats.length;
            progressText.textContent = `Step ${currentBeat} of ${total}`;
        }


    } else {
        console.warn('GSAP or ScrollTrigger not loaded');
    }
});
