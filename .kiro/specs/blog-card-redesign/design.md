# Design Document: Blog Card Redesign

## Overview

This design document specifies the implementation approach for redesigning the blog cards in the codebyLeon portfolio website. The design follows the project's CSS architecture, uses design tokens exclusively, and implements both light and dark mode support through the Theme_Context system.

## Design Approach

The blog card redesign will be implemented as CSS modifications to the existing `.card--blog` modifier in `src/styles/components/cards.css`. All styling will use design tokens from `src/styles/tokens/`, follow BEM naming conventions, and maintain the project's strict CSS layer hierarchy.

## Component Structure

### HTML Structure
```html
<article class="card card--blog">
  <div class="card__image-container">
    <img class="card__image" src="..." alt="..." loading="lazy" />
  </div>
  <div class="card__content">
    <span class="card__badge">Category Name</span>
    <h3 class="card__title">Blog Post Title</h3>
    <p class="card__description">Blog post description text...</p>
    <div class="card__meta">
      <span class="card__meta-item">Jan 15, 2024</span>
      <span class="card__meta-separator">•</span>
      <span class="card__meta-item">5 min read</span>
    </div>
    <a href="..." class="card__link">
      Read More
      <span class="card__link-icon">→</span>
    </a>
  </div>
</article>
```

## Visual Design Specifications

### Typography Hierarchy

**Title:**
- Font size: `clamp(var(--font-size-xl), 2vw, var(--font-size-2xl))`
- Font weight: `var(--font-weight-bold)`
- Line height: `var(--line-height-tight)`
- Color: `var(--color-text-primary)`
- Margin bottom: `var(--spacing-md)`

**Description:**
- Font size: `var(--font-size-base)`
- Font weight: `var(--font-weight-normal)`
- Line height: `var(--line-height-relaxed)`
- Color: `var(--color-text-secondary)`
- Margin bottom: `var(--spacing-lg)`
- Line clamp: 3 lines with ellipsis

**Meta Text:**
- Font size: `var(--font-size-sm)`
- Font weight: `var(--font-weight-normal)`
- Color: `var(--color-text-muted)`
- Line height: `var(--line-height-normal)`

### Category Badge Design

**Styling:**
- Font size: `var(--font-size-xs)`
- Font weight: `var(--font-weight-bold)`
- Text transform: `uppercase`
- Letter spacing: `var(--letter-spacing-wide)`
- Padding: `var(--spacing-sm) var(--spacing-md)`
- Border radius: `20px`
- Margin bottom: `var(--spacing-md)`
- Display: `inline-block`

**Light Mode Colors:**
- Background: `var(--color-primary)` with 10% opacity
- Text: `var(--color-primary)`
- Border: `1px solid var(--color-primary)` with 20% opacity

**Dark Mode Colors:**
- Background: `var(--hero-accent)` with 15% opacity
- Text: `var(--hero-accent)`
- Border: `1px solid var(--hero-accent)` with 25% opacity

### Spacing System

**Card Padding:**
- Mobile: `var(--spacing-xl)` (all sides)
- Desktop (≥900px): `var(--spacing-2xl)` (all sides)

**Content Spacing:**
- Image to content: `var(--spacing-lg)`
- Badge to title: `var(--spacing-md)`
- Title to description: `var(--spacing-md)`
- Description to meta: `var(--spacing-lg)`
- Meta to link: `var(--spacing-lg)`

**Meta Items:**
- Gap between items: `var(--spacing-md)`

### Featured Image Treatment

**Container:**
- Aspect ratio: `16 / 9`
- Border radius: `12px`
- Overflow: `hidden`
- Margin bottom: `var(--spacing-lg)`
- Min height: `200px`
- Max height: `280px`

**Image:**
- Object fit: `cover`
- Width: `100%`
- Height: `100%`
- Transition: `transform var(--duration-slow) var(--easing-standard)`

**Fallback:**
- Background: `linear-gradient(135deg, var(--color-primary) 0%, var(--hero-accent) 100%)`
- Opacity: `0.1`

### Interactive States

