# Horizontal Scroll Editorial Update Report

Prepared: February 24, 2026

## Summary
This update redesigns the Horizontal Scroll beat cards into a professional editorial layout and improves scroll behavior so each beat is easier to read before transitioning.

The work focused on three goals:
- Replace the previous heavy/glassy card style with a cleaner split media/content design.
- Make cards full-viewport width with strict hard-edge geometry (no rounded corners).
- Improve readability during scroll with stronger snap and short per-beat dwell.

## Why We Changed It
- The previous card treatment felt visually busy and reduced content focus.
- The new visual direction prioritizes hierarchy, spacing rhythm, and clarity.
- Users needed more time to consume each beat without it immediately sliding away.

## Scope
Files changed:
- `src/components/HorizontalScroll/StoryBeat.tsx`
- `src/styles/features/horizontal-scroll.css`
- `src/components/HorizontalScroll/MultiCardScrollSection.tsx`

Files intentionally not changed:
- Beat content files in `src/components/HorizontalScroll/beats/*` (content preserved)
- GSAP hooks architecture outside this feature
- Configurator styles and other sections

## Implementation Details

### 1) Card Structure and Media Integration
File: `src/components/HorizontalScroll/StoryBeat.tsx`

What changed:
- Added per-beat media mapping using existing project images.
- Introduced split shell structure:
  - `hs-beat__media` for the left media panel
  - `hs-beat__content` for the right content panel
  - `hs-beat__content-inner` to constrain content width and enforce hierarchy
- Kept `hs-beat-reveal` hooks to preserve current GSAP reveal behavior.

Why:
- Enforces consistent visual storytelling and allows each beat to have a clear visual anchor.
- Keeps animation integration stable while changing presentation.

### 2) Editorial Visual System, Full-Width Layout, and Theme Support
File: `src/styles/features/horizontal-scroll.css`

What changed:
- Added feature-scoped light/dark tokens under `.hs` and `[data-theme='dark'] .hs`.
- Converted cards to full-width, edge-to-edge shell presentation.
- Set responsive split behavior:
  - Desktop: `38/62`
  - Large desktop (`>=1440px`): `34/66`
  - Tablet/mobile: stacked media-first layout
- Enforced no rounded corners across beat surfaces and major child elements.
- Tightened typography and spacing:
  - Strong uppercase title hierarchy
  - Constrained right-column text width (`620px`)
  - Refined subtitle/body rhythm for better scanability
- Normalized chips/tags into structured outlined units.

Why:
- Creates a more professional and consistent visual language.
- Improves readability in both light and dark modes.
- Preserves existing feature ownership and CSS architecture layering.

### 3) Scroll UX: Beat Dwell + Stronger Snap
File: `src/components/HorizontalScroll/MultiCardScrollSection.tsx`

What changed:
- Replaced the old final-only hold model with per-beat dwell + final hold:
  - Desktop dwell ratio per beat: `0.18`
  - Mobile dwell ratio per beat: `0.08`
  - Desktop final hold ratio: `0.22`
  - Mobile final hold ratio: `0.1`
- Strengthened snapping by snapping to computed beat boundary points.
- Updated progress tracking to read actual `track` transform distance, so progress does not advance during dwell.
- Preserved pinning/scrub model and existing section/story trigger architecture.

Why:
- Gives users a brief pause at each beat to read full content.
- Makes transitions feel intentional and easier to follow.
- Aligns progress indicator behavior with what the user actually sees.

## UX Outcome (Expected)
- Each beat remains on screen long enough to be consumed.
- Snap behavior better aligns with beat boundaries.
- Cards feel cleaner, more editorial, and more focused.
- Dark and light modes both maintain readability and visual intent.

## Validation
Commands run:
- `npm run build` -> passed
- `npm run test` -> failed due existing CSS architecture gate issue unrelated to this feature
- `npm run css:gates` -> failed due existing selector leakage in `src/styles/features/configurator.css`

Known pre-existing failing area:
- `src/styles/features/configurator.css` modal selector leakage reported by gates.

## Known Risks / Follow-Up Review Points
- Current snap points do not include `1.0`; near the end of a story this may create slight snap-back behavior depending on wheel velocity.
- One new selector in horizontal-scroll uses higher specificity (`.hs .hs-beat__body .flex.flex-wrap.justify-center`) and may affect architecture quality metrics.
- CTA button utilities inside beat content still rely on mixed utility tokens and should be reviewed for guaranteed light/dark contrast consistency.

## Recommended Next Steps
1. Add a small visual QA pass with real-device scroll testing (trackpad + wheel + touch).
2. Decide whether to include `1.0` in snap points to avoid end-of-story snap-back.
3. Replace utility-dependent CTA styles with feature-owned classes for deterministic theme contrast.
4. Resolve existing `configurator.css` gate leakage separately so test gates can pass cleanly.
