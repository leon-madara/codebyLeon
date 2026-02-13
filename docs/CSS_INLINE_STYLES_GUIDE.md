# Inline Styles Guide

## Overview

This guide documents when and how to use inline styles in the Code by Leon project. Our architecture minimizes inline styles to maintain separation of concerns and improve maintainability.

**Key Principle:** Inline styles should ONLY be used for truly dynamic values that cannot be predetermined in CSS files.

---

## Table of Contents

1. [The 90% Reduction Goal](#the-90-reduction-goal)
2. [Acceptable Use Cases](#acceptable-use-cases)
3. [Unacceptable Use Cases](#unacceptable-use-cases)
4. [Best Practices](#best-practices)
5. [Migration Examples](#migration-examples)
6. [Verification](#verification)

---

## The 90% Reduction Goal

### Before Refactoring

**Baseline:** 147 inline style instances across the codebase

**Problems:**
- Static values hardcoded in JSX
- Duplicate style definitions
- Hard to maintain and update
- Inconsistent values
- Poor separation of concerns

### After Refactoring

**Target:** ≤15 inline style instances (90% reduction)

**Improvements:**
- Only dynamic values in inline styles
- Static values moved to CSS files
- Consistent use of design tokens
- Better maintainability
- Clear separation of concerns

---

## Acceptable Use Cases

### ✅ Use Case 1: Dynamic Animation Delays

**When:** Animation delays based on array index or dynamic data

**Why acceptable:** The value changes for each element and cannot be predetermined

**Pattern:** Use CSS custom properties set via inline styles

```tsx
/* ✅ GOOD - Dynamic delay based on index */
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

### ✅ Use Case 2: Dynamic Positioning

**When:** Position values calculated at runtime (e.g., mouse position, scroll position)

**Why acceptable:** Values change continuously based on user interaction

**Pattern:** Use CSS custom properties for x/y coordinates

```tsx
/* ✅ GOOD - Mouse trail effect */
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);

return (
  <div
    className="mouse-trail__dot"
    style={{
      '--x': `${mousePosition.x}px`,
      '--y': `${mousePosition.y}px`,
    } as React.CSSProperties}
  />
);
```

```css
/* CSS file */
.mouse-trail__dot {
  position: fixed;
  left: var(--x);
  top: var(--y);
  transform: translate(-50%, -50%);
}
```

### ✅ Use Case 3: Dynamic Colors from Data

**When:** Colors come from user data, API responses, or database

**Why acceptable:** Values are not known at build time

**Pattern:** Use CSS custom properties for color values

```tsx
/* ✅ GOOD - User-selected theme color */
interface UserProfile {
  themeColor: string;
}

const ProfileCard = ({ user }: { user: UserProfile }) => (
  <div
    className="profile-card"
    style={{ '--user-color': user.themeColor } as React.CSSProperties}
  >
    <div className="profile-card__header">
      {user.name}
    </div>
  </div>
);
```

```css
/* CSS file */
.profile-card__header {
  background: var(--user-color);
  color: white;
}
```

### ✅ Use Case 4: Dynamic Dimensions from Calculations

**When:** Width/height calculated based on viewport, container size, or data

**Why acceptable:** Values depend on runtime calculations

**Pattern:** Use CSS custom properties for dimension values

```tsx
/* ✅ GOOD - Progress bar based on data */
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progress-bar">
    <div
      className="progress-bar__fill"
      style={{ '--progress': `${progress}%` } as React.CSSProperties}
    />
  </div>
);
```

```css
/* CSS file */
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-progress-bg);
  border-radius: 4px;
}

.progress-bar__fill {
  width: var(--progress);
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width var(--duration-normal) var(--easing-standard);
}
```

### ✅ Use Case 5: Dynamic Transforms

**When:** Transform values calculated at runtime (parallax, scroll effects)

**Why acceptable:** Values change based on scroll position or other dynamic factors

**Pattern:** Use CSS custom properties for transform values

```tsx
/* ✅ GOOD - Parallax effect */
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

return (
  <div
    className="parallax-layer"
    style={{ '--scroll': `${scrollY * 0.5}px` } as React.CSSProperties}
  >
    Content
  </div>
);
```

```css
/* CSS file */
.parallax-layer {
  transform: translateY(var(--scroll));
}
```

---

## Unacceptable Use Cases

### ❌ Use Case 1: Static Padding/Margin

**Why unacceptable:** Static values should be in CSS files using design tokens

```tsx
/* ❌ BAD - Static padding */
<div style={{ padding: '1.5rem' }}>
  Content
</div>

/* ✅ GOOD - Use CSS class */
<div className="card">
  Content
</div>
```

```css
/* CSS file */
.card {
  padding: var(--spacing-lg);
}
```

### ❌ Use Case 2: Static Colors

**Why unacceptable:** Colors should be design tokens in CSS files

```tsx
/* ❌ BAD - Static color */
<button style={{ background: '#cd340f', color: '#ffffff' }}>
  Click me
</button>

/* ✅ GOOD - Use CSS class */
<button className="button button--primary">
  Click me
</button>
```

```css
/* CSS file */
.button--primary {
  background: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}
```

### ❌ Use Case 3: Static Typography

**Why unacceptable:** Typography should use design tokens in CSS files

```tsx
/* ❌ BAD - Static font styles */
<h2 style={{
  fontFamily: 'Playfair Display',
  fontSize: '2.25rem',
  fontWeight: 700
}}>
  Title
</h2>

/* ✅ GOOD - Use CSS class */
<h2 className="hero__title">
  Title
</h2>
```

```css
/* CSS file */
.hero__title {
  font-family: var(--font-display);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
}
```

### ❌ Use Case 4: Static Layout

**Why unacceptable:** Layout should be in CSS files or use Tailwind utilities

```tsx
/* ❌ BAD - Static layout */
<div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
}}>
  Content