**Card Hover:**
```css
.card--blog:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  transition: transform var(--duration-normal) var(--easing-standard),
              box-shadow var(--duration-normal) var(--easing-standard);
}
```

**Card Focus:**
```css
.card--blog:focus-visible {
  outline: 2px solid var(--hero-accent);
  outline-offset: 2px;
}
```

**Image Hover:**
```css
.card--blog:hover .card__image {
  transform: scale(1.05);
}
```

**Link Hover:**
```css
.card__link:hover {
  background: var(--hero-accent);
  color: var(--color-white);
  transform: translateX(4px);
}
```

### Color System

**Light Mode:**
- Card background: `var(--color-card-bg)` or `rgba(255, 255, 255, 0.95)`
- Card border: `var(--color-border)` or `rgba(0, 0, 0, 0.08)`
- Shadow: `var(--shadow-lg)`
- Text primary: `var(--color-text-primary)`
- Text secondary: `var(--color-text-secondary)`
- Text muted: `var(--color-text-muted)`

**Dark Mode:**
- Card background: `var(--color-card-bg-dark)` or `rgba(30, 30, 35, 0.95)`
- Card border: `var(--color-glass-border-dark)` or `rgba(255, 255, 255, 0.1)`
- Shadow: `var(--shadow-dark-lg)` or `0 10px 40px rgba(0, 0, 0, 0.5)`
- Text primary: `var(--color-text-primary)` (auto-adjusts via theme)
- Text secondary: `var(--color-text-secondary)` (auto-adjusts via theme)
- Text muted: `var(--color-text-muted)` (auto-adjusts via theme)

**Theme Transition:**
```css
.card--blog {
  transition: background-color var(--duration-normal) var(--easing-standard),
              border-color var(--duration-normal) var(--easing-standard),
              box-shadow var(--duration-normal) var(--easing-standard);
}
```

### Read More Link Design

**Base Styling:**
- Font size: `var(--font-size-sm)`
- Font weight: `var(--font-weight-semibold)`
- Text transform: `uppercase`
- Letter spacing: `var(--letter-spacing-wide)`
- Padding: `var(--spacing-sm) var(--spacing-lg)`
- Border radius: `8px`
- Display: `inline-flex`
- Align items: `center`
- Gap: `var(--spacing-sm)`

**Colors:**
- Light mode: `var(--hero-accent)` text, transparent background
- Dark mode: `var(--hero-accent)` text, transparent background
- Hover (both modes): `var(--hero-accent)` background, white text

**Icon:**
- Arrow symbol: `→`
- Transition: `transform var(--duration-fast) var(--easing-standard)`
- Hover transform: `translateX(4px)`

### Responsive Breakpoints

**Mobile (< 900px):**
- Padding: `var(--spacing-xl)`
- Title font size: Lower end of clamp
- Image height: `200px`

**Desktop (≥ 900px):**
- Padding: `var(--spacing-2xl)`
- Title font size: Upper end of clamp
- Image height: `280px`

### Accessibility Features

**Keyboard Navigation:**
- Tab order: Card → Link
- Focus visible: 2px solid outline with 2px offset
- Focus color: `var(--hero-accent)`

**Screen Readers:**
- Semantic `<article>` element
- Descriptive alt text for images
- ARIA labels where needed

**Color Contrast:**
- All text meets WCAG AA standards (4.5:1 minimum)
- Badge maintains 3:1 contrast in both modes
- Link maintains 4.5:1 contrast in both modes

### Performance Optimizations

