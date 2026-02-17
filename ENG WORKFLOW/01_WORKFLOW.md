# 01 — Workflow & Operating Model — codebyLeon

> "Humans steer. Agents execute."

---

## How We Work on codebyLeon

### The Prompt → Build → Validate Cycle

```
1. STEER    → Human identifies what to build/fix + points to relevant docs
2. PLAN     → Agent reads AGENTS.md → docs → creates an execution plan
3. EXECUTE  → Agent writes code, CSS, tests
4. VALIDATE → Agent runs:  npm run build  |  npm run test  |  npm run css:gates
5. REVIEW   → Human reviews PR or visual output in browser
6. LEARN    → Capture lessons in docs or golden principles
```

### For This Project Specifically

| Task Type | Approach |
|-----------|----------|
| **CSS change** | Read `docs/CSS_COMPONENT_OWNERSHIP.md` first → edit the correct file → run `css:gates` |
| **Animation change** | Read `GSAP/overview.md` + relevant sub-guide → use `useGSAP` hook → test visually |
| **New section** | Create component in `src/components/sections/` → create matching CSS in `src/styles/sections/` → add to `HomePage.tsx` |
| **Blog change** | Edit in `src/components/Blog/` → update `blogUtils.ts` if needed → run unit tests |
| **Theme/dark mode** | Edit CSS custom properties in `src/styles/tokens/colors.css` → follow `docs/theme_strategy.md` |

---

## Autonomy Levels for codebyLeon

### Level 1 — Auto-Pilot (Agent handles end-to-end)
- Fix a CSS specificity issue
- Update colors in token files
- Fix a broken link or typo
- Remove dead code

### Level 2 — Review diffs only
- Add a new blog post
- Adjust animation timing values
- Add responsive breakpoints
- Update an existing component's styles

### Level 3 — Plan first, then execute
- Add a new page section
- Redesign a component (e.g., portfolio cards)
- Implement a new animation pattern (e.g., cinematic reveal)
- Refactor CSS architecture

### Level 4 — Human decides
- Technology changes (e.g., drop Tailwind, change build tool)
- Major section redesigns
- New routes or page-level architecture

---

## When Something Goes Wrong

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| CSS styles not applying | Wrong file or specificity issue | Check `docs/CSS_COMPONENT_OWNERSHIP.md`, check layer order |
| GSAP animation conflicts | Multiple ScrollTriggers on same element | Check for competing `pin: true` or timeline conflicts |
| Dark mode broken | CSS variable not set for dark theme | Check `src/styles/tokens/colors.css` for `[data-theme="dark"]` |
| Build fails | TypeScript type errors | Fix type definitions, avoid `any` |
| Visual regression | CSS change affected another section | Run `npm run test:visual` and compare screenshots |
