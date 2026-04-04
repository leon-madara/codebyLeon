# Implementation Plan: Smart Navigation Header

## Overview

This plan implements intelligent show/hide behavior for the navigation header based on scroll direction and inactivity, with route-aware visual states (floating vs attached). The implementation enhances the existing Navigation component using GSAP Observer for scroll detection, useGSAP hook for animations, and follows the project's CSS architecture standards.

## Tasks

- [x] 1. Set up route detection and state management
  - Implement route type detection using useLocation hook
  - Add state variables: isVisible, isFloating, settleTimerRef
  - Create helper functions: determineRouteType, shouldBeFloating, shouldAutoHide
  - Add route change effect to reset visibility and determine state
  - _Requirements: 1.1, 1.2, 5.1, 6.1, 7.1, 13.1, 13.3, 13.4_

- [x] 2. Implement GSAP Observer for scroll detection
  - [x] 2.1 Register GSAP Observer plugin and configure scroll detection
    - Import and register Observer plugin
    - Create Observer instance in useGSAP hook with window target
    - Configure tolerance (10px), event types (wheel, touch, scroll)
    - Implement onChange handler for scroll up/down detection
    - Implement onStop handler for scroll inactivity
    - Add proper cleanup in useGSAP return function
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 9.1, 9.3, 9.4_
  
  - [ ] 2.2 Write property test for scroll down behavior
    - **Property 1: Scroll Down Hides Navigation**
    - **Validates: Requirements 2.1, 11.1**
  
  - [ ]* 2.3 Write property test for scroll up behavior
    - **Property 2: Scroll Up Shows Navigation**
    - **Validates: Requirements 3.1, 11.1**

- [x] 3. Implement visibility state management and timer logic
  - [x] 3.1 Create timer management functions
    - Implement clearSettleTimer function with error handling
    - Implement startSettleTimer function with 2000ms delay
    - Add shouldAutoHide check in timer logic
    - Clear timers on component unmount
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 2.3, 3.3_
  
  - [x] 3.2 Implement scroll event handlers
    - Create handleScrollDown to hide navigation and manage timers
    - Create handleScrollUp to show navigation and clear timers
    - Create handleScrollStop to start inactivity timer
    - Wire handlers to Observer onChange and onStop callbacks
    - _Requirements: 2.1, 2.3, 3.1, 3.3, 4.3_
  
  - [ ]* 3.3 Write property tests for timer behavior
    - **Property 3: Timer Clearing on Visibility Change**
    - **Property 4: Inactivity Auto-Hide**
    - **Property 5: Scroll Action Cancels Inactivity Timer**
    - **Property 6: Hero Page No Auto-Hide**
    - **Validates: Requirements 2.3, 3.3, 4.1, 4.3, 4.4, 11.3**

- [x] 4. Checkpoint - Ensure scroll detection and state management work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement show/hide animations with GSAP
  - [x] 5.1 Create visibility animations using useGSAP hook
    - Add useGSAP hook with isVisible dependency
    - Implement show animation (y: 0, opacity: 1, duration: 0.3s, ease: power2.out)
    - Implement hide animation (y: -100%, opacity: 0, duration: 0.3s, ease: power2.in)
    - Add error handling for animation failures
    - Scope animations to navRef
    - _Requirements: 2.1, 3.1, 9.1, 9.2, 9.4, 11.1, 11.2_
  
  - [x] 5.2 Create state transition animations
    - Add useGSAP hook with isFloating dependency
    - Implement smooth transition between floating and attached states (duration: 0.3s)
    - Use power2.inOut easing for state transitions
    - _Requirements: 7.3, 11.1, 11.2, 13.2_
  
  - [ ]* 5.3 Write unit tests for animations
    - Test show animation triggers on scroll up
    - Test hide animation triggers on scroll down
    - Test state transition animation on route change
    - Test animation cleanup on unmount
    - _Requirements: 2.1, 3.1, 7.3, 9.3_