</div>

/* ✅ GOOD - Use Tailwind utilities */
<div className="flex items-center gap-4">
  Content
</div>

/* ✅ ALSO GOOD - Use CSS class for complex layouts */
<div className="navigation__links">
  Content
</div>
```

```css
/* CSS file */
.navigation__links {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}
```

### ❌ Use Case 5: Static Borders/Shadows

**Why unacceptable:** Borders and shadows should use design tokens

```tsx
/* ❌ BAD - Static border and shadow */
<div style={{
  border: '1px solid #e5e7eb',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
}}>
  Content
</div>

/* ✅ GOOD - Use CSS class */
<div className="card">
  Content
</div>
```

```css
/* CSS file */
.card {
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-soft);
}
```

### ❌ Use Case 6: Static Transitions/Animations

**Why unacceptable:** Transitions should use timing tokens in CSS files

```tsx
/* ❌ BAD - Static transition */
<button style={{
  transition: 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)'
}}>
  Click me
</button>

/* ✅ GOOD - Use CSS class */
<button className="button button--primary">
  Click me
</button>
```

```css
/* CSS file */
.button {
  transition: all var(--duration-normal) var(--easing-standard);
}
```

---

## Best Practices

### 1. Always Use CSS Custom Properties

When you must use inline styles, always use CSS custom properties:

```tsx
/* ✅ GOOD - CSS custom property */
<div style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}>

/* ❌ BAD - Direct CSS property */
<div style={{ animationDelay: `${index * 100}ms` }}>
```

**Why?**
- Keeps styling logic in CSS files
- Easier to maintain and update
- Better separation of concerns
- Can be overridden by CSS if needed

### 2. Document Why Inline Styles Are Needed

Add comments explaining why inline styles are necessary:

```tsx
/* ✅ GOOD - Documented reason */
{items.map((item, index) => (
  <div
    key={item.id}
    className="card"
    // Dynamic delay based on array index
    style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
  >
    {item.content}
  </div>
))}
```

### 3. Keep Inline Styles Minimal

Only set the dynamic values, not all styles:

```tsx
/* ✅ GOOD - Only dynamic value */
<div
  className="card"
  style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
>

/* ❌ BAD - All styles inline */
<div style={{
  padding: '1.5rem',
  background: '#ffffff',
  borderRadius: '8px',
  animationDelay: `${index * 100}ms`
}}>
```

### 4. Use TypeScript for Type Safety

Cast inline styles to `React.CSSProperties` for type safety:

```tsx
/* ✅ GOOD - Type-safe */
<div
  style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
>

/* ❌ BAD - No type safety */
<div
  style={{ '--delay': `${index * 100}ms` }}
>
```

### 5. Prefer CSS Classes When Possible

If a pattern repeats, move it to a CSS class:

```tsx
/* ❌ BAD - Repeated inline styles */
<div style={{ '--delay': '0ms' } as React.CSSProperties}>Item 1</div>
<div style={{ '--delay': '100ms' } as React.CSSProperties}>Item 2</div>
<div style={{ '--delay': '200ms' } as React.CSSProperties}>Item 3</div>

/* ✅ GOOD - Use map for dynamic values */
{items.map((item, index) => (
  <div
    key={item.id}
    style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
  >
    {item.content}
  </div>
))}
```

---

## Migration Examples

### Example 1: Static Padding → CSS Class

**Before:**
```tsx
<div style={{ padding: '2rem' }}>
  <h2 style={{ marginBottom: '1rem' }}>Title</h2>
  <p>Content</p>
</div>
```

**After:**
```tsx
<div className="card">
  <h2 className="card__title">Title</h2>
  <p className="card__description">Content</p>
