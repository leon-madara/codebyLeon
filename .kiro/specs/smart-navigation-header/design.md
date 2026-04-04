# Smart Navigation Header - Design Document

## Overview

The smart navigation header enhances the existing Navigation component with intelligent show/hide behavior based on scroll direction and inactivity, along with context-aware visual states (floating vs attached) based on the current route. This design maintains the existing navigation functionality while adding dynamic behavior that improves user experience by maximizing content visibility while keeping navigation easily accessible.

### Key Features

- **Scroll-Based Visibility**: Hide on scroll down, show on scroll up
- **Auto-Hide on Inactivity**: Automatically hide after 2 seconds of scroll inactivity
- **Route-Aware Visual States**: 
  - Attached state for hero page (/) and blog pages (/blog/*)
  - Floating state for all other pages
- **GSAP-Powered Animations**: All animations use GSAP Observer and useGSAP hook
- **Theme Support**: Full light/dark mode support via ThemeContext
- **Accessibility**: Keyboard navigation, screen reader support, WCAG AA compliance

### Design Goals

1. Maximize content visibility without sacrificing navigation accessibility
2. Provide smooth, natural animations that feel responsive
3. Maintain visual consistency with existing design system
4. Follow project CSS architecture and GSAP patterns
5. Ensure accessibility for all users

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Navigation Component                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Route Detection Logic                       │  │
│  │  (useLocation → determine attached vs floating)       │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Scroll Detection (GSAP Observer)              │  │
│  │  • Detect scroll up/down                              │  │
│  │  • Track scroll inactivity                            │  │
│  │  • Manage inactivity timer                            │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │      Visibility State Management (React State)        │  │
│  │  • isVisible: boolean                                 │  │
│  │  • Update based on scroll events                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │       Animation Layer (GSAP via useGSAP)              │  │
│  │  • Show animation (translateY: 0)                     │  │
│  │  • Hide animation (translateY: -100%)                 │  │
│  │  • State transition animations                        │  │
│  └───────────────────────────────────────────────────────┘  │
│                           ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         CSS Layer (navigation.css)                    │  │
│  │  • Base styles                                        │  │
│  │  • .navigation--floating modifier                     │  │
│  │  • .navigation--attached modifier                     │  │
│  │  • .is-hidden state                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**Navigation Component** (`src/components/Layout/Navigation.tsx`):
- Route detection and state determination
- Scroll event handling via GSAP Observer
- Visibility state management
- Animation orchestration via useGSAP
- Rendering navigation UI elements

**Navigation Styles** (`src/styles/layout/navigation.css`):
- Base navigation styles
- Floating state styles (spacing, rounded corners, backdrop blur)
- Attached state styles (full width, no spacing)
- Hidden state styles
- Theme-specific overrides

### State Flow

```
Page Load
    ↓
Route Detection → Determine State (attached/floating)
    ↓
Initialize Visible
    ↓
User Scrolls Down → Hide Navigation + Start Inactivity Timer
    ↓
User Scrolls Up → Show Navigation + Clear Timer
    ↓
Scroll Stops → Start 2s Inactivity Timer
    ↓
Timer Expires → Hide Navigation (unless on hero page)
    ↓
Route Change → Reset to Visible + Re-determine State
```

## Components and Interfaces

### Navigation Component Interface

```typescript
// No props - Navigation is a standalone component
export function Navigation(): JSX.Element

// Internal State
interface NavigationState {
  isVisible: boolean;           // Current visibility state
  isFloating: boolean;          // Current visual state (floating vs attached)
  settleTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

// Route Detection
type RouteType = 'hero' | 'blog' | 'other';

function determineRouteType(pathname: string): RouteType {
  if (pathname === '/') return 'hero';
  if (pathname.startsWith('/blog')) return 'blog';
  return 'other';
}

function shouldBeFloating(routeType: RouteType): boolean {
  return routeType === 'other';
}

function shouldAutoHide(routeType: RouteType): boolean {
  return routeType !== 'hero';
}
```

### GSAP Observer Configuration

```typescript
interface ObserverConfig {
  target: Window;
  type: "wheel,touch,scroll";
  tolerance: number;           // 10px minimum to trigger
  preventDefault: false;       // Allow normal scrolling
  onChange: (self: Observer) => void;
  onStop: () => void;
}

// Observer callbacks
const handleScrollDown = () => {
  if (shouldAutoHide(routeType)) {
    setIsVisible(false);
    clearInactivityTimer();
    startInactivityTimer();
  }
};

const handleScrollUp = () => {
  setIsVisible(true);
  clearInactivityTimer();
};

const handleScrollStop = () => {
  if (shouldAutoHide(routeType)) {
    startInactivityTimer();
  }
};
```

### Animation Interface

```typescript
// GSAP animation configuration
interface ShowAnimation {
  y: 0;
  opacity: 1;
  duration: 0.3;
  ease: "power2.out";
}

interface HideAnimation {
  y: "-100%";
  opacity: 0;
  duration: 0.3;
  ease: "power2.in";
}

interface StateTransitionAnimation {
  // Floating → Attached or vice versa
  duration: 0.3;
  ease: "power2.inOut";
  properties: {
    borderRadius?: string;
    padding?: string;
    margin?: string;
  };
}
```

### CSS Class Structure

```typescript
// BEM naming convention
const navigationClasses = {
  base: 'navigation',
  floating: 'navigation--floating',
  attached: 'navigation--attached',
  hidden: 'is-hidden',
  container: 'navigation__container',
  logo: 'navigation__logo',
  links: 'navigation__links',
  link: 'navigation__link',
  cta: 'navigation__cta',
  themeToggle: 'navigation__theme-toggle'
};

// Dynamic class composition
const getNavigationClasses = (isFloating: boolean, isVisible: boolean): string => {
  return [
    navigationClasses.base,
    isFloating ? navigationClasses.floating : navigationClasses.attached,
    !isVisible ? navigationClasses.hidden : ''
  ].filter(Boolean).join(' ');
};
```

## Data Models

### Navigation State Model

```typescript
interface NavigationState {
  // Visibility state
  isVisible: boolean;
  
  // Visual state
  isFloating: boolean;
  
  // Route information
  currentRoute: string;
  routeType: RouteType;
  
  // Timer management
  inactivityTimerId: NodeJS.Timeout | null;
}

type RouteType = 'hero' | 'blog' | 'other';
```

### Scroll Event Model

```typescript
interface ScrollEvent {
  deltaY: number;        // Vertical scroll delta
  deltaX: number;        // Horizontal scroll delta (unused)
  velocityY: number;     // Scroll velocity
  direction: 1 | -1;     // 1 = down, -1 = up
}

interface ScrollState {
  isScrolling: boolean;
  lastScrollTime: number;
  scrollDirection: 'up' | 'down' | null;
}
```

### Animation State Model

```typescript
interface AnimationState {
  isAnimating: boolean;
  currentAnimation: gsap.core.Tween | null;
  animationQueue: Array<() => void>;
}
```

## Implementation Details

### Route Detection Logic

The navigation component uses React Router's `useLocation` hook to determine the current route and apply the appropriate visual state.

```typescript
import { useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();
  const [isFloating, setIsFloating] = useState(false);
  
  // Determine route type and floating state
  useEffect(() => {
    const routeType = determineRouteType(location.pathname);
    setIsFloating(shouldBeFloating(routeType));
  }, [location.pathname]);
  
  // Helper functions
  const determineRouteType = (pathname: string): RouteType => {
    if (pathname === '/') return 'hero';
    if (pathname.startsWith('/blog')) return 'blog';
    return 'other';
  };
  
  const shouldBeFloating = (routeType: RouteType): boolean => {
    return routeType === 'other';
  };
  
  const shouldAutoHide = (routeType: RouteType): boolean => {
    return routeType !== 'hero';
  };
}
```

### Scroll Detection with GSAP Observer

All scroll detection uses GSAP Observer plugin, registered and configured within the useGSAP hook.

```typescript
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Observer);

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const settleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  
  // Determine route type for auto-hide logic
  const routeType = useMemo(() => {
    if (location.pathname === '/') return 'hero';
    if (location.pathname.startsWith('/blog')) return 'blog';
    return 'other';
  }, [location.pathname]);
  
  const shouldAutoHide = routeType !== 'hero';
  
  useGSAP(() => {
    const clearSettleTimer = () => {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };
    
    const startSettleTimer = () => {
      if (!shouldAutoHide) return;
      
      clearSettleTimer();
      settleTimerRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    };
    
    const observer = Observer.create({
      target: window,
      type: "wheel,touch,scroll",
      tolerance: 10,
      preventDefault: false,
      onChange: (self) => {
        if (self.deltaY > 0) {
          // Scrolling down
          if (shouldAutoHide) {
            setIsVisible(false);
            clearSettleTimer();
            startSettleTimer();
          }
        } else if (self.deltaY < -5) {
          // Scrolling up (with small threshold)
          setIsVisible(true);
          clearSettleTimer();
        }
      },
      onStop: () => {
        startSettleTimer();
      }
    });
    
    return () => {
      observer.kill();
      clearSettleTimer();
    };
  }, { scope: navRef, dependencies: [shouldAutoHide] });
  
  return (
    <nav ref={navRef} className={getNavigationClasses(isFloating, isVisible)}>
      {/* Navigation content */}
    </nav>
  );
}
```

### Animation Implementation

All animations use GSAP with the useGSAP hook. The visibility state triggers CSS class changes, and GSAP handles the transitions.

```typescript
// Visibility animation via CSS classes
useGSAP(() => {
  if (!navRef.current) return;
  
  if (isVisible) {
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  } else {
    gsap.to(navRef.current, {
      y: "-100%",
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  }
}, { scope: navRef, dependencies: [isVisible] });

// State transition animation (floating ↔ attached)
useGSAP(() => {
  if (!navRef.current) return;
  
  // Animate state transition properties
  gsap.to(navRef.current, {
    duration: 0.3,
    ease: "power2.inOut"
  });
}, { scope: navRef, dependencies: [isFloating] });
```

### CSS Architecture

Following the project's CSS architecture, all navigation styles are defined in `src/styles/layout/navigation.css` with BEM naming conventions.

```css
/* Base navigation styles */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: transform 0.3s var(--easing-standard),
              opacity 0.3s var(--easing-standard);
  will-change: transform;
}

/* Attached state (hero and blog pages) */
.navigation--attached {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: 0;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid var(--glass-border);
}

/* Floating state (other pages) */
.navigation--floating {
  top: 4px;
  left: 4px;
  right: 4px;
  width: calc(100% - 8px);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 12px;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: none; /* No elevation per requirements */
}

/* Hidden state */
.navigation.is-hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

/* Theme overrides */
[data-theme="dark"] .navigation--attached {
  background: rgba(2, 17, 39, 0.3);
}

[data-theme="dark"] .navigation--floating {
  background: rgba(10, 15, 13, 0.8);
}
```

### Route Change Handling

When routes change, the navigation resets to visible and re-determines its state.

```typescript
useEffect(() => {
  // Reset to visible on route change
  setIsVisible(true);
  
  // Clear any pending timers
  if (settleTimerRef.current) {
    clearTimeout(settleTimerRef.current);
    settleTimerRef.current = null;
  }
  
  // Determine new state
  const routeType = determineRouteType(location.pathname);
  setIsFloating(shouldBeFloating(routeType));
}, [location.pathname]);
```

### Mobile Implementation

Mobile behavior follows the same scroll logic as desktop, using the existing `use-mobile` hook for responsive adjustments.

```typescript
import { useIsMobile } from '../../hooks/use-mobile';

export function Navigation() {
  const isMobile = useIsMobile();
  
  // Mobile-specific adjustments in CSS via media queries
  // Hamburger menu implementation (if not exists)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav ref={navRef} className={getNavigationClasses(isFloating, isVisible)}>
      <div className="navigation__container">
        {/* Logo */}
        <Link to="/" className="navigation__logo">
          <img src="/icons/main-logo.svg" alt="Code by Leon" />
        </Link>
        
        {/* Desktop links */}
        {!isMobile && (
          <ul className="navigation__links">
            {/* Links */}
          </ul>
        )}
        
        {/* Mobile hamburger menu */}
        {isMobile && (
          <button 
            className="navigation__hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
        
        {/* CTA and theme toggle */}
      </div>
      
      {/* Mobile menu overlay */}
      {isMobile && isMobileMenuOpen && (
        <div className="navigation__mobile-menu">
          {/* Mobile menu content */}
        </div>
      )}
    </nav>
  );
}
```

### Accessibility Implementation

```typescript
// ARIA live region for state announcements
const [announcement, setAnnouncement] = useState('');

useEffect(() => {
  if (isVisible) {
    setAnnouncement('Navigation shown');
  } else {
    setAnnouncement('Navigation hidden');
  }
}, [isVisible]);

return (
  <>
    {/* Screen reader announcements */}
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
    
    <nav 
      ref={navRef} 
      className={getNavigationClasses(isFloating, isVisible)}
      aria-label="Main navigation"
    >
      {/* Navigation content with proper ARIA labels */}
      <Link 
        to="/" 
        className="navigation__logo"
        aria-label="Code by Leon - Home"
      >
        <img src="/icons/main-logo.svg" alt="" aria-hidden="true" />
      </Link>
      
      <ul className="navigation__links" role="list">
        <li>
          <a 
            href="#portfolio" 
            className="navigation__link"
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            PORTFOLIO
          </a>
        </li>
        {/* More links */}
      </ul>
    </nav>
  </>
);
```

### Theme Support

Theme support uses the existing ThemeContext and CSS custom properties.

```typescript
import { useTheme } from '../../contexts/ThemeContext';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  
  // Theme-specific styles handled via CSS
  // [data-theme="dark"] selectors in navigation.css
  
  return (
    <nav>
      {/* Navigation content */}
      
      {/* Theme toggle button */}
      <div className="navigation__theme-toggle">
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="navigation__toggle-switch"
        >
          {/* Theme toggle UI */}
        </button>
      </div>
    </nav>
  );
}
```

## Error Handling

### Scroll Detection Errors

```typescript
useGSAP(() => {
  try {
    const observer = Observer.create({
      target: window,
      type: "wheel,touch,scroll",
      tolerance: 10,
      preventDefault: false,
      onChange: handleScrollChange,
      onStop: handleScrollStop
    });
    
    return () => {
      try {
        observer.kill();
      } catch (error) {
        console.error('Error killing Observer:', error);
      }
    };
  } catch (error) {
    console.error('Error creating Observer:', error);
    // Fallback: navigation remains visible
    setIsVisible(true);
  }
}, { scope: navRef, dependencies: [shouldAutoHide] });
```

### Animation Errors

```typescript
useGSAP(() => {
  if (!navRef.current) {
    console.warn('Navigation ref not available for animation');
    return;
  }
  
  try {
    if (isVisible) {
      gsap.to(navRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onError: (error) => {
          console.error('Show animation error:', error);
        }
      });
    } else {
      gsap.to(navRef.current, {
        y: "-100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onError: (error) => {
          console.error('Hide animation error:', error);
        }
      });
    }
  } catch (error) {
    console.error('Animation setup error:', error);
  }
}, { scope: navRef, dependencies: [isVisible] });
```

### Route Detection Errors

```typescript
const determineRouteType = (pathname: string): RouteType => {
  try {
    if (!pathname || typeof pathname !== 'string') {
      console.warn('Invalid pathname:', pathname);
      return 'other';
    }
    
    if (pathname === '/') return 'hero';
    if (pathname.startsWith('/blog')) return 'blog';
    return 'other';
  } catch (error) {
    console.error('Route detection error:', error);
    return 'other'; // Safe default
  }
};
```

### Timer Cleanup Errors

```typescript
const clearSettleTimer = () => {
  try {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  } catch (error) {
    console.error('Error clearing settle timer:', error);
  }
};

