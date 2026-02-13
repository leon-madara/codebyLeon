# CSS Component Ownership Mapping

## Overview

This document provides a clear mapping of which CSS file owns the styles for each component in the Code by Leon project. Each component should have exactly one source file for its styles to ensure maintainability and prevent conflicts.

---

## Directory Structure Diagram

```
src/styles/
│
├── tokens/                    # Design Tokens (Single Source of Truth)
│   ├── colors.css            # All color variables
│   ├── typography.css        # Font families, sizes, weights
│   ├── spacing.css           # Spacing scale + breakpoints
│   ├── shadows.css           # Shadow definitions
│   └── animations.css        # Animation timing + easing
│
├── base/                      # Foundation Styles
│   ├── reset.css             # CSS reset/normalize
│   ├── global.css            # Global element styles
│   └── theme.css             # Theme switching logic
│
├── layout/                    # Layout Components
│   ├── navigation.css        # Navigation component
│   ├── footer.css            # Footer component (if exists)
│   └── grid.css              # Layout grids (if exists)
│
├── components/                # Reusable UI Components
│   ├── buttons.css           # All button variants
│   ├── cards.css             # Card components
│   ├── forms.css             # Form elements
│   └── modals.css            # Modal components
│
├── sections/                  # Page Sections
│   ├── hero.css              # Hero section
│   ├── services.css          # Services section
│   ├── portfolio.css         # Portfolio section
│   ├── about.css             # About section
│   └── blog.css              # Blog section
│
├── features/                  # Complex Features
│   ├── horizontal-scroll.css # Horizontal scroll (beat cards)
│   ├── mouse-trail.css       # Mouse trail effect
│   ├── configurator.css      # Configurator page
│   └── torch-effect.css      # Torch effect (if exists)
│
├── utilities/                 # Utility Classes
│   ├── animations.css        # Animation utilities + keyframes
│   ├── helpers.css           # Helper classes (if exists)
│   └── responsive.css        # Responsive utilities (if exists)
│
└── index.css                  # Main Import Orchestrator
```

---

## Component Ownership Table

### Layout Components

| Component | Owner File | Class Prefix | Description |
|-----------|-----------|--------------|-------------|
| Navigation | `layout/navigation.css` | `.navigation` | Main navigation bar with logo, links, and CTA |
| Footer | `layout/footer.css` | `.footer` | Site footer (if implemented) |
| Grid System | `layout/grid.css` | `.grid` | Layout grid utilities (if implemented) |

**Navigation Classes:**
- `.navigation` - Main navigation container
- `.navigation.is-scrolled` - Scrolled state
- `.navigation__container` - Inner container
- `.navigation__logo` - Logo element
- `.navigation__links` - Links container
- `.navigation__link` - Individual link
- `.navigation__link.is-active` - Active link state

---

### UI Components

| Component | Owner File | Class Prefix | Description |
|-----------|-----------|--------------|-------------|
| Buttons | `components/buttons.css` | `.button` | All button variants and states |
| Cards | `components/cards.css` | `.card` | Card components for content display |
| Forms | `components/forms.css` | `.form__*` | Form inputs, labels, textareas, selects |
| Modals | `components/modals.css` | `.modal` | Modal dialogs and overlays |

**Button Classes:**
- `.button` - Base button
- `.button--primary` - Primary variant
- `.button--secondary` - Secondary variant
- `.button--nav-cta` - Navigation CTA variant
- `.button.is-loading` - Loading state
- `.button.is-disabled` - Disabled state

**Card Classes:**
- `.card` - Base card
- `.card__title` - Card title
- `.card__description` - Card description
- `.card--featured` - Featured variant
- `.card--blog` - Blog card variant
- `.card--beat` - Beat card variant (horizontal scroll)

**Form Classes:**
- `.form__label` - Form label
- `.form__input` - Text input
- `.form__textarea` - Textarea
- `.form__select` - Select dropdown

**Modal Classes:**
- `.modal` - Modal container
- `.modal.is-open` - Open state
- `.modal__overlay` - Background overlay
- `.modal__content` - Modal content
- `.modal__close` - Close button

---

### Page Sections

| Section | Owner File | Class Prefix | Description |
|---------|-----------|--------------|-------------|
| Hero | `sections/hero.css` | `.hero` | Hero section with title, subtitle, CTAs |
| Services | `sections/services.css` | `.services` | Services section with grid |
| Portfolio | `sections/portfolio.css` | `.portfolio` | Portfolio section with project grid |
| About | `sections/about.css` | `.about` | About section with content |
| Blog | `sections/blog.css` | `.blog` | Blog section with post grid |

