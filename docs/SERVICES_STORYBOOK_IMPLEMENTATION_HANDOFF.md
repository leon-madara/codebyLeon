# Services Storybook Implementation Handoff

## Current Result

The homepage services section now presents a generated straight-on CodeByLeon cover, opens into a pinned landscape book, and exposes three live service chapters through right-edge tabs. The open pages now run on the actual StPageFlip engine through `react-pageflip`, including its bottom-corner preview, shadows, and click-driven page turn. Chapter copy, beat lists, navigation, and calls to action remain accessible HTML.

The StPageFlip surface is now registered to the visible top leaf instead of the wider page-stack rectangle. Its spread ratio changed from 1.73:1 to 1.50:1, the plane was narrowed and made taller, the source-paper crop was recalibrated, and the two outer corners are clipped with a responsive radius. The generated leather chassis remains stationary underneath.

The original navigation defect is also resolved: selecting `SERVICES` in the header reaches `#services`, and scrolling inside the pinned section no longer rebounds to the top of the page.

## Interaction Details

- Header `SERVICES` link lands at the storybook section with the fixed navigation offset.
- Desktop scroll rotates and fades the cover, reveals the open spread, and advances through the ordered chapters.
- The cover and open spread share one fixed 50% spine axis, so the midpoint no longer slides left during the opening turn.
- Clicking a chapter tab holds that direct selection until the visitor resumes scrolling.
- Hovering the bottom-right corner previews the next StPageFlip page; clicking advances one spread.
- Once a chapter is open, the bottom-left corner previews and performs the reverse turn.
- StPageFlip owns page geometry and shadows; GSAP owns only the pinned cover/open sequence and scroll synchronization.
- Duplicate requests are ignored while the page engine reports its `flipping` state.
- The StPageFlip sheet is centered over the generated paper artwork, keeping both directions registered to the fixed book spine.
- The first spread acts as a prologue and lets the visitor enter chapter one.
- Mobile uses a readable single-page crop and a three-button chapter selector with visible labels.
- Reduced-motion users receive the open-book state without 3D transforms.

## Implemented Files

- `src/components/StoryScroll/StoryBookServices.tsx`
- `src/styles/features/storybook-services.css`
- `src/components/StoryScroll/StoryBookServices.test.tsx`
- `src/assets/services-storybook/research/closed-cover-straight-v1.png`
- `src/assets/services-storybook/research/open-book-blank-base-v1.png`
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

- Focused StoryBookServices tests: 7 passed, including shared-midpoint, bounded page order, StPageFlip spread mapping, and forward/reverse control regressions.
- Full Vitest suite: 25 files and 242 tests passed.
- CSS architecture gates: passed.
- Production TypeScript/Vite build: passed.
- Browser journey: header anchor, stable pin, cover opening, eight StPageFlip pages, forward/reverse page turns without scroll displacement, direct chapter selection, resumed ordered scrolling, and zero content overflow.
- Visual QA: corrected page plane at 1485 x 819 and 859 x 791, forward and reverse mid-turn captures, mobile fallback at 390 x 844, plus the existing opening-hinge captures.
- Dependency check: `react-pageflip@2.0.3` resolves to `page-flip@2.0.7`. The production dependency audit still reports five advisories elsewhere in the existing dependency tree; no forced upgrades were applied as part of this focused change.

## Follow-up Opportunities

- Compress or externally optimize the two generated PNG assets before production deployment; each is currently about 1.95 MB.
- Produce the approved dark-mode chassis and single-leaf texture set from the corrected page geometry; do not independently regenerate a differently shaped book.
- Refine the chapter-turn artwork once the final service copy and chapter count are approved.
- Add visual-regression baselines for the closed cover, prologue, and each chapter after the design direction is signed off.
- Revisit `disableFlipByClick` only if the interaction is later narrowed from page clicks to dedicated corner hotspots.
