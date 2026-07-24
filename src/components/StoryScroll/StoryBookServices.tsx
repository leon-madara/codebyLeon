import { forwardRef, useCallback, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HTMLFlipBook from 'react-pageflip';
import closedCoverImage from '../../assets/services-storybook/research/closed-cover-straight-v1.png';
import closedCoverDarkImage from '../../assets/services-storybook/research/closed-cover-straight-dark-v1.png';
import openBookImage from '../../assets/services-storybook/research/open-book-blank-base-v2-no-moon.png';
import openBookDarkImage from '../../assets/services-storybook/research/open-book-blank-dark-v1.png';
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
  chooserDescription: string;
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
    chooserDescription:
      'Websites, landing pages, client portals, and custom digital workflows.',
    descriptor:
      'Every good business has a story worth discovering. Together, we give yours a digital home and a clear path through the door.',
    beats: [
      {
        title: 'Hidden in Plain Sight',
        description:
          'Your best work may already exist, but the right clients cannot always see its value.',
      },
      {
        title: 'Draw the Map',
        description:
          'We decide what visitors should discover, where they should go, and what should happen next.',
      },
      {
        title: 'Build the World',
        description:
          'Words, visuals, pages, and technology come together as one connected experience.',
      },
      {
        title: 'Turn the Key',
        description:
          'Your new digital home opens with everything prepared for launch and ownership.',
      },
    ],
    ctaLabel: 'Open your digital doors',
    ctaHref: '/get-started.html',
    theme: 'websites',
  },
  {
    id: 'brand-identity',
    number: '02',
    navigationLabel: 'Brand Identity & Refresh',
    title: 'Brand Identity & Digital Refresh',
    chooserDescription:
      'Brand direction, visual identity, messaging, and digital renewal.',
    descriptor:
      'Sometimes a business grows beyond the story its brand is telling. We help you keep what still feels true, rewrite what no longer fits, and step forward as the business you have become.',
    beats: [
      {
        title: 'Outgrow the Old Story',
        description:
          'Your business has moved forward, but its identity may still speak from an earlier chapter.',
      },
      {
        title: 'Find the Thread',
        description:
          'We uncover what should remain, what needs to change, and what your audience should understand more clearly.',
      },
      {
        title: 'Redraw the Character',
        description:
          'Voice, colour, typography, and visual details become one identity that feels recognisably yours.',
      },
      {
        title: 'Begin the Next Chapter',
        description:
          'The renewed direction is carried into your website and the places where customers meet your brand.',
      },
    ],
    ctaLabel: 'Begin your brand’s next chapter',
    ctaHref: '/get-started.html',
    theme: 'brand',
  },
  {
    id: 'ongoing-design',
    number: '03',
    navigationLabel: 'Ongoing Design Support',
    title: 'Ongoing Design Support',
    chooserDescription:
      'Recurring support for campaigns, website updates, and everyday creative work.',
    descriptor:
      'A growing business keeps writing new pages. We stay close to the story, helping every campaign, update, and new idea feel like it belongs to the same book.',
    beats: [
      {
        title: 'Keep Hold of the Thread',
        description:
          'We work from one shared understanding of your brand, its voice, and where it is going.',
      },
      {
        title: 'Plan the Pages Ahead',
        description:
          'Campaigns, website updates, and creative requests become a clear and manageable queue.',
      },
      {
        title: 'Write as You Grow',
        description:
          'New assets are created without having to explain your business again with every request.',
      },
      {
        title: 'Keep the Story Whole',
        description:
          'As the business changes, its public experience remains connected, familiar, and intentional.',
      },
    ],
    ctaLabel: 'Keep your story moving',
    ctaHref: '/get-started.html',
    theme: 'ongoing',
  },
];

const TOTAL_CHAPTERS = CHAPTERS.length;
const SUBCHAPTERS_PER_CHAPTER = 4;
export const TOTAL_STORY_PAGES = CHAPTERS.reduce(
  (total, chapter) => total + chapter.beats.length,
  0,
);
const OPENING_PROGRESS = 0.34;
const PROLOGUE_PROGRESS = 0.43;

type StoryPageIndex = number | null;
type PageTurnDirection = -1 | 1;

interface PageFlipController {
  destroy: () => void;
  flipNext: (corner?: 'top' | 'bottom') => void;
  flipPrev: (corner?: 'top' | 'bottom') => void;
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
  theme?: StoryChapter['theme'];
}

