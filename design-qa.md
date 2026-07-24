# Services Storybook Design QA

## Final result

passed

The previously approved book geometry and StPageFlip interaction remain documented below. The twelve-spread chooser, nested navigation, and geometry-locked dark counterpart now have fresh browser evidence.

## Source and Implementation Evidence

- Source reference: `output/design-qa/source-open-book-reference.png`
- Final desktop capture: `output/design-qa/services-storybook-desktop-final.png`
- Final mobile capture: `output/design-qa/services-storybook-mobile-v1.png`
- Same-state comparison: `output/design-qa/services-storybook-comparison-final.png`
- Reported hinge-drift source: `output/design-qa/source-hinge-drift-reference.png`
- Corrected midpoint capture: `output/design-qa/services-storybook-hinge-after.png`
- Full hinge comparison: `output/design-qa/services-storybook-hinge-comparison-final.png`
- Focused hinge comparison: `output/design-qa/services-storybook-hinge-focus-final.png`
- Viberole forward-curl reference: `output/design-qa/viberole-forward-curl-reference.png`
- Viberole reverse-curl reference: `output/design-qa/viberole-reverse-curl-reference.png`
- CodeByLeon forward-curl capture: `output/design-qa/services-storybook-forward-curl.png`
- CodeByLeon reverse-curl capture: `output/design-qa/services-storybook-reverse-curl.png`
- Continuous forward curl capture: `output/design-qa/services-storybook-forward-curl-continuous.png`
- Continuous reverse curl capture: `output/design-qa/services-storybook-reverse-curl-continuous.png`
- StPageFlip proportional-layout capture: `output/design-qa/services-storybook-stpageflip-859.png`
- StPageFlip in-motion capture: `output/design-qa/services-storybook-stpageflip-curl.png`
- Desktop viewport: 1235 x 709 at device pixel ratio 1
- Mobile viewport: 390 x 844 at device pixel ratio 1
- Compared state: open book, chapter 01 selected, right-edge navigation visible
- Hinge QA viewport: 1610 x 870 CSS pixels at device pixel ratio 1
- Hinge source pixels: 1610 x 865
- Hinge implementation pixels: 1598 x 864, normalized to 1610 x 865 for the combined comparison
- Hinge state: cover approximately halfway through the scrubbed opening transition
- Focused comparison was required because the defect concerned the cover axis and open-book spine rather than the completed spread.

## Comparison Findings

### Resolved

- P1 layout: the first implementation reserved a separate grid column for the tabs, making the book materially smaller than the reference. The tabs now overlay the book edge and the spread occupies the available width.
- P1 responsiveness: the first mobile crop showed only the chapter details and hid the chapter title. Mobile now uses a deliberate single-page crop with the title, descriptor, four beats, CTA, and labeled chapter controls visible.
- P1 behavior: the header anchor reaches `#services`, the section remains pinned while scrolling, and the old reset-to-top behavior did not recur.
- P1 behavior: a directly selected chapter persists; normal ordered chapter progression resumes when the visitor scrolls again.
- P1 motion geometry: the rotating cover previously used a `33% center` origin plus `xPercent: -18`, placing its measured pivot near x=411 while the open-book spine was x=799. The translation was removed and both the cover and spread now use the shared center axis. In the corrected capture, the measured cover pivot and stage/spine center are both x=799.
- P1 interaction: desktop page edges now expose bounded forward and reverse controls. Pointer depth increases the bottom-corner peel, clicking completes a 3D page turn, and no turn is offered before the prologue or after the final chapter.
- P1 motion implementation: the temporary custom GSAP leaf layers were replaced with the selected StPageFlip engine. Its `stf__` DOM contains eight live pages, owns the curl geometry and page shadows, and reports page/state events back to React.
- P1 motion continuity: forward and backward turns now use StPageFlip's page surfaces while the generated book artwork and central spine remain fixed.
- P2 content: right-page copy previously collided with the tab rail. The live content inset was narrowed and all four beat descriptions remain inside the paper area.
- P2 hierarchy: book typography now scales against the book container instead of the viewport. At 859 x 791, the chapter title remains two lines and every live page reports no content overflow.
- P1 contrast: the active desktop label now uses `#2f241e` on the pale page (`13.10:1`), and active tab numbers remain at or above `4.52:1`; the previous white active label was removed.

### Accepted Differences

- The reference has seven product-oriented bookmarks; CodeByLeon uses the approved three service chapters.
- The fixed CodeByLeon header remains visible above the section because this is an implementation inside the existing homepage rather than a standalone full-screen reference.
- The generated book uses CodeByLeon black leather, copper, slate-blue, and botanical/celestial details instead of reproducing the reference artwork.

