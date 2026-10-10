# Continuous header restoration

Implemented locally on 9 October 2026.

The header restores the pre-pill arrangement: logo, navigation links, project CTA and theme toggle share a continuous full-width surface. Light and dark backgrounds use 96% opacity, with a soft shadow instead of a bottom border. The mobile menu header also uses a shadow.

The page effects and existing unfinished work are preserved. Header and mobile-menu stacking keeps page effects below navigation. Desktop links use adaptive spacing so the logo remains visible at 900px.

Smart navigation animates the whole bar, including its background and shadow. Its visibility resets when disabled for mobile, an open menu or reduced motion; initialization uses useGSAP so the idle timer is not cleared by a later effect.

## Verification

- Full unit suite: 26 files, 246 tests passed. Final focused navigation suite: 13 tests passed.
- Production build and CSS architecture gates passed.
- Screenshots reviewed at 1440, 900, 768 and 390px in light/dark themes; full-width surface, no bottom border, shadow and no horizontal overflow.
- Browser checks: mobile menu opens/closes, desktop Process link works, theme switch works, idle hiding and scroll-stop/upward-scroll restoration work.
- A combined homepage resize/route-transition exercise produced insertBefore DOM errors in page animation content. Fresh-page navigation checks passed; the broader page-animation issue is outside this header change and remains unresolved.
- Bundled Playwright Chromium is unavailable; review used installed Chrome. Historical visual baselines were not overwritten.

No commit, push or deployment performed.
