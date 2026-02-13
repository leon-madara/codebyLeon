# Design Document: CSS Architecture Refactor

## Overview

This design establishes a scalable, maintainable CSS architecture for the Code by Leon project. The refactoring addresses critical technical debt including specificity conflicts, massive monolithic files (hero.css: 2,464 lines), duplicate token definitions (3x duplication), and inconsistent styling approaches.

### Current State Problems

1. **Specificity Wars**: Compound selectors like `nav.navbar .cta-button` artificially boost specificity
2. **Massive Files**: Single files handling 7+ sections (hero.css)
3. **Triple Duplication**: Theme variables defined in index.css, hero.css, and configurator.css
4. **!important Abuse**: 4 instances indicating unresolved conflicts
5. **Mixed Approaches**: Tailwind + custom CSS + inline styles with no clear pattern
6. **Poor Separation**: Navigation in hero.css, blog styles in index.css

### Design Goals

1. **Single Source of Truth**: All design tokens in one location
2. **Predictable Specificity**: Maximum (0,0,2,0), eliminate compound hacks
3. **Clear Ownership**: Each component's styles in one file
4. **Consistent Patterns**: Clear decision tree for styling approaches
5. **Maintainable Scale**: Files under 500 lines, focused responsibilities
6. **Zero Regressions**: Maintain visual consistency throughout migration

### Success Metrics

- Reduce CSS bundle size by 30-40%
- Eliminate all !important (except utilities)
- Reduce average specificity to (0,0,1,0) - (0,0,2,0)
- Reduce inline styles by 90%
- Files under 500 lines each

## Architecture

### Directory Structure

```
src/styles/
├── tokens/
│   ├── colors.css          # Color variables only
│   ├── typography.css      # Font definitions
│   ├── spacing.css         # Spacing scale + breakpoints
│   ├── shadows.css         # Shadow definitions
│   └── animations.css      # Animation timing tokens
│
├── base/
│   ├── reset.css           # CSS reset/normalize
│   ├── global.css          # Global element styles
│   └── theme.css           # Theme switching logic
│
├── layout/
│   ├── navigation.css      # Navigation component
│   ├── footer.css          # Footer component
│   └── grid.css            # Layout grids
│
├── components/
│   ├── buttons.css         # All button variants
│   ├── cards.css           # Card components
│   ├── forms.css           # Form elements
│   └── modals.css          # Modal components
│
├── sections/
│   ├── hero.css            # Hero section ONLY
│   ├── services.css        # Services section ONLY
│   ├── portfolio.css       # Portfolio section ONLY
│   ├── about.css           # About section ONLY
│   └── blog.css            # Blog section ONLY
│
├── features/
│   ├── horizontal-scroll.css   # HorizontalScroll feature
│   ├── mouse-trail.css         # Mouse trail effect
│   ├── configurator.css        # Configurator page
│   └── torch-effect.css        # Torch effect
│
├── utilities/
│   ├── animations.css      # Animation utilities
│   ├── helpers.css         # Helper classes
│   └── responsive.css      # Responsive utilities
│
└── index.css               # Main import orchestrator
```

### Import Order (Cascade Control)

The `index.css` file orchestrates imports in specificity order:

```css
/* 1. External dependencies */
@import url('fonts...');

/* 2. Tailwind base (reset) */
@tailwind base;

/* 3. Design tokens (lowest specificity) */
@import './tokens/colors.css';
@import './tokens/typography.css';
@import './tokens/spacing.css';
@import './tokens/shadows.css';
@import './tokens/animations.css';

/* 4. Base styles */
@import './base/reset.css';
@import './base/global.css';
@import './base/theme.css';

/* 5. Layout */
@import './layout/navigation.css';
@import './layout/footer.css';
@import './layout/grid.css';

/* 6. Tailwind components */
@tailwind components;

/* 7. Components */
@import './components/buttons.css';
@import './components/cards.css';
@import './components/forms.css';
@import './components/modals.css';

/* 8. Sections */
@import './sections/hero.css';
@import './sections/services.css';
@import './sections/portfolio.css';
@import './sections/about.css';
@import './sections/blog.css';

/* 9. Features */
@import './features/horizontal-scroll.css';
@import './features/mouse-trail.css';
@import './features/configurator.css';
@import './features/torch-effect.css';

/* 10. Tailwind utilities (highest specificity) */
@tailwind utilities;

/* 11. Utility overrides */
@import './utilities/animations.css';
@import './utilities/helpers.css';
@import './utilities/responsive.css';
```

