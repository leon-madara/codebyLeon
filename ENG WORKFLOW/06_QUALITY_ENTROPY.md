# 06 — Quality & Entropy — codebyLeon

---

## Quality Scorecard

> Last updated: 2026-02-17

| Domain | Score | Trend | Top Issue |
|--------|:-----:|:-----:|-----------|
| Hero Section | B | ↑ | Cinematic reveal recently added, needs polish |
| Portfolio Section | C | ↓ | `position: sticky` pinning broken |
| About Section | B | → | Stable |
| Blog Section | A | → | Well-tested with blogUtils |
| Services / HorizontalScroll | B | → | Functional, complex GSAP |
| CSS Architecture | B | ↑ | Layer system works, few `!important` leaks remain |
| Test Coverage | B | ↑ | Vitest + Playwright + CSS gates active |
| Documentation | C | ↓ | 13+ files cluttering root, no index |
| Repo Hygiene | D | → | Stale reports, orphan scripts, flat structure |

---

## Known Entropy in This Project

### Root-Level Clutter
13 `TASK_*`, `MIGRATION_*`, and `*_REPORT.md` files at the project root. These should be in `docs/exec-plans/completed/` or `docs/reports/`.

### Stale/Orphan Files
- `fix_pins.py` — Python script in a JS project, likely a one-off
- `SPECIFICITY_AUDIT_REPORT.md` — 555 bytes, incomplete
- `current.png` — Unclear purpose, sitting in root
- `build.log` — Should not be committed

### Pattern Drift Risks
- Portfolio section has competing GSAP pin + CSS sticky approaches (historical conflict)
- Multiple migration summaries suggest the CSS architecture has been through several refactors — check for leftover old patterns

---

## Cleanup Actions

### Quick Wins (15 min each)
- [ ] Delete `fix_pins.py` (one-off script, no longer needed)
- [ ] Delete or update `SPECIFICITY_AUDIT_REPORT.md` (555 bytes, incomplete)
- [ ] Add `build.log` to `.gitignore`
- [ ] Move `current.png` to `public/` or delete

### Organizational (30 min total)
- [ ] Move `TASK_*_COMPLETION_SUMMARY.md` files → `docs/exec-plans/completed/`
- [ ] Move `MIGRATION_*.md` files → `docs/exec-plans/completed/`
- [ ] Move `*_REPORT.md` and `*_AUDIT_REPORT.md` files → `docs/reports/`
- [ ] Create `docs/index.md` with links to all docs

### Structural (1-2 hrs)
- [ ] Create `docs/ARCHITECTURE.md` based on the layer model in `04_ARCHITECTURE_ENFORCEMENT.md`
- [ ] Add `!important` grep check to CI or `css:gates`
- [ ] Audit CSS files for orphan selectors that match no elements

---

## Recurring Schedule

| Task | Frequency | Tool |
|------|-----------|------|
| Check for `!important` leaks | Per PR | `grep -rn '!important' src/styles/` |
| Review quality scorecard | Weekly | Update this file |
| Check for stale docs | Bi-weekly | `find docs/ -mtime +30` |
| Dead code scan | Monthly | Check for unused exports/components |
| Dependency audit | Monthly | `npm audit` |
