# CSS Architecture: What to Avoid (Guideline)

This document captures issues found during the refactor and follow-up fixes. It is a short reference for what **not** to do in this codebase to prevent regressions.

## 1. Global Feature Styles That Leak
**Avoid:** Global class names in feature CSS that can be used elsewhere (`.orbs-container`, `.frosted-overlay`, `.orb`).

**Why:** These can unintentionally override or cover other sections. A fixed-position overlay in a feature file can hide the entire app if reused.

**Do instead:** Scope feature styles under a feature root (`.configurator-page .orbs-container`) or use BEM names that cannot collide (`.configurator__orbs`).

## 2. Legacy Class Names After BEM Migration
**Avoid:** Continuing to use legacy classes like `.section-content`, `.blog-card`, `.blog-grid` after the BEM structure is in place.

**Why:** It creates parallel systems and makes ownership unclear. It also blocks cleaning up legacy mappings and increases specificity risk.

**Do instead:** Migrate JSX/HTML to BEM classes and remove legacy mappings once migration is complete.

## 3. Component Styles in Section Files
**Avoid:** Styling shared components (cards, buttons) inside section styles.

**Why:** It violates component ownership, duplicates styles, and causes cascade conflicts.

**Do instead:** Keep reusable UI in `src/styles/components/` and use modifiers (`.card--blog`) for variants.

## 4. Unscoped Static HTML Assets
**Avoid:** Relative asset paths in standalone HTML pages like `get-started.html` (`src/styles/...`).

**Why:** When accessed via `/get-started.html`, relative paths can resolve incorrectly and CSS/JS will not load.

**Do instead:** Use absolute paths (`/src/index.css`, `/src/styles/...`) or configure a dedicated build/route.

## 5. Token Usage Regression
**Avoid:** Hardcoded colors, spacing, or typography values in new styles.

**Why:** It bypasses the token system and makes theme adjustments brittle.

**Do instead:** Use token variables from `src/styles/tokens/` for all design values.

## 6. Specificity Escalation
**Avoid:** Compound selectors and specificity hacks (`nav.navbar .cta-button`, `section .btn-primary`).

**Why:** These defeat the refactor’s specificity rules and reintroduce “specificity wars”.

**Do instead:** Keep selectors to single class or BEM modifier/state classes with max specificity `(0,0,2,0)`.

## 7. Mixed Naming Conventions
**Avoid:** Mixing BEM classes with unrelated, generic class names in the same component.

**Why:** It confuses ownership and makes it unclear where styles should live.

**Do instead:** Use BEM consistently and reserve generic utilities for Tailwind or the utilities layer only.

## 8. Cross-Page CSS Imports Without Token Base
**Avoid:** Loading feature CSS without the token/base layer.

**Why:** Feature CSS assumes tokens are defined; missing them breaks colors, spacing, and layout.

**Do instead:** Ensure `src/index.css` (or an equivalent token/base bundle) is included before feature CSS in standalone pages.