### Follow-up, Non-blocking

- P3 performance: the two generated PNG assets are about 1.95 MB each and should be compressed or moved into the planned image-delivery pipeline before production release.

## Functional Checks

- Header `SERVICES` link: passed.
- Scroll stability and pinning: passed.
- Closed-cover to open-spread transition: passed.
- Direct chapter 01/02/03 controls: passed.
- Forward bottom-right corner peel and edge click: passed.
- Reverse bottom-left corner peel and edge click: passed.
- Hover curl to click-turn continuity in both directions: passed.
- Edge clicks preserve the pinned scroll position: passed.
- First/last page bounds: passed.
- Scroll-driven chapter progression after direct selection: passed.
- Mobile chapter labels and CTA: passed.
- Keyboard focus indicators and hidden-state tab order: passed.
- Reduced-motion fallback: covered by implementation and unit checks.
- Browser console warnings/errors in a clean run: none.

## Hinge Comparison History

1. The supplied screenshot showed the dark cover turning around an axis substantially left of the open-book spine.
2. Browser measurement reproduced the defect at 1610 x 870: cover pivot approximately x=411; open-book midpoint x=799.
3. The desktop cover translation was removed, the cover origin was changed to `center center`, and the spread scale origin was explicitly centered.
4. Post-fix measurement at the same scroll state: cover pivot x=799; open-book midpoint x=799.
5. Full-view and focused combined comparisons show the rotating cover remaining registered to the central spine.

## Page-plane Correction — 2026-07-24

### Evidence

- Source visual truth: `output/design-qa/source-page-plane-annotated.png`
- Pre-fix implementation: `output/design-qa/services-storybook-page-plane-before-open.png`
- Corrected settled spread: `output/design-qa/services-storybook-page-plane-after-final.png`
- Corrected forward turn: `output/design-qa/services-storybook-page-plane-turn-after.png`
- Corrected reverse turn: `output/design-qa/services-storybook-page-plane-reverse-after.png`
- Corrected 859 px spread: `output/design-qa/services-storybook-page-plane-after-859.png`
- Mobile regression: `output/design-qa/services-storybook-page-plane-mobile-regression.png`
- Combined source/implementation comparison: `output/design-qa/services-storybook-page-plane-comparison.png`
- Desktop comparison viewport and pixels: 1485 x 819 CSS pixels at device pixel ratio 1; both source and implementation are 1485 x 819 pixels.
- Compared state: light open book with chapter 01 selected and right-edge navigation visible.

### Comparison History

1. P1 geometry: the StPageFlip plane used a 1.73:1 spread ratio and followed the wider page-stack rectangle, making the animated sheet too wide and too shallow.
2. Fix: the plane moved from `inset: 11% 12%` to `inset: 8.5% 15%`, while the StPageFlip base page changed from 520 x 600 to 520 x 694.
3. Fix: the composite-paper crop was recalibrated to the same source region and the two outer page corners received responsive clipping.
4. Post-fix evidence: the settled plane sits inside the visible top leaf; both directional curls remain inside the leather/page-stack boundary; the spine stays fixed; and all eight live pages report zero content overflow.

### Required Fidelity Surfaces

- Fonts and typography: existing live type hierarchy and two-line chapter title are preserved; no truncation or overflow was introduced.
- Spacing and layout rhythm: the page plane is narrower and taller, while the reduced content inset preserves the original copy positions inside the corrected leaf.
- Colors and tokens: the light-mode palette is unchanged in this geometry-only pass.
- Image quality and asset fidelity: the existing book artwork remains the source; its paper crop is now registered to the corrected plane without stretching the chassis.
- Copy and content: no service copy, CTA, beat, or navigation label changed.

### Residual Difference

- The source annotation follows a curved outer contour, while StPageFlip uses a rectangular interaction plane. The approved implementation inscribes that rectangle within the green boundary and uses rounded outer corners and native page shadows to preserve the physical-book illusion.
- The production site header remains visible in the implementation capture; this is an accepted site-level constraint rather than page-plane drift.

final result: passed

## Twelve-spread service architecture — 2026-07-24

### Source truth

- Annotated layout reference: `output/design-qa/source-services-storybook-12-page-layout.png`
- Intended state: open light-mode book with the logo in the upper-left, a direct story title and supporting copy on the left page, optional story imagery below, and chapter navigation attached to the right edge.
- Required flow: a prologue that supports direct service selection or a complete journey, followed by three clearly named chapters with four story spreads each.