- [x] 6. Implement CSS styles for navigation states
  - [x] 6.1 Create base navigation styles in navigation.css
    - Add base .navigation class with fixed positioning and z-index
    - Add transition properties for transform and opacity
    - Add will-change: transform for performance
    - Follow CSS architecture layer hierarchy
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [x] 6.2 Create attached state styles
    - Add .navigation--attached modifier class
    - Set full width, no spacing, no rounded corners
    - Add backdrop-filter: blur(10px)
    - Add semi-transparent background with glass effect
    - Add border-bottom for visual separation
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1_
  
  - [x] 6.3 Create floating state styles
    - Add .navigation--floating modifier class
    - Set 4px spacing from top, left, right edges
    - Add border-radius from design tokens
    - Add backdrop-filter: blur(20px)
    - Add semi-transparent background
    - Ensure no box-shadow or elevation
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_
  
  - [x] 6.4 Create hidden state styles
    - Add .is-hidden state class
    - Set transform: translateY(-100%)
    - Set opacity: 0
    - Set pointer-events: none
    - _Requirements: 2.1, 15.3_
  
  - [x] 6.5 Add theme-specific overrides
    - Add [data-theme="dark"] selectors for attached state
    - Add [data-theme="dark"] selectors for floating state
    - Ensure proper backdrop blur opacity for both themes
    - Use CSS custom properties from ThemeContext
    - _Requirements: 10.1, 10.2, 10.4_

- [x] 7. Implement theme support and color transitions
  - [x] 7.1 Integrate ThemeContext
    - Import and use useTheme hook
    - Wire theme toggle button to toggleTheme function
    - Add proper ARIA labels for theme toggle
    - _Requirements: 10.1_
  
  - [x] 7.2 Add theme transition styles
    - Add CSS transition for color properties (200ms)
    - Ensure smooth transitions between light and dark modes
    - _Requirements: 10.5_
  
  - [ ]* 7.3 Write property tests for theme support
    - **Property 11: Theme Color Transition**
    - **Property 12: Contrast Ratio Compliance**
    - **Validates: Requirements 10.3, 10.5, 15.4**

- [x] 8. Checkpoint - Ensure animations and styling work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement mobile responsive behavior
  - [x] 9.1 Add mobile detection and hamburger menu
    - Import and use useIsMobile hook
    - Add isMobileMenuOpen state
    - Render hamburger button on mobile with proper ARIA attributes
    - Implement hamburger menu toggle handler
    - Add mobile menu overlay component
    - _Requirements: 12.2, 12.3, 12.4_
  
  - [x] 9.2 Add mobile-specific CSS
    - Add media queries for mobile viewport
    - Ensure 4px spacing maintained in floating state on mobile
    - Style hamburger button (3 lines, animated)
    - Style mobile menu overlay (full screen, backdrop blur)
    - Add mobile menu animation (slide in from right)
    - _Requirements: 12.1, 12.5_
  
  - [ ]* 9.3 Write property test for mobile behavior
    - **Property 13: Mobile Scroll Behavior Consistency**
    - **Property 14: Mobile Floating State Spacing**
    - **Validates: Requirements 12.1, 12.5**

- [x] 10. Implement accessibility features
  - [x] 10.1 Add ARIA attributes and screen reader support
    - Add aria-label="Main navigation" to nav element
    - Add aria-live="polite" region for state announcements
    - Update announcement state on visibility changes
    - Add aria-current for active route links
    - Add aria-expanded for hamburger menu
    - Add aria-hidden="true" to decorative elements
    - _Requirements: 15.2, 15.5_
  
  - [x] 10.2 Implement keyboard navigation support
    - Ensure focus visibility maintained when navigation hidden
    - Verify tab order is logical
    - Add keyboard shortcuts documentation (if applicable)
    - Test focus trap prevention when hidden
    - _Requirements: 15.1, 15.3_
  
  - [ ]* 10.3 Write property tests for accessibility
    - **Property 18: Keyboard Focus Visibility**
    - **Property 19: No Focus Trap When Hidden**
    - **Validates: Requirements 15.1, 15.3**

- [x] 11. Implement route change handling
  - [x] 11.1 Add route change effect
    - Create useEffect with location.pathname dependency
    - Reset isVisible to true on route change
    - Clear all pending timers on route change
    - Determine new state (floating/attached) based on new route
    - _Requirements: 13.1, 13.3, 13.4_
  
  - [ ]* 11.2 Write property tests for route changes
    - **Property 7: Hero Page Attached State**
    - **Property 8: Non-Blog Page Floating State**
    - **Property 9: Blog Page Attached State**
    - **Property 10: Route Change State Transition**
    - **Property 15: Route Change Visibility Reset**
    - **Property 16: Route Change Timer Cleanup**
    - **Property 17: Route Change State Determination**
    - **Validates: Requirements 5.1, 6.1, 7.1, 7.3, 13.1, 13.2, 13.3, 13.4**

