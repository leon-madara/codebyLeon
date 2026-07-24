# Static Hero and Floating Header Handoff

## Result

The homepage hero now uses a static, theme-aware ambient gradient canvas. The animated orb layers, frosted dot grid, mouse trail, entry-scale animation, and dark-mode torch overlay have been removed from this surface.

The desktop header now has three independent visual groups:

1. CodeByLeon logo at the left.
2. Centered rounded navigation pill with a subtle border, page links, and the project CTA.
3. Theme toggle at the right.

At narrower widths, the existing compact logo, CTA, hamburger, and full mobile menu remain in place so the desktop pill never compresses into an unreadable control.

## Files Changed

- `src/components/sections/Hero.tsx` and `src/styles/sections/hero.css`
  - Removed the moving hero-background layers and retained the existing hero content and scroll narrative.
- `src/pages/HomePage.tsx`
  - Removed the homepage background scale-in tween.
- `src/App.tsx`
  - Removed the dark torch overlay from the application shell.
- `src/components/Layout/Navigation.tsx` and `src/styles/layout/navigation.css`
  - Grouped links and CTA in the desktop pill and applied the three-part floating layout from 1100px upward.
- `src/styles/tokens/colors.css` and `src/styles/base/theme.css`
  - Added semantic static-canvas and navigation-pill tokens for light and dark themes.
- `src/components/Layout/Navigation.test.tsx`
  - Updated the navigation structure assertion to cover the pill grouping.

## Validation

- `npm run build` passed.
- `npm run test` passed: 25 files, 243 tests.
- `npm run css:gates` passed.
- In-app browser review passed on the local homepage:
  - light desktop header and static canvas,
  - dark desktop header and static canvas after the deliberate theme transition,
  - mobile compact header and opened menu,
  - no console errors from the local page.
- `npm run test:visual` could not start because the repository's Playwright Chromium binary is not installed locally. The test runner reported the missing `chromium_headless_shell` executable before running assertions. Browser visual checks above used the in-app Browser instead.

## Follow-up

After the test runner browser is installed, run `npm run test:visual` and intentionally refresh only the approved homepage/navigation/hero snapshots. The previous baselines describe the replaced dotted, animated background and attached header.