### Naming Convention (BEM-Inspired)

**Block**: Component or section name
```css
.navigation { }
.button { }
.card { }
```

**Element**: Part of a block (double underscore)
```css
.navigation__link { }
.navigation__logo { }
.button__icon { }
.card__title { }
```

**Modifier**: Variant of block or element (double dash)
```css
.button--primary { }
.button--secondary { }
.navigation__link--active { }
.card--featured { }
```

**State**: Temporary state (is- prefix)
```css
.navigation.is-scrolled { }
.navigation__link.is-active { }
.button.is-loading { }
.modal.is-open { }
```

### Specificity Rules

**Maximum Specificity: (0,0,2,0)**

1. **Preferred: Single class** (0,0,1,0)
   ```css
   .button { }
   .navigation__link { }
   ```

2. **Acceptable: Class + modifier** (0,0,2,0)
   ```css
   .button.is-loading { }
   .navigation__link--active { }
   ```

3. **Acceptable: Theme override** (0,0,2,0)
   ```css
   [data-theme="dark"] .button { }
   ```

4. **FORBIDDEN: Compound selectors**
   ```css
   /* ❌ NEVER DO THIS */
   nav.navbar .cta-button { }
   section .btn-primary { }
   ```

5. **FORBIDDEN: !important** (except utilities)
   ```css
   /* ❌ NEVER DO THIS */
   .button { color: red !important; }
   
   /* ✅ ONLY IN UTILITIES */
   .sr-only { display: none !important; }
   ```

### Styling Decision Tree

```
Need to style something?
│
├─ Is it a design token (color, spacing, font)?
│  └─ YES → tokens/*.css
│
├─ Is it a one-off utility (flex, grid, margin)?
│  └─ YES → Tailwind utility class
│
├─ Is it component-specific and NOT reusable?
│  └─ YES → Component.module.css (CSS Module)
│
├─ Is it reusable across multiple components?
│  └─ YES → components/*.css
│
├─ Is it a page section?
│  └─ YES → sections/*.css
│
├─ Is it a layout pattern (nav, footer, grid)?
│  └─ YES → layout/*.css
│
└─ Is it a complex feature?
   └─ YES → features/*.css
```

## Components and Interfaces

### Token System

**Purpose**: Single source of truth for all design decisions

**Structure**:
```css
/* tokens/colors.css */
:root {
  /* Base colors */
  --color-canvas-light: #F2EFFD;
  --color-canvas-dark: #0A0F0D;
  
  /* Semantic colors */
  --color-primary: hsl(152, 45%, 25%);
  --color-secondary: hsl(145, 35%, 88%);
  --color-accent: hsl(85, 55%, 50%);
  
  /* Component colors */
  --color-button-primary-bg: #cd340f;
  --color-button-primary-text: #ffffff;
  --color-nav-cta-bg: #fc5b45;
  --color-nav-cta-text: #000000;
}

/* tokens/typography.css */
:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* tokens/spacing.css */
:root {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  --spacing-3xl: 4rem;
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

/* tokens/shadows.css */
:root {
  --shadow-soft: 0 4px 20px -4px hsl(152 45% 25% / 0.15);
  --shadow-medium: 0 8px 30px -6px hsl(152 45% 25% / 0.25);
  --shadow-glow: 0 0 40px hsl(85 55% 50% / 0.3);
}

/* tokens/animations.css */
:root {
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 350ms;
  
  --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
}
```

### Theme System

**Purpose**: Consistent dark mode implementation

