# Implementation Plan: Blog Card Redesign

## Overview

This implementation plan breaks down the blog card redesign into discrete coding tasks. All work will be done in `src/styles/components/cards.css` under the `.card--blog` modifier, following the project's CSS architecture and using design tokens exclusively. The implementation includes both light and dark mode support via ThemeContext.

## Tasks

- [x] 1. Set up base card structure and design token references
  - Review existing `.card--blog` styles in `src/styles/components/cards.css`
  - Ensure all hardcoded values are replaced with design token references
  - Set up base card container styles with proper semantic structure
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
 
- [x] 2. Implement typography hierarchy and text styling
  - [x] 2.1 Style card title with responsive font sizing
    - Use `clamp(var(--font-size-xl), 2vw, var(--font-size-2xl))` for responsive scaling
    - Apply `var(--font-weight-bold)` and `var(--line-height-tight)`
    - Set color to `var(--color-text-primary)` for theme compatibility
    - _Requirements: 1.1, 1.3, 5.1, 5.2, 5.5_
  
  - [x] 2.2 Style card description with proper readability
    - Use `var(--font-size-base)` with `var(--line-height-relaxed)`
    - Apply `var(--color-text-secondary)` for visual hierarchy
    - Implement 3-line clamping with ellipsis for overflow
    - _Requirements: 1.1, 1.4, 5.1, 5.3, 5.6_
  
  - [x] 2.3 Style card metadata (date and read time)
    - Use `var(--font-size-sm)` with `var(--color-text-muted)`
    - Set proper line-height and spacing between meta items
    - _Requirements: 1.1, 5.1, 5.4_

- [x] 3. Implement category badge redesign
  - [x] 3.1 Create base badge styles with design tokens
    - Apply `var(--font-size-xs)` with `var(--font-weight-bold)`
    - Use `text-transform: uppercase` and `letter-spacing: var(--letter-spacing-wide)`
    - Set padding to `var(--spacing-sm) var(--spacing-md)`
    - Apply `border-radius: 20px` for pill shape
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 3.2 Implement badge colors for light and dark modes
    - Light mode: `var(--color-primary)` with 10% opacity background
    - Dark mode: `var(--hero-accent)` with 15% opacity background
    - Add subtle borders with appropriate opacity
    - _Requirements: 3.6, 3.7, 8.5_

- [x] 4. Implement spacing and layout system
  - [x] 4.1 Set up responsive card padding
    - Mobile: `var(--spacing-xl)` on all sides
    - Desktop (≥900px): `var(--spacing-2xl)` on all sides
    - _Requirements: 2.1, 2.2, 9.2_
  
  - [x] 4.2 Configure internal content spacing
    - Image to content: `var(--spacing-lg)`
    - Badge to title: `var(--spacing-md)`
    - Title to description: `var(--spacing-md)`
    - Description to meta: `var(--spacing-lg)`
    - Meta to link: `var(--spacing-lg)`
    - _Requirements: 2.1, 2.3_
  
  - [x] 4.3 Set up meta items spacing
    - Use flexbox with `var(--spacing-md)` gap
    - Add separator styling between date and read time
    - _Requirements: 2.4_

- [x] 5. Implement featured image treatment
  - [x] 5.1 Create image container with aspect ratio
    - Set aspect ratio to `16 / 9`
    - Apply `border-radius: 12px` with `overflow: hidden`
    - Set min-height `200px` and max-height `280px`
    - _Requirements: 6.1, 6.3, 6.6_
  
  - [x] 5.2 Style image with proper object-fit
    - Use `object-fit: cover` to prevent distortion
    - Add smooth transform transition for hover effect
    - _Requirements: 6.2_
  
  - [x] 5.3 Implement image fallback and loading states
    - Create gradient fallback using `var(--color-primary)` and `var(--hero-accent)`
    - Add smooth fade-in transition when image loads
    - Implement lazy loading support
    - _Requirements: 6.4, 6.5, 12.4_

- [x] 6. Implement interactive states and animations
  - [x] 6.1 Create card hover effects
    - Apply `translateY(-4px)` transform on hover
    - Elevate with `var(--shadow-xl)` box-shadow
    - Use `var(--duration-normal)` and `var(--easing-standard)` for transitions
    - _Requirements: 4.1, 4.2, 4.6, 12.1, 12.3_
  
  - [x] 6.2 Implement keyboard focus states
    - Add visible focus outline using `var(--hero-accent)` with 2px width
    - Set outline-offset to 2px for clarity
    - Ensure focus-visible pseudo-class is used
    - _Requirements: 4.3, 11.3, 11.7_
  
  - [x] 6.3 Add image zoom effect on card hover
    - Scale image to 1.05 when card is hovered
    - Use `var(--duration-slow)` for smooth transition
    - _Requirements: 4.1, 12.3_
  
  - [x] 6.4 Style cursor states
    - Set `cursor: pointer` on interactive card
    - Ensure all transitions use design token durations
    - _Requirements: 4.5, 4.6_

- [x] 7. Implement Read More link enhancement
  - [x] 7.1 Create base link styles
    - Use `var(--font-size-sm)` with `var(--font-weight-semibold)`
    - Apply `text-transform: uppercase` and `letter-spacing: var(--letter-spacing-wide)`
    - Set padding to `var(--spacing-sm) var(--spacing-lg)`
    - Use `border-radius: 8px` and `display: inline-flex`
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [x] 7.2 Add arrow icon and interaction
    - Include arrow symbol `→` with proper spacing
    - Add `translateX(4px)` transform on hover
    - Use `var(--duration-fast)` for icon animation
    - _Requirements: 7.4_
  
  - [x] 7.3 Implement link hover states
    - Change background to `var(--hero-accent)` on hover
    - Change text color to white on hover
    - Add smooth color transitions
    - _Requirements: 7.5, 7.6_