// Cleanup on unmount
useEffect(() => {
  return () => {
    clearSettleTimer();
  };
}, []);
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:
- Requirements 2.3 and 3.3 both test timer clearing on visibility changes - can be combined into one property
- Requirements 5.2, 5.3, 5.4 are all specific CSS examples for attached state - covered by visual regression tests
- Requirements 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8 are all specific CSS examples for floating state - covered by visual regression tests
- Requirements 11.1 subsumes 2.1 and 3.1 (all test 300ms transition timing)
- Requirements 8.1-8.5 and 9.1-9.4 are implementation verification, not behavioral properties
- Requirements 14.1-14.5 are code quality checks, not runtime properties

The following properties represent the unique, testable behavioral characteristics:

### Property 1: Scroll Down Hides Navigation

*For any* scroll down event on pages where auto-hide is enabled (non-hero pages), the navigation should transition to hidden state within 300ms.

**Validates: Requirements 2.1, 11.1**

### Property 2: Scroll Up Shows Navigation

*For any* scroll up event, the navigation should transition to visible state within 300ms.

**Validates: Requirements 3.1, 11.1**

### Property 3: Timer Clearing on Visibility Change

*For any* visibility state change (show or hide), all pending inactivity timers should be cleared before the state change completes.

**Validates: Requirements 2.3, 3.3**