</div>
```

```css
/* components/cards.css */
.card {
  padding: var(--spacing-xl);
}

.card__title {
  margin-bottom: var(--spacing-md);
}
```

### Example 2: Static Colors → Design Tokens

**Before:**
```tsx
<button style={{
  background: '#cd340f',
  color: '#ffffff',
  padding: '0.5rem 1.5rem'
}}>
  Click me
</button>
```

**After:**
```tsx
<button className="button button--primary">
  Click me
</button>
```

```css
/* components/buttons.css */
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
}

.button--primary {
  background: var(--color-button-primary-bg);
  color: var(--color-button-primary-text);
}
```

### Example 3: Dynamic Delay → CSS Custom Property

**Before:**
```tsx
{items.map((item, index) => (
  <div
    key={item.id}
    style={{
      padding: '1.5rem',
      background: '#ffffff',
      animationDelay: `${index * 100}ms`
    }}
  >
    {item.content}
  </div>
))}
```

**After:**
```tsx
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
/* components/cards.css */
.card {
  padding: var(--spacing-xl);
  background: var(--color-card-bg);
  animation: fadeIn var(--duration-normal) var(--easing-standard);
  animation-delay: var(--delay);
}
```

### Example 4: Static Layout → Tailwind Utilities

**Before:**
```tsx
<div style={{
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem'
}}>
  <span>Label</span>
  <button>Action</button>
</div>
```

**After:**
```tsx
<div className="flex items-center justify-between gap-4">
  <span>Label</span>
  <button className="button button--primary">Action</button>
</div>
```

### Example 5: Dynamic Position → CSS Custom Property

**Before:**
```tsx
<div style={{
  position: 'fixed',
  left: `${mouseX}px`,
  top: `${mouseY}px`,
  width: '10px',
  height: '10px',
  background: '#cd340f',
  borderRadius: '50%'
}}>
</div>
```

**After:**
```tsx
<div
  className="mouse-trail__dot"
  style={{
    '--x': `${mouseX}px`,
    '--y': `${mouseY}px`,
  } as React.CSSProperties}
/>
```

```css
/* features/mouse-trail.css */
.mouse-trail__dot {
  position: fixed;
  left: var(--x);
  top: var(--y);
  width: 10px;
  height: 10px;
  background: var(--color-primary);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
```

---

## Verification

### Audit Inline Styles

Run the inline styles audit to check compliance:

```bash
npm run test:css:inline-audit
```

**Output:**
```
Inline Styles Audit Report
==========================

Total inline style instances: 15
Baseline: 147
Reduction: 89.8%
Target: 90%

Status: ✅ PASS (within 90% reduction goal)

Acceptable inline styles (dynamic values):
- src/components/BeatCard.tsx:45 - Dynamic animation delay
- src/components/MouseTrail.tsx:23 - Dynamic position
- src/features/Parallax.tsx:67 - Dynamic transform

Potential issues (static values):
- None found
```

### Manual Review Checklist

When reviewing code with inline styles, ask:

1. ✅ **Is the value truly dynamic?**
   - Does it change based on runtime data?
   - Can it be predetermined in CSS?

2. ✅ **Is it using CSS custom properties?**
   - Using `--variable-name` syntax?
   - Not setting direct CSS properties?

3. ✅ **Is it documented?**
   - Comment explaining why inline style is needed?
   - Clear reason for dynamic value?

4. ✅ **Is it minimal?**
   - Only setting dynamic values?
   - Not duplicating static styles?

5. ✅ **Could it be a CSS class?**
   - Does the pattern repeat?
   - Could it be abstracted to a class?

---

## Summary

### Quick Reference

**✅ ACCEPTABLE:**
- Dynamic animation delays (based on index)
- Dynamic positioning (mouse, scroll)
- Dynamic colors (from data/API)
- Dynamic dimensions (calculated)
- Dynamic transforms (parallax, effects)

**❌ UNACCEPTABLE:**
- Static padding/margin
- Static colors
- Static typography
- Static layout
- Static borders/shadows
- Static transitions/animations

**ALWAYS:**
- Use CSS custom properties
- Document why inline styles are needed
- Keep inline styles minimal
- Use TypeScript for type safety
- Prefer CSS classes when possible

**GOAL:**
- 90% reduction from baseline (147 → ≤15 instances)
- Only truly dynamic values in inline styles
- Better separation of concerns
- Improved maintainability

---

## Related Documentation

- [CSS Architecture Style Guide](./CSS_ARCHITECTURE_STYLE_GUIDE.md)
- [Component Ownership Mapping](./CSS_COMPONENT_OWNERSHIP.md)
- [Onboarding Guide](./CSS_ONBOARDING_GUIDE.md)
- [Performance Report](./CSS_PERFORMANCE_REPORT.md)
