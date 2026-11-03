# Scroll pacing review - 2026-10-19

Scope: alternate checkout, branch codex/codebyleon-alternate, HEAD 6f914c6 plus existing uncommitted work. Local only.

## Changes

- Hero curtain: lift 1.8 -> 2.2 seconds; stationary reading interval after lift 0.7 -> 1 second. Existing quiet-input release and explicit navigation bypass preserved.
- Founder: initial hold .25 -> .7 timeline units; second reveal starts at 2.55 instead of 1.65; completed three-panel spread holds 1.5 units before the black wipe (previous gap .5). One unit consumes about .733 spread heights of scroll. Final comparison hold .45 -> 1.1 units. Gentle power1.inOut easing and .65 scrub. Mobile uses the same distance per timeline unit, with a final reading hold.
- Reality Check: initial hold .4 -> 1.1 units; completed comparison hold .4 -> 1.4 units; Services peek .35 -> .55 units with eased onset; final hold .25 -> 1 unit. Pin distance scales with total duration so extra holds do not compress movement into the old scroll range.
- Audited remaining scroll owners: lower homepage sections and listing/reader pages use normal document flow and entrance reveals, rather than page-changing pinned sequences. No extra scroll locks added there.

## Observed checks

- Focused ESLint on hero.tsx, reality-check.tsx, use-founder-sequence.ts: passed.
- git diff --check: passed (existing LF/CRLF notices only).
- Next.js webpack production build: passed outside sandbox after sandbox EPERM creating generated output. Existing config skips type validation; no clean type-check claim.
- Browser localhost:3000, desktop 1440x900: founder anchor settled at 72px; full spread visible at scrollY 11132. Scrolling another 585px to 11717 kept all three column positions unchanged and wipe opacity 0. Further scrolling revealed the next scene. Reverse restored the spread with wipe opacity 0.
- Desktop Reality Check: completed comparison stayed visible through additional .65 viewport scroll, followed by Services handoff on further scroll.
- Mobile 390x844: founder anchor settled at about 72px. Traversed introduction -> film -> biography; another .45 viewport scroll retained biography; reverse returned to film. Hero reset and curtain replay reached Reality Check.
- Desktop lower page: Work anchor settled near 112px; forward scroll through Articles, contact and footer, then reverse traversal observed.
- Browser console hydration warnings show extension-injected bis_skin_checked/bis_register attributes. No new animation exception observed.

These are agent-reviewed interaction observations, not independent review. Trackpad hardware feel, every input device, reduced-motion interaction, and both complete theme passes were not exhaustively tested. The subjective pacing remains available for user review.
