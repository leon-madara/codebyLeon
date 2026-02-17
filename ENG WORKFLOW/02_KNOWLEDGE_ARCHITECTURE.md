# 02 — Knowledge Architecture — codebyLeon

---

## Current Documentation Map

```
AGENTS.md                                  ← Entry point (this project's routing table)
│
├── docs/
│   ├── CSS_ARCHITECTURE_STYLE_GUIDE.md    ← CSS layer hierarchy and rules
│   ├── CSS_COMPONENT_OWNERSHIP.md         ← 1:1 CSS-to-component mapping
│   ├── CSS_ARCHITECTURE_AVOID.md          ← CSS anti-patterns
│   ├── CSS_GUIDE.md                       ← General CSS conventions
│   ├── CSS_ONBOARDING_GUIDE.md            ← New developer CSS onboarding
│   ├── CSS_INLINE_STYLES_GUIDE.md         ← Inline styles policy
│   ├── CSS_PERFORMANCE_REPORT.md          ← Performance metrics
│   ├── hero_design_spec.md                ← Hero section spec
│   ├── configurator_spec.md               ← Service configurator spec
│   ├── configurator_enhanced_spec.md       ← Enhanced configurator spec
│   ├── theme_strategy.md                  ← Dark/light mode strategy
│   └── HORIZONTAL_SCROLL_REFACTOR_SUMMARY.md ← Refactor log
│
├── GSAP/                                  ← Animation reference library
│   ├── overview.md                        ← GSAP entry point
│   ├── scrolltrigger/usage.md             ← ScrollTrigger guide
│   ├── react/useGSAP.md                   ← React integration
│   ├── tweens/usage.md                    ← Basic animations
│   ├── timeline/usage.md                  ← Sequencing
│   └── [11 more topic guides]
│
├── CSS Rules/                             ← Additional CSS ruleset docs
│
├── Build Plans/
│   └── website_content_strategy_implementation.md
│
└── ENG WORKFLOW/                          ← This folder — agent operating guides
```

---

## Target Structure (What To Build Toward)

```
docs/
├── index.md                              ← Master index (CREATE)
├── ARCHITECTURE.md                       ← System boundaries (CREATE)
├── GOLDEN_PRINCIPLES.md                  ← Non-negotiable rules (CREATE)
│
├── design-docs/
│   ├── hero_design_spec.md               ← MOVE from docs/
│   ├── configurator_spec.md              ← MOVE from docs/
│   └── configurator_enhanced_spec.md     ← MOVE from docs/
│
├── exec-plans/
│   ├── active/                           ← Currently active plans
│   ├── completed/                        ← MOVE TASK_*_SUMMARY.md files here
│   └── tech-debt-tracker.md              ← CREATE
│
├── references/
│   ├── CSS_ARCHITECTURE_STYLE_GUIDE.md   ← MOVE from docs/
│   ├── CSS_COMPONENT_OWNERSHIP.md        ← MOVE from docs/
│   ├── CSS_GUIDE.md                      ← MOVE from docs/
│   ├── CSS_ONBOARDING_GUIDE.md           ← MOVE from docs/
│   ├── CSS_INLINE_STYLES_GUIDE.md        ← MOVE from docs/
│   ├── CSS_ARCHITECTURE_AVOID.md         ← MOVE from docs/
│   └── theme_strategy.md                 ← MOVE from docs/
│
└── reports/
    ├── CSS_PERFORMANCE_REPORT.md         ← MOVE from docs/
    └── [MOVE root-level *_REPORT.md and *_SUMMARY.md files here]
```

---

## What Lives Where in This Project

| Content | Location |
|---------|----------|
| How agents should navigate this project | `AGENTS.md` (project root) |
| CSS architecture rules | `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md` |
| Which CSS file owns which component | `docs/CSS_COMPONENT_OWNERSHIP.md` |
| GSAP animation patterns | `GSAP/overview.md` → sub-guides |
| Design specifications | `docs/hero_design_spec.md`, etc. |
| Theme/dark mode approach | `docs/theme_strategy.md` |
| Agent workflow instructions | `ENG WORKFLOW/` |
| Build/content strategy | `Build Plans/` |

---

## Rules for Knowledge in This Project

1. **CSS decisions go in `docs/`** — This project has deep CSS architecture; every convention must be documented
2. **GSAP patterns go in `GSAP/`** — Animation patterns, plugin usage, and gotchas
3. **Design specs go in `docs/` (future: `docs/design-docs/`)** — Every section's visual spec
4. **Completed task summaries go in `docs/` (future: `docs/exec-plans/completed/`)** — Not the project root
5. **Reports go in `docs/` (future: `docs/reports/`)** — Performance reports, audit results
