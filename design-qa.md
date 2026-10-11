# Comparison-card refinement — visual QA
final result: passed

Reference: current Acquirly Featured opportunities list, https://acquirly.co/. Square white cards, title/icon group, lighter summary and a separate right detail column divided by a fine rule. Authored hover darkens borders/text over 240ms, without card lift. Current screenshot saved as acquirly-reference-card.jpg.

Implemented four shorter benefit titles, grounded summaries and separately labelled Common problem details. Existing fonts, equal cream/burnt-red halves and illustration preserved. Existing Lucide icons represent focused features, speed, brand and screens. Informational cards have no fabricated CTA, badge, metric or claim.

Hover warms border/background, changes icon tile colour and shifts only the icon 1px. GSAP retains ownership of scroll-driven card transforms. Reduced motion disables transitions and icon movement.

Verified:
- Scoped ESLint passes.
- 1440 x 900: equal halves, four separate cards, clear title/summary/problem hierarchy, light and dark themes.
- 1200 x 800 normal-motion Founder reveal: all four card opacities 1; last card bottom 727.58px inside stage bottom 777.78px; no horizontal overflow.
- 390 x 844: supporting details stack below summary with horizontal rule; all four reviewed in light/dark; no horizontal overflow.
- CSS hover simulation: normal icon transform translateY(-1px), 0.24s transitions; reduced-motion transform none and 0s. Forced states cleared.
- SVG hash unchanged: 0f1adf199a435c5a856eacca0b6f33753788049e3289d72c88fce71dbbbb38c9. Figma not touched.

Copy review: retained confirmed principles of needs-led features, page-speed checks before launch, business/content-led design and device-layout checks. Corrected mismatched update-attention/page-speed association. No performance guarantees or new services.

Limits: full TypeScript remains blocked by previously observed errors outside changed files; not rerun for this CSS/content refinement. Preview restarted on port 3101. No commit, push or deployment.

