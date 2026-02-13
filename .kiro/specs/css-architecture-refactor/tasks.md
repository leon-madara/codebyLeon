# Implementation Plan: CSS Architecture Refactor

## Overview

This implementation plan refactors the CSS architecture for the Code by Leon project through 5 incremental phases. Each phase builds on the previous, ensuring no visual regressions while establishing a scalable, maintainable CSS foundation. The refactoring addresses critical issues: 2,464-line hero.css, triple-duplicated tokens, specificity wars, and !important abuse.

**Key Principles**:
- Incremental migration with visual regression testing after each phase
- Property-based testing for universal correctness properties (31 properties total)
- Clear separation of concerns with BEM-inspired naming
- Single source of truth for design tokens
- Maximum specificity of (0,0,2,0)
- TypeScript for all test utilities and configuration

**Technology Stack**:
- Language: TypeScript (for tests and utilities), CSS (for styles)
- Testing: Vitest + fast-check (property-based testing) + Playwright (visual regression)
- Build: Vite with PostCSS
- CSS Modules: Enabled for component-scoped styles

## Tasks

### Phase 1: Foundation (5 days)

- [x] 1. Set up CSS testing infrastructure
  - Install CSS parsing dependencies: css-tree, postcss, postcss-reporter
  - Create src/test/css-utils/ directory for test utilities
  - Create CSS file parser utility (TypeScript)
  - Create specificity calculator utility (TypeScript)
  - Create token extraction utility (TypeScript)
  - Set up baseline metrics collection (bundle size, FCP, parsing time)
  - Configure Playwright for visual regression testing
  - _Requirements: 13.4, 16.6_

- [ ]* 1.1 Write unit tests for CSS parsing utilities
  - Test CSS file parsing
  - Test specificity calculation
  - Test token extraction
  - _Requirements: 13.4_

