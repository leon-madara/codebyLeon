# Horizontal Scroll Refactor Summary

## What was implemented

A controlled refactor of the services story feature was completed using a namespaced CSS architecture (`hs-*`) and a unified scroll engine.

### Behavior contract implemented

1. Desktop (`>= 1024px`)
- Each story card (`Launch`, `Brand Refresh`, `Ongoing Support`) is pinned.
- Vertical page scroll drives horizontal beat transitions.
- Each card has 4 beats.
- Beat 4 reaches full completion before the pin releases to the next story.

2. Tablet and mobile (`< 1024px`)
- Each story card is pinned.
- Vertical page scroll drives vertical beat transitions.
- Progress and active step update while scrolling.
- After beat 4 completes, the next story becomes active.

### Architecture decisions

1. Data-driven story definition
- Story metadata and beat components are configured in a single `STORIES` array.
- Rendering is mapped from config instead of repeating three large section blocks.

2. Shared progress model
- One normalized progress system (`0..1`) per story.
- Derived step index per story from normalized progress.
- Shared logic for desktop and mobile/tablet modes.

3. Strict CSS namespacing
- Horizontal story UI now uses `hs-*` selectors under the feature root.
- Generic selectors that caused bleed were removed from this feature.

4. Collision fix with configurator
- Configurator-only hidden progress selector was scoped from global `.progress-fill` to configurator roots.

## Files updated

1. `src/components/HorizontalScroll/MultiCardScrollSection.tsx`
2. `src/components/HorizontalScroll/ServiceTabs.tsx`
3. `src/components/HorizontalScroll/ProgressIndicator.tsx`
4. `src/components/HorizontalScroll/StoryBeat.tsx`
5. `src/components/HorizontalScroll/ScrollHint.tsx`
6. `src/components/HorizontalScroll/WaveDivider.tsx`
7. `src/components/HorizontalScroll/Sidebar.tsx`
8. `src/styles/features/horizontal-scroll.css`
9. `src/styles/features/configurator.css`

## Verification completed

1. Build/typecheck
- `npm run build` passed.

2. Regression target addressed
- Global progress-fill collision was removed by configurator scoping.

## Manual QA checklist

1. Desktop
- Scroll inside `Launch` story and confirm 4 beat progression.
- Confirm final beat fully completes before moving to `Brand Refresh`.
- Repeat for `Brand Refresh` into `Ongoing Support`.
- Confirm tabs jump to the right story on click.
- Confirm progress indicator updates continuously while scrolling.

2. Tablet/mobile
- Confirm vertical progression inside each pinned story.
- Confirm progress/step text updates as you scroll.
- Confirm transition to next story only after beat 4 completion.

3. Visual
- Confirm wave dividers render correctly.
- Confirm active tab and progress states remain synchronized.
- Confirm no missing styles from class collisions.