### Property 4: Inactivity Auto-Hide

*For any* period of scroll inactivity lasting 2000ms or more on non-hero pages, the navigation should transition to hidden state.

**Validates: Requirements 4.1, 11.3**

### Property 5: Scroll Action Cancels Inactivity Timer

*For any* scroll action (up or down) that occurs while an inactivity timer is active, the timer should be cancelled immediately.

**Validates: Requirements 4.3**

### Property 6: Hero Page No Auto-Hide

*For any* scroll behavior on the hero page (/), the navigation should never auto-hide due to inactivity.

**Validates: Requirements 4.4**

### Property 7: Hero Page Attached State

*For any* time the current route is the hero page (/), the navigation should be in attached state (not floating).

**Validates: Requirements 5.1**

### Property 8: Non-Blog Page Floating State

*For any* route that is not the hero page and not a blog page, the navigation should be in floating state.

**Validates: Requirements 6.1**

### Property 9: Blog Page Attached State

*For any* route that starts with /blog, the navigation should be in attached state (not floating).

**Validates: Requirements 7.1**

### Property 10: Route Change State Transition

*For any* route change to a blog page, the navigation should transition to attached state within 300ms.

**Validates: Requirements 7.3, 13.2**

### Property 11: Theme Color Transition

*For any* theme change (light to dark or dark to light), the navigation colors should transition smoothly within 200ms.