**Hero Classes:**
- `.hero` - Hero section container
- `.hero__container` - Inner container
- `.hero__title` - Main heading
- `.hero__subtitle` - Subtitle text
- `.hero__ctas` - CTA buttons container
- `.hero__cta` - Individual CTA button

**Services Classes:**
- `.services` - Services section container
- `.services__container` - Inner container
- `.services__title` - Section title
- `.services__grid` - Services grid
- `.services__item` - Individual service item

**Portfolio Classes:**
- `.portfolio` - Portfolio section container
- `.portfolio__container` - Inner container
- `.portfolio__title` - Section title
- `.portfolio__grid` - Portfolio grid
- `.portfolio__item` - Individual portfolio item

**About Classes:**
- `.about` - About section container
- `.about__container` - Inner container
- `.about__title` - Section title
- `.about__content` - Content area

**Blog Classes:**
- `.blog` - Blog section container
- `.blog__container` - Inner container
- `.blog__title` - Section title
- `.blog__grid` - Blog post grid
- `.blog__post` - Individual blog post

---

### Features

| Feature | Owner File | Class Prefix | Description |
|---------|-----------|--------------|-------------|
| Horizontal Scroll | `features/horizontal-scroll.css` | `.horizontal-scroll` | Horizontal scrolling beat cards |
| Mouse Trail | `features/mouse-trail.css` | `.mouse-trail` | Mouse trail effect |
| Configurator | `features/configurator.css` | `.configurator` | Configurator page styles |
| Torch Effect | `features/torch-effect.css` | `.torch-effect` | Torch effect (if implemented) |

**Horizontal Scroll Classes:**
- `.horizontal-scroll` - Container
- `.horizontal-scroll__container` - Inner container
- `.horizontal-scroll__track` - Scrolling track
- `.beat-card` - Individual beat card
- `.beat-card__title` - Beat card title
- `.beat-card__description` - Beat card description

**Mouse Trail Classes:**
- `.mouse-trail` - Mouse trail container
- `.mouse-trail__dot` - Individual trail dot

**Configurator Classes:**
- `.configurator` - Configurator container
- `.configurator__panel` - Control panel
- `.configurator__preview` - Preview area
- `.configurator__controls` - Controls section

---

### Design Tokens

| Token Category | Owner File | Variable Prefix | Description |
|----------------|-----------|-----------------|-------------|
| Colors | `tokens/colors.css` | `--color-*` | All color variables |
| Typography | `tokens/typography.css` | `--font-*` | Font families, sizes, weights |
| Spacing | `tokens/spacing.css` | `--spacing-*`, `--breakpoint-*` | Spacing scale + breakpoints |
| Shadows | `tokens/shadows.css` | `--shadow-*` | Shadow definitions |
| Animations | `tokens/animations.css` | `--duration-*`, `--easing-*` | Animation timing + easing |

**Color Tokens:**
- `--color-canvas-light` - Light canvas background
- `--color-canvas-dark` - Dark canvas background
- `--color-primary` - Primary brand color
- `--color-secondary` - Secondary brand color
- `--color-accent` - Accent color
- `--color-text-primary` - Primary text color
- `--color-text-secondary` - Secondary text color
- `--color-button-primary-bg` - Primary button background
- `--color-button-primary-text` - Primary button text
- `--color-nav-cta-bg` - Navigation CTA background
- `--color-nav-cta-text` - Navigation CTA text

**Typography Tokens:**
- `--font-display` - Display font (Playfair Display)
- `--font-body` - Body font (Inter)
- `--font-size-xs` through `--font-size-4xl` - Font size scale
- `--font-weight-normal` through `--font-weight-bold` - Font weights

**Spacing Tokens:**
- `--spacing-xs` through `--spacing-3xl` - Spacing scale
- `--breakpoint-sm` through `--breakpoint-xl` - Responsive breakpoints

**Shadow Tokens:**
- `--shadow-soft` - Soft shadow
- `--shadow-medium` - Medium shadow
- `--shadow-glow` - Glow effect

