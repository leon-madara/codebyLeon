# Services Storybook Implementation Plan

## Goal

Replace the placeholder storybook presentation on `feature/storybook-services` with a layered, interactive services book based on the selected references:

- a straight-on black leather closed cover,
- a wide open-book spread,
- three accessible chapter tabs on the right,
- a pinned cover-opening sequence,
- scroll and click-driven chapter changes with a visible page turn,
- StPageFlip-powered bottom-corner curls with forward and reverse page turns.

## Source Visuals

- Closed cover: `src/assets/services-storybook/research/closed-cover-straight-v1.png`
- Open book: `src/assets/services-storybook/research/open-book-blank-base-v2-no-moon.png`
- Layout reference: the supplied Viberole open-book screenshot

Viberole is a composition and interaction reference only. CodeByLeon keeps its own leather, copper, slate-blue, type, copy, and service architecture.

## Files in Scope

- `src/components/StoryScroll/StoryBookServices.tsx`
  - Chapter data, accessible controls, active state, cover/open spread layers, and GSAP behavior.
- `src/styles/features/storybook-services.css`
  - The component's existing owned style surface.
- `src/components/StoryScroll/StoryBookServices.test.tsx`
  - Navigation target, chapter controls, content, and asset-state regressions.
- `src/assets/services-storybook/research/`
  - Versioned generated cover and open-book assets.
- `docs/SERVICES_STORYBOOK_IMPLEMENTATION_HANDOFF.md`
  - Final validation and follow-up record.
- `design-qa.md`
  - Visual comparison evidence required by the image-to-code workflow.

## Explicitly Out of Scope

- Global navigation behavior.
- Homepage section ordering.
- Global design tokens.
- The old `HorizontalScroll` implementation retained for rollback.
- Configurator implementation or service-pricing logic.
- Other homepage animations.

## Interaction Model

1. Enter the pinned section with the closed book visible.
2. Scroll through the opening range to rotate/fade the cover away and reveal the open spread.
3. Use the prologue to select a known service or begin the complete guided journey.
4. Continue scrolling to advance through twelve story spreads across the three service chapters.
5. Select any chapter tab or nested story marker to open it directly; the selection remains in place until scrolling resumes.
6. Use `react-pageflip`/StPageFlip for the page surface, corner preview, shadow, and click-driven turn.
7. Hovering the bottom-right or bottom-left page corner previews the available turn; clicking completes it from that corner.
8. Keep GSAP responsible only for the pinned section, cover opening, and scroll-to-story synchronization.
9. Keep the StPageFlip spine centered inside the open-book image so the page sheet never drifts away from the book midpoint.
10. With reduced motion, skip 3D transforms and expose the open book and chapter controls directly.

## Approved 12-Page Chapter Architecture

The chooser supports two equally visible paths:

1. Visitors who know what they need select one clearly named service chapter.
2. Visitors who are still deciding select **Explore the full journey** and read all
   12 story spreads in order.

The cover and prologue chooser are not part of the 12-page story count.

### Chapter 01 — Website Design & Digital Systems

1. Hidden in Plain Sight
2. Draw the Map
3. Build the World
4. Turn the Key

### Chapter 02 — Brand Identity & Digital Refresh

5. Outgrow the Old Story
6. Find the Thread
7. Redraw the Character
8. Begin the Next Chapter

### Chapter 03 — Ongoing Design Support

9. Keep Hold of the Thread
10. Plan the Pages Ahead
11. Write as You Grow
12. Keep the Story Whole

Each reader-facing story page is one complete open-book spread backed by two
StPageFlip leaf elements. The StPageFlip book therefore contains 26 leaves:
two prologue leaves plus 24 story leaves. Text and controls remain live HTML.

## Approved Navigation Hierarchy

- Three persistent chapter bookmarks use explicit service names.
- Selecting a chapter opens its first subchapter.
- The active chapter reveals four smaller numbered sub-markers.
- A sub-marker jumps directly to its matching story spread.
- Page turns, scroll progress, chapter bookmarks, and sub-markers share one
  active-story-page state.
- Direct non-adjacent jumps use an immediate StPageFlip page change; adjacent
  turns retain the animated corner flip.

## Approved Visual Hierarchy

- Prologue title: **Choose the service you need**.
- Prologue supporting copy explains direct selection and the guided journey.
- Story spread order: logo, page/chapter marker, story title, story subtitle,
  chapter context, then the next step or chapter CTA.
- Chapter paper tones remain deliberately subtle:
  warm parchment for websites, cool mist for brand identity, and soft
  terracotta parchment for ongoing support.
- Paper texture and corrected 1.50:1 page geometry remain unchanged.

## Responsive Rules

- Desktop: landscape spread with left-page narrative, right-page service content, and vertical tabs outside the right edge.
- Tablet: retain the spread while reducing type and tab width.
- Mobile: portrait reading layout with a compact horizontal chapter selector and non-3D state changes.

## Risks and Mitigations

- ScrollSmoother measurement drift:
  initialize StoryScroll triggers after the parent smoother and refresh after asset layout.
- Reset-to-top regression:
  do not use ScrollTrigger snapping in this section.
- Competing scroll and click updates:
  update the active chapter through one guarded state path and ignore duplicate requests while StPageFlip reports its `flipping` state.
- Generated image crop drift:
  keep the full book chassis on the fixed stage, but register the StPageFlip plane to the narrower top leaf. The approved desktop plane uses a 1.50:1 spread ratio, sits inside the visible page stack, and rounds only the two outer leaf corners. Mobile intentionally crops to a single readable page.
- Accessibility:
  use buttons, `aria-current`, visible focus, readable live text, and a reduced-motion path.
- Page-turn engine:
  use the MIT-licensed `react-pageflip` wrapper around StPageFlip. Keep the supplied Turn.js 4 archive out of the production bundle because its archive does not include a transferable license and its jQuery runtime would compete with React ownership.

## Validation

- Focused StoryBookServices and Navigation tests.
- `npm run test`
- `npm run css:gates`
- `npm run build`
- Live desktop verification:
  header anchor, pinning, opening, StPageFlip DOM/page count, forward and reverse corner curls, click page turns, all three scroll states, direct tab selection, and no console errors.
- Responsive verification at desktop, tablet, and mobile widths.
- Same-state visual comparison against the supplied open-book reference, recorded in `design-qa.md`.

## Ordered Follow-up

1. Preserve the corrected light-mode page plane and its 1.50:1 geometry.
2. Produce geometry-locked light and dark chassis/page-texture assets on the same canvas. Completed with `closed-cover-straight-dark-v1.png` and `open-book-blank-dark-v1.png`.
3. Switch the complete surface and foreground token set together without remounting StPageFlip or resetting the active chapter. Completed through persistent light/dark image layers and component-scoped semantic tokens.
4. Continue refining the shared opening and page-turn motion without introducing theme-specific animation branches.

## Dark-mode implementation checkpoint

- The light and dark closed-cover assets share a 1672 x 941 canvas.
- The light and dark open-book assets share a 1658 x 949 canvas.
- Both theme layers stay mounted; the root `data-theme` attribute changes their opacity.
- StPageFlip is not remounted and the active story page is not reset when the theme changes.
- Dark page roles use stable semantic names for surface, primary text, secondary text, muted text, accent, border, control, CTA, and focus colors.
- Representative contrast checks:
  - primary text on dark paper: 12.84:1
  - secondary text on dark paper: 8.58:1
  - muted text on dark paper: 6.01:1
  - CTA text on normal dark copper: 4.61:1
  - active slate marker text: 4.72:1
