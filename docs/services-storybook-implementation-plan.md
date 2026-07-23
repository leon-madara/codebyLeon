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
- Open book: `src/assets/services-storybook/research/open-book-blank-base-v1.png`
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
3. Continue scrolling to advance through the three service chapters.
4. Select any chapter tab to open it directly; the selected chapter remains in place until scrolling resumes.
5. Use `react-pageflip`/StPageFlip for the page surface, corner preview, shadow, and click-driven turn.
6. Hovering the bottom-right or bottom-left page corner previews the available turn; clicking completes it from that corner.
7. Keep GSAP responsible only for the pinned section, cover opening, and scroll-to-chapter synchronization.
8. Keep the StPageFlip spine centered inside the open-book image so the page sheet never drifts away from the book midpoint.
9. With reduced motion, skip 3D transforms and expose the open book and chapter controls directly.

## Chapter Architecture

1. Websites & Systems
2. Brand Identity
3. Ongoing Design

Each spread keeps four scannable beats and one action. Text and controls remain live HTML rather than being embedded in the generated book image.

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
2. Produce geometry-locked light and dark chassis/page-texture assets on the same canvas.
3. Switch the complete surface and foreground token set together without remounting StPageFlip or resetting the active chapter.
