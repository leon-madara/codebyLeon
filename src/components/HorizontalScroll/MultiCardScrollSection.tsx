import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceTabs from './ServiceTabs';
import WaveDivider from './WaveDivider';

// Card 1 beats
import { Card1ProblemBeat, Card1PlanBeat, Card1BuildBeat, Card1LaunchBeat } from './beats/card1';
// Card 2 beats
import { Card2OutdatedBeat, Card2StrategyBeat, Card2ProcessBeat, Card2TransformationBeat } from './beats/card2';
// Card 3 beats
import { Card3BottlenecksBeat, Card3ModelBeat, Card3WorkflowBeat, Card3SuccessBeat } from './beats/card3';

import ProgressIndicator from './ProgressIndicator';
import Sidebar from './Sidebar';
import ScrollHint from './ScrollHint';

gsap.registerPlugin(ScrollTrigger);

const CARDS_CONFIG = [
  {
    id: 'launch',
    title: 'Launch',
    theme: 'forest' as const,
    labels: ['Problem', 'Plan', 'Build', 'Launch'],
    waveColor: 'hsl(195, 70%, 20%)',
  },
  {
    id: 'brand-refresh',
    title: 'Brand Refresh',
    theme: 'cyan' as const,
    labels: ['Outdated', 'Strategy', 'Process', 'Transformation'],
    waveColor: 'hsl(160, 65%, 18%)',
  },
  {
    id: 'ongoing-support',
    title: 'Ongoing Support',
    theme: 'emerald' as const,
    labels: ['Bottlenecks', 'Model', 'Workflow', 'Success'],
    waveColor: 'hsl(var(--background))',
  },
];

const MultiCardScrollSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const beatsContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Beat refs - separate arrays for each card
  const card1BeatRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const card2BeatRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const card3BeatRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  
  const [activeCard, setActiveCard] = useState(0);
  const [cardProgress, setCardProgress] = useState([0, 0, 0]);
  const [currentBeats, setCurrentBeats] = useState([0, 0, 0]);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const TOTAL_BEATS = 4;

  const getBeatRefs = (cardIndex: number) => {
    switch (cardIndex) {
      case 0: return card1BeatRefs.current;
      case 1: return card2BeatRefs.current;
      case 2: return card3BeatRefs.current;
      default: return [];
    }
  };

  // Check for mobile
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 900);
  }, []);

  useEffect(() => {
    checkMobile();
    setIsReady(true);
    
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkMobile();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [checkMobile]);

  // Hide scroll hint on first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showScrollHint) setShowScrollHint(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollHint]);

  // Scroll to card on tab click
  const handleCardClick = (index: number) => {
    const cardSection = cardSectionRefs.current[index];
    if (cardSection) {
      cardSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // GSAP ScrollTrigger setup
  useLayoutEffect(() => {
    if (!isReady || isMobile) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        CARDS_CONFIG.forEach((_, cardIndex) => {
          const section = cardSectionRefs.current[cardIndex];
          const beatsContainer = beatsContainerRefs.current[cardIndex];
          const beatRefsArray = getBeatRefs(cardIndex);

          if (!section || !beatsContainer) return;

          const scrollDistance = (TOTAL_BEATS - 1) * window.innerWidth;

          // Main horizontal scroll animation
          const mainTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              pinSpacing: true,
              start: 'top top',
              end: `+=${scrollDistance}`,
              scrub: 1,
              anticipatePin: 1,
              snap: {
                snapTo: 1 / (TOTAL_BEATS - 1),
                duration: { min: 0.2, max: 0.6 },
                delay: 0,
                ease: 'power1.inOut',
              },
              onEnter: () => setActiveCard(cardIndex),
              onEnterBack: () => setActiveCard(cardIndex),
              onUpdate: (self) => {
                const progressValue = self.progress;
                setCardProgress(prev => {
                  const newProgress = [...prev];
                  newProgress[cardIndex] = progressValue;
                  return newProgress;
                });
                const beatIndex = Math.round(progressValue * (TOTAL_BEATS - 1));
                setCurrentBeats(prev => {
                  const newBeats = [...prev];
                  newBeats[cardIndex] = beatIndex;
                  return newBeats;
                });
              },
            },
          });

          mainTl.to(beatsContainer, {
            x: -scrollDistance,
            ease: 'none',
          });

          // Beat-specific animations
          beatRefsArray.forEach((beat) => {
            if (!beat) return;

            const elements = {
              icon: beat.querySelector('.beat-icon'),
              title: beat.querySelector('.beat-title'),
              subtitle: beat.querySelector('.beat-subtitle'),
              description: beat.querySelector('.beat-description'),
              content: beat.querySelector('.beat-content'),
            };

            const beatTl = gsap.timeline({
              scrollTrigger: {
                trigger: beat,
                containerAnimation: mainTl,
                start: 'left center',
                end: 'right center',
                scrub: 1,
              },
            });

            if (elements.icon) {
              beatTl.fromTo(elements.icon, 
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.3 },
                0
              );
            }

            if (elements.title) {
              beatTl.fromTo(elements.title,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3 },
                0.1
              );
            }

            if (elements.subtitle) {
              beatTl.fromTo(elements.subtitle,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3 },
                0.2
              );
            }

            if (elements.description) {
              beatTl.fromTo(elements.description,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3 },
                0.3
              );
            }

            if (elements.content) {
              beatTl.fromTo(elements.content,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4 },
                0.4
              );
            }
          });
        });
      }, containerRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady, isMobile]);

  // Mobile: Simple fade-in animations
  useLayoutEffect(() => {
    if (!isReady || !isMobile) return;

    const ctx = gsap.context(() => {
      [card1BeatRefs, card2BeatRefs, card3BeatRefs].forEach(refs => {
        refs.current.forEach((beat) => {
          if (!beat) return;

          gsap.fromTo(beat,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: beat,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
              },
            }
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isReady, isMobile]);

  return (
    <div ref={containerRef} className="relative">
      {/* Service tabs navigation */}
      <ServiceTabs 
        cards={CARDS_CONFIG}
        activeCard={activeCard}
        onCardClick={handleCardClick}
      />

      {/* Spacer for sticky tabs */}
      <div className="h-14" />

      {/* Card 1 - Launch */}
      <section
        ref={(el: HTMLDivElement | null) => { cardSectionRefs.current[0] = el; }}
        className="relative"
        id="service-launch"
        data-story-card="launch"
      >
        <div className="sticky top-14 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 py-4">
          <ProgressIndicator 
            currentBeat={currentBeats[0]}
            totalBeats={TOTAL_BEATS}
            progress={cardProgress[0]}
            labels={CARDS_CONFIG[0].labels}
          />
        </div>

        <div className="relative overflow-hidden">
          <div 
            ref={(el: HTMLDivElement | null) => { beatsContainerRefs.current[0] = el; }}
            className={`flex ${isMobile ? 'flex-col' : 'flex-row'} will-change-transform`}
          >
            <Card1ProblemBeat ref={(el: HTMLDivElement | null) => { card1BeatRefs.current[0] = el; }} />
            <Card1PlanBeat ref={(el: HTMLDivElement | null) => { card1BeatRefs.current[1] = el; }} />
            <Card1BuildBeat ref={(el: HTMLDivElement | null) => { card1BeatRefs.current[2] = el; }} />
            <Card1LaunchBeat ref={(el: HTMLDivElement | null) => { card1BeatRefs.current[3] = el; }} />
          </div>
        </div>

        {isMobile && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 z-50">
            <div className="text-center text-sm text-muted-foreground">
              Launch • Step {currentBeats[0] + 1} of {TOTAL_BEATS}
            </div>
          </div>
        )}

        <ScrollHint visible={showScrollHint && !isMobile} />
        <WaveDivider position="bottom" color={CARDS_CONFIG[0].waveColor} />
      </section>

      {/* Card 2 - Brand Refresh */}
      <section
        ref={(el: HTMLDivElement | null) => { cardSectionRefs.current[1] = el; }}
        className="relative"
        id="service-brand-refresh"
        data-story-card="brand-refresh"
      >
        <WaveDivider position="top" color={CARDS_CONFIG[0].waveColor} />
        
        <div className="sticky top-14 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 py-4">
          <ProgressIndicator 
            currentBeat={currentBeats[1]}
            totalBeats={TOTAL_BEATS}
            progress={cardProgress[1]}
            labels={CARDS_CONFIG[1].labels}
          />
        </div>

        <div className="relative overflow-hidden">
          <div 
            ref={(el: HTMLDivElement | null) => { beatsContainerRefs.current[1] = el; }}
            className={`flex ${isMobile ? 'flex-col' : 'flex-row'} will-change-transform`}
          >
            <Card2OutdatedBeat ref={(el: HTMLDivElement | null) => { card2BeatRefs.current[0] = el; }} />
            <Card2StrategyBeat ref={(el: HTMLDivElement | null) => { card2BeatRefs.current[1] = el; }} />
            <Card2ProcessBeat ref={(el: HTMLDivElement | null) => { card2BeatRefs.current[2] = el; }} />
            <Card2TransformationBeat ref={(el: HTMLDivElement | null) => { card2BeatRefs.current[3] = el; }} />
          </div>
        </div>

        {isMobile && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 z-50">
            <div className="text-center text-sm text-muted-foreground">
              Brand Refresh • Step {currentBeats[1] + 1} of {TOTAL_BEATS}
            </div>
          </div>
        )}

        <WaveDivider position="bottom" color={CARDS_CONFIG[1].waveColor} />
      </section>

      {/* Card 3 - Ongoing Support */}
      <section
        ref={(el: HTMLDivElement | null) => { cardSectionRefs.current[2] = el; }}
        className="relative"
        id="service-ongoing-support"
        data-story-card="ongoing-support"
      >
        <WaveDivider position="top" color={CARDS_CONFIG[1].waveColor} />
        
        <div className="sticky top-14 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 py-4">
          <ProgressIndicator 
            currentBeat={currentBeats[2]}
            totalBeats={TOTAL_BEATS}
            progress={cardProgress[2]}
            labels={CARDS_CONFIG[2].labels}
          />
        </div>

        <div className="relative overflow-hidden">
          <div 
            ref={(el: HTMLDivElement | null) => { beatsContainerRefs.current[2] = el; }}
            className={`flex ${isMobile ? 'flex-col' : 'flex-row'} will-change-transform`}
          >
            <Card3BottlenecksBeat ref={(el: HTMLDivElement | null) => { card3BeatRefs.current[0] = el; }} />
            <Card3ModelBeat ref={(el: HTMLDivElement | null) => { card3BeatRefs.current[1] = el; }} />
            <Card3WorkflowBeat ref={(el: HTMLDivElement | null) => { card3BeatRefs.current[2] = el; }} />
            <Card3SuccessBeat ref={(el: HTMLDivElement | null) => { card3BeatRefs.current[3] = el; }} />
          </div>
        </div>

        {isMobile && (
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t border-border/50 z-50">
            <div className="text-center text-sm text-muted-foreground">
              Ongoing Support • Step {currentBeats[2] + 1} of {TOTAL_BEATS}
            </div>
          </div>
        )}

        <WaveDivider position="bottom" color={CARDS_CONFIG[2].waveColor} />
      </section>

      {/* Single shared Sidebar for all cards */}
      {!isMobile && <Sidebar currentStep={currentBeats[activeCard]} totalSteps={TOTAL_BEATS} />}
    </div>
  );
};

export default MultiCardScrollSection;