**Animation Tokens:**
- `--duration-fast` - Fast duration (150ms)
- `--duration-normal` - Normal duration (250ms)
- `--duration-slow` - Slow duration (350ms)
- `--easing-standard` - Standard easing
- `--easing-decelerate` - Decelerate easing
- `--easing-accelerate` - Accelerate easing

---

## Migration History

### Before Refactoring

**Problems:**
- Navigation styles in `hero.css` (lines 1-250)
- Button styles scattered across `hero.css` and `index.css`
- Card styles duplicated in multiple files
- Blog styles split between `hero.css` and `index.css`
- Theme variables defined in 3 places (index.css, hero.css, configurator.css)
- No clear ownership - hard to find where to modify styles

### After Refactoring

**Solutions:**
- Each component has exactly one owner file
- Clear namespace with BEM naming
- All tokens in single location (tokens/)
- Easy to find and modify styles
- No duplicate definitions
- Maximum 500 lines per file

---

## Finding Component Styles

### Quick Lookup Guide

**"Where do I find styles for...?"**

1. **A reusable component** (button, card, form, modal)
   - Look in `components/[component-name].css`
   - Example: Button styles → `components/buttons.css`

2. **A page section** (hero, services, portfolio, about, blog)
   - Look in `sections/[section-name].css`
   - Example: Hero styles → `sections/hero.css`

3. **A layout element** (navigation, footer, grid)
   - Look in `layout/[element-name].css`
   - Example: Navigation styles → `layout/navigation.css`

4. **A complex feature** (horizontal scroll, mouse trail, configurator)
   - Look in `features/[feature-name].css`
   - Example: Mouse trail → `features/mouse-trail.css`

5. **A design token** (color, spacing, font, shadow, animation)
   - Look in `tokens/[category].css`
   - Example: Colors → `tokens/colors.css`

6. **Theme overrides** (dark mode)
   - Look in `base/theme.css`

7. **Global element styles** (body, headings, paragraphs)
   - Look in `base/global.css`

---

## Ownership Rules

### ✅ DO:

1. **Define component styles in exactly one file**
   - All button styles in `components/buttons.css`
   - All card styles in `components/cards.css`

2. **Namespace all selectors under component name**
   - `.button`, `.button--primary`, `.button.is-loading`
   - `.card`, `.card__title`, `.card--featured`

3. **Include all variants and states in the same file**
   - Primary, secondary, tertiary variants
   - Hover, active, focus, disabled states

4. **Co-locate responsive styles with base styles**
   - Media queries in the same file as component

5. **Reference tokens for all values**
   - Use `var(--color-primary)` not `#cd340f`
   - Use `var(--spacing-lg)` not `1.5rem`

### ❌ DON'T:

1. **Split component styles across multiple files**
   - ❌ Button styles in both `buttons.css` and `hero.css`

2. **Define styles for other components**
   - ❌ Card styles in `buttons.css`
   - ❌ Button styles in `hero.css`

3. **Duplicate component definitions**
   - ❌ `.button` defined in multiple files

4. **Scatter responsive styles**
   - ❌ Mobile styles in component file, desktop in utilities

5. **Define tokens outside tokens/ directory**
   - ❌ `--color-primary` defined in `buttons.css`

---

## Verification

To verify component ownership is correct:

```bash
# Check for duplicate class definitions
npm run test:css:properties

# Audit component ownership
npm run test:css:audit

# Visual regression testing
npm run test:visual
```

---

## Questions?

- **"Can I create a new component file?"**
  - Yes! Follow the naming conventions and file organization principles
  - Add it to the appropriate directory (components/, sections/, features/)
  - Update this document with the new component

- **"What if a component is used in multiple sections?"**
  - It belongs in `components/` not `sections/`
  - Sections should only contain section-specific layout and composition

- **"Can I use Tailwind classes instead?"**
  - Yes, for one-off utilities (flex, grid, margin, padding)
  - No, for reusable component patterns (use component CSS files)

- **"Where do I put page-specific styles?"**
  - If it's a section: `sections/[section-name].css`
  - If it's a feature: `features/[feature-name].css`
  - If it's truly unique: Consider a CSS Module

---

## Related Documentation

- [CSS Architecture Style Guide](./CSS_ARCHITECTURE_STYLE_GUIDE.md)
- [Onboarding Guide](./CSS_ONBOARDING_GUIDE.md)
- [Inline Styles Guide](./CSS_INLINE_STYLES_GUIDE.md)
- [Performance Report](./CSS_PERFORMANCE_REPORT.md)
