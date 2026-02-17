# 03 — Execution Plans — codebyLeon

---

## Active Plans

Place active execution plans in this project's `docs/exec-plans/active/` directory.

### Current Known Active Work

| Area | Status | Notes |
|------|--------|-------|
| Portfolio section pinning | 🔴 Broken | CSS `position: sticky` not working correctly — see root cause analysis |
| Cinematic reveal (Hero) | 🟡 Implemented | Preloader + Hero scale animation — needs polish |
| Service configurator | 🟡 Partial | `get-started.html` exists but integration needs work |

---

## Completed Work Archive

Move these root-level files to `docs/exec-plans/completed/` when restructuring:

| File | Content |
|------|---------|
| `TASK_23_COMPLETION_SUMMARY.md` | Task 23 results |
| `TASK_24_COMPLETION_SUMMARY.md` | Task 24 results |
| `TASK_25_COMPLETION_SUMMARY.md` | Task 25 results |
| `TASK_26_COMPLETION_SUMMARY.md` | Task 26 results |
| `TASK_27_COMPLETION_SUMMARY.md` | Task 27 results |
| `TASK_29_COMPLETION_SUMMARY.md` | Task 29 results |
| `TASK_30_1_BUNDLE_SIZE_COMPARISON.md` | Bundle size analysis |
| `TASK_31_DOCUMENTATION_COMPLETE.md` | Documentation audit |
| `MIGRATION_COMPLETE.md` | Migration results |
| `MIGRATION_FINAL_SUMMARY.md` | Migration summary |
| `MIGRATION_PHASE1_COMPLETE.md` | Phase 1 migration |
| `MIGRATION_PHASE2_COMPLETE.md` | Phase 2 migration |
| `MIGRATION_PHASE3_COMPLETE.md` | Phase 3 migration |

---

## Tech Debt Tracker

| Priority | Debt | Impact | Location | Effort |
|:--------:|------|--------|----------|:------:|
| 🔴 | Portfolio `position: sticky` not pinning | Section doesn't stay fixed during scroll | `src/components/sections/Portfolio.tsx`, `src/styles/sections/portfolio.css` | M |
| 🟡 | Root-level report/summary files cluttering repo | Hard to navigate, stale docs | Project root (`*_REPORT.md`, `TASK_*.md`) | S |
| 🟡 | `fix_pins.py` — Python script in a JS project | Doesn't belong, likely one-off | `fix_pins.py` | S |
| 🟡 | `SPECIFICITY_AUDIT_REPORT.md` — 555 bytes, likely incomplete | Dead/stale doc | Project root | S |
| 🟢 | No `docs/index.md` master index | Agents must guess which doc to read | `docs/` | S |
| 🟢 | No `docs/ARCHITECTURE.md` | No system-level architecture map | `docs/` | M |

---

## Plan Templates

Use the templates from the global `ENG WORKFLOW/03_EXECUTION_PLANS.md` for creating new plans specific to this project.