- [x] 12. Checkpoint - Ensure mobile and accessibility features work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Write unit tests for component behavior
  - [ ]* 13.1 Write initial render and state tests
    - Test navigation visible on initial mount
    - Test floating state applied on non-hero, non-blog routes
    - Test attached state applied on hero route
    - Test attached state applied on blog routes
    - _Requirements: 1.1, 5.1, 6.1, 7.1_
  
  - [ ]* 13.2 Write GSAP integration tests
    - Test GSAP Observer is created on mount
    - Test Observer cleanup on unmount
    - Test useGSAP hook usage (not useEffect)
    - Test animation scoping to navRef
    - _Requirements: 8.1, 8.5, 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 13.3 Write scroll behavior tests
    - Test hide on scroll down (non-hero page)
    - Test show on scroll up
    - Test auto-hide after 2s inactivity on non-hero page
    - Test no auto-hide on hero page
    - _Requirements: 2.1, 3.1, 4.1, 4.4_
  
  - [ ]* 13.4 Write route change tests
    - Test reset to visible on route change
    - Test transition to floating state when leaving hero page
    - Test timer cleanup on route change
    - _Requirements: 13.1, 13.3, 13.4_
  
  - [ ]* 13.5 Write theme tests
    - Test dark theme styles applied
    - Test color transition on theme change
    - _Requirements: 10.2, 10.5_
  
  - [ ]* 13.6 Write accessibility tests
    - Test focus visibility maintained when hidden
    - Test no focus trap when hidden
    - Test sufficient contrast ratios
    - Test ARIA labels present
    - Test screen reader announcements
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ]* 13.7 Write mobile tests
    - Test hamburger menu renders on mobile
    - Test mobile menu toggle functionality
    - _Requirements: 12.2, 12.3_

- [ ] 14. Create visual regression tests with Playwright
  - [ ]* 14.1 Write visual tests for navigation states
    - Test attached state appearance on hero page
    - Test attached state appearance on blog pages
    - Test floating state appearance on other pages
    - _Requirements: 5.1, 6.1, 7.1_
  
  - [ ]* 14.2 Write visual tests for animations
    - Test show animation visual
    - Test hide animation visual
    - Test state transition animation visual
    - _Requirements: 2.1, 3.1, 7.3_
  
  - [ ]* 14.3 Write visual tests for themes
    - Test light theme appearance
    - Test dark theme appearance
    - _Requirements: 10.2, 10.3_
  
  - [ ]* 14.4 Write visual tests for mobile
    - Test mobile responsive layout
    - Test hamburger menu appearance
    - Test mobile menu overlay
    - _Requirements: 12.1, 12.2, 12.5_

- [ ] 15. Final integration and verification
  - [ ] 15.1 Verify CSS architecture compliance
    - Confirm navigation.css is the only CSS file for Navigation component
    - Verify no inline styles used
    - Verify no !important declarations
    - Verify CSS layer hierarchy followed
    - Check CSS_COMPONENT_OWNERSHIP.md mapping
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 15.2 Run all tests and verify coverage
    - Run unit tests (npm run test:unit)
    - Run property-based tests (npm run test:property)
    - Run visual regression tests (npm run test:visual)
    - Verify code coverage ≥ 80%
    - Run accessibility audit (axe-core)
    - _Requirements: All_
  
  - [ ] 15.3 Manual testing checklist
    - Test on hero page: attached state, no auto-hide, scroll behavior
    - Test on blog pages: attached state, auto-hide, scroll behavior
    - Test on other pages: floating state, auto-hide, scroll behavior
    - Test route transitions between all page types
    - Test theme switching in all states
    - Test mobile hamburger menu and responsive behavior
    - Test keyboard navigation and focus management
    - Test with screen reader (VoiceOver/NVDA)
    - _Requirements: All_

- [ ] 16. Final checkpoint - Ensure all requirements met
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (19 properties total)
- Unit tests validate specific examples and edge cases
- Visual regression tests ensure UI consistency across states and themes
- Follow AGENTS.md and project documentation for all implementation decisions
- All GSAP animations must use useGSAP hook, never useEffect
- All CSS must follow the project's CSS architecture guidelines
- No !important declarations allowed
- Maintain 1:1 CSS file to component mapping per CSS_COMPONENT_OWNERSHIP.md