- [x] 2. Create tokens directory structure
  - [x] 2.1 Create tokens/colors.css with all color variables
    - Extract all color tokens from index.css, hero.css, configurator.css
    - Consolidate duplicate definitions into single source
    - Organize by category: base colors, semantic colors, component colors, gradients
    - Define :root selector with all color custom properties
    - _Requirements: 1.1, 1.6_
  
  - [x] 2.2 Create tokens/typography.css with font definitions
    - Extract font family, size, weight, line-height tokens
    - Define consistent typography scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
    - _Requirements: 1.2_
  
  - [x] 2.3 Create tokens/spacing.css with spacing scale and breakpoints
    - Define spacing scale (xs, sm, md, lg, xl, 2xl, 3xl)
    - Define breakpoint tokens (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
    - _Requirements: 1.3, 19.3_
  
  - [x] 2.4 Create tokens/shadows.css with shadow definitions
    - Extract shadow tokens (soft, medium, glow)
    - Define using HSL with alpha for theme compatibility
    - _Requirements: 1.4_
  
  - [x] 2.5 Create tokens/animations.css with timing tokens
    - Define duration tokens (fast: 150ms, normal: 250ms, slow: 350ms)
    - Define easing function tokens (standard, decelerate, accelerate)
    - Use cubic-bezier values
    - _Requirements: 20.1_

- [ ]* 2.6 Write property test for token centralization
  - **Property 1: Token Centralization**
  - For any CSS custom property (token), verify it's defined exactly once in tokens/ directory
  - Use fast-check to iterate over all CSS files
  - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.6**

- [ ]* 2.7 Write property test for token resolution
  - **Property 2: Token Resolution**
  - For any var(--token-name) reference, verify the token is defined in tokens/ directory
  - **Validates: Requirements 1.5**

- [x] 3. Create base directory structure
  - [x] 3.1 Create base/reset.css with CSS reset
    - Minimal reset for consistent cross-browser rendering
    - Reset margins, paddings, box-sizing
    - _Requirements: 14.1_
  
  - [x] 3.2 Create base/global.css with global element styles
    - Body, html, heading, paragraph base styles
    - Use tokens for all values (colors, fonts, spacing)
    - _Requirements: 14.1_
  
  - [x] 3.3 Create base/theme.css with theme switching logic
    - Define [data-theme="dark"] selector
    - Override color tokens for dark theme
    - Ensure only token overrides, no new token definitions
    - _Requirements: 6.2, 6.5_

- [ ]* 3.4 Write property test for theme override pattern
  - **Property 3: Theme Override Pattern**
  - For any token override in [data-theme="dark"], verify it only overrides existing tokens
  - **Validates: Requirements 1.7**

- [ ]* 3.5 Write property test for theme selector consistency
  - **Property 10: Theme Selector Consistency**
  - For any theme-specific rule, verify it uses [data-theme="dark"] exclusively
  - **Validates: Requirements 3.4, 6.4, 6.5**

- [x] 4. Configure CSS Modules in build system
  - [x] 4.1 Update vite.config.ts for CSS Modules
    - Add css.modules configuration object
    - Set localsConvention to 'camelCase'
    - Set generateScopedName to '[name]__[local]___[hash:base64:5]'
    - _Requirements: 5.1, 5.3, 14.1_
  
  - [x] 4.2 Update postcss.config.js for error reporting
    - Add postcss-reporter plugin
    - Configure throwError: true for invalid CSS
    - _Requirements: 14.1_

- [ ]* 4.3 Write unit test for CSS Modules configuration
  - Test that CSS Modules generate scoped class names
  - Test that build processes .module.css files correctly
  - Create sample Component.module.css and verify output
  - _Requirements: 5.4_

- [x] 5. Create new index.css with import structure
  - [x] 5.1 Create new index.css with correct import order
    - Import external fonts first
    - Import @tailwind base
    - Import all tokens/*.css files
    - Import all base/*.css files
    - Import @tailwind components
    - Import all layout/*.css files
    - Import all components/*.css files
    - Import all sections/*.css files
    - Import all features/*.css files
    - Import @tailwind utilities
    - Import all utilities/*.css files
    - Add comments documenting import order rationale
    - _Requirements: 2.4, 14.2, 14.5_

- [ ]* 5.2 Write property test for import order preservation
  - **Property 21: Import Order Preservation**
  - For any style migration, verify cascade order is preserved through import ordering
  - **Validates: Requirements 13.2**

- [x] 6. Checkpoint - Phase 1 Complete
  - Run all property tests and unit tests
  - Run visual regression tests (baseline comparison)
  - Verify build succeeds without errors
  - Document baseline metrics (bundle size, FCP, parsing time)
  - Ensure all tests pass, ask the user if questions arise

### Phase 2: Component Extraction (7 days)

- [x] 7. Extract button component styles
  - [x] 7.1 Create components/buttons.css
    - Extract all button variants from hero.css and index.css
    - Define base .button class with common styles (display, padding, font, border-radius, transition)
    - Define variants: .button--primary, .button--secondary, .button--nav-cta
    - Define states: .button.is-loading, .button.is-disabled
    - Use BEM naming convention throughout
    - Use tokens for all values (colors, spacing, fonts, durations)
    - Ensure all selectors have specificity <= (0,0,2,0)
    - _Requirements: 8.1, 4.1, 4.2, 3.1_

- [ ]* 7.2 Write property test for BEM naming compliance
  - **Property 13: BEM Naming Compliance**
  - For any class in components/, sections/, layout/, verify BEM pattern compliance
  - **Validates: Requirements 4.1, 4.2, 4.3**

- [ ]* 7.3 Write property test for maximum specificity compliance
  - **Property 7: Maximum Specificity Compliance**
  - For any selector (excluding utilities/), verify specificity <= (0,0,2,0)
  - **Validates: Requirements 3.1**

- [ ]* 7.4 Write property test for compound selector elimination
  - **Property 8: Compound Selector Elimination**
  - For any selector, verify no compound element-class patterns (e.g., nav.navbar)
  - **Validates: Requirements 3.2**

- [x] 8. Extract navigation component styles
  - [x] 8.1 Create layout/navigation.css
    - Extract navigation styles from hero.css (approximately lines 1-250)
    - Define .navigation block with BEM structure
    - Define elements: .navigation__container, .navigation__logo, .navigation__links, .navigation__link
    - Define state: .navigation.is-scrolled
    - Define link state: .navigation__link.is-active
    - Use tokens for all values
    - Include responsive styles in same file
    - _Requirements: 7.1, 2.5, 4.1, 19.1_
  
  - [x] 8.2 Update navigation component to use new classes
    - Replace old class names with BEM classes in TSX files
    - Remove inline styles where possible
    - Convert remaining inline styles to CSS custom properties
    - _Requirements: 9.2_

- [ ]* 8.3 Write property test for element namespacing
  - **Property 14: Element Namespacing**
  - For any class with __, verify it's namespaced under a valid block name
  - **Validates: Requirements 4.5**

- [ ]* 8.4 Write visual regression test for navigation
  - Test navigation in light theme
  - Test navigation in dark theme
  - Test navigation in scrolled state (.is-scrolled)
  - Test navigation link active state
  - _Requirements: 13.1, 13.3_

- [x] 9. Extract card component styles
  - [x] 9.1 Create components/cards.css
    - Extract card styles from hero.css and index.css
    - Define base .card class (padding, background, border-radius, shadow, transition)
    - Define elements: .card__title, .card__description
    - Define variants: .card--featured, .card--blog, .card--beat
    - Include hover effects
    - Use tokens for all values
    - _Requirements: 8.2, 4.1_

- [ ]* 9.2 Write property test for component file responsibility
  - **Property 6: Component File Responsibility**
  - For any file in components/, verify all selectors are namespaced under component name
  - **Validates: Requirements 2.3**

- [ ]* 9.3 Write property test for component style uniqueness
  - **Property 16: Component Style Uniqueness**
  - For any component identifier, verify styles are defined in exactly one file
  - **Validates: Requirements 8.6, 18.1, 18.5**

- [x] 10. Extract form component styles
  - [x] 10.1 Create components/forms.css
    - Extract form element styles from index.css
    - Define styles for input, textarea, select, label
    - Use BEM naming: .form__input, .form__label, .form__select, .form__textarea
    - Use tokens for all values
    - _Requirements: 8.3_

- [x] 11. Extract modal component styles
  - [x] 11.1 Create components/modals.css
    - Extract modal styles if they exist in current codebase
    - Define .modal block with BEM structure
    - Define elements: .modal__overlay, .modal__content, .modal__close
    - Define state: .modal.is-open
    - Use tokens for all values
    - _Requirements: 8.4_

- [x] 12. Update index.css to import new component files
  - Add @import './layout/navigation.css' in layout section
  - Add @import './components/buttons.css' in components section
  - Add @import './components/cards.css' in components section
  - Add @import './components/forms.css' in components section
  - Add @import './components/modals.css' in components section
  - Maintain correct cascade order
  - _Requirements: 14.2_

- [x] 13. Checkpoint - Phase 2 Complete
  - Run all property tests and unit tests
  - Run visual regression tests for all extracted components
  - Verify no visual changes from baseline
  - Verify build succeeds
  - Ensure all tests pass, ask the user if questions arise

### Phase 3: Section Separation (7 days)

- [x] 14. Extract hero section styles
  - [x] 14.1 Create sections/hero.css
    - Extract hero section styles from hero.css (approximately lines 250-650)
    - Define .hero block with BEM structure
    - Define elements: .hero__container, .hero__title, .hero__subtitle, .hero__ctas, .hero__cta
    - Use tokens for all values
    - Include responsive styles (media queries) in same file
    - Ensure mobile-first approach (min-width media queries)
    - _Requirements: 7.2, 2.2, 19.1, 19.6_

- [ ]* 14.2 Write property test for section file responsibility
  - **Property 5: Section File Responsibility**
  - For any file in sections/, verify all selectors are namespaced under section name
  - **Validates: Requirements 2.2**

- [ ]* 14.3 Write property test for responsive style co-location
  - **Property 26: Responsive Style Co-location**
  - For any component with media queries, verify they're in same file as base styles
  - **Validates: Requirements 19.1, 19.5**

- [x] 15. Extract services section styles
  - [x] 15.1 Create sections/services.css
    - Extract services section styles from hero.css
    - Define .services block with BEM structure
    - Define elements: .services__container, .services__title, .services__grid, .services__item
    - Include responsive styles in same file
    - Use tokens for all values
    - _Requirements: 7.3, 2.2_

- [x] 16. Extract portfolio section styles
  - [x] 16.1 Create sections/portfolio.css
    - Extract portfolio section styles from hero.css
    - Define .portfolio block with BEM structure
    - Define elements: .portfolio__container, .portfolio__title, .portfolio__grid, .portfolio__item
    - Include responsive styles in same file
    - Use tokens for all values
    - _Requirements: 7.4, 2.2_

- [x] 17. Extract about section styles
  - [x] 17.1 Create sections/about.css
    - Extract about section styles from hero.css
    - Define .about block with BEM structure
    - Define elements: .about__container, .about__title, .about__content
    - Include responsive styles in same file
    - Use tokens for all values
    - _Requirements: 7.5, 2.2_

- [x] 18. Extract blog section styles
  - [x] 18.1 Create sections/blog.css
    - Extract blog section styles from hero.css and index.css
    - Consolidate blog styles from both files
    - Define .blog block with BEM structure
    - Define elements: .blog__container, .blog__title, .blog__grid, .blog__post
    - Include responsive styles in same file
    - Use tokens for all values
    - _Requirements: 7.6, 2.2_

- [ ]* 18.2 Write property test for file size constraint
  - **Property 4: File Size Constraint**
  - For any CSS file (excluding index.css), verify it contains fewer than 500 lines
  - **Validates: Requirements 2.7**

- [x] 19. Extract feature styles
  - [x] 19.1 Create features/horizontal-scroll.css
    - Extract horizontal scroll (beat cards) styles from index.css
    - Define .horizontal-scroll block
    - Define .horizontal-scroll__container, .horizontal-scroll__track
    - Include beat card variants
    - Use tokens for all values
    - _Requirements: 2.1_
  
  - [x] 19.2 Move mouse-trail.css to features/mouse-trail.css
    - Move existing mouse-trail.css file to features/ directory
    - Update imports in index.css
    - Verify no duplicate token definitions
    - _Requirements: 2.1_
  
  - [x] 19.3 Move configurator.css to features/configurator.css
    - Move existing configurator.css file to features/ directory
    - Update imports in index.css
    - Remove duplicate token definitions (use tokens/ instead)
    - _Requirements: 2.1, 1.6_

- [x] 20. Update index.css to import new section and feature files
  - Add @import './sections/hero.css' in sections section
  - Add @import './sections/services.css' in sections section
  - Add @import './sections/portfolio.css' in sections section
  - Add @import './sections/about.css' in sections section
  - Add @import './sections/blog.css' in sections section
  - Add @import './features/horizontal-scroll.css' in features section
  - Add @import './features/mouse-trail.css' in features section
  - Add @import './features/configurator.css' in features section
  - Remove old @import for hero.css
  - Maintain correct cascade order
  - _Requirements: 14.2_

- [x] 21. Delete original hero.css file
  - Verify all styles have been extracted to new files
  - Verify build succeeds without hero.css
  - Delete src/styles/hero.css
  - _Requirements: 7.7_

- [x] 22. Checkpoint - Phase 3 Complete
  - Run all property tests and unit tests
  - Run visual regression tests for all sections
  - Verify no visual changes from baseline
  - Verify hero.css is deleted
  - Verify all section files are under 500 lines
  - Ensure all tests pass, ask the user if questions arise

### Phase 4: Cleanup (5 days)

- [x] 23. Eliminate !important declarations
  - [x] 23.1 Audit all !important usage
    - Parse all CSS files using css-tree
    - Identify all !important declarations
    - Document location (file, line, selector) and reason for each
    - Create audit report
    - _Requirements: 3.5_
  
  - [x] 23.2 Remove !important from component files
    - For each !important in components/, resolve specificity conflict
    - Adjust cascade order in index.css if needed
    - Update selectors to proper specificity
    - _Requirements: 11.1_
  
  - [x] 23.3 Remove !important from section files
    - For each !important in sections/, resolve specificity conflict
    - Adjust cascade order in index.css if needed
    - _Requirements: 11.2_
  
  - [x] 23.4 Verify !important only in utilities
    - Check that remaining !important are in utilities/ directory
    - Document exceptions (e.g., .sr-only for accessibility)
    - _Requirements: 11.3, 11.5_

- [ ]* 23.5 Write property test for important declaration restriction
  - **Property 11: Important Declaration Restriction**
  - For any file in components/, sections/, layout/, features/, verify zero !important
  - **Validates: Requirements 3.5, 11.1, 11.2**

- [ ]* 23.6 Write property test for utility important exception
  - **Property 12: Utility Important Exception**
  - For any !important, verify it's only in utilities/ or on display:none for accessibility
  - **Validates: Requirements 11.3, 11.6**

- [x] 24. Reduce specificity across all files
  - [x] 24.1 Audit selector specificity
    - Calculate specificity for all selectors using specificity calculator
    - Identify selectors exceeding (0,0,2,0)
    - Create audit report with recommendations
    - _Requirements: 3.1_
  
  - [x] 24.2 Refactor high-specificity selectors
    - Replace compound selectors (e.g., nav.navbar) with single classes
    - Adjust cascade order in index.css if needed
    - Verify visual output unchanged after each change
    - _Requirements: 3.2_

- [ ]* 24.3 Write property test for single class selector preference
  - **Property 9: Single Class Selector Preference**
  - For any file in components/ or sections/, verify at least 70% are single class selectors
  - **Validates: Requirements 3.3**

- [x] 25. Eliminate inline styles
  - [x] 25.1 Audit inline styles in TSX files
    - Parse all TSX/JSX files
    - Count inline style attributes
    - Categorize as static vs dynamic
    - Create audit report with baseline count
    - _Requirements: 9.1_
  
  - [x] 25.2 Convert static inline styles to CSS classes
    - For each static inline style, create corresponding CSS class
    - Replace inline style with className
    - Add new classes to appropriate CSS files
    - _Requirements: 9.2_
  
  - [x] 25.3 Convert dynamic inline styles to CSS custom properties
    - For dynamic values (e.g., animation delays based on index), use CSS variables
    - Set CSS variables via inline styles: style={{ '--delay': `${index * 100}ms` }}
    - Define CSS rules using those variables: animation-delay: var(--delay)
    - _Requirements: 9.3, 9.5_

- [ ]* 25.4 Write property test for inline style reduction
  - **Property 17: Inline Style Reduction**
  - For any TSX/JSX file, verify 90% reduction in inline styles from baseline
  - **Validates: Requirements 9.1**

- [ ]* 25.5 Write property test for static inline style elimination
  - **Property 18: Static Inline Style Elimination**
  - For any inline style, verify it only contains dynamic values (variables, expressions)
  - **Validates: Requirements 9.2, 9.4**

- [ ]* 25.6 Write property test for dynamic style pattern
  - **Property 19: Dynamic Style Pattern**
  - For any inline style with dynamic values, verify it uses CSS custom properties
  - **Validates: Requirements 9.3**

- [x] 26. Consolidate responsive styles
  - [x] 26.1 Audit media queries across all files
    - Parse all CSS files for media queries
    - Identify scattered responsive overrides
    - Verify breakpoint consistency with tokens
    - Create audit report
    - _Requirements: 19.2_
  
  - [x] 26.2 Move responsive styles to component files
    - Ensure all media queries for a component are in same file as base styles
    - Remove scattered responsive overrides from other files
    - _Requirements: 19.1_
  
  - [x] 26.3 Standardize to mobile-first approach
    - Convert max-width media queries to min-width where appropriate
    - Ensure mobile styles are base styles, desktop styles are in media queries
    - _Requirements: 19.6_

- [ ]* 26.4 Write property test for breakpoint consistency
  - **Property 27: Breakpoint Consistency**
  - For any media query, verify breakpoint values match tokens
  - **Validates: Requirements 19.2**

- [ ]* 26.5 Write property test for mobile-first approach
  - **Property 28: Mobile-First Approach**
  - For any media query, verify it uses min-width (unless specifically justified)
  - **Validates: Requirements 19.6**

- [x] 27. Consolidate animation definitions
  - [x] 27.1 Create utilities/animations.css
    - Extract all @keyframes definitions from all files
    - Consolidate duplicate keyframe definitions
    - Define reusable animation utility classes
    - _Requirements: 20.2_
  
  - [x] 27.2 Update animation references to use tokens
    - Replace hardcoded duration values with tokens (var(--duration-fast), etc.)
    - Replace hardcoded easing values with tokens (var(--easing-standard), etc.)
    - _Requirements: 20.4, 20.3_

- [ ]* 27.3 Write property test for animation timing tokens
  - **Property 29: Animation Timing Tokens**
  - For any transition or animation duration, verify it references a token
  - **Validates: Requirements 20.4**

- [ ]* 27.4 Write property test for easing function consistency
  - **Property 30: Easing Function Consistency**
  - For any transition or animation easing, verify it references a token
  - **Validates: Requirements 20.3**

- [ ]* 27.5 Write property test for keyframe uniqueness
  - **Property 31: Keyframe Uniqueness**
  - For any @keyframes definition, verify it's defined exactly once in utilities/animations.css
  - **Validates: Requirements 20.6**

- [x] 28. Checkpoint - Phase 4 Complete
  - Run all property tests and unit tests
  - Verify zero !important (except utilities)
  - Verify all specificity <= (0,0,2,0)
  - Verify 90% inline style reduction
  - Run visual regression tests
  - Verify no visual changes from baseline
  - Ensure all tests pass, ask the user if questions arise

### Phase 5: Testing & Optimization (5 days)

- [x] 29. Create comprehensive test suite
  - [x] 29.1 Ensure all CSS parsing utilities are complete
    - Verify CSS file parser utility
    - Verify selector extraction utility
    - Verify token extraction utility
    - Verify specificity calculator utility
    - _Requirements: 13.4_
  
  - [x] 29.2 Create baseline metrics utilities
    - Write utility to measure bundle size (minified CSS)
    - Write utility to measure CSS parsing time (browser performance API)
    - Write utility to measure FCP (Lighthouse)
    - Write utility to measure render-blocking time (Lighthouse)
    - Document baseline metrics before refactoring
    - _Requirements: 16.6_

- [ ]* 29.3 Write property test for generic name avoidance
  - **Property 15: Generic Name Avoidance**
  - For any class name, verify it's not a generic single-word from blocklist
  - Blocklist: .link, .button, .card, .container, .wrapper, .item, .element
  - **Validates: Requirements 4.4**

- [ ]* 29.4 Write property test for token definition location
  - **Property 20: Token Definition Location**
  - For any CSS custom property definition (not reference), verify design tokens are in tokens/
  - **Validates: Requirements 10.5**

- [x] 30. Performance testing and optimization
  - [x] 30.1 Measure and compare bundle sizes
    - Build production bundle with Vite
    - Measure minified CSS bundle size
    - Compare to baseline metrics
    - Verify 30-40% reduction
    - _Requirements: 16.1_

- [ ]* 30.2 Write property test for bundle size reduction
  - **Property 22: Bundle Size Reduction**
  - Verify CSS bundle is 30-40% smaller than baseline
  - **Validates: Requirements 16.1**

- [ ]* 30.3 Write property test for CSS parsing performance
  - **Property 23: CSS Parsing Performance**
  - Verify browser CSS parsing time <= baseline
  - **Validates: Requirements 16.3**

- [ ]* 30.4 Write property test for First Contentful Paint
  - **Property 24: First Contentful Paint**
  - Verify FCP metric <= baseline
  - **Validates: Requirements 16.4**

- [ ]* 30.5 Write property test for render-blocking time
  - **Property 25: Render-Blocking Time**
  - Verify render-blocking time <= baseline
  - **Validates: Requirements 16.5**

- [x] 31. Create documentation
  - [x] 31.1 Create CSS architecture style guide
    - Document BEM naming conventions with examples
    - Document styling decision tree (when to use Tailwind vs CSS vs CSS Modules)
    - Document file organization principles
    - Document theme system usage (data-theme attribute)
    - Provide examples for common patterns (buttons, cards, forms, sections)
    - _Requirements: 4.6, 10.1, 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [x] 31.2 Create component ownership mapping
    - Document which file owns each component's styles
    - Create visual diagram of directory structure
    - List all components with their file locations
    - _Requirements: 18.3, 18.4_
  
  - [x] 31.3 Create onboarding documentation
    - Write guide for new developers joining the project
    - Explain architecture decisions and rationale
    - Provide quick reference for common tasks
    - Include troubleshooting section
    - _Requirements: 15.6_
  
  - [x] 31.4 Document acceptable inline style use cases
    - List valid reasons for inline styles (dynamic values only)
    - Provide examples of acceptable inline styles
    - Provide examples of unacceptable inline styles
    - _Requirements: 9.6_
  
  - [x] 31.5 Document performance improvements
    - Compare before/after metrics (bundle size, FCP, parsing time)
    - Document bundle size reduction percentage
    - Document performance gains
    - Include charts/graphs if possible
    - _Requirements: 16.6_

- [ ] 32. Final visual regression testing
  - [ ] 32.1 Run comprehensive visual regression suite
    - Test all pages in light theme
    - Test all pages in dark theme
    - Test all interactive states (hover, active, focus)
    - Test all responsive breakpoints (mobile, tablet, desktop)
    - Test theme toggle transitions
    - _Requirements: 13.1, 13.3, 13.5_
  
  - [ ] 32.2 Fix any visual regressions
    - Investigate and fix any differences from baseline
    - Re-run tests until all pass
    - Document any intentional visual changes separately
    - _Requirements: 13.1, 13.6_

- [ ] 33. Final checkpoint - Phase 5 Complete
  - Run all 31 property tests (minimum 100 iterations each)
  - Run all unit tests
  - Run all visual regression tests
  - Verify all tests pass
  - Verify documentation is complete
  - Verify performance targets are met (30-40% bundle size reduction)
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties across all inputs (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and integration points
- Visual regression tests ensure no unintended visual changes during refactoring
- All phases must maintain visual consistency - no regressions allowed
- Each phase builds on the previous - do not skip phases
- Use TypeScript for all test utilities and configuration
- Use fast-check library for property-based testing
- Use Vitest for unit testing
- Use Playwright for visual regression testing
- Estimated total time: 29 days (5-6 weeks) for one developer

## Success Criteria

**Phase 1 Complete**:
- ✅ All design tokens in tokens/ directory
- ✅ No duplicate token definitions
- ✅ CSS Modules configured and working
- ✅ New index.css with correct import structure
- ✅ Visual output unchanged

**Phase 2 Complete**:
- ✅ Navigation extracted to layout/navigation.css
- ✅ Buttons extracted to components/buttons.css
- ✅ Cards extracted to components/cards.css
- ✅ Forms extracted to components/forms.css
- ✅ Modals extracted to components/modals.css
- ✅ All components use BEM naming
- ✅ Visual output unchanged

**Phase 3 Complete**:
- ✅ hero.css deleted
- ✅ All sections in separate files (hero, services, portfolio, about, blog)
- ✅ All section files under 500 lines
- ✅ Features organized in features/ directory
- ✅ Visual output unchanged

**Phase 4 Complete**:
- ✅ Zero !important (except utilities)
- ✅ All specificity <= (0,0,2,0)
- ✅ 90% reduction in inline styles
- ✅ All responsive styles co-located with components
- ✅ All animations use tokens
- ✅ Visual output unchanged

**Phase 5 Complete**:
- ✅ All 31 property tests pass (100+ iterations each)
- ✅ All unit tests pass
- ✅ All visual regression tests pass
- ✅ Bundle size reduced by 30-40%
- ✅ Performance metrics maintained or improved
- ✅ Documentation complete (style guide, ownership map, onboarding)
- ✅ Team trained on new architecture
