# 07 — Agent Legibility — codebyLeon

---

## What's Already Legible

This project has strong agent-legibility foundations:

| Capability | Status | Where |
|-----------|--------|-------|
| CSS architecture documented | ✅ | `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md` |
| Component → CSS mapping documented | ✅ | `docs/CSS_COMPONENT_OWNERSHIP.md` |
| GSAP reference library | ✅ | `GSAP/` (14 topic guides) |
| Test suite runnable | ✅ | `npm run test`, `npm run test:visual` |
| CSS gates automated | ✅ | `npm run css:gates` |
| Dev server headless | ✅ | `npm run dev` / `vite --host` |
| Visual regression tests | ✅ | Playwright configured |
| Dark/light mode strategy | ✅ | `docs/theme_strategy.md` |

---

## What Needs Improvement

| Gap | Impact | Fix |
|-----|--------|-----|
| No `AGENTS.md` at project root | Agents don't know where to start | Copy `ENG WORKFLOW/AGENTS.md` to project root |
| No master doc index | Agents must guess which of 12 docs to read | Create `docs/index.md` |
| No architecture diagram | Agents can't see layer boundaries | Create `docs/ARCHITECTURE.md` |
| Root littered with report files | Agents pick up stale context | Reorganize into `docs/` subdirectories |
| GSAP conventions spread across 14 files | Agent may miss critical patterns | `GSAP/overview.md` acts as entry point — it's good but could link to "must-read" vs "reference" |

---

## Navigation Cheat Sheet for Agents

```
"I need to change a section's appearance"
  → docs/CSS_COMPONENT_OWNERSHIP.md  (find the right CSS file)
  → src/styles/sections/[name].css    (edit it)

"I need to add an animation"
  → GSAP/overview.md                  (patterns and setup)
  → GSAP/scrolltrigger/usage.md       (if scroll-triggered)
  → GSAP/react/useGSAP.md             (React integration)

"I need to understand the dark mode"
  → docs/theme_strategy.md            (strategy)
  → src/styles/tokens/colors.css      (CSS variables)
  → src/contexts/ThemeContext.tsx      (toggle logic)

"I need to add a new page section"
  → src/components/sections/          (create component here)
  → src/styles/sections/              (create CSS here)
  → src/pages/HomePage.tsx            (compose it here)
  → docs/CSS_COMPONENT_OWNERSHIP.md   (register ownership)

"I need to fix a bug"
  → npm run test                      (which tests fail?)
  → npm run build                     (type errors?)
  → npm run css:gates                 (architecture violations?)

"I need to understand what was built before"
  → TASK_*_COMPLETION_SUMMARY.md      (completed work history)
  → MIGRATION_*.md                    (CSS architecture evolution)
```

---

## Technology Legibility in This Project

| Technology | Agent Legibility | Notes |
|-----------|:----------------:|-------|
| React 18 | ✅ High | Well-represented in training data |
| TypeScript | ✅ High | Types make code self-documenting |
| Vite | ✅ High | Simple, well-documented config |
| GSAP | 🟡 Medium | Powerful but requires domain knowledge — mitigated by `GSAP/` reference library |
| Tailwind CSS | 🟡 Medium | Utility classes are dense — mitigated by custom CSS architecture docs |
| Playwright | ✅ High | Standard API for browser automation |
| Vitest | ✅ High | Jest-compatible, well-documented |
