# Static Hero and Floating Header Plan

## Goal

Replace the homepage hero's animated orb, dot-grid, cursor-trail, and dark spotlight canvas with a still ambient gradient surface. Recompose the desktop navigation into a floating logo, a centered bordered navigation pill, and an independent theme toggle.

## In Scope

- `src/components/sections/Hero.tsx` and `src/styles/sections/hero.css`
- `src/pages/HomePage.tsx`
- `src/App.tsx`
- `src/components/Layout/Navigation.tsx` and `src/styles/layout/navigation.css`
- Theme tokens in `src/styles/tokens/colors.css` and `src/styles/base/theme.css`

## Constraints

- Preserve the hero's existing copy, CTA destinations, text entrance, and scroll narrative.
- Keep the mobile navigation overlay; apply the floating three-part composition only when the complete pill fits.
- Keep background colors semantic and theme-aware through existing CSS custom properties.
- Verify both themes, desktop/mobile navigation, CSS gates, tests, and production build before sign-off.

## Explicitly Out of Scope

- The hero's typography and content layout.
- Decorative looping linework from the supplied reference.
- Re-skinning portfolio, blog, process, or case-study page surfaces.