**Validates: Requirements 10.5**

### Property 12: Contrast Ratio Compliance

*For any* theme (light or dark), all text and interactive elements in the navigation should maintain a contrast ratio of at least 4.5:1 (WCAG AA).

**Validates: Requirements 10.3, 15.4**

### Property 13: Mobile Scroll Behavior Consistency

*For any* scroll event on mobile devices, the show/hide behavior should match desktop behavior (hide on scroll down, show on scroll up).

**Validates: Requirements 12.1**

### Property 14: Mobile Floating State Spacing

*For any* mobile device in floating state, the navigation should maintain 4px spacing from all viewport edges (top, left, right).

**Validates: Requirements 12.5**

### Property 15: Route Change Visibility Reset

*For any* route change, the navigation should reset to visible state regardless of previous visibility.

**Validates: Requirements 13.3**

### Property 16: Route Change Timer Cleanup

*For any* route change, all pending inactivity timers should be cleared.

**Validates: Requirements 13.4**

### Property 17: Route Change State Determination

*For any* route change, the navigation should determine the correct state (attached or floating) within 100ms.

**Validates: Requirements 13.1**

### Property 18: Keyboard Focus Visibility

*For any* visibility state (shown or hidden), keyboard focus indicators should remain visible and meet WCAG AA contrast requirements.

