# CSS Architecture Style Guide

## Table of Contents

1. [Overview](#overview)
2. [BEM Naming Conventions](#bem-naming-conventions)
3. [Styling Decision Tree](#styling-decision-tree)
4. [File Organization Principles](#file-organization-principles)
5. [Theme System Usage](#theme-system-usage)
6. [Common Patterns](#common-patterns)

---

## Overview

This style guide documents the CSS architecture for the Code by Leon project. The architecture is designed to be scalable, maintainable, and predictable, with clear separation of concerns and consistent naming conventions.

**Key Principles:**
- Single source of truth for design tokens
- Maximum specificity of (0,0,2,0)
- BEM-inspired naming conventions
- Clear file organization by responsibility
- No !important declarations (except utilities)
- Minimal inline styles (dynamic values only)

---

## BEM Naming Conventions

We use a BEM-inspired naming methodology for all CSS classes. BEM stands for Block, Element, Modifier.

### Block

A standalone component or section that is meaningful on its own.

**Format:** `.block-name`

**Examples:**
```css
.navigation { }
.button { }
.card { }
.hero { }
.services { }
```

### Element

A part of a block that has no standalone meaning and is semantically tied to its block.

**Format:** `.block__element`

**Examples:**
```css
.navigation__link { }
.navigation__logo { }
.button__icon { }
.card__title { }
.card__description { }
.hero__container { }
.hero__title { }
```

### Modifier

A flag on a block or element that changes appearance or behavior.

**Format:** `.block--modifier` or `.block__element--modifier`

**Examples:**
```css
.button--primary { }
.button--secondary { }
.navigation__link--active { }
.card--featured { }
.card--blog { }
```

### State

A temporary state that can be toggled on/off.

**Format:** `.is-state` or `.block.is-state`

**Examples:**
```css
.navigation.is-scrolled { }
.navigation__link.is-active { }
.button.is-loading { }
.button.is-disabled { }
.modal.is-open { }
```

### Complete Example

```css
/* Block */
.button {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 0.5rem;
  transition: all var(--duration-normal) var(--easing-standard);
}

/* Element */
.button__icon {
  margin-right: var(--spacing-xs);
}

/* Modifiers */
.button--primary {
  background: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}

.button--secondary {
  background: var(--color-button-secondary-bg);
  color: var(--color-button-secondary-text);
}

/* States */
.button.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.button.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}
```

### Naming Rules

✅ **DO:**
- Use descriptive, semantic names
- Namespace elements under their block
- Use double underscore for elements (`__`)
- Use double dash for modifiers (`--`)
- Use `is-` prefix for states
- Keep names lowercase with hyphens

❌ **DON'T:**
- Use generic single-word names (`.link`, `.item`, `.wrapper`)
- Create deep nesting (`.block__element__subelement`)
- Mix naming conventions
- Use camelCase or snake_case

---

## Styling Decision Tree

Use this decision tree to determine the appropriate styling approach:

```
Need to style something?
│
├─ Is it a design token (color, spacing, font, shadow, animation)?
│  └─ YES → Define in tokens/*.css
│     Examples: --color-primary, --spacing-lg, --font-display
│
├─ Is it a one-off utility (flex, grid, margin, padding)?
│  └─ YES → Use Tailwind utility class
│     Examples: flex, grid, mt-4, px-6, text-center
│
├─ Is it component-specific and NOT reusable elsewhere?
│  └─ YES → Create Component.module.css (CSS Module)
│     Examples: Unique layout for a specific page component
│
├─ Is it reusable across multiple components?
│  └─ YES → Create/update file in components/*.css
│     Examples: buttons, cards, forms, modals
│
├─ Is it a page section?
│  └─ YES → Create/update file in sections/*.css
│     Examples: hero, services, portfolio, about, blog
│
├─ Is it a layout pattern (nav, footer, grid)?
│  └─ YES → Create/update file in layout/*.css
│     Examples: navigation, footer, grid
│
└─ Is it a complex feature?
   └─ YES → Create/update file in features/*.css
      Examples: horizontal-scroll, mouse-trail, configurator
```

### Detailed Guidelines

#### When to Use Tokens

Use tokens for any value that:
- Represents a design decision (colors, spacing, typography)
- Might be reused across multiple components
- Should be consistent across the application
- Needs to change based on theme

```css
/* ✅ GOOD - Using tokens */
.card {
  padding: var(--spacing-lg);
  background: var(--color-card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
}

/* ❌ BAD - Hardcoded values */
.card {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
```

#### When to Use Tailwind

Use Tailwind for:
- One-off utilities that don't need custom values
- Layout utilities (flex, grid, positioning)
- Spacing utilities (margin, padding)
- Quick prototyping

```tsx
/* ✅ GOOD - Tailwind for utilities */
<div className="flex items-center gap-4 mt-8">
  <button className="button button--primary">Click me</button>
</div>

/* ❌ BAD - Custom CSS for simple utilities */
.my-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}
```

#### When to Use CSS Modules

Use CSS Modules for:
- Component-specific styles that won't be reused
- Complex layouts unique to one component
- Styles that need scoping to avoid conflicts

```tsx
// Component.tsx
import styles from './Component.module.css';

export const Component = () => (
  <div className={styles.container}>
    <h2 className={styles.title}>Title</h2>
  </div>
);
```

```css
/* Component.module.css */
.container {
  padding: var(--spacing-xl);
  background: var(--color-card-bg);
}

.title {
  font-family: var(--font-display);
  color: var(--color-text-primary);
}
```

#### When to Use Component CSS

Use component CSS files for:
- Reusable components used across multiple pages
- Components with multiple variants
- Shared patterns (buttons, cards, forms)

```css
/* components/buttons.css */
.button { /* base styles */ }
.button--primary { /* variant */ }
.button--secondary { /* variant */ }
.button.is-loading { /* state */ }
```

---

## File Organization Principles

### Directory Structure

```
src/styles/
├── tokens/          # Design tokens (single source of truth)
├── base/            # Reset, global styles, theme
├── layout/          # Layout components (nav, footer, grid)
├── components/      # Reusable components
├── sections/        # Page sections
├── features/        # Complex features
├── utilities/       # Utility classes
└── index.css        # Import orchestrator
```

### File Responsibilities

#### tokens/

**Purpose:** Single source of truth for all design decisions

**Files:**
- `colors.css` - All color variables
- `typography.css` - Font families, sizes, weights
- `spacing.css` - Spacing scale and breakpoints
- `shadows.css` - Shadow definitions
- `animations.css` - Animation timing and easing

**Rules:**
- Only define CSS custom properties (variables)
- No selectors or styles, only `:root { }`
- No duplicate definitions across files

#### base/

**Purpose:** Foundation styles that apply globally

**Files:**
- `reset.css` - CSS reset/normalize
- `global.css` - Global element styles (body, headings, etc.)
- `theme.css` - Theme switching logic

**Rules:**
- Use element selectors or very low specificity
- Reference tokens for all values
- Keep minimal and focused

#### layout/

**Purpose:** Layout components that structure pages

**Files:**
- `navigation.css` - Navigation component
- `footer.css` - Footer component
- `grid.css` - Layout grids

**Rules:**
- One layout component per file
- Use BEM naming
- Include responsive styles in same file

#### components/

**Purpose:** Reusable UI components

**Files:**
- `buttons.css` - All button variants
- `cards.css` - Card components
- `forms.css` - Form elements
- `modals.css` - Modal components

**Rules:**
- One component per file
- All selectors namespaced under component name
- Include all variants and states
- Maximum 500 lines per file

#### sections/

**Purpose:** Page section styles

**Files:**
- `hero.css` - Hero section only
- `services.css` - Services section only
- `portfolio.css` - Portfolio section only
- `about.css` - About section only
- `blog.css` - Blog section only

**Rules:**
- One section per file
- All selectors namespaced under section name
- Include responsive styles in same file
- Maximum 500 lines per file

#### features/

**Purpose:** Complex features with unique behavior

**Files:**
- `horizontal-scroll.css` - Horizontal scroll feature
- `mouse-trail.css` - Mouse trail effect
- `configurator.css` - Configurator page
- `torch-effect.css` - Torch effect

**Rules:**
- One feature per file
- Self-contained styles
- Can include multiple components if feature-specific

#### utilities/

**Purpose:** Utility classes and helpers

**Files:**
- `animations.css` - Animation utilities and keyframes
- `helpers.css` - Helper classes
- `responsive.css` - Responsive utilities

**Rules:**
- Only place where !important is allowed
- Keep minimal - prefer Tailwind utilities
- Document each utility's purpose

### Import Order

The `index.css` file controls cascade order:

1. External dependencies (fonts)
2. Tailwind base
3. Tokens (lowest specificity)
4. Base styles
5. Layout
6. Tailwind components
7. Components
8. Sections
9. Features
10. Tailwind utilities
11. Custom utilities (highest specificity)

**Why this order matters:**
- Tokens first so they're available everywhere
- Base styles before components
- Components before sections (sections use components)
- Utilities last so they can override anything

---

## Theme System Usage

### Overview

We use a single `data-theme` attribute on the `<html>` element to control theming.

### Setting the Theme

```typescript
// Set theme
const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Toggle theme
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
};
```

### Defining Theme Overrides

```css
/* tokens/colors.css - Light theme (default) */
:root {
  --color-canvas-light: #F2EFFD;
  --color-canvas-dark: #0A0F0D;
  --color-text-primary: hsl(152, 45%, 15%);
  --color-text-secondary: hsl(152, 25%, 35%);
}

/* base/theme.css - Dark theme overrides */
[data-theme="dark"] {
  --color-canvas-light: #0A0F0D;
  --color-canvas-dark: #F2EFFD;
  --color-text-primary: hsl(145, 25%, 92%);
  --color-text-secondary: hsl(145, 15%, 60%);
}
```

### Component-Specific Theme Styles

```css
/* components/buttons.css */
.button--primary {
  background: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}

/* Theme-specific adjustments if needed */
[data-theme="dark"] .button--primary {
  /* Only if component needs specific dark mode adjustments */
  /* beyond token overrides */
}
```

### Theme Rules

✅ **DO:**
- Use `[data-theme="dark"]` exclusively
- Override token values in `base/theme.css`
- Keep theme logic centralized
- Test both themes for every component

❌ **DON'T:**
- Use `.dark` class or `html[data-theme]` variants
- Define new tokens in theme overrides
- Scatter theme logic across files
- Hardcode theme-specific values

---

## Common Patterns

### Pattern 1: Buttons

```css
/* components/buttons.css */

/* Base button */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: 0.5rem;
  transition: all var(--duration-normal) var(--easing-standard);
  cursor: pointer;
  border: none;
}

/* Variants */
.button--primary {
  background: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}

.button--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.button--secondary {
  background: var(--color-button-secondary-bg);
  color: var(--color-button-secondary-text);
  border: 2px solid var(--color-border);
}

/* States */
.button.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.button.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}
```

**Usage:**
```tsx
<button className="button button--primary">
  Click me
</button>

<button className="button button--secondary is-loading">
  Loading...
</button>
```

### Pattern 2: Cards

```css
/* components/cards.css */

/* Base card */
.card {
  padding: var(--spacing-xl);
  background: var(--color-card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
  transition: all var(--duration-normal) var(--easing-standard);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

/* Elements */
.card__title {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.card__description {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Variants */
.card--featured {
  border: 2px solid var(--color-accent);
}

.card--blog {
  cursor: pointer;
}
```

**Usage:**
```tsx
<div className="card card--featured">
  <h3 className="card__title">Card Title</h3>
  <p className="card__description">Card description text</p>
</div>
```

### Pattern 3: Forms

```css
/* components/forms.css */

.form__label {
  display: block;
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.form__input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-input-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  transition: border-color var(--duration-fast) var(--easing-standard);
}

.form__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.form__input::placeholder {
  color: var(--color-text-tertiary);
}
```

**Usage:**
```tsx
<div>
  <label className="form__label" htmlFor="email">
    Email Address
  </label>
  <input
    type="email"
    id="email"
    className="form__input"
    placeholder="you@example.com"
  />
</div>
```

### Pattern 4: Sections

```css
/* sections/hero.css */

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: var(--color-canvas-light);
}

.hero__container {
  max-width: 1280px;
  margin: 0 auto;
  text-align: center;
}

.hero__title {
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-lg);
}

.hero__subtitle {
  font-family: var(--font-body);
  font-size: var(--font-size-xl);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
}

.hero__ctas {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

/* Responsive */
@media (min-width: 768px) {
  .hero__title {
    font-size: var(--font-size-6xl);
  }
  
  .hero__subtitle {
    font-size: var(--font-size-2xl);
  }
}
```

**Usage:**
```tsx
<section className="hero">
  <div className="hero__container">
    <h1 className="hero__title">Welcome</h1>
    <p className="hero__subtitle">Subtitle text</p>
    <div className="hero__ctas">
      <button className="button button--primary">Get Started</button>
      <button className="button button--secondary">Learn More</button>
    </div>
  </div>
</section>
```

### Pattern 5: Responsive Design

Always use mobile-first approach with `min-width` media queries:

```css
/* Mobile styles (default) */
.navigation {
  padding: var(--spacing-sm);
}

.navigation__links {
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .navigation {
    padding: var(--spacing-md) var(--spacing-xl);
  }
  
  .navigation__links {
    flex-direction: row;
    gap: var(--spacing-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .navigation {
    padding: var(--spacing-lg) var(--spacing-2xl);
  }
}
```

### Pattern 6: Dynamic Inline Styles

Only use inline styles for truly dynamic values:

```tsx
/* ✅ GOOD - Dynamic value using CSS custom property */
<div
  className="card"
  style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
>
  Content
</div>
```

```css
/* CSS file */
.card {
  animation-delay: var(--delay);
}
```

```tsx
/* ❌ BAD - Static value that should be in CSS */
<div className="card" style={{ padding: '1.5rem' }}>
  Content
</div>
```

---

## Quick Reference

### Specificity Limits

- Maximum: (0,0,2,0)
- Preferred: (0,0,1,0)
- No !important (except utilities)

### File Size Limits

- Maximum: 500 lines per file (excluding index.css)

### Naming Patterns

- Block: `.block-name`
- Element: `.block__element`
- Modifier: `.block--modifier`
- State: `.is-state`

### Theme Selector

- Always use: `[data-theme="dark"]`
- Never use: `.dark`, `html[data-theme]`, `[data-theme]`

### Import Order

1. Fonts → 2. Tailwind base → 3. Tokens → 4. Base → 5. Layout → 6. Tailwind components → 7. Components → 8. Sections → 9. Features → 10. Tailwind utilities → 11. Custom utilities

---

## Additional Resources

- [Component Ownership Mapping](./CSS_COMPONENT_OWNERSHIP.md)
- [Onboarding Guide](./CSS_ONBOARDING_GUIDE.md)
- [Inline Styles Guide](./CSS_INLINE_STYLES_GUIDE.md)
- [Performance Improvements](./CSS_PERFORMANCE_REPORT.md)
