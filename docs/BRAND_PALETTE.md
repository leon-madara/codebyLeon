# Code by Leon brand palette

Approved by Leon on 2026-10-10 for the Code by Leon alternate. This is the project brand reference. The palette is approved; component-level light and dark assignments remain a direction to refine together. It has not been transferred to the main React/Vite site.

## Approved colours

| Role | Colour | Provenance | Initial use |
|---|---|---|---|
| Brand blue | #2380D9 | Exact fill in public/original-logo.svg | Signature accents and translucent background blobs |
| Action blue | #1B65B0 | Supporting shade proposed and approved | Light-mode primary buttons and text links |
| Light blue | #56AFF0 | Supporting shade proposed and approved | Dark-mode links, active indicators, soft blue blobs |
| Pale blue | #E7F2FC | Supporting tint proposed and approved | Light-mode selected surfaces |
| Deep navy | #020024 | Exact fill in public/original-logo.svg | Strong brand text and occasional emphasis |
| Warm paper | #F5F2EA | Existing alternate background, approved | Light-mode page background |
| Warm orange | #DE4D26 | Exact fill in public/original-logo.svg | Occasional expressive accents |
| Cyan | #75EEFD | Exact fill in public/original-logo.svg | Rare decorative highlights |

The logo also includes #2389D5, #237DD1 and #2D8DDB. #2380D9 is the chosen blue anchor, not a claim that the logo contains only one blue. Preserve the original SVG.

## Theme direction to refine

Keep most surfaces neutral. Use blue consistently for interaction, orange selectively for expression, and cyan rarely. Approximately 5-10% strong colour is a visual starting point, not a fixed quota. Preserve type, spacing and composition.

- Light: retain warm paper; use action blue for small links and filled buttons with white labels. Use pale blue for quiet selection backgrounds.
- Dark: retain the existing #151310 warm-ink background for now; use light blue for readable interactive accents and pair filled light-blue controls with dark text. Deep navy belongs on light surfaces, not as text on dark backgrounds.
- Status colours retain their own meaning. Do not automatically turn errors, warnings or success states blue.
- Text, focus, hover, selected and disabled pairings require component-level verification before adoption.

Calculated contrast: white on #2380D9 is 4.07:1; white on #1B65B0 is 5.94:1; #1B65B0 on warm paper is 5.31:1; #56AFF0 on #151310 is 7.76:1. These are solid-colour calculations, not a full accessibility audit. Normal text generally requires at least 4.5:1: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.

## First implementation: background blobs only

The existing orange wash is retained. The jade background wash becomes translucent logo blue (#2380D9), and the gold background wash becomes translucent supporting blue (#56AFF0). Existing jade/gold interface tokens are preserved.

| Background token | Light | Dark |
|---|---|---|
| --signal-wash-a | Existing orange rgba(188,57,11,0.16) | Existing orange rgba(255,98,38,0.14) |
| --signal-wash-b | Logo blue rgba(35,128,217,0.24) | Logo blue rgba(35,128,217,0.22) |
| --signal-wash-c | Light blue rgba(86,175,240,0.12) | Light blue rgba(86,175,240,0.12) |

The hero layers orange and blue within its existing blob. Shared background blobs, including the project intake, and the final call-to-action blue wash use the theme tokens. Preserve existing blur, geometry, blend modes, animation and content. Opacity values are tuned for translucent decoration, not text or buttons.

Buttons, links, hero typography and other foreground colours have not yet adopted this palette. Their rollout is a separate decision.
