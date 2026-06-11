# Process Page Design QA

## Comparison Target

- Source visual truth:
  `C:\Users\LEONMA~1\AppData\Local\Temp\codex-clipboard-486c51b2-5a70-442d-bbcc-aa13b2b0dc3c.png`
- Implementation:
  `http://127.0.0.1:5173/process?e2e=1&no-burn=1`
- Implementation screenshot:
  `test-results/process-design-qa/process-desktop-light-final.png`
- Viewport: 1440 x 1000 CSS pixels, full-page capture
- State: light theme, reduced motion, fonts and images loaded

The supplied reference is an 864 x 1821 composite with no declared CSS viewport
or device scale. The implementation capture was normalized to 864 pixels wide
for proportional comparison. Its normalized height is 1911 pixels, within about
5% of the reference height.

## Evidence

- Full-view comparison:
  `test-results/process-design-qa/comparison-full.png`
- Focused hero comparison:
  `test-results/process-design-qa/comparison-hero.png`
- Focused journey comparison:
  `test-results/process-design-qa/comparison-journey.png`
- Mobile light capture:
  `test-results/process-design-qa/process-mobile-light-final.png`
- Tablet dark capture:
  `test-results/process-design-qa/process-tablet-dark-final.png`

Focused regions were required because typography, image treatment, and the
journey connector were too small to judge reliably in the full-page comparison.

## Findings

No actionable P0, P1, or P2 findings remain.

- [P3] Hero line breaks vary slightly from the reference at some desktop widths.
  Evidence: the same four-line hierarchy and underline are present, but the first
  phrase wraps after "bring" rather than after "the" at 1440 CSS pixels.
  Impact: minor typographic drift only; hierarchy and readability are unchanged.
  Follow-up: use breakpoint-specific line wrappers only if exact editorial wraps
  are preferred over natural responsive wrapping.

## Required Fidelity Surfaces

- Fonts and typography: `MyKidsHandwritten` is used for emotional headings and
  Inter for body, controls, promises, and FAQ text. Weight, line height, and
  hierarchy match the reference intent.
- Spacing and layout rhythm: split hero, open promise row, alternating journey,
  role columns, FAQ, and closing panel match the reference sequence and density.
  Desktop normalized height is within about 5% of the source composite.
- Colors and tokens: lavender canvas, navy copy, coral actions and underlines,
  and periwinkle accents are preserved. Dark mode has readable token-based
  adaptations.
- Image quality and asset fidelity: all requested existing photographs load at
  full resolution with purposeful crops and soft edge blending. The source photo
  subjects differ by design because the approved plan maps existing project
  assets rather than introducing replacement photography.
- Copy and content: all requested headings, promises, five stages, role lists,
  FAQs, and CTA destinations are present. Stage `4` is restored.
- Icons and controls: Lucide icons are consistently sized and aligned. Native
  FAQ disclosure controls work with pointer and keyboard interaction.
- Responsiveness and accessibility: desktop, tablet, and 390px mobile have no
  horizontal overflow. The mobile quote CTA ends at 497px in an 844px opening
  viewport. Meaningful alt text, focus styles, reduced motion, and accessible
  heading labels are present.

## Intentional Differences

- The concept pill is removed as explicitly required.
- The existing global navigation, logo, quote CTA, and theme toggle are retained.
- Existing mapped project photography replaces the exact photographic subjects
  shown in the source screenshot.
- Marker `4` is included even though it is missing from the supplied reference.

## Patches Made During QA

- Centered all five journey markers on the dashed path.
- Preserved path alignment under reduced motion.
- Reduced desktop full-page height from 3852 to 3185 CSS pixels.
- Tightened promise, journey, role, FAQ, and closing section rhythm.
- Corrected promise typography and role checklist color treatment.
- Added desktop, mobile, and dark-theme browser coverage.

## Final Result

final result: passed
