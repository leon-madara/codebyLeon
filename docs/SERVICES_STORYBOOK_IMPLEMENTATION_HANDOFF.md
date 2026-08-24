# Services Storybook Implementation Handoff

## Current Result

The homepage services section now presents a generated straight-on CodeByLeon cover, opens into a pinned landscape book, and offers two clear routes into the service story. Visitors who know what they need can open one of three explicitly named service chapters. Visitors who are still deciding can choose **Explore the full journey** and read all twelve story spreads in order.

Each service chapter now contains four individually addressable subchapters. The right-edge chapter rail reveals four nested story markers beneath the active chapter, while each chapter uses a restrained paper tint to help visitors understand where they are without making the three sections look like unrelated books. The open pages continue to run on StPageFlip through `react-pageflip`, including its corner preview, shadows, and click-driven page turn. All chooser copy, story titles, navigation, and calls to action remain accessible HTML.

The storybook now also has a geometry-locked dark counterpart. Separate closed-cover and open-book PNGs use the same canvases and alignment as their light equivalents. Both theme layers remain mounted and cross-fade through the existing root `data-theme` attribute, so changing theme does not remount StPageFlip, move the spine, or reset the active story.

The StPageFlip surface is now registered to the visible top leaf instead of the wider page-stack rectangle. Its spread ratio changed from 1.73:1 to 1.50:1, the plane was narrowed and made taller, the source-paper crop was recalibrated, and the two outer corners are clipped with a responsive radius. The generated leather chassis remains stationary underneath.

The original navigation defect is also resolved: selecting `SERVICES` in the header reaches `#services`, and scrolling inside the pinned section no longer rebounds to the top of the page.

## Interaction Details

- Header `SERVICES` link lands at the storybook section with the fixed navigation offset.
- Desktop scroll rotates and fades the cover, reveals the open spread, and advances through twelve ordered story spreads.
- The cover and open spread share one fixed 50% spine axis, so the midpoint no longer slides left during the opening turn.
- The prologue offers three direct service choices plus an **Explore the full journey** path.
- Clicking a chapter tab opens the first story in that service; clicking one of its four nested markers opens that exact story.
- Direct non-adjacent choices change to the requested StPageFlip spread immediately, avoiding a temporary mismatch between the selected marker and visible content.
- Adjacent previous/next actions retain the animated StPageFlip page turn.
- A direct selection is held until the visitor resumes scrolling.
- Hovering the bottom-right corner previews the next StPageFlip page; clicking advances one spread.
- Once a chapter is open, the bottom-left corner previews and performs the reverse turn.
- StPageFlip owns page geometry and shadows; GSAP owns only the pinned cover/open sequence and scroll synchronization.
- Duplicate requests are ignored while the page engine reports its `flipping` state.
- The StPageFlip sheet is centered over the generated paper artwork, keeping both directions registered to the fixed book spine.
- The first spread acts as a prologue and supports either direct service selection or the complete guided journey.
- Mobile uses a readable single-page crop, three clearly named chapter controls, and four visible subchapter controls for the active service.
- Websites & Systems, Brand Identity & Refresh, and Ongoing Design Support each apply a subtle, distinct paper wash.
- Dark mode uses warm charcoal paper, aged-copper accents, warm ivory foregrounds, and theme-adjusted chapter washes.
- Adjacent keyboard page actions now call StPageFlip's directional `flipNext` and `flipPrev` methods; direct chapter and story jumps continue to use immediate page selection.
- Reduced-motion users receive the open-book state without 3D transforms.

## Implemented Files

- `src/components/StoryScroll/StoryBookServices.tsx`
- `src/styles/features/storybook-services.css`
- `src/components/StoryScroll/StoryBookServices.test.tsx`
- `src/assets/services-storybook/research/closed-cover-straight-v1.png`
- `src/assets/services-storybook/research/open-book-blank-base-v1.png`
- `src/assets/services-storybook/research/open-book-blank-base-v2-no-moon.png`
- `src/assets/services-storybook/research/closed-cover-straight-dark-v1.png`
- `src/assets/services-storybook/research/open-book-blank-dark-v1.png`
- `docs/services-storybook-implementation-plan.md`
- `design-qa.md`

## Page-turn Library Audit

- Supplied archive: `C:\Users\Leon Madara\Dev Mode\5396f77366f55-turnjs4.zip`
- Identified library: Turn.js 4.1.0, a 2012 jQuery plugin.
- The bundled API manual labels the fourth release as a commercial version, the JavaScript header says all rights reserved, and the archive does not include the referenced `license.txt`.
- Live Viberole inspection showed a different modern page-flip engine, identifiable by its `stf__` page layers.
- The selected replacement is `react-pageflip` 2.0.3, the React wrapper for the MIT-licensed StPageFlip engine; `page-flip` is installed transitively.
- Decision: use StPageFlip for the book physics and keep GSAP for the outer scroll choreography. No Turn.js or legacy jQuery source was added to the production bundle.

## Validation

- Focused StoryBookServices tests: 7 passed, including the twelve-spread count, 26-leaf StPageFlip mapping, direct chooser paths, nested subchapter navigation, and forward/reverse story-page controls.
- Full Vitest suite: 25 files and 242 tests passed.
- CSS architecture gates: passed.
- Production TypeScript/Vite build: passed.
- Browser journey for the earlier three-spread implementation passed: header anchor, stable pin, cover opening, forward/reverse turns, direct chapter selection, resumed ordered scrolling, and zero content overflow.
- Fresh browser journey and side-by-side visual QA now cover the light and dark Chapter 01 opening spread, the dark prologue, the dark closed cover, active-story persistence during theme changes, nested-marker fit, and the real bottom-left StPageFlip corner returning to the prologue.
- Light and dark open-book geometry remained registered to the same spine and outer book bounds at the 1192 x 900 browser viewport.
- Browser console errors in the verified journey: none.
- Dependency check: `react-pageflip@2.0.3` resolves to `page-flip@2.0.7`. The production dependency audit still reports five advisories elsewhere in the existing dependency tree; no forced upgrades were applied as part of this focused change.

## Follow-up Opportunities

- Compress or externally optimize the two generated PNG assets before production deployment; each is currently about 1.95 MB.
- Extend the approved dark visual language to any future story illustrations without changing the locked chassis or page geometry.
- Create the planned story image set for the opening page of selected subchapters after the twelve-spread layout is visually signed off.
- Add visual-regression baselines for the chooser, all three chapter tints, nested marker states, and representative mobile spreads after sign-off.
- Revisit `disableFlipByClick` only if the interaction is later narrowed from page clicks to dedicated corner hotspots.
