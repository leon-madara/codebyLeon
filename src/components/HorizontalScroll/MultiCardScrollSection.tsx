import { useRef, useState, useEffect, useCallback } from 'react';
import type { ForwardRefExoticComponent, RefAttributes, CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';
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
const DESKTOP_BEAT_DWELL_RATIO = 0.18;
const MOBILE_BEAT_DWELL_RATIO = 0.08;
const DESKTOP_FINAL_BEAT_HOLD_RATIO = 0.22;
const MOBILE_FINAL_BEAT_HOLD_RATIO = 0.1;
const SNAP_DURATION = { min: 0.2, max: 0.55 } as const;

type BeatComponent = ForwardRefExoticComponent<RefAttributes<HTMLElement>>;

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
const createBeatRefMatrix = () => STORIES.map(() => Array<HTMLElement | null>(TOTAL_BEATS).fill(null));

const clampProgress = (value: number) => Math.min(1, Math.max(0, value));
const getTargetSectionTop = (section: HTMLElement) => section.getBoundingClientRect().top + window.scrollY;
const getNumericGsapValue = (value: string | number) =>
  typeof value === 'number' ? value : Number.parseFloat(value);

const MultiCardScrollSection = () => {
  const visualTestMode = isVisualTestMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const topChromeRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggersRef = useRef<(ScrollTrigger | null)[]>([]);
  const beatRefs = useRef<(HTMLElement | null)[][]>(createBeatRefMatrix());
  const contextRef = useRef<ReturnType<typeof gsap.context> | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [cardProgress, setCardProgress] = useState<number[]>(createProgressArray());
  const [currentBeats, setCurrentBeats] = useState<number[]>(createProgressArray());
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [topChromeHeight, setTopChromeHeight] = useState(168);
  const [navHeight, setNavHeight] = useState(72);
  const topChromeHeightRef = useRef(168);
  const navHeightRef = useRef(72);

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
      if (nextHeight > 0) {
        topChromeHeightRef.current = nextHeight;
        setTopChromeHeight(nextHeight);
      }
    };

    updateTopChromeHeight();

    const resizeObserver = new ResizeObserver(updateTopChromeHeight);
    resizeObserver.observe(element);
    window.addEventListener('resize', updateTopChromeHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateTopChromeHeight);
    };
    // Intentionally no activeCard dep — observer only needs to register once on mount.
    // topChromeHeightRef stays in sync for useLayoutEffect to read without re-triggering it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const navElement = document.querySelector<HTMLElement>('.navigation');
    if (!navElement) return;

    const updateNavHeight = () => {
      const nextHeight = navElement.offsetHeight;
      if (nextHeight > 0) {
        navHeightRef.current = nextHeight;
        setNavHeight(nextHeight);
      }
    };

    updateNavHeight();

    const resizeObserver = new ResizeObserver(updateNavHeight);
    resizeObserver.observe(navElement);
    window.addEventListener('resize', updateNavHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

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

  useGSAP(() => {
    if (!isReady || visualTestMode) return;

    // Defer creation by one frame so ScrollSmoother (created in App.tsx
    // via useGSAP) has already initialised and called normalizeScroll.
    // Without this, the ScrollTrigger start/end positions are calculated
    // against the raw viewport, then ScrollSmoother re-maps the scroll
    // coordinates — making the first-visit pin positions wrong and
    // causing the snap to send the user back to the top.
    const rafId = requestAnimationFrame(() => {
      // Revert previous context to prevent any lingering duplicate ScrollTriggers
      if (contextRef.current) {
        contextRef.current.revert();
      }

      contextRef.current = gsap.context(() => {
        const container = containerRef.current;
        const topChrome = topChromeRef.current;

        STORIES.forEach((_, storyIndex) => {
          const section = sectionRefs.current[storyIndex];
          const track = trackRefs.current[storyIndex];
          const beats = beatRefs.current[storyIndex].filter(
            (beat): beat is HTMLElement => Boolean(beat)
          );

          if (!section || !track || beats.length !== TOTAL_BEATS) return;

          const getStepDistance = () => {
            const firstBeat = beats[0];
            const rect = firstBeat.getBoundingClientRect();
            return isDesktop ? rect.width : rect.height;
          };

          const beatDwellRatio = isDesktop ? DESKTOP_BEAT_DWELL_RATIO : MOBILE_BEAT_DWELL_RATIO;
          const finalBeatHoldRatio = isDesktop
            ? DESKTOP_FINAL_BEAT_HOLD_RATIO
            : MOBILE_FINAL_BEAT_HOLD_RATIO;

          let stepDistance = 0;
          let baseDistance = 0;
          let totalDistance = 0;
          let snapPoints = [0];

          const recalculateDistances = () => {
            stepDistance = getStepDistance();
            baseDistance = stepDistance * (TOTAL_BEATS - 1);
            totalDistance =
              baseDistance +
              stepDistance * ((TOTAL_BEATS - 1) * beatDwellRatio + finalBeatHoldRatio);

            const totalTimelineDuration =
              (TOTAL_BEATS - 1) * (1 + beatDwellRatio) + finalBeatHoldRatio;

            const beatSnapPoints = Array.from({ length: TOTAL_BEATS }, (_, beatIndex) => {
              if (totalTimelineDuration <= 0) return 0;
              return (beatIndex * (1 + beatDwellRatio)) / totalTimelineDuration;
            });

            snapPoints = [...beatSnapPoints, 1];
          };
          recalculateDistances();

          gsap.set(track, { x: 0, y: 0 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              pinSpacing: true,
              start: isDesktop ? `top top+=${topChromeHeightRef.current}` : 'top top',
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
                snapTo: (value: number) => {
                  let closest = snapPoints[0] ?? value;
                  let smallestDistance = Math.abs(value - closest);

                  for (let index = 1; index < snapPoints.length; index += 1) {
                    const point = snapPoints[index];
                    const distance = Math.abs(value - point);
                    if (distance < smallestDistance) {
                      smallestDistance = distance;
                      closest = point;
                    }
                  }

                  return closest;
                },
                duration: SNAP_DURATION,
                delay: 0.03,
                ease: 'power2.out',
              },
              onEnter: () => setActiveCard(storyIndex),
              onEnterBack: () => setActiveCard(storyIndex),
              onUpdate: () => {
                const trackOffset = getNumericGsapValue(
                  gsap.getProperty(track, isDesktop ? 'x' : 'y') as string | number
                );
                const travelledDistance = Number.isFinite(trackOffset)
                  ? Math.min(baseDistance, Math.abs(trackOffset))
                  : 0;
                const mappedProgress = baseDistance > 0
                  ? clampProgress(travelledDistance / baseDistance)
                  : 0;
                updateStoryProgress(storyIndex, mappedProgress);
              },
            },
          });

          for (let beatIndex = 0; beatIndex < TOTAL_BEATS - 1; beatIndex += 1) {
            timeline.to({}, { duration: beatDwellRatio });

            if (isDesktop) {
              timeline.to(track, {
                x: () => -(beatIndex + 1) * stepDistance,
                ease: 'none',
                duration: 1,
              });
            } else {
              timeline.to(track, {
                y: () => -(beatIndex + 1) * stepDistance,
                ease: 'none',
                duration: 1,
              });
            }
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

        if (isDesktop && container && topChrome) {
          ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: () => {
              const storyTriggers = scrollTriggersRef.current.filter(
                (t): t is ScrollTrigger => Boolean(t)
              );

              if (!storyTriggers.length) {
                return container.scrollHeight - topChrome.getBoundingClientRect().height;
              }

              return storyTriggers.reduce(
                (maxEnd, trigger) => Math.max(maxEnd, trigger.end ?? maxEnd),
                0
              );
            },
            pin: topChrome,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
        }

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setShowSidebar(true),
          onLeave: () => setShowSidebar(false),
          onEnterBack: () => setShowSidebar(true),
          onLeaveBack: () => setShowSidebar(false),
        });

        // Force a refresh after all triggers are created so positions
        // are calculated with ScrollSmoother's normalizeScroll active.
        ScrollTrigger.refresh();
      }, containerRef);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (contextRef.current) {
        contextRef.current.revert();
        contextRef.current = null;
      }
      scrollTriggersRef.current = [];
    };
  }, { dependencies: [isDesktop, isReady, updateStoryProgress, visualTestMode], scope: containerRef });

  const rootStyle = {
    '--hs-top-chrome-height': `${topChromeHeight}px`,
    '--hs-nav-height': `${navHeight}px`,
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
                  ref={(el: HTMLElement | null) => {
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