**GPU Acceleration:**
```css
.card--blog {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

**Efficient Animations:**
- Use `transform` and `opacity` only
- Avoid animating `width`, `height`, `margin`, `padding`
- Use `will-change` sparingly on hover only

**Image Loading:**
- Lazy loading: `loading="lazy"` attribute
- Aspect ratio container prevents layout shift
- Smooth fade-in on load

## CSS Architecture Compliance

### File Location
- All styles in: `src/styles/components/cards.css`
- Modifier class: `.card--blog`
- BEM naming for all sub-elements

### Specificity Rules
- Maximum specificity: (0,0,2,0)
- No `!important` declarations
- No ID selectors
- Class-based selectors only

### Token Usage
- All colors from design tokens
- All spacing from design tokens
- All typography from design tokens
- All shadows from design tokens
- All animations from design tokens

### Layer Hierarchy
```
tokens → base → component → section → feature → utility
```

The blog card styles live in the component layer and reference tokens exclusively.

## Implementation Notes

1. Modify existing `.card--blog` styles, don't create new files
2. Use CSS custom properties for all theme-dependent values
3. Test both light and dark modes thoroughly
4. Verify keyboard navigation and focus states
5. Test responsive behavior at all breakpoints
6. Validate color contrast ratios
7. Check animation performance (60fps target)
8. Ensure no layout shift during image loading

## Correctness Properties

### Property 1: Token Consistency
**Statement:** All style values must reference design tokens; no hardcoded values allowed.

**Validates:** Requirements 1.1, 2.1, 3.1, 4.6, 5.1, 7.1, 10.3

**Test Strategy:** Static analysis of CSS file to ensure all values use `var(--*)` syntax.

### Property 2: Theme Symmetry
**Statement:** For every light mode style, there must be a corresponding dark mode style that maintains visual hierarchy and contrast ratios.

**Validates:** Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7

**Test Strategy:** Visual regression testing comparing light and dark mode screenshots; automated contrast ratio checking.

### Property 3: Specificity Ceiling
**Statement:** No CSS selector for blog cards shall exceed specificity (0,0,2,0).

**Validates:** Requirements 10.4, 10.5

**Test Strategy:** CSS specificity analyzer tool to verify all selectors.

### Property 4: Accessibility Compliance
**Statement:** All interactive elements must be keyboard accessible and maintain WCAG AA contrast ratios.

**Validates:** Requirements 11.1, 11.2, 11.3, 11.4, 11.6, 11.7

**Test Strategy:** Automated accessibility testing with axe-core; manual keyboard navigation testing.

### Property 5: Performance Threshold
**Statement:** All animations must use GPU-accelerated properties (transform, opacity) and maintain 60fps.

**Validates:** Requirements 12.1, 12.2, 12.3, 12.5, 12.6

**Test Strategy:** Chrome DevTools Performance profiler; frame rate monitoring during interactions.

### Property 6: Responsive Consistency
**Statement:** Visual hierarchy and spacing relationships must be maintained across all breakpoints.

**Validates:** Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6

**Test Strategy:** Visual regression testing at multiple viewport sizes; manual testing on physical devices.

### Property 7: BEM Naming Convention
**Statement:** All CSS classes must follow BEM naming pattern: `.block__element--modifier`.

**Validates:** Requirements 10.2

**Test Strategy:** Regex pattern matching against all class names in cards.css.

### Property 8: Interactive State Completeness
**Statement:** Every interactive element must have defined hover, focus, and active states.

**Validates:** Requirements 4.1, 4.2, 4.3, 4.4, 4.5

**Test Strategy:** Manual testing of all interactive states; CSS coverage analysis.

## Edge Cases

1. **Long Titles:** Titles exceeding 3 lines should wrap gracefully without breaking layout
2. **Missing Images:** Fallback gradient should display when image fails to load
3. **Short Descriptions:** Cards with minimal content should maintain consistent height
4. **Narrow Viewports:** Cards should remain readable at 320px width
5. **High Contrast Mode:** Styles should respect user's high contrast preferences
6. **Reduced Motion:** Animations should be disabled when `prefers-reduced-motion: reduce`
7. **Very Long Category Names:** Badge should wrap or truncate appropriately

## Testing Checklist

- [ ] Visual regression tests for light mode
- [ ] Visual regression tests for dark mode
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Color contrast validation
- [ ] Responsive testing (320px, 768px, 1024px, 1440px)
- [ ] Animation performance profiling
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Touch target size validation on mobile
- [ ] Image loading and fallback testing
- [ ] Theme transition smoothness
- [ ] CSS specificity validation
- [ ] Token usage validation