### Implementation evidence

- Automated DOM coverage: `src/components/StoryScroll/StoryBookServices.test.tsx`
- Implementation: `src/components/StoryScroll/StoryBookServices.tsx`
- Layout and chapter tint rules: `src/styles/features/storybook-services.css`
- Fresh implementation screenshot: not captured.
- Fresh combined source/implementation comparison: not produced.
- Target desktop viewport: 1485 x 819 CSS pixels at device pixel ratio 1.
- Target mobile viewport: 390 x 844 CSS pixels at device pixel ratio 1.

### Verified without visual inference

- The reader-facing model contains exactly twelve story spreads: four for each of the three service chapters.
- StPageFlip receives 26 leaves: two prologue leaves plus two leaves for each story spread.
- The prologue exposes three clearly named service choices and an **Explore the full journey** action.
- Each active chapter exposes four nested story markers.
- Direct non-adjacent selections and adjacent page turns use separate navigation paths to keep marker state aligned with the visible spread.
- Each chapter applies a distinct low-opacity paper wash.
- Production build, full unit suite, and CSS architecture gates pass.

### Blocking visual checks

- Confirm the three chooser cards and journey CTA fit inside the prologue right page at the target desktop and mobile viewports.
- Confirm all four nested markers remain legible and do not overflow the right rail.
- Confirm the twelve-spread page turns keep the content and active marker synchronized in the real StPageFlip canvas.
- Compare the reference and implementation in one combined image at the same viewport and state.
- Check all three chapter tints in light mode before generating the corresponding dark-mode artwork.

### Blocker

The selected Codex in-app browser rejected the localhost reload under its browser URL security policy. Per the browser and Product Design safety requirements, no alternate browser, raw CDP call, or local Playwright workaround was used.

final result: blocked

The earlier localhost blocker was resolved in a later browser session. The resulting light/dark evidence and final status are recorded below.

## Geometry-locked dark mode — 2026-07-24

### Source and implementation evidence

- Light open-book source asset: `src/assets/services-storybook/research/open-book-blank-base-v2-no-moon.png`
- Dark open-book counterpart: `src/assets/services-storybook/research/open-book-blank-dark-v1.png`
- Light closed-cover source asset: `src/assets/services-storybook/research/closed-cover-straight-v1.png`
- Dark closed-cover counterpart: `src/assets/services-storybook/research/closed-cover-straight-dark-v1.png`
- Dark closed-cover browser capture: `output/design-qa/services-storybook-dark-cover-v1.png`
- Dark prologue browser capture: `output/design-qa/services-storybook-dark-prologue-v1.png`
- Dark Chapter 01 browser capture: `output/design-qa/services-storybook-dark-open-v1.png`
- Matching light Chapter 01 capture: `output/design-qa/services-storybook-light-open-comparison-v1.png`
- Combined same-state comparison: `output/design-qa/services-storybook-light-dark-comparison-v1.png`
- Browser viewport: 1192 x 900 CSS pixels at device pixel ratio 1.
- Compared state: Chapter 01, Story 01 selected with nested markers visible.

### Findings and fixes

1. The first dark browser capture exposed the light studio background embedded in the closed-cover PNG. A geometry-matched 1672 x 941 dark cover asset replaced that surface in dark mode.
2. The first dark open spread exposed an overlap between the upper-left logo and the story kicker. The intro page now reserves a fixed container-relative header band in both themes.
3. The 1658 x 949 light and dark open-book assets preserve the same canvas, book bounds, central spine, page-stack silhouette, rounded corners, ornament positions, and writing plane.
4. Both asset layers remain mounted and cross-fade through `data-theme`; switching themes kept **Hidden in Plain Sight** active.
5. The dark prologue fits three direct service choices and **Explore the full journey** without visible overflow.
6. The real bottom-left StPageFlip corner returned Chapter 01, Story 01 to the prologue.
7. No browser console errors were reported.

### Contrast evidence

- Primary warm-ivory text on charcoal paper: 12.84:1.
- Secondary text on charcoal paper: 8.58:1.
- Muted text on charcoal paper: 6.01:1.
- CTA text on the normal copper fill: 4.61:1.
- CTA text on the darker hover fill: 5.40:1.
- Active text on the slate chapter marker: 4.72:1.

### Accepted differences

- Dark mode is a tailored nocturnal palette rather than a mechanical inversion of the light asset.
- The dark paper grain is slightly more visible so large near-black surfaces do not collapse into one flat field.
- Shared GSAP and StPageFlip motion remains unchanged except for the directional adjacent-page API correction.

final result: passed
