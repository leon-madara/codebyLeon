# 05 — Golden Principles — codebyLeon

---

## Active Principles

### GP-01: One CSS File Per Component

**Rule:** Every component in `src/components/` has exactly one corresponding CSS file in `src/styles/`. No shared CSS files, no orphan CSS files.  
**Why:** Orphan styles cause unpredictable cascading. Agents need a 1:1 map to know where to edit.  
**Enforced by:** `docs/CSS_COMPONENT_OWNERSHIP.md` (manual). Target: structural test.  
**Remediation:** Find the correct file in `docs/CSS_COMPONENT_OWNERSHIP.md`. If it doesn't exist, create it in the matching `src/styles/` subdirectory.

### GP-02: No `!important` Declarations

**Rule:** Zero `!important` in any CSS file under `src/styles/`.  
**Why:** Specificity wars make CSS unpredictable, especially when agents add new rules. Once one `!important` exists, more follow.  
**Enforced by:** `grep -rn '!important' src/styles/` (manual). Target: CI gate.  
**Remediation:** Restructure the cascade order in `src/index.css`, increase selector specificity naturally, or move the rule to the `utilities/` layer.

### GP-03: All Scroll Animations Use GSAP

**Rule:** Any animation triggered by scrolling must use GSAP ScrollTrigger. No CSS `scroll()` or `animation-timeline` properties.  
**Why:** Mixing animation systems creates conflicts (e.g., the portfolio pinning bug). One system means one debugging surface.  
**Enforced by:** Manual review. Target: grep for `animation-timeline` and `scroll()` in CSS.  
**Remediation:** Implement using `gsap.to()` with `scrollTrigger: {}`. See `GSAP/scrolltrigger/usage.md`.

### GP-04: Use `useGSAP`, Never `useEffect` for Animations

**Rule:** All GSAP animations in React components must use the `useGSAP` hook from `@gsap/react`, not `useEffect`.  
**Why:** `useEffect` doesn't handle GSAP cleanup properly. Animations leak across re-renders and cause memory issues.  
**Enforced by:** Manual review. Target: grep for `useEffect.*gsap` patterns.  
**Remediation:** Replace `useEffect` with `useGSAP(() => { ... }, { scope: containerRef })`. See `GSAP/react/useGSAP.md`.

### GP-05: CSS Layer Order Is Sacred

**Rule:** The import order in `src/index.css` must follow: tokens → base → components → sections → features → layout → utilities.  
**Why:** CSS cascade depends on source order. Wrong order = wrong specificity = broken styles.  
**Enforced by:** `css:gates` script (checks architecture layers). ✅ Active.  
**Remediation:** Move the import statement to the correct position in `src/index.css` per `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md`.

### GP-06: Dark Mode Via CSS Custom Properties Only

**Rule:** Dark/light mode is implemented exclusively via CSS custom properties toggled by `[data-theme="dark"]`. No JavaScript-based style switching.  
**Why:** Consistency, performance, and avoiding flash-of-wrong-theme. Agents can reason about a single mechanism.  
**Enforced by:** Manual review + `docs/theme_strategy.md`.  
**Remediation:** Add dark mode values to `src/styles/tokens/colors.css` under the `[data-theme="dark"]` selector.

### GP-07: No Inline Styles

**Rule:** No `style={{}}` props on JSX elements except for truly dynamic values (e.g., computed positions).  
**Why:** Inline styles bypass the CSS architecture, create specificity issues, and are invisible to CSS tools and agents.  
**Enforced by:** `docs/CSS_INLINE_STYLES_GUIDE.md` (manual). Target: lint rule.  
**Remediation:** Move the styles to the component's CSS file. Use CSS custom properties for dynamic values if needed.
