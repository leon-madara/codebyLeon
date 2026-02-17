# 08 — Review & Merge — codebyLeon

---

## Review Tiers for This Project

### Tier 1: Auto-Merge (CI green = merge)
- Token value changes (colors, spacing, typography)
- Doc updates (fixing links, updating dates)
- Removing dead code / orphan files
- Formatting changes

### Tier 2: Quick Review (Skim the diff, 2 min)
- CSS style changes within existing sections
- Animation timing adjustments
- New blog posts added
- Test coverage additions
- Small refactors within one component

### Tier 3: Full Review (Detailed, 10+ min)
- New page sections (Hero, About, etc.)
- GSAP animation architecture changes (new ScrollTriggers, timeline restructuring)
- CSS architecture changes (new layers, import order)
- New routes or pages
- Component redesigns (e.g., portfolio cards)
- Changes to `ThemeContext` or dark mode strategy

---

## Pre-Merge Checklist

```bash
# Must pass before any merge
npm run build          # Type-check + build
npm run test           # Unit tests
npm run css:gates      # CSS architecture validation

# Should run for visual changes
npm run test:visual    # Playwright screenshots
```

---

## How to Review GSAP Changes

GSAP changes are the hardest to review in this codebase because effects are visual and time-based. Guidelines:

1. **Read the GSAP reference** before reviewing — `GSAP/overview.md`
2. **Check for competing animations** — Two ScrollTriggers targeting the same element = bugs
3. **Verify cleanup** — Must use `useGSAP`, not `useEffect`
4. **Test in browser** — Run `npm run dev` and manually scroll through the section
5. **Check mobile** — Use DevTools responsive mode, especially for `matchMedia` breakpoints

---

## Capturing Review Feedback

When a review comment reveals a systemic issue, don't just fix the PR — encode the rule:

| Comment | Action |
|---------|--------|
| "This CSS should be in the sections/ layer" | Verify `05_GOLDEN_PRINCIPLES.md` GP-05 covers this |
| "Don't use inline styles here" | Verify GP-07 is documented |
| "This GSAP animation leaks" | Verify GP-04 (`useGSAP` requirement) is clear |
| "This import violates architecture" | Add to enforcement gaps in `04_ARCHITECTURE_ENFORCEMENT.md` |
