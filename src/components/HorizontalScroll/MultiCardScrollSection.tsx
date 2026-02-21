import { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import type { ForwardRefExoticComponent, RefAttributes, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import ServiceTabs from './ServiceTabs';
import WaveDivider from './WaveDivider';

import { Card1ProblemBeat, Card1PlanBeat, Card1BuildBeat, Card1LaunchBeat } from './beats/card1';
import { Card2OutdatedBeat, Card2StrategyBeat, Card2ProcessBeat, Card2TransformationBeat } from './beats/card2';
import { Card3BottlenecksBeat, Card3ModelBeat, Card3WorkflowBeat, Card3SuccessBeat } from './beats/card3';

import ProgressIndicator from './ProgressIndicator';
import Sidebar from './Sidebar';
import ScrollHint from './ScrollHint';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_BREAKPOINT = 1024;
const TOTAL_BEATS = 4;
const FINAL_BEAT_SCROLL_MULTIPLIER = 1.2;

type BeatComponent = ForwardRefExoticComponent<RefAttributes<HTMLDivElement>>;

interface StoryConfig {
  id: string;
  title: string;
  labels: string[];
  waveColor: string;
  beats: BeatComponent[];
}

const STORIES: StoryConfig[] = [
  {
    id: 'launch',
    title: 'Launch',
    labels: ['Problem', 'Plan', 'Build', 'Launch'],
    waveColor: 'hsl(195, 70%, 20%)',
    beats: [Card1ProblemBeat, Card1PlanBeat, Card1BuildBeat, Card1LaunchBeat],
  },
  {
    id: 'brand-refresh',
    title: 'Brand Refresh',
    labels: ['Outdated', 'Strategy', 'Process', 'Transformation'],
    waveColor: 'hsl(160, 65%, 18%)',
    beats: [Card2OutdatedBeat, Card2StrategyBeat, Card2ProcessBeat, Card2TransformationBeat],
  },
  {
    id: 'ongoing-support',
    title: 'Ongoing Support',
    labels: ['Bottlenecks', 'Model', 'Workflow', 'Success'],
    waveColor: 'hsl(var(--background))',
    beats: [Card3BottlenecksBeat, Card3ModelBeat, Card3WorkflowBeat, Card3SuccessBeat],
  },
];

const createProgressArray = () => STORIES.map(() => 0);
const createBeatRefMatrix = () => STORIES.map(() => Array<HTMLDivElement | null>(TOTAL_BEATS).fill(null));

const clampProgress = (value: number) => Math.min(1, Math.max(0, value));
const getTargetSectionTop = (section: HTMLElement) => section.getBoundingClientRect().top + window.scrollY;

const MultiCardScrollSection = () => {
  const visualTestMode = isVisualTestMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const topChromeRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggersRef = useRef<(ScrollTrigger | null)[]>([]);
  const beatRefs = useRef<(HTMLDivElement | null)[][]>(createBeatRefMatrix());

  const [isDesktop, setIsDesktop] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [cardProgress, setCardProgress] = useState<number[]>(createProgressArray());
  const [currentBeats, setCurrentBeats] = useState<number[]>(createProgressArray());
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [topChromeHeight, setTopChromeHeight] = useState(168);
  const [sidebarHeight, setSidebarHeight] = useState(0);

  const syncViewportMode = useCallback(() => {
    setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
  }, []);

  useEffect(() => {
    syncViewportMode();
    setIsReady(true);
    if (visualTestMode) return;

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        syncViewportMode();
        ScrollTrigger.refresh();
      }, 180);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [syncViewportMode, visualTestMode]);

  useEffect(() => {
    if (!showScrollHint || !isDesktop || visualTestMode) return;

    const handleScroll = () => setShowScrollHint(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showScrollHint, isDesktop, visualTestMode]);

  useEffect(() => {
    const element = topChromeRef.current;
    if (!element) return;

    const updateTopChromeHeight = () => {
      const nextHeight = Math.ceil(element.getBoundingClientRect().height);
      if (nextHeight > 0) setTopChromeHeight(nextHeight);
    };

    updateTopChromeHeight();

    const resizeObserver = new ResizeObserver(updateTopChromeHeight);
    resizeObserver.observe(element);
    window.addEventListener('resize', updateTopChromeHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateTopChromeHeight);
    };
  }, [activeCard]);

  useEffect(() => {
    const element = sidebarRef.current;
    if (!element) {
      setSidebarHeight(0);
      return;
    }

    const updateSidebarHeight = () => {
      if (!isDesktop || !showSidebar) {
        setSidebarHeight(0);
        return;
      }
      const nextHeight = Math.ceil(element.getBoundingClientRect().height);
      setSidebarHeight(nextHeight > 0 ? nextHeight : 0);
    };

    updateSidebarHeight();

    const resizeObserver = new ResizeObserver(updateSidebarHeight);
    resizeObserver.observe(element);
    window.addEventListener('resize', updateSidebarHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSidebarHeight);
    };
  }, [isDesktop, showSidebar, activeCard]);

  const updateStoryProgress = useCallback((storyIndex: number, progressValue: number) => {
    const clamped = clampProgress(progressValue);

    setCardProgress((prev) => {
      if (Math.abs(prev[storyIndex] - clamped) < 0.001) return prev;
      const next = [...prev];
      next[storyIndex] = clamped;
      return next;
    });

    const normalized = clamped * TOTAL_BEATS;
    const beatIndex = Math.min(TOTAL_BEATS - 1, Math.floor(normalized));

    setCurrentBeats((prev) => {
      if (prev[storyIndex] === beatIndex) return prev;
      const next = [...prev];
      next[storyIndex] = beatIndex;
      return next;
    });
  }, []);

  const handleCardClick = useCallback((index: number) => {
    const trigger = scrollTriggersRef.current[index];
    const section = sectionRefs.current[index];
    const targetScroll = trigger?.start ?? (section ? getTargetSectionTop(section) : null);
    if (targetScroll === null) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(targetScroll, !prefersReducedMotion);
      return;
    }

    window.scrollTo({
      top: targetScroll,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, []);

  useLayoutEffect(() => {
    if (!isReady || visualTestMode) return;

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const topChrome = topChromeRef.current;

      // Under ScrollSmoother, CSS sticky can desync from transformed scroll containers.
      // Pin the top chrome with ScrollTrigger for deterministic behavior on desktop.
      if (isDesktop && container && topChrome) {
        ScrollTrigger.create({
          trigger: container,
          start: 'top top',
          end: () => `bottom top+=${Math.ceil(topChrome.getBoundingClientRect().height)}`,
          pin: topChrome,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      STORIES.forEach((_, storyIndex) => {
        const section = sectionRefs.current[storyIndex];
        const track = trackRefs.current[storyIndex];
        const beats = beatRefs.current[storyIndex].filter(
          (beat): beat is HTMLDivElement => Boolean(beat)
        );

        if (!section || !track || beats.length !== TOTAL_BEATS) return;

        const getStepDistance = () => {
          const firstBeat = beats[0];
          const rect = firstBeat.getBoundingClientRect();
          return isDesktop ? rect.width : rect.height;
        };

        let baseDistance = 0;
        let totalDistance = 0;
        const recalculateDistances = () => {
          const stepDistance = getStepDistance();
          baseDistance = stepDistance * (TOTAL_BEATS - 1);
          totalDistance = baseDistance + stepDistance * (FINAL_BEAT_SCROLL_MULTIPLIER - 1);
        };
        recalculateDistances();

        const finalBeatHoldRatio = Math.max(
          0,
          TOTAL_BEATS > 1 ? (FINAL_BEAT_SCROLL_MULTIPLIER - 1) / (TOTAL_BEATS - 1) : 0
        );

        gsap.set(track, { x: 0, y: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            pin: true,
            pinSpacing: true,
            start: 'top top',
            end: () => {
              recalculateDistances();
              return `+=${totalDistance}`;
            },
            scrub: 0.35,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: recalculateDistances,
            onRefresh: recalculateDistances,
            snap: {
              snapTo: (value: number) => Math.round(value * (TOTAL_BEATS - 1)) / (TOTAL_BEATS - 1),
              duration: { min: 0.15, max: 0.45 },
              delay: 0.05,
              ease: 'power2.out',
            },
            onEnter: () => setActiveCard(storyIndex),
            onEnterBack: () => setActiveCard(storyIndex),
            onUpdate: (self) => {
              const scrolledDistance = self.scroll() - self.start;
              const mappedProgress = baseDistance > 0 ? clampProgress(scrolledDistance / baseDistance) : 0;
              updateStoryProgress(storyIndex, mappedProgress);
            },
          },
        });

        if (isDesktop) {
          timeline.to(track, {
            x: () => -baseDistance,
            ease: 'none',
            duration: 1,
          });
        } else {
          timeline.to(track, {
            y: () => -baseDistance,
            ease: 'none',
            duration: 1,
          });
        }

        timeline.to({}, { duration: finalBeatHoldRatio });

        scrollTriggersRef.current[storyIndex] = timeline.scrollTrigger ?? null;

        beats.forEach((beat, beatIndex) => {
          const revealNodes = beat.querySelectorAll<HTMLElement>('.hs-beat-reveal');
          if (!revealNodes.length) return;

          if (beatIndex === 0) {
            gsap.set(revealNodes, { opacity: 1, y: 0 });
            return;
          }

          gsap.set(revealNodes, { opacity: 0, y: 18 });

          gsap.timeline({
            scrollTrigger: {
              trigger: beat,
              containerAnimation: timeline,
              start: isDesktop ? 'left 72%' : 'top 72%',
              toggleActions: 'play none none none',
            },
          }).to(revealNodes, {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.4,
            ease: 'power2.out',
          });
        });
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setShowSidebar(true),
        onLeave: () => setShowSidebar(false),
        onEnterBack: () => setShowSidebar(true),
        onLeaveBack: () => setShowSidebar(false),
      });
    }, containerRef);

    return () => {
      scrollTriggersRef.current = [];
      ctx.revert();
    };
  }, [isDesktop, isReady, updateStoryProgress, visualTestMode]);

  const rootStyle = {
    '--hs-top-chrome-height': `${topChromeHeight}px`,
    '--hs-sidebar-height': `${sidebarHeight}px`,
  } as CSSProperties;

  return (
    <div id="services" ref={containerRef} className="hs" style={rootStyle}>
      <div ref={topChromeRef} className="hs__top-chrome">
        <ServiceTabs cards={STORIES} activeCard={activeCard} onCardClick={handleCardClick} />
        <ProgressIndicator
          className="hs__progress"
          currentBeat={currentBeats[activeCard]}
          totalBeats={TOTAL_BEATS}
          progress={cardProgress[activeCard]}
          labels={STORIES[activeCard].labels}
        />
        {!isDesktop && (
          <div className="hs__mobile-step">
            <span className="hs__mobile-step-title">{STORIES[activeCard].title}</span>
            <span>
              Step {currentBeats[activeCard] + 1} of {TOTAL_BEATS}
            </span>
          </div>
        )}
      </div>

      {STORIES.map((story, storyIndex) => (
        <section
          key={story.id}
          ref={(el) => {
            sectionRefs.current[storyIndex] = el;
          }}
          className={`hs__story ${isDesktop ? 'hs__story--horizontal' : 'hs__story--vertical'}`.trim()}
          id={`service-${story.id}`}
          data-story-card={story.id}
        >
          <div className="hs__viewport">
            <div
              ref={(el) => {
                trackRefs.current[storyIndex] = el;
              }}
              className={`hs__track ${isDesktop ? 'hs__track--horizontal' : 'hs__track--vertical'}`.trim()}
            >
              {story.beats.map((BeatComponent, beatIndex) => (
                <BeatComponent
                  key={`${story.id}-beat-${beatIndex}`}
                  ref={(el: HTMLDivElement | null) => {
                    beatRefs.current[storyIndex][beatIndex] = el;
                  }}
                />
              ))}
            </div>
          </div>

          {storyIndex === 0 && <ScrollHint visible={showScrollHint && isDesktop} />}
          <WaveDivider position="bottom" color={story.waveColor} />
        </section>
      ))}

      {isDesktop && (
        <Sidebar
          ref={sidebarRef}
          currentStep={currentBeats[activeCard]}
          totalSteps={TOTAL_BEATS}
          visible={showSidebar}
        />
      )}
    </div>
  );
};

export default MultiCardScrollSection;
