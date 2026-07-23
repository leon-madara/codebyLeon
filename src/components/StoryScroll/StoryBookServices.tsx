import { forwardRef, useCallback, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HTMLFlipBook from 'react-pageflip';
import closedCoverImage from '../../assets/services-storybook/research/closed-cover-straight-v1.png';
import openBookImage from '../../assets/services-storybook/research/open-book-blank-base-v1.png';
import { isVisualTestMode } from '../../utils/runtimeFlags';

gsap.registerPlugin(ScrollTrigger);

const ResponsiveFlipBook = HTMLFlipBook as unknown as React.ComponentType<
  Omit<React.ComponentProps<typeof HTMLFlipBook>, 'style'> & {
    style?: React.CSSProperties;
  }
>;

interface StoryBeat {
  title: string;
  description: string;
}

export interface StoryChapter {
  id: string;
  number: string;
  navigationLabel: string;
  title: string;
  descriptor: string;
  beats: StoryBeat[];
  ctaLabel: string;
  ctaHref: string;
  theme: 'websites' | 'brand' | 'ongoing';
}

const CHAPTERS: StoryChapter[] = [
  {
    id: 'websites-and-systems',
    number: '01',
    navigationLabel: 'Websites & Systems',
    title: 'Website Design & Digital Systems',
    descriptor: 'Websites, landing pages, client portals, and custom web workflows.',
    beats: [
      {
        title: 'Visibility & Credibility',
        description: 'Make the value of your work easier for potential clients to see and trust.',
      },
      {
        title: 'Strategy & Structure',
        description: 'Organise the message, user path, content, and technical requirements.',
      },
      {
        title: 'Design & Development',
        description: 'Turn the approved direction into a responsive website or digital system.',
      },
      {
        title: 'Launch & Next Steps',
        description: 'Prepare the finished experience for launch, handover, and what comes next.',
      },
    ],
    ctaLabel: 'Build your digital presence',
    ctaHref: '/get-started.html',
    theme: 'websites',
  },
  {
    id: 'brand-identity',
    number: '02',
    navigationLabel: 'Brand Identity',
    title: 'Brand Identity & Digital Refresh',
    descriptor: 'Visual identity, messaging direction, and website or brand renewal.',
    beats: [
      {
        title: 'What No Longer Fits',
        description: 'Identify where the current identity no longer reflects the business.',
      },
      {
        title: 'Brand Direction',
        description: 'Decide what should remain, what needs to change, and what must be clearer.',
      },
      {
        title: 'Identity System',
        description: 'Create a coherent visual and verbal system for everyday brand use.',
      },
      {
        title: 'Digital Refresh',
        description: 'Carry the refreshed direction into the website and key customer touchpoints.',
      },
    ],
    ctaLabel: 'Refresh your brand',
    ctaHref: '/get-started.html',
    theme: 'brand',
  },
  {
    id: 'ongoing-design',
    number: '03',
    navigationLabel: 'Ongoing Design',
    title: 'Ongoing Design Support',
    descriptor: 'Recurring campaign, website, and everyday creative support.',
    beats: [
      {
        title: 'A Shared Direction',
        description: 'Keep recurring work aligned to one established visual and messaging system.',
      },
      {
        title: 'Planned Priorities',
        description: 'Shape upcoming campaigns, site updates, and creative needs into a clear queue.',
      },
      {
        title: 'Consistent Production',
        description: 'Produce connected assets without re-explaining the brand from the beginning.',
      },
      {
        title: 'Continuity',
        description: 'Keep the public experience coherent as the business and its needs evolve.',
      },
    ],
    ctaLabel: 'Plan ongoing support',
    ctaHref: '/get-started.html',
    theme: 'ongoing',
  },
];

const TOTAL_CHAPTERS = CHAPTERS.length;
const OPENING_PROGRESS = 0.34;
const PROLOGUE_PROGRESS = 0.43;

type ChapterIndex = number | null;
type PageTurnDirection = -1 | 1;

interface PageFlipController {
  destroy: () => void;
  flip: (page: number, corner?: 'top' | 'bottom') => void;
  getCurrentPageIndex: () => number;
  turnToPage: (page: number) => void;
}

interface FlipBookHandle {
  pageFlip: () => PageFlipController;
}

interface PageFlipEvent<T> {
  data: T;
}

interface ServiceBookPageProps {
  children: React.ReactNode;
  hidden: boolean;
  side: 'left' | 'right';
}

const ServiceBookPage = forwardRef<HTMLDivElement, ServiceBookPageProps>(
  ({ children, hidden, side }, ref) => (
    <div
      ref={ref}
      className={`sb__flip-page sb__flip-page--${side}`}
      data-density="soft"
      aria-hidden={hidden}
    >
      <img
        src={openBookImage}
        alt=""
        className={`sb__flip-page-paper sb__flip-page-paper--${side}`}
        aria-hidden="true"
      />
      <div className="sb__flip-page-content">{children}</div>
    </div>
  ),
);
ServiceBookPage.displayName = 'ServiceBookPage';

function ChapterIntro({ chapter }: { chapter: StoryChapter }) {
  return (
    <article className="sb__page-copy sb__page-copy--intro">
      <p className="sb__chapter-kicker">
        Chapter {chapter.number} / {TOTAL_CHAPTERS.toString().padStart(2, '0')}
      </p>
      <h3 className="sb__chapter-title">{chapter.title}</h3>
      <p className="sb__chapter-descriptor">{chapter.descriptor}</p>
      <p className="sb__chapter-note">
        A clear path from what is holding the business back to what we can build next.
      </p>
    </article>
  );
}

function ChapterDetails({
  chapter,
  interactive,
}: {
  chapter: StoryChapter;
  interactive: boolean;
}) {
  return (
    <article className="sb__page-copy sb__page-copy--details">
      <p className="sb__page-heading">Inside this chapter</p>
      <ol className="sb__beats">
        {chapter.beats.map((beat, index) => (
          <li key={beat.title} className="sb__beat">
            <span className="sb__beat-number">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span>
              <strong>{beat.title}</strong>
              <span>{beat.description}</span>
            </span>
          </li>
        ))}
      </ol>
      <a
        href={chapter.ctaHref}
        className="sb__chapter-cta"
        tabIndex={interactive ? 0 : -1}
      >
        {chapter.ctaLabel}
        <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
      </a>
    </article>
  );
}

function PrologueIntro() {
  return (
    <article className="sb__page-copy sb__page-copy--intro">
      <p className="sb__chapter-kicker">Our Services</p>
      <h3 className="sb__chapter-title">What does your business need next?</h3>
      <p className="sb__chapter-descriptor">
        Build a stronger online presence, refresh a brand that no longer fits,
        or keep everyday creative work moving.
      </p>
    </article>
  );
}

function PrologueDetails({
  interactive,
  onSelect,
}: {
  interactive: boolean;
  onSelect: () => void;
}) {
  return (
    <article className="sb__page-copy sb__page-copy--details sb__prologue">
      <p className="sb__page-heading">Choose a chapter</p>
      <p className="sb__prologue-copy">
        Select a bookmark now, or continue scrolling to read the full book in order.
      </p>
      <button
        type="button"
        className="sb__read-button"
        onClick={onSelect}
        tabIndex={interactive ? 0 : -1}
      >
        Read the first chapter
      </button>
    </article>
  );
}

function getSpreadOrder(index: ChapterIndex) {
  return index === null ? -1 : index;
}

export function getPageIndexForChapter(index: ChapterIndex) {
  return index === null ? 0 : (index + 1) * 2;
}

export function getChapterForPageIndex(pageIndex: number): ChapterIndex {
  if (pageIndex < 2) return null;

  return Math.min(TOTAL_CHAPTERS - 1, Math.floor(pageIndex / 2) - 1);
}

export function getAdjacentChapter(
  index: ChapterIndex,
  direction: PageTurnDirection,
): ChapterIndex {
  const nextOrder = Math.min(
    TOTAL_CHAPTERS - 1,
    Math.max(-1, getSpreadOrder(index) + direction),
  );

  return nextOrder === -1 ? null : nextOrder;
}

export function getCoverOpeningTransform(desktop: boolean) {
  return {
    rotationY: desktop ? -112 : 0,
    rotationX: desktop ? 0 : -96,
    xPercent: 0,
    yPercent: desktop ? 0 : -14,
    autoAlpha: 0,
    duration: 1,
    ease: 'none',
    transformOrigin: desktop ? 'center center' : 'center top',
  };
}

export function StoryBookServices() {
  const visualTestMode = isVisualTestMode();
  const sectionRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const flipBookRef = useRef<FlipBookHandle | null>(null);
  const storyTriggerRef = useRef<ScrollTrigger | null>(null);
  const manualSelectionRef = useRef(false);
  const isTurningRef = useRef(false);
  const pendingChapterRef = useRef<ChapterIndex | undefined>(undefined);
  const activeChapterRef = useRef<ChapterIndex>(null);
  const isBookOpenRef = useRef(visualTestMode);
  const transitionToChapterRef = useRef<(
    index: ChapterIndex,
    animate?: boolean,
  ) => void>(() => {});
  const [activeChapter, setActiveChapter] = useState<ChapterIndex>(null);
  const [isBookOpen, setIsBookOpen] = useState(visualTestMode);

  const setChapter = useCallback((index: ChapterIndex) => {
    activeChapterRef.current = index;
    setActiveChapter(index);
  }, []);

  const transitionToChapter = useCallback((
    index: ChapterIndex,
    animate = true,
  ) => {
    if (
      index === activeChapterRef.current
      || index === pendingChapterRef.current
    ) return;

    const pageFlip = flipBookRef.current?.pageFlip();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      visualTestMode
      || prefersReducedMotion
      || window.innerWidth <= 768
      || !pageFlip
    ) {
      pendingChapterRef.current = undefined;
      setChapter(index);
      return;
    }

    const targetPage = getPageIndexForChapter(index);
    pendingChapterRef.current = index;

    if (animate) {
      isTurningRef.current = true;
      pageFlip.flip(targetPage, 'bottom');
      return;
    }

    pageFlip.turnToPage(targetPage);
    pendingChapterRef.current = undefined;
    setChapter(index);
  }, [setChapter, visualTestMode]);

  transitionToChapterRef.current = transitionToChapter;

  const handleChapterSelect = useCallback((index: number) => {
    manualSelectionRef.current = !visualTestMode;
    if (visualTestMode) {
      setChapter(index);
      return;
    }

    transitionToChapterRef.current(index);
  }, [setChapter, visualTestMode]);

  const handlePageStep = (direction: PageTurnDirection) => {
    if (isTurningRef.current) return;

    const target = getAdjacentChapter(activeChapterRef.current, direction);
    if (target === activeChapterRef.current) return;

    manualSelectionRef.current = !visualTestMode;

    if (visualTestMode) {
      setChapter(target);
      return;
    }

    transitionToChapterRef.current(target);
  };

  const handlePageFlip = useCallback((event: PageFlipEvent<number>) => {
    const chapter = getChapterForPageIndex(event.data);
    pendingChapterRef.current = undefined;
    isTurningRef.current = false;
    setChapter(chapter);
  }, [setChapter]);

  const handlePageFlipState = useCallback((event: PageFlipEvent<string>) => {
    const isFlipping = event.data === 'flipping';
    if (isFlipping && pendingChapterRef.current === undefined) {
      manualSelectionRef.current = true;
    }
    isTurningRef.current = isFlipping;
  }, []);

  useGSAP(() => {
    if (visualTestMode || !sectionRef.current || !coverRef.current || !spreadRef.current) return;

    const section = sectionRef.current;
    const cover = coverRef.current;
    const spread = spreadRef.current;
    let animationContext: gsap.Context | null = null;
    const releaseManualSelection = () => {
      manualSelectionRef.current = false;
    };

    window.addEventListener('wheel', releaseManualSelection, { passive: true });
    window.addEventListener('touchmove', releaseManualSelection, { passive: true });
    window.addEventListener('keydown', releaseManualSelection);

    const rafId = requestAnimationFrame(() => {
      animationContext = gsap.context(() => {
        const media = gsap.matchMedia();

        media.add({
          desktop: '(min-width: 769px)',
          mobile: '(max-width: 768px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        }, (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean;
            mobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(cover, { autoAlpha: 0 });
            gsap.set(spread, { autoAlpha: 1, scale: 1 });
            isBookOpenRef.current = true;
            setIsBookOpen(true);
            return;
          }

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top+=80',
              end: () => `+=${window.innerHeight * (desktop ? 5 : 4)}`,
              pin: true,
              pinSpacing: true,
              scrub: desktop ? 0.5 : 0.25,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (manualSelectionRef.current) return;

                const bookIsOpen = self.progress >= OPENING_PROGRESS * 0.78;
                if (bookIsOpen !== isBookOpenRef.current) {
                  isBookOpenRef.current = bookIsOpen;
                  setIsBookOpen(bookIsOpen);
                }

                if (self.progress < PROLOGUE_PROGRESS) {
                  transitionToChapterRef.current(null, false);
                  return;
                }

                const chapterProgress = (self.progress - PROLOGUE_PROGRESS) / (1 - PROLOGUE_PROGRESS);
                const nextChapter = Math.min(
                  TOTAL_CHAPTERS - 1,
                  Math.floor(chapterProgress * TOTAL_CHAPTERS),
                );
                transitionToChapterRef.current(nextChapter);
              },
            },
          });
          storyTriggerRef.current = timeline.scrollTrigger ?? null;

          timeline
            .to(cover, getCoverOpeningTransform(desktop))
            .fromTo(spread, {
              autoAlpha: 0,
              scale: 0.94,
              transformOrigin: 'center center',
            }, {
              autoAlpha: 1,
              scale: 1,
              duration: 0.58,
              ease: 'none',
              transformOrigin: 'center center',
            }, 0.24)
            .to({}, { duration: 2 });
        });

        ScrollTrigger.refresh();
      }, section);
    });

    return () => {
      cancelAnimationFrame(rafId);
      storyTriggerRef.current = null;
      manualSelectionRef.current = false;
      window.removeEventListener('wheel', releaseManualSelection);
      window.removeEventListener('touchmove', releaseManualSelection);
      window.removeEventListener('keydown', releaseManualSelection);
      animationContext?.revert();
    };
  }, { scope: sectionRef, dependencies: [visualTestMode] });

  const currentChapter = activeChapter === null ? null : CHAPTERS[activeChapter];
  const spreadTheme = currentChapter?.theme ?? 'prologue';

  return (
    <section
      ref={sectionRef}
      id="services"
      className={`sb ${isBookOpen || visualTestMode ? 'sb--open' : ''} ${visualTestMode ? 'sb--static' : ''}`}
      aria-labelledby="services-storybook-title"
    >
      <h2 id="services-storybook-title" className="sr-only">CodeByLeon services storybook</h2>

      <div className="sb__experience">
        <div className="sb__book-stage">
          <div
            ref={coverRef}
            className="sb__cover-state"
            aria-hidden={isBookOpen}
          >
            <img
              src={closedCoverImage}
              alt="Closed black leather CodeByLeon services storybook"
              className="sb__cover-image"
            />
            <p className="sb__cover-prompt">Scroll to open</p>
          </div>

          <div
            ref={spreadRef}
            className={`sb__open-state sb__open-state--${spreadTheme}`}
            aria-hidden={!isBookOpen && !visualTestMode}
          >
            <img
              src={openBookImage}
              alt=""
              className="sb__open-book-image"
              aria-hidden="true"
            />

            {!visualTestMode && (
              <div className="sb__flipbook-shell">
                <ResponsiveFlipBook
                  ref={flipBookRef}
                  className="sb__flipbook"
                  width={520}
                  height={694}
                  size="stretch"
                  minWidth={260}
                  maxWidth={760}
                  minHeight={347}
                  maxHeight={1015}
                  startPage={0}
                  drawShadow
                  flippingTime={820}
                  usePortrait={false}
                  startZIndex={10}
                  autoSize={false}
                  maxShadowOpacity={0.28}
                  showCover={false}
                  mobileScrollSupport
                  clickEventForward
                  useMouseEvents
                  swipeDistance={30}
                  showPageCorners
                  disableFlipByClick={false}
                  renderOnlyPageLengthChange={false}
                  onFlip={handlePageFlip}
                  onChangeState={handlePageFlipState}
                >
                  <ServiceBookPage side="left" hidden={activeChapter !== null}>
                    <PrologueIntro />
                  </ServiceBookPage>
                  <ServiceBookPage side="right" hidden={activeChapter !== null}>
                    <PrologueDetails
                      interactive={isBookOpen && activeChapter === null}
                      onSelect={() => handleChapterSelect(0)}
                    />
                  </ServiceBookPage>
                  {CHAPTERS.flatMap((chapter, index) => [
                    <ServiceBookPage
                      key={`${chapter.id}-intro`}
                      side="left"
                      hidden={activeChapter !== index}
                    >
                      <ChapterIntro chapter={chapter} />
                    </ServiceBookPage>,
                    <ServiceBookPage
                      key={`${chapter.id}-details`}
                      side="right"
                      hidden={activeChapter !== index}
                    >
                      <ChapterDetails
                        chapter={chapter}
                        interactive={isBookOpen && activeChapter === index}
                      />
                    </ServiceBookPage>,
                  ])}
                </ResponsiveFlipBook>
              </div>
            )}

            <div className="sb__static-spread" aria-live="polite">
              {currentChapter ? (
                <>
                  <ChapterIntro chapter={currentChapter} />
                  <ChapterDetails
                    chapter={currentChapter}
                    interactive={isBookOpen || visualTestMode}
                  />
                </>
              ) : (
                <>
                  <PrologueIntro />
                  <PrologueDetails
                    interactive={isBookOpen || visualTestMode}
                    onSelect={() => handleChapterSelect(0)}
                  />
                </>
              )}
            </div>

            <nav className="sb__page-actions" aria-label="Turn service book pages">
              <button
                type="button"
                className="sb__page-step sb__page-step--backward"
                aria-label={activeChapter === null
                  ? 'You are at the services prologue'
                  : activeChapter === 0
                    ? 'Turn back to the services prologue'
                    : `Turn back to chapter ${CHAPTERS[activeChapter - 1].number}: ${CHAPTERS[activeChapter - 1].navigationLabel}`}
                disabled={activeChapter === null}
                tabIndex={isBookOpen || visualTestMode ? 0 : -1}
                onClick={() => handlePageStep(-1)}
              >
                Previous page
              </button>

              <button
                type="button"
                className="sb__page-step sb__page-step--forward"
                aria-label={activeChapter === TOTAL_CHAPTERS - 1
                  ? 'You are on the final service chapter'
                  : `Turn forward to chapter ${CHAPTERS[getSpreadOrder(activeChapter) + 1].number}: ${CHAPTERS[getSpreadOrder(activeChapter) + 1].navigationLabel}`}
                disabled={activeChapter === TOTAL_CHAPTERS - 1}
                tabIndex={isBookOpen || visualTestMode ? 0 : -1}
                onClick={() => handlePageStep(1)}
              >
                Next page
              </button>
            </nav>
          </div>
        </div>

        <nav
          className="sb__tabs"
          aria-label="Service chapter navigation"
          aria-hidden={!isBookOpen && !visualTestMode}
        >
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              className={`sb__tab sb__tab--${chapter.theme} ${activeChapter === index ? 'sb__tab--active' : ''}`}
              onClick={() => handleChapterSelect(index)}
              aria-current={activeChapter === index ? 'page' : undefined}
              aria-label={`Open chapter ${chapter.number}: ${chapter.navigationLabel}`}
              tabIndex={isBookOpen || visualTestMode ? 0 : -1}
            >
              <span className="sb__tab-number">{chapter.number}</span>
              <span className="sb__tab-label">{chapter.navigationLabel}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default StoryBookServices;
