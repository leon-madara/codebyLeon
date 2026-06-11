# Process Page: Screenshot-Led Human Design

Date: 2026-06-11
Route: `/process`

## Source Of Truth

The supplied screenshot `codex-clipboard-486c51b2-5a70-442d-bbcc-aa13b2b0dc3c.png`
governs layout, typography, spacing, imagery treatment, section order, and visual
tone. The Human direction is the default page. No Cinematic/Human/Precise concept
pill ships.

The global navigation, route structure, theme system, and quote configurator are
preserved.

## Page Sequence

1. Split hero
2. Three promises
3. Five-step visual journey
4. Your role / My role
5. FAQ accordion
6. Gradient closing CTA

## Copy Hierarchy

- Hero: "You bring the ambition. I'll keep the work clear."
- Promise: "Here's the promise"
- Journey: "Our 5-step journey, together"
- Roles: "Clear roles. Strong results."
- FAQ: "Common questions"
- Closing: "Let's build something you'll be proud of."

## Visual Direction

- Open editorial composition on a soft lavender canvas
- `MyKidsHandwritten` for emotional display headings and Inter for body/UI copy
- Navy copy, coral actions and underlines, and periwinkle accents
- Existing photography with alternating placement and softly blended edges
- A curved dashed raster connector behind accessible HTML markers `1` through `5`
- The reference's missing marker `4` is corrected in the implementation
- Lucide icons for promises, role headings, checks, arrows, and FAQ controls
- Light mode closely follows the screenshot; dark mode uses existing theme tokens
  for readable adaptations

## Asset Mapping

- Hero: `07-refresh-process.png`
- Listen: `02-launch-plan.png`
- Direction: `06-refresh-strategy.png`
- Visible: `08-refresh-transformation.png`
- Build: `11-ongoing-workflow.png`
- Launch: `12-ongoing-success.png`
- Journey connector: `src/assets/process/process-journey-path.png`

## Links And Interaction

- Every "Build Your Quote" CTA links to `/get-started.html`
- "Meet the Process" links to `#process-journey`
- "Let's Talk" uses a normal anchor to `/#final-cta`
- FAQs use native accessible `<details>/<summary>` controls
- Motion uses `useGSAP` and `ScrollTrigger`
- Reduced-motion visitors receive complete content without reveal dependencies

## Responsive Behavior

- Desktop keeps the split hero and alternating journey composition
- Tablet simplifies spacing and image offsets
- Mobile becomes a vertical story in reading order
- The primary quote CTA remains visible in the initial 390px mobile viewport
- No supported width may introduce horizontal overflow

## Acceptance Criteria

1. The supplied screenshot is the visible design reference.
2. No concept pill appears anywhere on the page.
3. All three promises and five ordered journey stages are present, including `4`.
4. Role lists, meaningful image alternatives, and FAQ labels are accessible.
5. Quote and conversation links use the required destinations.
6. Light and dark themes remain readable.
7. `npm run test`, `npm run build`, `npm run css:gates`, and
   `npm run test:visual` complete successfully.
8. Desktop, tablet, and 390px browser verification confirms image crops,
   interaction, motion, CTA visibility, and no horizontal overflow.