const ServiceBookPage = forwardRef<HTMLDivElement, ServiceBookPageProps>(
  ({ children, hidden, side, theme }, ref) => (
    <div
      ref={ref}
      className={`sb__flip-page sb__flip-page--${side}${theme ? ` sb__flip-page--${theme}` : ''}`}
      data-density="soft"
      aria-hidden={hidden}
    >
      <img
        src={openBookImage}
        alt=""
        className={`sb__flip-page-paper sb__flip-page-paper--${side} sb__theme-image sb__theme-image--light`}
        data-theme-asset="light"
        aria-hidden="true"
      />
      <img
        src={openBookDarkImage}
        alt=""
        className={`sb__flip-page-paper sb__flip-page-paper--${side} sb__theme-image sb__theme-image--dark`}
        data-theme-asset="dark"
        aria-hidden="true"
      />
      <div className="sb__flip-page-content">{children}</div>
    </div>
  ),
);
ServiceBookPage.displayName = 'ServiceBookPage';

function BookPageLogo() {
  return (
    <img
      src="/icons/main-logo.svg"
      alt=""
      className="sb__book-page-logo"
      aria-hidden="true"
    />
  );
}

function StorySpreadIntro({
  chapter,
  beat,
  storyPageIndex,
  subchapterIndex,
}: {
  chapter: StoryChapter;
  beat: StoryBeat;
  storyPageIndex: number;
  subchapterIndex: number;
}) {
  return (
    <article className="sb__page-copy sb__page-copy--intro">
      <BookPageLogo />
      <p className="sb__chapter-kicker">
        Chapter {chapter.number} · Story {(subchapterIndex + 1).toString().padStart(2, '0')} / 04
      </p>
      <h3 className="sb__chapter-title">{beat.title}</h3>
      <p className="sb__chapter-descriptor">{beat.description}</p>
      <p className="sb__chapter-note">
        <span>{chapter.title}</span>
        Story page {(storyPageIndex + 1).toString().padStart(2, '0')} / {TOTAL_STORY_PAGES}
      </p>
    </article>
  );
}

function StorySpreadDetails({
  chapter,
  subchapterIndex,
  interactive,
}: {
  chapter: StoryChapter;
  subchapterIndex: number;
  interactive: boolean;
}) {
  const isChapterEnding = subchapterIndex === chapter.beats.length - 1;
  const nextBeat = chapter.beats[subchapterIndex + 1];

  return (
    <article className="sb__page-copy sb__page-copy--details sb__story-details">
      <p className="sb__page-heading">{chapter.title}</p>
      <p className="sb__story-context">{chapter.descriptor}</p>
      <ol className="sb__story-route" aria-label={`${chapter.title} story pages`}>
        {chapter.beats.map((beat, index) => (
          <li
            key={beat.title}
            className={`sb__story-route-item${index === subchapterIndex ? ' sb__story-route-item--active' : ''}`}
            aria-current={index === subchapterIndex ? 'step' : undefined}
          >
            <span className="sb__story-route-number">
              {(index + 1).toString().padStart(2, '0')}
            </span>
            <span>{beat.title}</span>
          </li>
        ))}
      </ol>
      {isChapterEnding ? (
        <a
          href={chapter.ctaHref}
          className="sb__chapter-cta"
          tabIndex={interactive ? 0 : -1}
        >
          {chapter.ctaLabel}
          <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.8} />
        </a>
      ) : (
        <p className="sb__story-next">
          Next: <strong>{nextBeat.title}</strong>
        </p>
      )}
    </article>
  );
}

function PrologueIntro() {
  return (
    <article className="sb__page-copy sb__page-copy--intro">
      <BookPageLogo />
      <p className="sb__chapter-kicker">Our Services</p>
      <h3 className="sb__chapter-title">Choose the service you need</h3>
      <p className="sb__chapter-descriptor">
        Know what you need? Open the relevant chapter. Still deciding?
        Follow the complete journey and discover which service fits your business.
      </p>
    </article>
  );
}

