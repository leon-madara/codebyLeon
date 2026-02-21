# AGENTS.md — codebyLeon Agent Guide

> **Read this file first.** It is the entry point for understanding this project. Follow the pointers to deeper docs before making changes.

---

## Project Overview

**Name:** codebyLeon  
**Stack:** React 18 + Vite 5 + TypeScript + GSAP 3 + Tailwind CSS 3  
**Description:** A portfolio/agency website for CodeByLeon featuring scroll-driven animations, cinematic reveals, interactive mouse effects, and a blog.

---

## Directory Structure

```
codebyLeon/
├── src/
│   ├── components/
│   │   ├── sections/           ← Page sections: Hero, About, Portfolio, Blog, FinalCTA
│   │   ├── HorizontalScroll/   ← Services horizontal scroll component
│   │   ├── StoryScroll/        ← Story scroll animation system
│   │   ├── Blog/               ← Blog card and listing components
│   │   ├── MouseTrail/         ← Canvas-based mouse trail effect
│   │   ├── Layout/             ← Navigation and layout wrappers
│   │   └── ui/                 ← Shared UI primitives (Button, Toast, etc.)
│   ├── pages/                  ← Route-level pages: HomePage, BlogListingPage, BlogPostPage
│   ├── styles/
│   │   ├── tokens/             ← Design tokens (colors, typography, spacing, shadows, animations)
│   │   ├── base/               ← Reset, global defaults
│   │   ├── components/         ← Component-scoped styles
│   │   ├── sections/           ← Section-scoped styles (hero.css, portfolio.css, etc.)
│   │   ├── features/           ← Feature-specific styles (blog, horizontal-scroll)
│   │   ├── layout/             ← Layout styles (navigation)
│   │   └── utilities/          ← Utility classes
│   ├── hooks/                  ← Custom hooks: useScrollAnimation, useTypingAnimation, use-mobile, use-toast
│   ├── utils/                  ← Utilities: blogUtils, runtimeFlags
│   ├── contexts/               ← ThemeContext (dark/light mode)
│   ├── data/                   ← Static data files
│   ├── lib/                    ← Third-party wrappers
│   ├── assets/                 ← Images, fonts, static assets
│   └── test/                   ← Vitest unit tests + Playwright visual tests + CSS architecture gates
├── docs/                       ← System of record (see Key Documentation below)
├── GSAP/                       ← GSAP reference docs (14 topic guides)
├── ENG WORKFLOW/               ← Agent workflow guides
├── public/                     ← Static public assets
└── [config files]              ← package.json, vite.config.ts, tsconfig.json, tailwind.config.ts, playwright.config.ts
```

---

## Key Documentation (Read Before Making Changes)

| Doc | Purpose |
|-----|---------|
| `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md` | CSS layer hierarchy and style rules |
| `docs/CSS_COMPONENT_OWNERSHIP.md` | 1:1 mapping of CSS files to components |
| `docs/CSS_ARCHITECTURE_AVOID.md` | CSS anti-patterns to avoid |
| `docs/CSS_GUIDE.md` | General CSS conventions |
| `docs/CSS_ONBOARDING_GUIDE.md` | Onboarding guide for CSS in this project |
| `docs/theme_strategy.md` | Dark/light mode implementation |
| `docs/hero_design_spec.md` | Hero section design specification |
| `docs/configurator_spec.md` | Service configurator specification |
| `GSAP/overview.md` | GSAP integration patterns and plugin reference |
| `GLOBAL_CHANGE_EXECUTION_PLAYBOOK.md` | Global modification/new-feature workflow and decision protocol |
| `docs/CODEBYLEON_CHANGE_EXECUTION_PLAYBOOK.md` | Project-specific execution workflow to use with this file |

---

## Rules for Agents

### Must Follow
1. **Read `docs/CSS_COMPONENT_OWNERSHIP.md` before touching any CSS.** Every component has exactly one CSS file — don't create duplicates.
2. **No `!important` declarations.** Solve specificity by restructuring the cascade. See `docs/CSS_ARCHITECTURE_AVOID.md`.
3. **All scroll-triggered animations use GSAP ScrollTrigger.** No CSS `scroll()` animations. See `GSAP/scrolltrigger/usage.md`.
4. **Use `useGSAP` hook for all GSAP animations.** Never use `useEffect` for GSAP — it breaks cleanup. See `GSAP/react/useGSAP.md`.
5. **CSS follows the token → base → component → section → feature → utility layer order.** See `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md`.
6. **Dark mode uses CSS custom properties via ThemeContext.** See `docs/theme_strategy.md`.
7. **Run tests before opening a PR.** `npm run test` (unit) and `npm run build` (type-check) must pass.

### Anti-Patterns to Avoid
- No inline styles — use CSS files mapped to the component
- No raw CSS transitions for scroll-driven effects — use GSAP
- No direct DOM manipulation — use React refs + GSAP
- No mixing animation systems (CSS animations + GSAP on the same element)
- No `any` TypeScript types — use proper interfaces

---

## Testing

```bash
# Unit tests (Vitest)
npm run test

# Visual regression tests (Playwright)
npm run test:visual

# CSS architecture gate checks
npm run css:gates

# Type-check + build
npm run build
```

---

## How to Get Context

1. **Start here** → This file
2. **CSS rules** → `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md`
3. **Component ownership** → `docs/CSS_COMPONENT_OWNERSHIP.md`
4. **GSAP patterns** → `GSAP/overview.md`
5. **Design specs** → `docs/hero_design_spec.md`, `docs/configurator_spec.md`
6. **Theme/dark mode** → `docs/theme_strategy.md`
7. **Agent workflow** → `ENG WORKFLOW/01_WORKFLOW.md`
8. **Global change protocol** → `GLOBAL_CHANGE_EXECUTION_PLAYBOOK.md`
9. **Project change protocol** → `docs/CODEBYLEON_CHANGE_EXECUTION_PLAYBOOK.md`