**Approach**: Single attribute selector `[data-theme="dark"]`

**Structure**:
```css
/* base/theme.css */

/* Light theme (default) - defined in tokens/colors.css */

/* Dark theme overrides */
[data-theme="dark"] {
  --color-canvas-light: #0A0F0D;
  --color-canvas-dark: #F2EFFD;
  --color-primary: hsl(140, 40%, 65%);
  --color-text-primary: hsl(145, 25%, 92%);
  --color-text-secondary: hsl(145, 15%, 60%);
  /* ... other overrides */
}

/* Component-specific theme overrides */
[data-theme="dark"] .navigation {
  background: var(--color-canvas-dark);
}

[data-theme="dark"] .button--primary {
  /* Theme-specific adjustments if needed */
}
```

**JavaScript Integration**:
```typescript
// Theme toggle logic
const setTheme = (theme: 'light' | 'dark') => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);
```

### CSS Modules Configuration

**Purpose**: Component-scoped styles to prevent global pollution

**Vite Configuration**:
```typescript
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
});
```

**Usage Pattern**:
```typescript
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
  background: var(--color-card-bg);
}

.title {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
}
```

### Button Component System

**Purpose**: Centralized button styling with clear variants

**Structure**:
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

/* Primary variant */
.button--primary {
  background: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}

.button--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* Secondary variant */
.button--secondary {
  background: var(--color-button-secondary-bg);
  color: var(--color-button-secondary-text);
  border: 2px solid var(--color-border);
}

/* Navigation CTA variant */
.button--nav-cta {
  background: var(--color-nav-cta-bg);
  color: var(--color-nav-cta-text);
}

/* States */
.button.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.button.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* Theme overrides */
[data-theme="dark"] .button--primary {
  /* Dark mode adjustments if needed */
}
```

### Navigation Component

**Purpose**: Extract navigation from hero.css into dedicated file

**Structure**:
```css
/* layout/navigation.css */

.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-nav-bg);
  transition: all var(--duration-normal) var(--easing-standard);
}

.navigation.is-scrolled {
  background: var(--color-nav-bg-scrolled);
  box-shadow: var(--shadow-soft);
}

.navigation__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
}

.navigation__logo {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.navigation__links {
  display: flex;
  gap: var(--spacing-lg);
  list-style: none;
}

.navigation__link {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast) var(--easing-standard);
}

.navigation__link:hover {
  color: var(--color-text-primary);
}