function PrologueDetails({
  interactive,
  onSelect,
  onExplore,
}: {
  interactive: boolean;
  onSelect: (chapterIndex: number) => void;
  onExplore: () => void;
}) {
  return (
    <article className="sb__page-copy sb__page-copy--details sb__prologue">
      <p className="sb__page-heading">Services at a glance</p>
      <div className="sb__service-choices">
        {CHAPTERS.map((chapter, index) => (
          <button
            key={chapter.id}
            type="button"
            className={`sb__service-choice sb__service-choice--${chapter.theme}`}
            onClick={() => onSelect(index)}
            tabIndex={interactive ? 0 : -1}
          >
            <span className="sb__service-choice-number">{chapter.number}</span>
            <span className="sb__service-choice-copy">
              <strong>{chapter.title}</strong>
              <span>{chapter.chooserDescription}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="sb__read-button"
        onClick={onExplore}
        tabIndex={interactive ? 0 : -1}
      >
        Explore the full journey
      </button>
    </article>
  );
}

function getStoryOrder(index: StoryPageIndex) {
  return index === null ? -1 : index;
}

export function getStoryPageIndex(chapterIndex: number, subchapterIndex: number) {
  return chapterIndex * SUBCHAPTERS_PER_CHAPTER + subchapterIndex;
}

export function getChapterIndexForStoryPage(index: number) {
  return Math.min(
    TOTAL_CHAPTERS - 1,
    Math.floor(index / SUBCHAPTERS_PER_CHAPTER),
  );
}

export function getSubchapterIndexForStoryPage(index: number) {
  return index % SUBCHAPTERS_PER_CHAPTER;
}

export function getPageIndexForStoryPage(index: StoryPageIndex) {
  return index === null ? 0 : (index + 1) * 2;
}

export function getStoryPageForPageIndex(pageIndex: number): StoryPageIndex {
  if (pageIndex < 2) return null;

  return Math.min(TOTAL_STORY_PAGES - 1, Math.floor((pageIndex - 2) / 2));
}

export function getAdjacentStoryPage(
  index: StoryPageIndex,
  direction: PageTurnDirection,
): StoryPageIndex {
  const nextOrder = Math.min(
    TOTAL_STORY_PAGES - 1,
    Math.max(-1, getStoryOrder(index) + direction),
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
  const pendingStoryPageRef = useRef<StoryPageIndex | undefined>(undefined);
  const activeStoryPageRef = useRef<StoryPageIndex>(null);
  const isBookOpenRef = useRef(visualTestMode);
  const transitionToStoryPageRef = useRef<(
    index: StoryPageIndex,
    animate?: boolean,
  ) => void>(() => {});
  const [activeStoryPage, setActiveStoryPage] = useState<StoryPageIndex>(null);
  const [isBookOpen, setIsBookOpen] = useState(visualTestMode);

  const setStoryPage = useCallback((index: StoryPageIndex) => {
    activeStoryPageRef.current = index;
    setActiveStoryPage(index);
  }, []);

  const transitionToStoryPage = useCallback((
    index: StoryPageIndex,
    animate = true,
  ) => {
    if (
      index === activeStoryPageRef.current
      || index === pendingStoryPageRef.current
    ) return;

    const pageFlip = flipBookRef.current?.pageFlip();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (
      visualTestMode
      || prefersReducedMotion
      || window.innerWidth <= 768
      || !pageFlip
    ) {
      pendingStoryPageRef.current = undefined;
      setStoryPage(index);
      return;
    }

    const targetPage = getPageIndexForStoryPage(index);
    const currentOrder = getStoryOrder(activeStoryPageRef.current);
    const targetOrder = getStoryOrder(index);
    const isAdjacent = Math.abs(targetOrder - currentOrder) === 1;
    pendingStoryPageRef.current = index;

    if (animate && isAdjacent) {
      isTurningRef.current = true;
      if (targetOrder > currentOrder) {
        pageFlip.flipNext('bottom');
      } else {
        pageFlip.flipPrev('bottom');
      }
      return;
    }

    pageFlip.turnToPage(targetPage);
    pendingStoryPageRef.current = undefined;
    setStoryPage(index);
  }, [setStoryPage, visualTestMode]);

  transitionToStoryPageRef.current = transitionToStoryPage;

  const handleStoryPageSelect = useCallback((index: number) => {
    manualSelectionRef.current = !visualTestMode;
    if (visualTestMode) {
      setStoryPage(index);
      return;
    }

    transitionToStoryPageRef.current(index);
  }, [setStoryPage, visualTestMode]);

  const handleChapterSelect = useCallback((chapterIndex: number) => {
    handleStoryPageSelect(getStoryPageIndex(chapterIndex, 0));
  }, [handleStoryPageSelect]);

  const handleSubchapterSelect = useCallback((
    chapterIndex: number,
    subchapterIndex: number,
  ) => {
    handleStoryPageSelect(getStoryPageIndex(chapterIndex, subchapterIndex));
  }, [handleStoryPageSelect]);

  const handlePageStep = (direction: PageTurnDirection) => {
    if (isTurningRef.current) return;

    const target = getAdjacentStoryPage(activeStoryPageRef.current, direction);
    if (target === activeStoryPageRef.current) return;

    manualSelectionRef.current = !visualTestMode;

    if (visualTestMode) {
      setStoryPage(target);
      return;
    }

    transitionToStoryPageRef.current(target);
  };

  const handlePageFlip = useCallback((event: PageFlipEvent<number>) => {
    const storyPage = getStoryPageForPageIndex(event.data);
    pendingStoryPageRef.current = undefined;
    isTurningRef.current = false;
    setStoryPage(storyPage);
  }, [setStoryPage]);

  const handlePageFlipState = useCallback((event: PageFlipEvent<string>) => {
    const isFlipping = event.data === 'flipping';
    if (isFlipping && pendingStoryPageRef.current === undefined) {
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
              end: () => `+=${window.innerHeight * (desktop ? 9 : 7)}`,
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
                  transitionToStoryPageRef.current(null, false);
                  return;
                }

                const storyProgress = (self.progress - PROLOGUE_PROGRESS) / (1 - PROLOGUE_PROGRESS);
                const nextStoryPage = Math.min(
                  TOTAL_STORY_PAGES - 1,
                  Math.floor(storyProgress * TOTAL_STORY_PAGES),
                );
                transitionToStoryPageRef.current(nextStoryPage);
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

  const activeChapterIndex = activeStoryPage === null
    ? null
    : getChapterIndexForStoryPage(activeStoryPage);
  const activeSubchapterIndex = activeStoryPage === null
    ? null
    : getSubchapterIndexForStoryPage(activeStoryPage);
  const currentChapter = activeChapterIndex === null
    ? null
    : CHAPTERS[activeChapterIndex];
  const currentBeat = currentChapter && activeSubchapterIndex !== null
    ? currentChapter.beats[activeSubchapterIndex]
    : null;
  const spreadTheme = currentChapter?.theme ?? 'prologue';
  const previousStoryPage = activeStoryPage !== null && activeStoryPage > 0
    ? activeStoryPage - 1
    : null;
  const nextStoryPage = activeStoryPage === null
    ? 0
    : activeStoryPage < TOTAL_STORY_PAGES - 1
      ? activeStoryPage + 1
      : null;
  const previousStory = previousStoryPage === null
    ? null
    : CHAPTERS[getChapterIndexForStoryPage(previousStoryPage)]
      .beats[getSubchapterIndexForStoryPage(previousStoryPage)];
  const nextStory = nextStoryPage === null
    ? null
    : CHAPTERS[getChapterIndexForStoryPage(nextStoryPage)]
      .beats[getSubchapterIndexForStoryPage(nextStoryPage)];

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
              className="sb__cover-image sb__theme-image sb__theme-image--light"
              data-theme-asset="light"
            />
            <img
              src={closedCoverDarkImage}
              alt=""
              className="sb__cover-image sb__theme-image sb__theme-image--dark"
              data-theme-asset="dark"
              aria-hidden="true"
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
              className="sb__open-book-image sb__theme-image sb__theme-image--light"
              data-theme-asset="light"
              aria-hidden="true"
            />
            <img
              src={openBookDarkImage}
              alt=""
              className="sb__open-book-image sb__theme-image sb__theme-image--dark"
              data-theme-asset="dark"
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
                  <ServiceBookPage side="left" hidden={activeStoryPage !== null}>
                    <PrologueIntro />
                  </ServiceBookPage>
                  <ServiceBookPage side="right" hidden={activeStoryPage !== null}>
                    <PrologueDetails
                      interactive={isBookOpen && activeStoryPage === null}
                      onSelect={handleChapterSelect}
                      onExplore={() => handleStoryPageSelect(0)}
                    />
                  </ServiceBookPage>
                  {CHAPTERS.flatMap((chapter, chapterIndex) =>
                    chapter.beats.flatMap((beat, subchapterIndex) => {
                      const storyPageIndex = getStoryPageIndex(
                        chapterIndex,
                        subchapterIndex,
                      );

                      return [
                        <ServiceBookPage
                          key={`${chapter.id}-${subchapterIndex}-intro`}
                          side="left"
                          theme={chapter.theme}
                          hidden={activeStoryPage !== storyPageIndex}
                        >
                          <StorySpreadIntro
                            chapter={chapter}
                            beat={beat}
                            storyPageIndex={storyPageIndex}
                            subchapterIndex={subchapterIndex}
                          />
                        </ServiceBookPage>,
                        <ServiceBookPage
                          key={`${chapter.id}-${subchapterIndex}-details`}
                          side="right"
                          theme={chapter.theme}
                          hidden={activeStoryPage !== storyPageIndex}
                        >
                          <StorySpreadDetails
                            chapter={chapter}
                            subchapterIndex={subchapterIndex}
                            interactive={isBookOpen && activeStoryPage === storyPageIndex}
                          />
                        </ServiceBookPage>,
                      ];
                    }),
                  )}
                </ResponsiveFlipBook>
              </div>
            )}

            <div className="sb__static-spread" aria-live="polite">
              {currentChapter && currentBeat && activeSubchapterIndex !== null && activeStoryPage !== null ? (
                <>
                  <StorySpreadIntro
                    chapter={currentChapter}
                    beat={currentBeat}
                    storyPageIndex={activeStoryPage}
                    subchapterIndex={activeSubchapterIndex}
                  />
                  <StorySpreadDetails
                    chapter={currentChapter}
                    subchapterIndex={activeSubchapterIndex}
                    interactive={isBookOpen || visualTestMode}
                  />
                </>
              ) : (
                <>
                  <PrologueIntro />
                  <PrologueDetails
                    interactive={isBookOpen || visualTestMode}
                    onSelect={handleChapterSelect}
                    onExplore={() => handleStoryPageSelect(0)}
                  />
                </>
              )}
            </div>

            <nav className="sb__page-actions" aria-label="Turn service book pages">
              <button
                type="button"
                className="sb__page-step sb__page-step--backward"
                aria-label={activeStoryPage === null
                  ? 'You are at the services prologue'
                  : activeStoryPage === 0
                    ? 'Turn back to the services prologue'
                    : `Turn back to story page ${activeStoryPage.toString().padStart(2, '0')}: ${previousStory?.title ?? ''}`}
                disabled={activeStoryPage === null}
                tabIndex={isBookOpen || visualTestMode ? 0 : -1}
                onClick={() => handlePageStep(-1)}
              >
                Previous page
              </button>

              <button
                type="button"
                className="sb__page-step sb__page-step--forward"
                aria-label={activeStoryPage === TOTAL_STORY_PAGES - 1
                  ? 'You are on the final service story page'
                  : `Turn forward to story page ${((nextStoryPage ?? 0) + 1).toString().padStart(2, '0')}: ${nextStory?.title ?? ''}`}
                disabled={activeStoryPage === TOTAL_STORY_PAGES - 1}
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
          {CHAPTERS.map((chapter, chapterIndex) => {
            const isActiveChapter = activeChapterIndex === chapterIndex;

            return (
              <div
                key={chapter.id}
                className={`sb__chapter-nav sb__chapter-nav--${chapter.theme}`}
              >
                <button
                  type="button"
                  className={`sb__tab sb__tab--${chapter.theme} ${isActiveChapter ? 'sb__tab--active' : ''}`}
                  onClick={() => handleChapterSelect(chapterIndex)}
                  aria-current={isActiveChapter ? 'page' : undefined}
                  aria-label={`Open chapter ${chapter.number}: ${chapter.navigationLabel}`}
                  tabIndex={isBookOpen || visualTestMode ? 0 : -1}
                >
                  <span className="sb__tab-number">{chapter.number}</span>
                  <span className="sb__tab-label">{chapter.navigationLabel}</span>
                </button>

                {isActiveChapter && (
                  <div
                    className="sb__subtabs"
                    aria-label={`${chapter.title} subchapters`}
                  >
                    {chapter.beats.map((beat, subchapterIndex) => {
                      const storyPageIndex = getStoryPageIndex(
                        chapterIndex,
                        subchapterIndex,
                      );
                      const isActiveSubchapter = activeStoryPage === storyPageIndex;

                      return (
                        <button
                          key={beat.title}
                          type="button"
                          className={`sb__subtab${isActiveSubchapter ? ' sb__subtab--active' : ''}`}
                          onClick={() => handleSubchapterSelect(
                            chapterIndex,
                            subchapterIndex,
                          )}
                          aria-current={isActiveSubchapter ? 'page' : undefined}
                          aria-label={`Open story ${(subchapterIndex + 1).toString().padStart(2, '0')}: ${beat.title}`}
                          tabIndex={isBookOpen || visualTestMode ? 0 : -1}
                        >
                          <span className="sb__subtab-number">
                            {(subchapterIndex + 1).toString().padStart(2, '0')}
                          </span>
                          <span className="sb__subtab-label">{beat.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

export default StoryBookServices;