**Validates: Requirements 15.1**

### Property 19: No Focus Trap When Hidden

*For any* hidden state, keyboard focus should be able to move freely to other page elements without being trapped in the navigation.

**Validates: Requirements 15.3**

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Initial render state (visible, correct route-based state)
- Specific CSS class application for attached/floating states
- GSAP Observer configuration and cleanup
- useGSAP hook usage and cleanup
- Theme context integration
- ARIA attributes and accessibility markup
- Mobile hamburger menu rendering
- Edge cases (invalid routes, rapid route changes)

**Property-Based Tests** focus on:
- Scroll behavior across many random scroll events
- Timing constraints across many iterations
- Route changes across all possible route combinations
- Theme transitions with random timing
- Contrast ratios across all color combinations
- Mobile behavior across different viewport sizes

### Property-Based Testing Configuration

**Library**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: smart-navigation-header, Property {number}: {property_text}`

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';
import { describe, it, expect } from 'vitest';

describe('Feature: smart-navigation-header', () => {
  it('Property 1: Scroll Down Hides Navigation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }), // scroll delta
        fc.constantFrom('blog', 'other'), // route types that allow auto-hide
        (scrollDelta, routeType) => {
          // Setup: render navigation on specified route
          const { container } = render(<Navigation />, { route: `/${routeType}` });
          
          // Action: simulate scroll down
          simulateScroll({ deltaY: scrollDelta });
          
          // Wait for animation
          await waitFor(() => {
            const nav = container.querySelector('.navigation');
            expect(nav).toHaveClass('is-hidden');
          }, { timeout: 300 });
          
          // Assert: navigation is hidden within 300ms
          const nav = container.querySelector('.navigation');
          expect(nav).toHaveClass('is-hidden');
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 6: Hero Page No Auto-Hide', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 1000 }), // scroll delta
        fc.integer({ min: 2000, max: 5000 }), // inactivity duration
        async (scrollDelta, inactivityDuration) => {
          // Setup: render navigation on hero page
          const { container } = render(<Navigation />, { route: '/' });
          
          // Action: scroll down and wait for inactivity
          simulateScroll({ deltaY: scrollDelta });
          await new Promise(resolve => setTimeout(resolve, inactivityDuration));
          
          // Assert: navigation is still visible
          const nav = container.querySelector('.navigation');
          expect(nav).not.toHaveClass('is-hidden');
        }
      ),
      { numRuns: 100 }
    );
  });
  
  it('Property 12: Contrast Ratio Compliance', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('light', 'dark'), // theme
        fc.constantFrom('logo', 'link', 'cta', 'toggle'), // element type
        (theme, elementType) => {
          // Setup: render navigation with theme
          const { container } = render(
            <ThemeProvider initialTheme={theme}>
              <Navigation />
            </ThemeProvider>
          );
          
          // Get element and compute contrast
          const element = container.querySelector(`.navigation__${elementType}`);
          const contrast = calculateContrastRatio(element);
          
          // Assert: contrast meets WCAG AA (4.5:1)
          expect(contrast).toBeGreaterThanOrEqual(4.5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

**Component Behavior Tests**:
```typescript
describe('Navigation Component', () => {
  it('should render visible on initial mount', () => {
    const { container } = render(<Navigation />);
    const nav = container.querySelector('.navigation');
    expect(nav).not.toHaveClass('is-hidden');
  });
  
  it('should apply floating state on non-hero, non-blog routes', () => {
    const { container } = render(<Navigation />, { route: '/about' });
    const nav = container.querySelector('.navigation');
    expect(nav).toHaveClass('navigation--floating');
  });
  
  it('should apply attached state on hero route', () => {
    const { container } = render(<Navigation />, { route: '/' });
    const nav = container.querySelector('.navigation');
    expect(nav).toHaveClass('navigation--attached');
  });
  
  it('should apply attached state on blog routes', () => {
    const { container } = render(<Navigation />, { route: '/blog' });
    const nav = container.querySelector('.navigation');
    expect(nav).toHaveClass('navigation--attached');
  });
  
  it('should use GSAP Observer for scroll detection', () => {
    const observerSpy = vi.spyOn(Observer, 'create');
    render(<Navigation />);
    expect(observerSpy).toHaveBeenCalled();
  });
  
  it('should clean up Observer on unmount', () => {
    const killSpy = vi.fn();
    vi.spyOn(Observer, 'create').mockReturnValue({ kill: killSpy });
    const { unmount } = render(<Navigation />);
    unmount();
    expect(killSpy).toHaveBeenCalled();
  });
  
  it('should render hamburger menu on mobile', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(max-width: 767px)'
    });
    const { container } = render(<Navigation />);
    const hamburger = container.querySelector('.navigation__hamburger');
    expect(hamburger).toBeInTheDocument();
  });
  
  it('should have proper ARIA labels', () => {
    const { container } = render(<Navigation />);
    const nav = container.querySelector('nav');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
  });
  
  it('should announce state changes to screen readers', () => {
    const { container } = render(<Navigation />);
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });
});
```

**Scroll Behavior Tests**:
```typescript
describe('Navigation Scroll Behavior', () => {
  it('should hide on scroll down (non-hero page)', async () => {
    const { container } = render(<Navigation />, { route: '/blog' });
    simulateScroll({ deltaY: 100 });
    await waitFor(() => {
      const nav = container.querySelector('.navigation');
      expect(nav).toHaveClass('is-hidden');
    });
  });
  
  it('should show on scroll up', async () => {
    const { container } = render(<Navigation />, { route: '/blog' });
    // First hide
    simulateScroll({ deltaY: 100 });
    await waitFor(() => {
      expect(container.querySelector('.navigation')).toHaveClass('is-hidden');
    });
    // Then show
    simulateScroll({ deltaY: -100 });
    await waitFor(() => {
      expect(container.querySelector('.navigation')).not.toHaveClass('is-hidden');
    });
  });
  
  it('should auto-hide after 2s inactivity on non-hero page', async () => {
    const { container } = render(<Navigation />, { route: '/blog' });
    simulateScroll({ deltaY: 100 });
    await new Promise(resolve => setTimeout(resolve, 2100));
    const nav = container.querySelector('.navigation');
    expect(nav).toHaveClass('is-hidden');
  });
  
  it('should not auto-hide on hero page', async () => {
    const { container } = render(<Navigation />, { route: '/' });
    simulateScroll({ deltaY: 100 });
    await new Promise(resolve => setTimeout(resolve, 2100));
    const nav = container.querySelector('.navigation');
    expect(nav).not.toHaveClass('is-hidden');
  });
});
```

**Route Change Tests**:
```typescript
describe('Navigation Route Changes', () => {
  it('should reset to visible on route change', () => {
    const { container, rerender } = render(<Navigation />, { route: '/blog' });
    // Hide navigation
    simulateScroll({ deltaY: 100 });
    // Change route
    rerender(<Navigation />, { route: '/about' });
    const nav = container.querySelector('.navigation');
    expect(nav).not.toHaveClass('is-hidden');
  });
  
  it('should transition to floating state when leaving hero page', async () => {
    const { container, rerender } = render(<Navigation />, { route: '/' });
    rerender(<Navigation />, { route: '/about' });
    await waitFor(() => {
      const nav = container.querySelector('.navigation');
      expect(nav).toHaveClass('navigation--floating');
    });
  });
  
  it('should clear timers on route change', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { rerender } = render(<Navigation />, { route: '/blog' });
    simulateScroll({ deltaY: 100 });
    rerender(<Navigation />, { route: '/about' });
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
```

**Theme Tests**:
```typescript
describe('Navigation Theme Support', () => {
  it('should apply dark theme styles', () => {
    const { container } = render(
      <ThemeProvider initialTheme="dark">
        <Navigation />
      </ThemeProvider>
    );
    document.documentElement.setAttribute('data-theme', 'dark');
    const nav = container.querySelector('.navigation');
    const styles = window.getComputedStyle(nav);
    // Verify dark theme background is applied
    expect(styles.background).toContain('rgba(2, 17, 39');
  });
  
  it('should transition colors on theme change', async () => {
    const { container } = render(
      <ThemeProvider initialTheme="light">
        <Navigation />
      </ThemeProvider>
    );
    const nav = container.querySelector('.navigation');
    const initialColor = window.getComputedStyle(nav).background;
    
    // Change theme
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Wait for transition
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newColor = window.getComputedStyle(nav).background;
    expect(newColor).not.toBe(initialColor);
  });
});
```

**Accessibility Tests**:
```typescript
describe('Navigation Accessibility', () => {
  it('should maintain focus visibility when hidden', () => {
    const { container } = render(<Navigation />);
    const link = container.querySelector('.navigation__link');
    link.focus();
    simulateScroll({ deltaY: 100 });
    expect(document.activeElement).toBe(link);
  });
  
  it('should not trap focus when hidden', () => {
    const { container } = render(<Navigation />);
    simulateScroll({ deltaY: 100 });
    const nav = container.querySelector('.navigation');
    expect(nav).toHaveStyle({ pointerEvents: 'none' });
  });
  
  it('should have sufficient contrast ratios', () => {
    const { container } = render(<Navigation />);
    const link = container.querySelector('.navigation__link');
    const contrast = calculateContrastRatio(link);
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
});
```

### Visual Regression Tests

Use Playwright for visual regression testing of:
- Attached state appearance on hero page
- Attached state appearance on blog pages
- Floating state appearance on other pages
- Show/hide animations
- State transition animations
- Light theme appearance
- Dark theme appearance
- Mobile responsive layout
- Hamburger menu on mobile

```typescript
// tests/visual/navigation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Navigation Visual Tests', () => {
  test('attached state on hero page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.navigation')).toHaveScreenshot('nav-hero-attached.png');
  });
  
  test('floating state on about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('.navigation')).toHaveScreenshot('nav-about-floating.png');
  });
  
  test('hide animation', async ({ page }) => {
    await page.goto('/blog');
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(300);
    await expect(page.locator('.navigation')).toHaveScreenshot('nav-hidden.png');
  });
  
  test('dark theme', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await expect(page.locator('.navigation')).toHaveScreenshot('nav-dark-theme.png');
  });
  
  test('mobile hamburger menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('.navigation')).toHaveScreenshot('nav-mobile.png');
  });
});
```

### Test Execution

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run property-based tests only
npm run test:property

# Run visual regression tests
npm run test:visual

# Run with coverage
npm run test:coverage
```

### Success Criteria

- All unit tests pass
- All property-based tests pass (100 iterations each)
- All visual regression tests pass
- Code coverage ≥ 80% for Navigation component
- No accessibility violations (axe-core)
- All GSAP animations use useGSAP hook
- All CSS follows architecture guidelines
- No !important declarations
- No inline styles (except dynamic CSS variables)
