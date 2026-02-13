# CSS Architecture Guide

## Overview

This guide documents the CSS architecture for the Code by Leon project. It explains the cascade order, naming conventions, file organization, and best practices for maintaining and extending the stylesheet system.

**Last Updated:** Phase 1 Complete (February 2026)  
**Architecture Version:** 2.0 (Post-Refactor)

---

## Table of Contents

1. [Cascade Order](#cascade-order)
2. [Directory Structure](#directory-structure)
3. [Import Order Rationale](#import-order-rationale)
4. [Naming Conventions](#naming-conventions)
5. [Specificity Rules](#specificity-rules)
6. [Styling Decision Tree](#styling-decision-tree)
7. [Theme System](#theme-system)
8. [Common Patterns](#common-patterns)
9. [Migration Status](#migration-status)
10. [Troubleshooting](#troubleshooting)

---

## Cascade Order

The CSS cascade order is **critical** for maintaining predictable styling behavior. All imports are orchestrated through `src/index.css` in the following order:

```
1. Fonts (External)
   ↓
2. Tailwind Base (Reset)
   ↓
3. Design Tokens
   ↓
4. Base Styles
   ↓
5. Legacy Files (Temporary)
   ↓
6. Tailwind Components
   ↓
7. Layout Components
   ↓
8. Reusable Components
   ↓
9. Page Sections
   ↓
10. Features
   ↓
11. Tailwind Utilities
   ↓
12. Utility Overrides
```

### Why This Order?

Each layer builds on the previous one, with specificity increasing as you move down:

- **Fonts first** → Prevents Flash of Unstyled Text (FOUT)
- **Tailwind base** → Establishes consistent browser baseline
- **Tokens** → Foundation variables available to all subsequent styles
- **Base styles** → Global element defaults using tokens
- **Components before sections** → Sections can use component styles
- **Utilities last** → Can override anything when needed

---

## Directory Structure

```
src/styles/
├── tokens/              # Design tokens (CSS custom properties)
│   ├── colors.css       # Color palette and semantic colors
│   ├── typography.css   # Font families, sizes, weights
│   ├── spacing.css      # Spacing scale and breakpoints
│   ├── shadows.css      # Shadow definitions
│   └── animations.css   # Animation timing and easing
│
├── base/                # Global base styles
│   ├── reset.css        # Additional CSS reset/normalize
│   ├── global.css       # Global element styles (body, headings)
│   └── theme.css        # Dark mode theme overrides
│
├── layout/              # Structural layout components
│   ├── navigation.css   # [Phase 2] Navigation component
│   ├── footer.css       # [Phase 2] Footer component
│   └── grid.css         # [Phase 2] Layout grids
│
├── components/          # Reusable UI components
│   ├── buttons.css      # [Phase 2] All button variants
│   ├── cards.css        # [Phase 2] Card components
│   ├── forms.css        # [Phase 2] Form elements
│   └── modals.css       # [Phase 2] Modal components
│
├── sections/            # Page-specific sections
│   ├── hero.css         # [Phase 3] Hero section only
│   ├── services.css     # [Phase 3] Services section
│   ├── portfolio.css    # [Phase 3] Portfolio section
│   ├── about.css        # [Phase 3] About section
│   └── blog.css         # [Phase 3] Blog section
│
├── features/            # Complex feature-specific styles
│   ├── mouse-trail.css          # [Phase 3] Mouse trail effect
│   ├── configurator.css         # [Phase 3] Configurator page
│   └── horizontal-scroll.css    # [Phase 3] Horizontal scroll
│
├── utilities/           # Utility classes and helpers
│   ├── animations.css   # [Phase 4] Animation utilities
│   ├── helpers.css      # [Phase 4] Helper classes
│   └── responsive.css   # [Phase 4] Responsive utilities
│
└── [LEGACY]             # Files to be removed in Phase 3
    ├── hero.css         # ⚠️ 2,464 lines - being decomposed
    └── configurator.css # ⚠️ Moving to features/
```

---

## Import Order Rationale

### PostCSS Constraint

**Critical Rule:** All `@import` statements must come before `@tailwind` directives.

This is a PostCSS requirement. The current structure in `src/index.css`:

```css
/* ✅ CORRECT ORDER */
@import url('fonts...');           /* 1. External dependencies */
@import './styles/tokens/...';     /* 2. Design tokens */
@import './styles/base/...';       /* 3. Base styles */
@import './styles/hero.css';       /* 4. Legacy files */

@tailwind base;                    /* 5. Tailwind layers */
@tailwind components;
@tailwind utilities;
```

```css
/* ❌ WRONG - Will cause build errors */
@tailwind base;
@import './styles/tokens/colors.css';  /* Error: @import after @tailwind */
```

### Cascade Control Strategy

Since all imports must come first, we control cascade order through:

1. **Import sequence** - Files imported later override earlier files
2. **Specificity management** - Keep all selectors ≤ (0,0,2,0)
3. **Tailwind layers** - Strategic placement of base/components/utilities

---

## Naming Conventions

We use **BEM-inspired** naming for clarity and maintainability.

### Block (Component/Section)

```css
.navigation { }
.button { }
.card { }
.hero { }
```

### Element (Part of a block)

Use double underscore `__`:

```css
.navigation__link { }
.navigation__logo { }
.button__icon { }
.card__title { }
.card__description { }
```

### Modifier (Variant)

Use double dash `--`:

```css
.button--primary { }
.button--secondary { }
.card--featured { }
.navigation__link--active { }
```

### State (Temporary state)

Use `is-` prefix:

```css
.navigation.is-scrolled { }
.button.is-loading { }
.button.is-disabled { }
.modal.is-open { }
```

### Examples

```css
/* ✅ GOOD - Clear, semantic, BEM-compliant */
.blog-card { }
.blog-card__title { }
.blog-card__description { }
.blog-card--featured { }
.blog-card.is-loading { }

/* ❌ BAD - Generic, unclear, non-BEM */
.card { }              /* Too generic */
.card-title { }        /* Should use __ */
.featured { }          /* Should use -- */
.loading { }           /* Should use is- */
```

---

## Specificity Rules

**Maximum Allowed Specificity: (0,0,2,0)**

Format: `(inline, IDs, classes, elements)`

### Preferred: Single Class (0,0,1,0)

```css
/* ✅ BEST - Single class selector */
.button { }
.navigation__link { }
.card--featured { }
```

### Acceptable: Class + State/Modifier (0,0,2,0)

```css
/* ✅ ACCEPTABLE - Two classes maximum */
.button.is-loading { }
.navigation__link.is-active { }
[data-theme="dark"] .button { }
```

### Forbidden: Compound Selectors

```css
/* ❌ NEVER DO THIS - Artificial specificity boost */
nav.navbar { }
div.container { }
section .card { }
.parent .child .grandchild { }
```

### Forbidden: !important (Except Utilities)

```css
/* ❌ NEVER in components/sections */
.button {
  color: red !important;
}

/* ✅ ONLY in utilities/ directory */
.sr-only {
  display: none !important;  /* Accessibility override */
}
```

---

## Styling Decision Tree

When you need to style something, follow this decision tree:

```
┌─────────────────────────────────────┐
│ Need to style something?            │
└─────────────────┬───────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │ Is it a design token?     │
    │ (color, spacing, font)    │
    └─────────────┬─────────────┘
                  │ YES
                  ↓
         tokens/*.css
                  │
                  │ NO
    ┌─────────────┴─────────────┐
    │ Is it a one-off utility?  │
    │ (flex, grid, margin)      │
    └─────────────┬─────────────┘
                  │ YES
                  ↓
         Tailwind utility class
         (e.g., flex, mt-4)
                  │
                  │ NO
    ┌─────────────┴─────────────────────┐
    │ Is it component-specific and      │
    │ NOT reusable elsewhere?           │
    └─────────────┬─────────────────────┘
                  │ YES
                  ↓
         Component.module.css
         (CSS Module - scoped)
                  │
                  │ NO
    ┌─────────────┴─────────────────────┐
    │ Is it reusable across multiple    │
    │ components?                        │
    └─────────────┬─────────────────────┘
                  │ YES
                  ↓
         components/*.css
         (e.g., buttons.css)
                  │
                  │ NO
    ┌─────────────┴─────────────────────┐
    │ Is it a page section?             │
    └─────────────┬─────────────────────┘
                  │ YES
                  ↓
         sections/*.css
         (e.g., hero.css)
                  │
                  │ NO
    ┌─────────────┴─────────────────────┐
    │ Is it a layout pattern?           │
    │ (nav, footer, grid)               │
    └─────────────┬─────────────────────┘
                  │ YES
                  ↓
         layout/*.css
                  │
                  │ NO
    ┌─────────────┴─────────────────────┐
    │ Is it a complex feature?          │
    └─────────────┬─────────────────────┘
                  │ YES
                  ↓
         features/*.css
```

---

## Theme System

### Single Source of Truth

We use `[data-theme="dark"]` attribute selector exclusively for dark mode.

### Light Theme (Default)

Defined in `tokens/colors.css`:

```css
:root {
  --color-canvas-light: #F2EFFD;
  --color-canvas-dark: #0A0F0D;
  --color-primary: hsl(152, 45%, 25%);
  --color-text-primary: hsl(150, 40%, 10%);
  /* ... more tokens */
}
```

### Dark Theme (Override)

Defined in `base/theme.css`:

```css
[data-theme="dark"] {
  /* Override token values only */
  --color-canvas-light: #0A0F0D;
  --color-canvas-dark: #F2EFFD;
  --color-primary: hsl(140, 40%, 65%);
  --color-text-primary: hsl(145, 25%, 92%);
  /* ... more overrides */
}
```

### Component Theme Adjustments

If a component needs theme-specific styling beyond token changes:

```css
/* Component base styles */
.navigation {
  background: var(--color-canvas-light);
  color: var(--color-text-primary);
}

/* Theme-specific adjustments (if needed) */
[data-theme="dark"] .navigation {
  /* Only if token changes aren't enough */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
```

### JavaScript Integration

```typescript
// Set theme
const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize on load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
```

---

## Common Patterns

### Using Design Tokens

```css
/* ✅ ALWAYS use tokens */
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-primary);
  border-radius: var(--radius);
  transition: all var(--duration-normal) var(--easing-standard);
}

/* ❌ NEVER hardcode values */
.button {
  padding: 0.5rem 1.5rem;        /* Use var(--spacing-*) */
  font-family: 'Inter', sans-serif;  /* Use var(--font-body) */
  color: #333;                   /* Use var(--color-*) */
}
```

### Responsive Design

Keep responsive styles in the same file as base styles:

```css
/* components/buttons.css */
.button {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

/* Responsive styles in same file */
@media (min-width: 768px) {
  .button {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: var(--font-size-base);
  }
}
```

### Animations

```css
/* Use timing tokens */
.button {
  transition: all var(--duration-normal) var(--easing-standard);
}

.modal {
  animation: fadeIn var(--duration-slow) var(--easing-decelerate);
}

/* Define keyframes in utilities/animations.css */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### State Management

```css
/* Base state */
.button {
  opacity: 1;
  cursor: pointer;
}

/* Loading state */
.button.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Disabled state */
.button.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## Migration Status

### Phase 1: Foundation ✅ COMPLETE

- ✅ Design tokens extracted to `tokens/` directory
- ✅ Base styles created (`reset.css`, `global.css`, `theme.css`)
- ✅ New `index.css` with documented import order
- ✅ CSS Modules configured in build system

### Phase 2: Component Extraction ⏳ PENDING

- ⏳ Extract navigation to `layout/navigation.css`
- ⏳ Extract buttons to `components/buttons.css`
- ⏳ Extract cards to `components/cards.css`
- ⏳ Extract forms to `components/forms.css`

### Phase 3: Section Separation ⏳ PENDING

- ⏳ Split `hero.css` into individual section files
- ⏳ Move features to `features/` directory
- ⏳ Delete original `hero.css` (2,464 lines)

### Phase 4: Cleanup ⏳ PENDING

- ⏳ Eliminate all `!important` declarations (except utilities)
- ⏳ Reduce specificity to ≤ (0,0,2,0)
- ⏳ Convert inline styles to CSS classes

### Phase 5: Testing & Optimization ⏳ PENDING

- ⏳ Visual regression testing
- ⏳ Performance benchmarking
- ⏳ Documentation completion

---

## Troubleshooting

### Build Error: "@import must precede all other statements"

**Problem:** You added an `@import` after a `@tailwind` directive.

**Solution:** Move all `@import` statements to the top of `src/index.css`, before any `@tailwind` directives.

```css
/* ✅ CORRECT */
@import './styles/tokens/colors.css';
@tailwind base;

/* ❌ WRONG */
@tailwind base;
@import './styles/tokens/colors.css';  /* Error! */
```

### Styles Not Applying

**Check these in order:**

1. **Is the file imported?** Check `src/index.css` import list
2. **Import order correct?** Later imports override earlier ones
3. **Specificity too low?** Check if another rule is overriding
4. **Token undefined?** Verify token exists in `tokens/` files
5. **Theme override?** Check if `[data-theme="dark"]` is overriding

### Specificity Conflicts

**Problem:** Your styles are being overridden unexpectedly.

**Solution:**

1. Check specificity with browser DevTools
2. Ensure you're not exceeding (0,0,2,0)
3. Adjust import order in `index.css` if needed
4. Never use `!important` to fix specificity issues

### Theme Not Switching

**Check:**

1. Is `data-theme` attribute set on `<html>` element?
2. Are theme overrides in `base/theme.css`?
3. Are you using `[data-theme="dark"]` selector (not `.dark` or `html[data-theme]`)?

---

## Quick Reference

### File Size Limits

- **Maximum:** 500 lines per file (except `index.css`)
- **Current:** `hero.css` is 2,464 lines (being decomposed in Phase 3)

### Specificity Limits

- **Maximum:** (0,0,2,0)
- **Preferred:** (0,0,1,0)
- **Never:** Use IDs or compound selectors for specificity

### Token Usage

- **Always:** Use tokens for colors, spacing, typography, shadows, animations
- **Never:** Hardcode values that should be tokens

### Import Order

```
Fonts → Tokens → Base → Legacy → Tailwind Layers
```

### Theme Selector

- **Use:** `[data-theme="dark"]`
- **Don't use:** `.dark`, `html[data-theme]`, `[data-theme]`

---

## Additional Resources

- **Design Document:** `.kiro/specs/css-architecture-refactor/design.md`
- **Requirements:** `.kiro/specs/css-architecture-refactor/requirements.md`
- **Tasks:** `.kiro/specs/css-architecture-refactor/tasks.md`
- **Analysis Report:** `CSS_ARCHITECTURE_ANALYSIS_REPORT.md`

---

## Questions?

If you're unsure about where to add styles or how to structure something:

1. Consult the [Styling Decision Tree](#styling-decision-tree)
2. Check existing patterns in similar components
3. Review the [Design Document](.kiro/specs/css-architecture-refactor/design.md)
4. When in doubt, ask before creating new patterns

**Remember:** Consistency is more important than perfection. Follow established patterns even if you think there's a "better" way.