- [x] 8. Implement dark mode support
  - [x] 8.1 Set up dark mode card background and borders
    - Use `var(--color-card-bg-dark)` or `rgba(30, 30, 35, 0.95)` for background
    - Apply `var(--color-glass-border-dark)` or `rgba(255, 255, 255, 0.1)` for border
    - Add appropriate dark mode shadows
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  
  - [x] 8.2 Configure dark mode text colors
    - Ensure text colors use theme-aware custom properties
    - Verify WCAG AA contrast ratios in dark mode
    - Test all text hierarchy levels for readability
    - _Requirements: 8.4, 11.4_
  
  - [x] 8.3 Add smooth theme transition
    - Apply `var(--duration-normal)` transition to background, border, and shadow
    - Use `var(--easing-standard)` for smooth theme switching
    - _Requirements: 8.7_

- [x] 9. Implement responsive design optimizations
  - [x] 9.1 Configure mobile-first responsive styles
    - Start with mobile base styles
    - Add desktop enhancements at 900px breakpoint
    - Ensure touch targets meet 44x44px minimum on mobile
    - _Requirements: 9.1, 9.4_
  
  - [x] 9.2 Adjust typography for different breakpoints
    - Use clamp() for fluid typography scaling
    - Test readability at 320px, 768px, 1024px, 1440px
    - _Requirements: 9.3, 9.5_
  
  - [x] 9.3 Optimize image heights for different screens
    - Mobile: 200px height
    - Desktop: 280px height
    - Maintain aspect ratio across all sizes
    - _Requirements: 9.6_

- [x] 10. Implement accessibility features
  - [x] 10.1 Ensure semantic HTML structure
    - Verify `<article>` element is used for card
    - Add appropriate ARIA labels where needed
    - Ensure proper heading hierarchy
    - _Requirements: 11.1, 11.2_
  
  - [x] 10.2 Implement keyboard navigation support
    - Ensure Tab key navigation works correctly
    - Verify Enter and Space keys activate links
    - Test focus order is logical
    - _Requirements: 11.6_
  
  - [x] 10.3 Add image alt text support
    - Ensure Featured_Image has descriptive alt attribute
    - Verify alt text is meaningful and contextual
    - _Requirements: 11.5_

- [x] 11. Implement performance optimizations
  - [x] 11.1 Add GPU acceleration hints
    - Apply `transform: translateZ(0)` for GPU layering
    - Use `backface-visibility: hidden` to prevent flickering
    - _Requirements: 12.3_
  
  - [x] 11.2 Optimize animation properties
    - Ensure only `transform` and `opacity` are animated
    - Use `will-change` sparingly (hover states only)
    - Avoid animating layout-triggering properties
    - _Requirements: 12.1, 12.2, 12.5_
  
  - [x] 11.3 Implement lazy loading for images
    - Add `loading="lazy"` attribute to images
    - Ensure aspect ratio container prevents layout shift
    - _Requirements: 12.4_

- [x] 12. Checkpoint - Verify CSS architecture compliance
  - Review all styles to ensure they're in `src/styles/components/cards.css` only
  - Verify BEM naming convention is followed throughout
  - Check that no `!important` declarations exist
  - Confirm maximum specificity doesn't exceed (0,0,2,0)
  - Validate all values use design tokens (no hardcoded values)
  - Ensure file doesn't exceed 500 lines
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.7_

- [ ] 13. Testing and validation
  - [ ]* 13.1 Run visual regression tests
    - Test light mode appearance
    - Test dark mode appearance
    - Compare against design specifications
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 13.2 Validate accessibility compliance
    - Run automated accessibility tests with axe-core
    - Test keyboard navigation manually
    - Verify color contrast ratios meet WCAG AA
    - Test with screen reader
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 13.3 Test responsive behavior
    - Test at 320px, 768px, 1024px, 1440px viewports
    - Verify touch targets on mobile devices
    - Check typography scaling across breakpoints
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 13.4 Profile animation performance
    - Use Chrome DevTools Performance profiler
    - Verify 60fps during hover interactions
    - Check for layout thrashing or reflows
    - _Requirements: 12.1, 12.2, 12.3, 12.5, 12.6_
  
  - [ ]* 13.5 Validate CSS architecture
    - Run `npm run css:gates` to check architecture compliance
    - Verify specificity with CSS analyzer
    - Confirm token usage with static analysis
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 14. Final checkpoint - Ensure all tests pass
  - Run `npm run test` for unit tests
  - Run `npm run build` for type-checking
  - Run `npm run test:visual` for visual regression tests
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- All CSS modifications happen in `src/styles/components/cards.css` under `.card--blog` modifier
- No new CSS files should be created (follows CSS_COMPONENT_OWNERSHIP.md)
- All values must use design tokens from `src/styles/tokens/`
- Both light and dark modes must be implemented simultaneously
- Follow BEM naming convention: `.card__element--modifier`
- No `!important` declarations allowed
- Maximum CSS specificity: (0,0,2,0)
- All animations use CSS transitions (not GSAP, as these are not scroll-driven)
- Test theme switching smoothness between light and dark modes
- Verify keyboard accessibility at each interactive state implementation
- Each task references specific requirements for traceability

