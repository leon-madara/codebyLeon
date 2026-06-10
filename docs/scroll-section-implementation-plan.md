# Scroll Section Implementation Plan

Branch created from main: `feature/scroll-section-redesign-plan`

## 1. Target section identified

The primary section to carry forward is the pinned story/beat scroll surface rendered from:
- `src/pages/HomePage.tsx`
- `src/components/HorizontalScroll/MultiCardScrollSection.tsx`
- `src/components/HorizontalScroll/ServiceTabs.tsx`
- `src/components/HorizontalScroll/ProgressIndicator.tsx`
- `src/styles/features/horizontal-scroll.css`

This is the section that currently provides the chapter-style progress UI and the horizontal story progression model.

A supporting navigation pattern to reuse for the dropdown-style shell is:
- `src/components/sections/PortfolioCarousel.tsx`
- `src/styles/sections/portfolio-carousel.css`

That file already demonstrates the collapsible filter rail / dropdown interaction that opens a horizontally scrollable control surface.

## 2. What the main branch currently does

From the main branch baseline:
1. `HomePage.tsx` mounts the horizontal story section after the 3D/about stack sections.
2. `MultiCardScrollSection.tsx` drives the story flow with GSAP ScrollTrigger pinning and beat progression.
3. `ServiceTabs.tsx` provides chapter-level switching.
4. `ProgressIndicator.tsx` gives the chapter/step visual feedback.
5. `horizontal-scroll.css` owns the feature-scoped styling, responsive behavior, and theme tokens.

This baseline is the reference implementation to preserve while updating the UX.

## 3. What the current feature branch work already established

The working feature branch already contains the current horizontal-scroll implementation and related story/beat logic, including:
- pinned horizontal/vertical beat progression
- progress-state updates for each story chapter
- top chrome controls for chapter selection
- feature-scoped styling for the story UI

The main design implication to keep in mind is that the chapter indicator and chapter selection UI must stay aligned with the actual pinned scroll progress, not just the visible card index.

## 4. Implementation goals for the new branch

1. Reuse the existing GSAP + ScrollTrigger model for the story scroll section.
2. Preserve the chapter indicator behavior while tightening the UX around chapter switching and visible progress.
3. Introduce a dropdown-style chapter rail / reveal surface that can support horizontal navigation without breaking the current pinning model.
4. Keep styling under the existing owned CSS files instead of creating duplicate feature styles.

## 5. Proposed work plan

### Phase A — Audit and contract lock
1. Confirm the exact section and DOM contract used by `MultiCardScrollSection.tsx`.
2. Document the existing chapter indicator behavior and the current chapter-switch action path.
3. Identify which UI surface should become the dropdown / reveal interaction.

### Phase B — UI and behavior update
1. Update the chapter shell so the current chapter, progress, and horizontal story navigation are visually consistent.
2. Add the dropdown / rail interaction using the same patterns already visible in `PortfolioCarousel.tsx`.
3. Preserve accessibility and reduced-motion behavior.

### Phase C — Styling and responsiveness
1. Keep all visual changes in `src/styles/features/horizontal-scroll.css` and only use `src/styles/sections/portfolio-carousel.css` if the dropdown shell needs shared styling support.
2. Verify desktop, tablet, and mobile behavior for the chapter indicator and the reveal interaction.

### Phase D — Validation
1. Run `npm run test`.
2. Run `npm run build`.
3. If the chapter UI changes affect styling or animation contracts, run `npm run css:gates` and `npm run test:visual` as follow-up validation.

## 6. Risks to watch

- The current pinning and snap model is sensitive to scroll timing; any change in chapter switching must preserve GSAP ScrollTrigger timing.
- The chapter indicator must stay synchronized with the real scroll progress, not only with click events.
- The dropdown / reveal interaction must not interfere with the existing horizontal beat progression on desktop.

## 7. Definition of done

The work is ready when:
- the chapter indicator remains clear and readable,
- the dropdown / reveal interaction works without breaking the pinned story scroll,
- the implementation remains in the existing `HorizontalScroll` and `portfolio-carousel` ownership model,
- the branch is validated with the project’s test/build commands.