.navigation__link.is-active {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

/* Theme overrides */
[data-theme="dark"] .navigation {
  background: var(--color-nav-bg-dark);
}

[data-theme="dark"] .navigation__link {
  color: var(--color-text-secondary-dark);
}
```

### Card Component System

**Purpose**: Reusable card styling across sections

**Structure**:
```css
/* components/cards.css */

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

/* Beat cards (horizontal scroll feature) */
.card--beat {
  min-width: 300px;
  background: linear-gradient(
    135deg,
    var(--beat-gradient-start),
    var(--beat-gradient-end)
  );
}

/* Theme overrides */
[data-theme="dark"] .card {
  background: var(--color-card-bg-dark);
}
```

## Data Models

### CSS File Metadata

Each CSS file in the new architecture has clear metadata:

```typescript
interface CSSFileMetadata {
  path: string;              // e.g., "src/styles/components/buttons.css"
  category: 'tokens' | 'base' | 'layout' | 'components' | 'sections' | 'features' | 'utilities';
  responsibility: string;    // e.g., "All button variants and states"
  maxLines: number;          // Target: 500
  dependencies: string[];    // Other CSS files it depends on
  components: string[];      // Components that use these styles
}
```

### Migration Phase Model

```typescript
interface MigrationPhase {
  phase: number;
  name: string;
  description: string;
  deliverables: string[];
  dependencies: number[];    // Previous phases that must complete
  estimatedDays: number;
  completionCriteria: string[];
}

const phases: MigrationPhase[] = [
  {
    phase: 1,
    name: "Foundation",
    description: "Extract tokens, setup base styles, configure CSS Modules",
    deliverables: [
      "tokens/ directory with all design tokens",
      "base/ directory with reset, global, theme",
      "CSS Modules configuration in vite.config.ts",
      "Updated index.css with new import structure"
    ],
    dependencies: [],
    estimatedDays: 5,
    completionCriteria: [
      "All tokens extracted to single source",
      "No duplicate token definitions",
      "CSS Modules working in build",
      "Visual output unchanged"
    ]
  },
  {
    phase: 2,
    name: "Component Extraction",
    description: "Extract reusable components to components/ directory",
    deliverables: [
      "components/buttons.css",
      "components/cards.css",
      "layout/navigation.css"
    ],
    dependencies: [1],
    estimatedDays: 7,
    completionCriteria: [
      "All button variants in single file",
      "Navigation extracted from hero.css",
      "Card styles consolidated",
      "Visual output unchanged"
    ]
  },
  {
    phase: 3,
    name: "Section Separation",
    description: "Split hero.css into individual section files",
    deliverables: [
      "sections/hero.css",
      "sections/services.css",
      "sections/portfolio.css",
      "sections/about.css",
      "sections/blog.css"
    ],
    dependencies: [2],
    estimatedDays: 7,
    completionCriteria: [
      "hero.css deleted",
      "Each section in separate file",
      "All sections under 500 lines",
      "Visual output unchanged"
    ]
  },
  {
    phase: 4,
    name: "Cleanup",
    description: "Remove !important, reduce specificity, eliminate inline styles",
    deliverables: [
      "Zero !important declarations (except utilities)",
      "All selectors under (0,0,2,0) specificity",
      "90% reduction in inline styles"
    ],
    dependencies: [3],
    estimatedDays: 5,
    completionCriteria: [
      "No !important in component/section files",
      "No compound selectors for specificity",
      "Inline styles only for dynamic values",
      "Visual output unchanged"
    ]
  },
  {
    phase: 5,
    name: "Testing & Optimization",
    description: "Visual regression testing, performance audit, documentation",
    deliverables: [
      "Visual regression test suite",
      "Performance benchmarks",
      "CSS architecture documentation",
      "Style guide"
    ],
    dependencies: [4],
    estimatedDays: 5,
    completionCriteria: [
      "All visual regression tests pass",
      "Bundle size reduced by 30-40%",
      "Documentation complete",
      "Team trained on new architecture"
    ]
  }
];
```

### Specificity Tracking Model

```typescript
interface SpecificityScore {
  inline: number;      // 1,0,0,0
  ids: number;         // 0,1,0,0
  classes: number;     // 0,0,1,0
  elements: number;    // 0,0,0,1
}

interface SelectorAudit {
  selector: string;
  file: string;
  line: number;
  specificity: SpecificityScore;
  isCompliant: boolean;  // <= (0,0,2,0)
  hasImportant: boolean;
  recommendation?: string;
}
```

### Component Ownership Map

```typescript
interface ComponentOwnership {
  component: string;
  styleFiles: string[];      // Should be length 1 after refactor
  currentFiles: string[];    // Before refactor (may be multiple)
  targetFile: string;        // After refactor
  migrationPhase: number;
}

const ownershipMap: ComponentOwnership[] = [
  {
    component: "Navigation",
    styleFiles: ["layout/navigation.css"],
    currentFiles: ["src/styles/hero.css"],
    targetFile: "src/styles/layout/navigation.css",
    migrationPhase: 2
  },
  {
    component: "Button",
    styleFiles: ["components/buttons.css"],
    currentFiles: ["src/styles/hero.css", "src/index.css"],
    targetFile: "src/styles/components/buttons.css",
    migrationPhase: 2
  },
  {
    component: "Hero Section",
    styleFiles: ["sections/hero.css"],
    currentFiles: ["src/styles/hero.css"],
    targetFile: "src/styles/sections/hero.css",
    migrationPhase: 3
  }
  // ... more mappings
];
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas of redundancy:

1. **Token centralization properties (1.1-1.4)** can be combined into a single comprehensive property about token organization
2. **File extraction properties (7.1-7.6, 8.1-8.4)** are examples of specific migrations, not universal properties
3. **!important elimination properties (11.1-11.3)** can be combined into one property with directory-specific checks
4. **Theme selector properties (6.4-6.5)** are redundant - both verify the same thing
5. **Naming convention properties (4.1-4.3)** can be tested together as a comprehensive naming compliance property
6. **Responsive design properties (19.1, 19.5)** overlap - both verify responsive styles are co-located

The following properties represent the unique, non-redundant validation requirements:

### Property 1: Token Centralization

*For any* CSS custom property (token) in the codebase, it should be defined exactly once in the tokens/ directory, and all references to that token should resolve to that single definition.

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.6**

### Property 2: Token Resolution

*For any* CSS custom property reference (var(--token-name)) in any CSS file, the token should be defined in one of the files in the tokens/ directory.

**Validates: Requirements 1.5**

### Property 3: Theme Override Pattern

*For any* token override in dark theme, it should only override existing tokens defined in light theme, not define new tokens.

**Validates: Requirements 1.7**

### Property 4: File Size Constraint

*For any* CSS file in the styles/ directory (excluding index.css), the file should contain fewer than 500 lines.

**Validates: Requirements 2.7**

### Property 5: Section File Responsibility

*For any* CSS file in the sections/ directory, all selectors in that file should be namespaced under the section name (e.g., sections/hero.css should only contain .hero* selectors).

**Validates: Requirements 2.2**

### Property 6: Component File Responsibility

*For any* CSS file in the components/ directory, all selectors in that file should be namespaced under the component name (e.g., components/buttons.css should only contain .button* selectors).

**Validates: Requirements 2.3**

### Property 7: Maximum Specificity Compliance

*For any* CSS selector in any stylesheet (excluding utilities/), the calculated specificity should not exceed (0,0,2,0).

**Validates: Requirements 3.1**

### Property 8: Compound Selector Elimination

*For any* CSS selector in any stylesheet, it should not use compound element-class patterns (e.g., nav.navbar, div.container) for specificity manipulation.

**Validates: Requirements 3.2**

### Property 9: Single Class Selector Preference

*For any* CSS file in components/ or sections/ directories, at least 70% of selectors should be single class selectors (specificity 0,0,1,0).

**Validates: Requirements 3.3**

### Property 10: Theme Selector Consistency

*For any* theme-specific CSS rule, it should use the [data-theme="dark"] attribute selector exclusively, not variants like html[data-theme="dark"], .dark, or [data-theme].

**Validates: Requirements 3.4, 6.4, 6.5**

### Property 11: Important Declaration Restriction

*For any* CSS file in components/, sections/, layout/, or features/ directories, it should contain zero !important declarations.

**Validates: Requirements 3.5, 11.1, 11.2**

### Property 12: Utility Important Exception

*For any* !important declaration in the codebase, it should only appear in files within the utilities/ directory or on display:none for accessibility.

**Validates: Requirements 11.3, 11.6**

### Property 13: BEM Naming Compliance

*For any* CSS class name in components/, sections/, or layout/ directories, it should follow BEM naming patterns: block, block__element, block--modifier, or is-state.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 14: Element Namespacing

*For any* CSS class representing a component element (containing __), it should be namespaced under a valid block name (e.g., .navigation__link, not just .__link).

**Validates: Requirements 4.5**

### Property 15: Generic Name Avoidance

*For any* CSS class name in the codebase, it should not be a generic single-word name from the blocklist: .link, .button, .card, .container, .wrapper, .item, .element.

**Validates: Requirements 4.4**

### Property 16: Component Style Uniqueness

*For any* component identifier (e.g., "button", "card", "navigation"), its styles should be defined in exactly one CSS file in the codebase.

**Validates: Requirements 8.6, 18.1, 18.5**

### Property 17: Inline Style Reduction

*For any* TSX/JSX file in the codebase, the number of inline style attributes should be reduced by at least 90% compared to the baseline count before refactoring.

**Validates: Requirements 9.1**

### Property 18: Static Inline Style Elimination

*For any* inline style attribute in TSX/JSX files, it should only contain dynamic values (variables, expressions, computed values), not static CSS values.

**Validates: Requirements 9.2, 9.4**

### Property 19: Dynamic Style Pattern

*For any* inline style with dynamic values, it should use CSS custom properties set via inline styles rather than direct CSS property values.

**Validates: Requirements 9.3**

### Property 20: Token Definition Location

*For any* CSS custom property definition (not reference), if it represents a design token (color, spacing, typography, shadow, animation), it should be defined in the tokens/ directory.

**Validates: Requirements 10.5**

### Property 21: Import Order Preservation

*For any* refactoring that moves styles between files, the relative cascade order of those styles should be preserved through correct import ordering in index.css.

**Validates: Requirements 13.2**

### Property 22: Bundle Size Reduction

*For the* complete CSS bundle, the total minified size after refactoring should be 30-40% smaller than the baseline size before refactoring.

**Validates: Requirements 16.1**

### Property 23: CSS Parsing Performance

*For the* complete CSS bundle, the browser CSS parsing time should be equal to or less than the baseline parsing time before refactoring.

**Validates: Requirements 16.3**

### Property 24: First Contentful Paint

*For the* application, the First Contentful Paint (FCP) metric should be equal to or better than the baseline FCP before refactoring.

**Validates: Requirements 16.4**

### Property 25: Render-Blocking Time

*For the* CSS loading process, the total render-blocking time should be equal to or less than the baseline render-blocking time before refactoring.

**Validates: Requirements 16.5**

### Property 26: Responsive Style Co-location

*For any* component with responsive styles (media queries), all media queries for that component should be defined in the same CSS file as the component's base styles.

**Validates: Requirements 19.1, 19.5**

### Property 27: Breakpoint Consistency

*For any* media query in the codebase, the breakpoint values should match the breakpoint tokens defined in tokens/spacing.css or tokens/breakpoints.css.

**Validates: Requirements 19.2**

### Property 28: Mobile-First Approach

*For any* media query in the codebase, it should use min-width (mobile-first) rather than max-width (desktop-first), unless specifically justified.

**Validates: Requirements 19.6**

### Property 29: Animation Timing Tokens

*For any* CSS transition or animation duration value, it should reference a token from tokens/animations.css rather than using hardcoded values.

**Validates: Requirements 20.4**

### Property 30: Easing Function Consistency

*For any* CSS transition or animation easing function, it should reference a token from tokens/animations.css rather than using hardcoded cubic-bezier values.

**Validates: Requirements 20.3**

### Property 31: Keyframe Uniqueness

*For any* @keyframes animation definition, it should be defined exactly once in utilities/animations.css, with no duplicate definitions across files.

**Validates: Requirements 20.6**

## Error Handling

### CSS Parsing Errors

**Strategy**: Validate CSS syntax during build process

```javascript
// postcss.config.js
export default {
  plugins: {
    'postcss-reporter': {
      clearReportedMessages: true,
      throwError: true
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Error Cases**:
1. **Invalid CSS syntax**: Build fails with clear error message
2. **Missing token reference**: Warning logged for undefined CSS variables
3. **Circular imports**: Build fails with dependency cycle error

### Migration Errors

**Strategy**: Incremental validation with rollback capability

**Error Cases**:
1. **Visual regression detected**: Halt migration, review changes, fix before proceeding
2. **Specificity conflict**: Identify conflicting selectors, resolve through cascade order
3. **Missing styles**: Compare rendered output, identify missing rules, restore them
4. **Build failure**: Rollback to previous working state, fix issues, retry

### Runtime Errors

**Strategy**: Graceful degradation with fallbacks

**Error Cases**:
1. **CSS file fails to load**: Fallback to inline critical CSS
2. **Theme toggle fails**: Default to light theme, log error
3. **CSS Module not found**: Fallback to global styles, log warning

## Testing Strategy

### Dual Testing Approach

This refactoring requires both **unit tests** and **property-based tests** for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across all inputs

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing

**Library**: fast-check (already in package.json)

**Configuration**: Minimum 100 iterations per property test

**Test Organization**:
```
src/styles/__tests__/
├── properties/
│   ├── token-centralization.test.ts
│   ├── specificity-compliance.test.ts
│   ├── naming-conventions.test.ts
│   ├── file-organization.test.ts
│   └── performance.test.ts
├── unit/
│   ├── theme-toggle.test.ts
│   ├── css-modules.test.ts
│   └── import-order.test.ts
└── visual/
    ├── hero-section.test.ts
    ├── navigation.test.ts
    └── theme-switching.test.ts
```

**Property Test Example**:
```typescript
// properties/token-centralization.test.ts
import * as fc from 'fast-check';
import { describe, it, expect } from 'vitest';
import { parseAllCSSFiles, extractTokenDefinitions } from '../utils/css-parser';

describe('CSS Architecture Properties', () => {
  it('Property 1: Token Centralization - Feature: css-architecture-refactor, Property 1: For any CSS custom property (token) in the codebase, it should be defined exactly once in the tokens/ directory', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...parseAllCSSFiles()),
        (cssFile) => {
          const tokens = extractTokenDefinitions(cssFile);
          
          // For each token in this file
          for (const token of tokens) {
            // If it's a token definition (not in tokens/ directory)
            if (!cssFile.path.includes('tokens/')) {
              // It should not be a design token
              expect(isDesignToken(token)).toBe(false);
            }
          }
          
          // All tokens should be defined exactly once
          const allTokens = getAllTokenDefinitions();
          const tokenCounts = countTokenDefinitions(allTokens);
          
          for (const [token, count] of Object.entries(tokenCounts)) {
            expect(count).toBe(1);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 7: Maximum Specificity Compliance - Feature: css-architecture-refactor, Property 7: For any CSS selector in any stylesheet (excluding utilities/), the calculated specificity should not exceed (0,0,2,0)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...parseAllCSSFiles()),
        (cssFile) => {
          // Skip utilities directory
          if (cssFile.path.includes('utilities/')) return true;
          
          const selectors = extractSelectors(cssFile);
          
          for (const selector of selectors) {
            const specificity = calculateSpecificity(selector);
            
            // Specificity should not exceed (0,0,2,0)
            expect(specificity.inline).toBe(0);
            expect(specificity.ids).toBe(0);
            expect(specificity.classes).toBeLessThanOrEqual(2);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 13: BEM Naming Compliance - Feature: css-architecture-refactor, Property 13: For any CSS class name in components/, sections/, or layout/ directories, it should follow BEM naming patterns', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...parseAllCSSFiles()),
        (cssFile) => {
          // Only check specific directories
          const relevantDirs = ['components/', 'sections/', 'layout/'];
          if (!relevantDirs.some(dir => cssFile.path.includes(dir))) {
            return true;
          }
          
          const classNames = extractClassNames(cssFile);
          
          for (const className of classNames) {
            // Should match BEM patterns
            const isBEM = 
              /^[a-z][a-z0-9-]*$/.test(className) ||                    // block
              /^[a-z][a-z0-9-]*__[a-z][a-z0-9-]*$/.test(className) ||   // block__element
              /^[a-z][a-z0-9-]*--[a-z][a-z0-9-]*$/.test(className) ||   // block--modifier
              /^is-[a-z][a-z0-9-]*$/.test(className);                   // is-state
            
            expect(isBEM).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Testing

**Focus Areas**:
1. **Theme toggle functionality**: Verify data-theme attribute changes
2. **CSS Modules integration**: Verify scoped class names are generated
3. **Import order**: Verify index.css imports in correct sequence
4. **Build configuration**: Verify PostCSS and Vite configs are correct

**Unit Test Example**:
```typescript
// unit/theme-toggle.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setTheme, getTheme } from '../utils/theme';

describe('Theme System', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should set data-theme attribute on html element', () => {
    setTheme('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should persist theme to localStorage', () => {
    setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('should initialize from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    const theme = getTheme();
    expect(theme).toBe('dark');
  });

  it('should default to light theme', () => {
    const theme = getTheme();
    expect(theme).toBe('light');
  });
});
```

### Visual Regression Testing

**Strategy**: Screenshot comparison before/after refactoring

**Tool**: Playwright or Puppeteer with pixelmatch

**Critical Components**:
1. Navigation (light and dark themes)
2. Hero section
3. Service cards
4. Portfolio section
5. Blog cards
6. Horizontal scroll feature
7. Theme toggle transition

**Visual Test Example**:
```typescript
// visual/navigation.test.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation Visual Regression', () => {
  test('should match baseline in light theme', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const screenshot = await page.locator('.navigation').screenshot();
    expect(screenshot).toMatchSnapshot('navigation-light.png');
  });

  test('should match baseline in dark theme', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await page.waitForTimeout(500); // Wait for theme transition
    
    const screenshot = await page.locator('.navigation').screenshot();
    expect(screenshot).toMatchSnapshot('navigation-dark.png');
  });

  test('should match baseline when scrolled', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300); // Wait for scroll animation
    
    const screenshot = await page.locator('.navigation').screenshot();
    expect(screenshot).toMatchSnapshot('navigation-scrolled.png');
  });
});
```

### Performance Testing

**Metrics to Track**:
1. **CSS bundle size**: Before and after refactoring
2. **CSS parsing time**: Browser performance timeline
3. **First Contentful Paint (FCP)**: Lighthouse
4. **Render-blocking time**: Lighthouse
5. **Build time**: Vite build duration

**Performance Test Example**:
```typescript
// properties/performance.test.ts
import { describe, it, expect } from 'vitest';
import { buildCSS, measureBundleSize } from '../utils/build';
import { BASELINE_METRICS } from '../utils/baseline';

describe('Performance Properties', () => {
  it('Property 22: Bundle Size Reduction - should reduce CSS bundle by 30-40%', async () => {
    const currentSize = await measureBundleSize();
    const reduction = (BASELINE_METRICS.bundleSize - currentSize) / BASELINE_METRICS.bundleSize;
    
    expect(reduction).toBeGreaterThanOrEqual(0.30);
    expect(reduction).toBeLessThanOrEqual(0.40);
  });

  it('Property 24: First Contentful Paint - should maintain or improve FCP', async () => {
    const currentFCP = await measureFCP();
    
    expect(currentFCP).toBeLessThanOrEqual(BASELINE_METRICS.fcp);
  });
});
```

### Integration Testing

**Focus**: Verify components work together after refactoring

**Test Cases**:
1. Theme toggle affects all components
2. Navigation CTA button uses correct styles
3. Hero section buttons use correct styles
4. Card hover effects work correctly
5. Horizontal scroll feature maintains styling
6. Mouse trail effect maintains styling

### Test Execution Strategy

**During Development**:
```bash
npm run test:watch  # Run unit tests in watch mode
```

**Before Each Commit**:
```bash
npm run test        # Run all unit and property tests
```

**After Each Migration Phase**:
```bash
npm run test                    # All tests
npm run test:visual             # Visual regression tests
npm run test:performance        # Performance benchmarks
```

**Continuous Integration**:
- Run all tests on every pull request
- Block merge if any test fails
- Generate coverage reports
- Track performance metrics over time

### Success Criteria

**All tests must pass**:
- ✅ 100% of property-based tests pass (31 properties)
- ✅ 100% of unit tests pass
- ✅ 100% of visual regression tests pass
- ✅ Performance metrics meet or exceed targets

**Coverage Requirements**:
- CSS parsing utilities: 100% coverage
- Theme system: 100% coverage
- Build configuration: 100% coverage
