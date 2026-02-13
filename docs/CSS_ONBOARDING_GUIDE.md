# CSS Architecture Onboarding Guide

Welcome to the Code by Leon project! This guide will help you understand our CSS architecture and get you productive quickly.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Key Concepts](#key-concepts)
4. [Common Tasks](#common-tasks)
5. [Architecture Decisions](#architecture-decisions)
6. [Troubleshooting](#troubleshooting)
7. [Best Practices](#best-practices)

---

## Quick Start

### 1. Understand the Structure

Our CSS is organized into clear directories:

```
src/styles/
├── tokens/       # Design tokens (colors, spacing, fonts)
├── base/         # Foundation styles (reset, global, theme)
├── layout/       # Layout components (navigation, footer)
├── components/   # Reusable UI components (buttons, cards)
├── sections/     # Page sections (hero, services, portfolio)
├── features/     # Complex features (horizontal-scroll, mouse-trail)
├── utilities/    # Utility classes (animations, helpers)
└── index.css     # Import orchestrator
```

### 2. Learn the Naming Convention

We use BEM-inspired naming:

```css
.block { }                    /* Component or section */
.block__element { }           /* Part of a block */
.block--modifier { }          /* Variant of a block */
.block.is-state { }           /* Temporary state */
```

### 3. Follow the Decision Tree

**Need to style something?**

1. **Design token?** → `tokens/*.css`
2. **One-off utility?** → Tailwind class
3. **Component-specific?** → `Component.module.css`
4. **Reusable component?** → `components/*.css`
5. **Page section?** → `sections/*.css`
6. **Layout pattern?** → `layout/*.css`
7. **Complex feature?** → `features/*.css`

### 4. Key Rules

- ✅ Maximum specificity: (0,0,2,0)
- ✅ Use tokens for all values
- ✅ One component = one file
- ✅ BEM naming everywhere
- ❌ No !important (except utilities)
- ❌ No inline styles (except dynamic values)
- ❌ No duplicate definitions

---

## Architecture Overview

### The Problem We Solved

**Before refactoring:**
- 2,464-line `hero.css` file
- Styles scattered across 3+ files
- Triple-duplicated design tokens
- Specificity wars with compound selectors
- !important abuse (4+ instances)
- No clear ownership

**After refactoring:**
- Clear file organization (max 500 lines per file)
- Single source of truth for tokens
- Predictable specificity
- Zero !important (except utilities)
- Clear component ownership
- 30-40% smaller CSS bundle

### Design Principles

1. **Single Source of Truth**
   - All design tokens in `tokens/` directory
   - Each component's styles in exactly one file

2. **Predictable Specificity**
   - Maximum (0,0,2,0)
   - Prefer single class selectors
   - No compound selectors for specificity hacks

3. **Clear Ownership**
   - Easy to find where to modify styles
   - No duplicate definitions
   - Clear namespace with BEM

4. **Consistent Patterns**
   - Decision tree for styling approaches
   - Documented conventions
   - Examples for common patterns

5. **Maintainable Scale**
   - Files under 500 lines
   - Focused responsibilities
   - Co-located responsive styles

---

## Key Concepts

### 1. Design Tokens

**What are they?**
CSS custom properties (variables) that represent design decisions.

**Why use them?**
- Single source of truth
- Easy to update globally
- Theme switching support
- Consistent values across app

**Example:**
```css
/* tokens/colors.css */
:root {
  --color-primary: hsl(152, 45%, 25%);
  --color-text-primary: hsl(152, 45%, 15%);
}

/* components/buttons.css */
.button--primary {
  background: var(--color-primary);
  color: var(--color-text-primary);
}
```

### 2. BEM Naming

**What is it?**
Block Element Modifier - a naming methodology for CSS classes.

**Why use it?**
- Clear relationships between classes
- Avoids naming conflicts
- Self-documenting code
- Predictable specificity

**Example:**
```css
/* Block */
.card { }

/* Element (part of block) */
.card__title { }
.card__description { }

/* Modifier (variant) */
.card--featured { }
.card--blog { }

/* State (temporary) */
.card.is-loading { }
```

### 3. Specificity Management

**What is specificity?**
CSS's way of determining which styles apply when multiple rules target the same element.

**Format:** (inline, IDs, classes, elements)
- `(1,0,0,0)` - Inline styles
- `(0,1,0,0)` - ID selector
- `(0,0,1,0)` - Class selector
- `(0,0,0,1)` - Element selector

**Our rules:**
- Maximum: (0,0,2,0)
- Preferred: (0,0,1,0)
- No compound selectors (e.g., `nav.navbar`)

**Example:**
```css
/* ✅ GOOD - (0,0,1,0) */
.button { }

/* ✅ GOOD - (0,0,2,0) */
.button.is-loading { }

/* ❌ BAD - (0,0,2,0) but compound */
nav.navbar { }

/* ❌ BAD - (0,0,3,0) too high */
.section .card .title { }
```

### 4. Theme System

**How it works:**
- Single `data-theme` attribute on `<html>`
- Token overrides in `base/theme.css`
- JavaScript toggles the attribute

**Example:**
```css
/* tokens/colors.css - Light theme (default) */
:root {
  --color-canvas-light: #F2EFFD;
  --color-text-primary: hsl(152, 45%, 15%);
}

/* base/theme.css - Dark theme overrides */
[data-theme="dark"] {
  --color-canvas-light: #0A0F0D;
  --color-text-primary: hsl(145, 25%, 92%);
}
```

```typescript
// Toggle theme
const toggleTheme = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};
```

### 5. CSS Modules

**What are they?**
Component-scoped CSS files that prevent global namespace pollution.

**When to use:**
- Component-specific styles not reused elsewhere
- Complex layouts unique to one component
- Need scoping to avoid conflicts

**Example:**
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
  padding: var(--spacing-lg);
}

.title {
  font-family: var(--font-display);
}
```

---

## Common Tasks

### Task 1: Add a New Button Variant

**File:** `src/styles/components/buttons.css`

```css
/* Add after existing variants */
.button--tertiary {
  background: var(--color-button-tertiary-bg);
  color: var(--color-button-tertiary-text);
  border: 2px solid var(--color-border);
}

.button--tertiary:hover {
  background: var(--color-button-tertiary-hover-bg);
}
```

**Usage:**
```tsx
<button className="button button--tertiary">
  Click me
</button>
```

### Task 2: Create a New Component

**1. Create the CSS file:**
```bash
# Create file in appropriate directory
touch src/styles/components/badges.css
```

**2. Define the styles:**
```css
/* components/badges.css */

/* Base badge */
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-family: var(--font-body);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: 9999px;
  background: var(--color-badge-bg);
  color: var(--color-badge-text);
}

/* Variants */
.badge--success {
  background: var(--color-success);
  color: var(--color-success-text);
}

.badge--warning {
  background: var(--color-warning);
  color: var(--color-warning-text);
}

.badge--error {
  background: var(--color-error);
  color: var(--color-error-text);
}
```

**3. Add import to index.css:**
```css
/* In the components section */
@import './components/badges.css';
```

**4. Use in components:**
```tsx
<span className="badge badge--success">Active</span>
```

### Task 3: Add a New Design Token

**1. Identify the category:**
- Color → `tokens/colors.css`
- Spacing → `tokens/spacing.css`
- Typography → `tokens/typography.css`
- Shadow → `tokens/shadows.css`
- Animation → `tokens/animations.css`

**2. Add the token:**
```css
/* tokens/colors.css */
:root {
  /* Add new token */
  --color-badge-bg: hsl(152, 45%, 95%);
  --color-badge-text: hsl(152, 45%, 25%);
}
```

**3. Add dark theme override (if needed):**
```css
/* base/theme.css */
[data-theme="dark"] {
  --color-badge-bg: hsl(152, 45%, 15%);
  --color-badge-text: hsl(152, 45%, 85%);
}
```

### Task 4: Style a New Page Section

**1. Create the section file:**
```bash
touch src/styles/sections/testimonials.css
```

**2. Define the styles:**
```css
/* sections/testimonials.css */

.testimonials {
  padding: var(--spacing-3xl) var(--spacing-xl);
  background: var(--color-canvas-light);
}

.testimonials__container {
  max-width: 1280px;
  margin: 0 auto;
}

.testimonials__title {
  font-family: var(--font-display);
  font-size: var(--font-size-3xl);
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.testimonials__item {
  padding: var(--spacing-xl);
  background: var(--color-card-bg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-soft);
}

/* Responsive */
@media (min-width: 768px) {
  .testimonials__title {
    font-size: var(--font-size-4xl);
  }
}
```

**3. Add import to index.css:**
```css
/* In the sections section */
@import './sections/testimonials.css';
```

**4. Use in JSX:**
```tsx
<section className="testimonials">
  <div className="testimonials__container">
    <h2 className="testimonials__title">What Our Clients Say</h2>
    <div className="testimonials__grid">
      <div className="testimonials__item">
        {/* Testimonial content */}
      </div>
    </div>
  </div>
</section>
```

### Task 5: Add Responsive Styles

**Always use mobile-first approach:**

```css
/* Mobile styles (default) */
.navigation {
  padding: var(--spacing-sm);
}

.navigation__links {
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* Tablet and up (min-width) */
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

### Task 6: Handle Dynamic Styles

**Use CSS custom properties for dynamic values:**

```tsx
/* ✅ GOOD - Dynamic value using CSS custom property */
{items.map((item, index) => (
  <div
    key={item.id}
    className="card"
    style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
  >
    {item.content}
  </div>
))}
```

```css
/* CSS file */
.card {
  animation: fadeIn var(--duration-normal) var(--easing-standard);
  animation-delay: var(--delay);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Architecture Decisions

### Why BEM Naming?

**Decision:** Use BEM-inspired naming for all CSS classes.

**Rationale:**
- Clear relationships between classes
- Avoids naming conflicts
- Self-documenting code
- Predictable specificity
- Industry standard

**Alternative considered:** Utility-first (Tailwind only)
- Rejected because: Need semantic component classes for complex patterns

### Why Token-Based Design?

**Decision:** All design values in CSS custom properties (tokens).

**Rationale:**
- Single source of truth
- Easy global updates
- Theme switching support
- Consistent values
- Better maintainability

**Alternative considered:** Hardcoded values
- Rejected because: Leads to inconsistency and difficult updates

### Why Maximum Specificity (0,0,2,0)?

**Decision:** Limit all selectors to maximum specificity of (0,0,2,0).

**Rationale:**
- Predictable cascade
- Avoids specificity wars
- Easy to override when needed
- Prevents !important abuse
- Maintainable long-term

**Alternative considered:** No specificity limits
- Rejected because: Leads to specificity wars and !important abuse

### Why Separate Files by Responsibility?

**Decision:** Organize CSS into directories by responsibility (tokens, components, sections, etc.).

**Rationale:**
- Easy to find styles
- Clear ownership
- Prevents duplicate definitions
- Scalable architecture
- Better code organization

**Alternative considered:** Single large CSS file
- Rejected because: Unmaintainable at scale (hero.css was 2,464 lines)

### Why CSS Modules for Component-Specific Styles?

**Decision:** Use CSS Modules for component-specific styles not reused elsewhere.

**Rationale:**
- Prevents global namespace pollution
- Automatic scoping
- Co-located with component
- Type-safe with TypeScript
- Industry standard

**Alternative considered:** Global CSS only
- Rejected because: Risk of naming conflicts and unintended side effects

### Why Mobile-First Responsive Design?

**Decision:** Use min-width media queries (mobile-first approach).

**Rationale:**
- Progressive enhancement
- Better performance (mobile loads less CSS)
- Easier to reason about
- Industry best practice
- Matches user behavior (mobile-first world)

**Alternative considered:** Desktop-first (max-width)
- Rejected because: Requires overriding more styles, worse performance

---

## Troubleshooting

### Problem: Can't Find Where to Modify Styles

**Solution:** Use the component ownership mapping.

1. Check [Component Ownership Mapping](./CSS_COMPONENT_OWNERSHIP.md)
2. Search for the class name in the codebase
3. Follow the BEM naming pattern (`.block` → `components/block.css`)

**Example:**
- Looking for button styles? → `components/buttons.css`
- Looking for hero styles? → `sections/hero.css`
- Looking for navigation styles? → `layout/navigation.css`

### Problem: Styles Not Applying

**Possible causes:**

1. **Specificity too low**
   - Check if another rule has higher specificity
   - Use browser DevTools to see which rule wins
   - Solution: Adjust cascade order in `index.css`

2. **Token not defined**
   - Check if the CSS variable exists in `tokens/`
   - Solution: Define the token in appropriate tokens file

3. **Import order wrong**
   - Check `index.css` import order
   - Solution: Ensure correct cascade order

4. **Typo in class name**
   - Check spelling in both CSS and JSX
   - Solution: Fix the typo

### Problem: Theme Not Switching

**Possible causes:**

1. **data-theme attribute not set**
   - Check if `<html data-theme="dark">` exists
   - Solution: Ensure JavaScript sets the attribute

2. **Token not overridden in theme.css**
   - Check if token has dark mode override
   - Solution: Add override in `base/theme.css`

3. **Wrong theme selector**
   - Check if using `[data-theme="dark"]` not `.dark`
   - Solution: Use correct selector

### Problem: Styles Duplicated

**Solution:** Consolidate into single file.

1. Find all occurrences of the class
2. Identify the correct owner file
3. Move all styles to that file
4. Remove duplicates
5. Update imports in `index.css`

### Problem: File Too Large (>500 lines)

**Solution:** Split into smaller files.

1. Identify logical groupings
2. Create new files for each group
3. Move styles to new files
4. Update imports in `index.css`
5. Verify no visual regressions

### Problem: Build Errors

**Common errors:**

1. **"Cannot find module './styles/...'"**
   - Solution: Check file path in import
   - Ensure file exists

2. **"Invalid CSS syntax"**
   - Solution: Check for missing semicolons, braces
   - Use CSS linter

3. **"Circular dependency"**
   - Solution: Check import order in `index.css`
   - Remove circular imports

### Problem: Visual Regression

**Solution:** Compare with baseline.

1. Run visual regression tests: `npm run test:visual`
2. Review differences in Playwright report
3. Identify which styles changed
4. Fix or accept the change
5. Update baseline if intentional

---

## Best Practices

### DO:

✅ **Use tokens for all values**
```css
/* ✅ GOOD */
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--color-primary);
}
```

✅ **Follow BEM naming**
```css
/* ✅ GOOD */
.card { }
.card__title { }
.card--featured { }
```

✅ **Co-locate responsive styles**
```css
/* ✅ GOOD - In same file */
.navigation { }

@media (min-width: 768px) {
  .navigation { }
}
```

✅ **Use single class selectors**
```css
/* ✅ GOOD - (0,0,1,0) */
.button { }
```

✅ **Document complex patterns**
```css
/* ✅ GOOD */
/* Horizontal scroll container with snap points */
.horizontal-scroll__track {
  scroll-snap-type: x mandatory;
}
```

### DON'T:

❌ **Hardcode values**
```css
/* ❌ BAD */
.button {
  padding: 0.5rem 1.5rem;
  background: #cd340f;
}
```

❌ **Use generic names**
```css
/* ❌ BAD */
.link { }
.item { }
.wrapper { }
```

❌ **Scatter responsive styles**
```css
/* ❌ BAD - In different files */
/* components/navigation.css */
.navigation { }

/* utilities/responsive.css */
@media (min-width: 768px) {
  .navigation { }
}
```

❌ **Use compound selectors**
```css
/* ❌ BAD */
nav.navbar { }
div.container { }
```

❌ **Use !important**
```css
/* ❌ BAD */
.button {
  color: red !important;
}
```

---

## Next Steps

1. **Read the Style Guide**
   - [CSS Architecture Style Guide](./CSS_ARCHITECTURE_STYLE_GUIDE.md)

2. **Review Component Ownership**
   - [Component Ownership Mapping](./CSS_COMPONENT_OWNERSHIP.md)

3. **Understand Inline Styles**
   - [Inline Styles Guide](./CSS_INLINE_STYLES_GUIDE.md)

4. **Check Performance**
   - [Performance Report](./CSS_PERFORMANCE_REPORT.md)

5. **Start Coding!**
   - Pick a task from the backlog
   - Follow the patterns in this guide
   - Ask questions when stuck

---

## Getting Help

**Questions about:**
- **Architecture decisions** → Review this guide's "Architecture Decisions" section
- **Where to put styles** → Check [Component Ownership Mapping](./CSS_COMPONENT_OWNERSHIP.md)
- **Naming conventions** → Review [Style Guide](./CSS_ARCHITECTURE_STYLE_GUIDE.md)
- **Common patterns** → Check [Style Guide - Common Patterns](./CSS_ARCHITECTURE_STYLE_GUIDE.md#common-patterns)
- **Troubleshooting** → Review "Troubleshooting" section above

**Still stuck?**
- Check existing code for similar patterns
- Review the design document: `.kiro/specs/css-architecture-refactor/design.md`
- Ask the team in Slack/Discord
- Create an issue with specific questions

---

Welcome aboard! 🚀
