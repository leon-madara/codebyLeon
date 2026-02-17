# 04 — Architecture & Enforcement — codebyLeon

---

## System Architecture

### Layer Model

```
┌─────────────────────────────────────────────────────────┐
│  ENTRY POINTS                                           │
│  src/main.tsx → src/App.tsx → src/pages/                │
│  (Routing, providers, lazy loading)                     │
└────────────────────────┬────────────────────────────────┘
                         │ imports
┌────────────────────────▼────────────────────────────────┐
│  PAGES                                                  │
│  src/pages/HomePage.tsx, BlogListingPage, BlogPostPage  │
│  (Compose sections, manage scroll context)              │
└────────────────────────┬────────────────────────────────┘
                         │ imports
┌────────────────────────▼────────────────────────────────┐
│  SECTIONS                                               │
│  src/components/sections/ — Hero, About, Portfolio,     │
│  Blog, FinalCTA                                         │
│  (Self-contained page segments with own animations)     │
└────────────────────────┬────────────────────────────────┘
                         │ imports
┌────────────────────────▼────────────────────────────────┐
│  FEATURES                                               │
│  src/components/HorizontalScroll/, StoryScroll/,        │
│  MouseTrail/, Blog/                                     │
│  (Complex interactive systems)                          │
└────────────────────────┬────────────────────────────────┘
                         │ imports
┌────────────────────────▼────────────────────────────────┐
│  UI PRIMITIVES + HOOKS                                  │
│  src/components/ui/ — Button, Toast, etc.               │
│  src/hooks/ — useScrollAnimation, useTypingAnimation    │
│  (Reusable, context-free building blocks)               │
└────────────────────────┬────────────────────────────────┘
                         │ imports
┌────────────────────────▼────────────────────────────────┐
│  CORE                                                   │
│  src/utils/ — blogUtils, runtimeFlags                   │
│  src/contexts/ — ThemeContext                            │
│  src/data/ — Static data                                │
│  (Zero UI dependencies)                                 │
└─────────────────────────────────────────────────────────┘
```

### Dependency Rules

| Layer | Can Import From | Cannot Import From |
|-------|----------------|-------------------|
| Entry Points | Everything | — |
| Pages | Sections, Features, UI, Hooks, Core | — |
| Sections | Features, UI, Hooks, Core | Pages, Entry Points |
| Features | UI, Hooks, Core | Pages, Sections, Entry Points |
| UI / Hooks | Core | Pages, Sections, Features |
| Core | Nothing project-internal | Everything above |

### CSS Layer Model

```
tokens/    → Design tokens (variables, no selectors)
base/      → Reset, defaults, html/body
components/ → Component styles (.button, .toast)
sections/  → Section styles (.hero, .portfolio)
features/  → Feature styles (.blog, .horizontal-scroll)
layout/    → Layout styles (.navigation)
utilities/ → Utility overrides (last in cascade)
```

**Import order in `index.css` must match this order.** Tokens first, utilities last.

---

## Current Enforcement

| Gate | Command | Status |
|------|---------|--------|
| TypeScript type-check | `npm run build` (includes `tsc`) | ✅ Active |
| Unit tests | `npm run test` | ✅ Active |
| CSS architecture gates | `npm run css:gates` | ✅ Active |
| CSS baseline comparison | `npm run css:compare` | ✅ Active |
| Visual regression | `npm run test:visual` | ✅ Active |

---

## Enforcement Gaps to Fill

| What | Type | Priority |
|------|------|:--------:|
| JS import boundary lint (sections can't import pages) | Structural test | 🟡 |
| CSS `!important` grep check in CI | Lint script | 🔴 |
| File size warnings (>400 lines) | Lint script | 🟢 |
| Component-to-CSS naming match check | Structural test | 🟡 |
| Stale docs detection | CI job | 🟢 |

---

## Naming Conventions

```
Component:   src/components/sections/Hero.tsx
CSS file:    src/styles/sections/hero.css
Test file:   src/test/components/sections/Hero.test.tsx (or co-located)
Design spec: docs/hero_design_spec.md
```

The agent should be able to find any component's CSS, tests, and spec by convention.
