# ScrollToPlugin

ScrollToPlugin allows you to tween the window or any element's scroll position with standard GSAP syntax (duration, ease, etc.).

## Setup

```tsx
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);
```

## Basic Usage

### Scroll Window to Position
```tsx
// Scroll to 500px down
gsap.to(window, { duration: 1, scrollTo: 500 });

// Scroll to element
gsap.to(window, { duration: 1, scrollTo: "#target-section" });
```

### Scroll Inside a Container
```tsx
gsap.to(".scrollable-div", { 
  duration: 1, 
  scrollTo: { y: 200, x: 0 }, 
  ease: "power2.inOut" 
});
```

## Advanced Options

### Offset
Useful for fixed headers.

```tsx
gsap.to(window, { 
  duration: 1, 
  scrollTo: { 
    y: "#section2", 
    offsetY: 70 // Leave 70px space at top
  } 
});
```

### Auto-Kill
By default, if the user tries to scroll while the animation is running, GSAP stops the animation to respect the user's action. Set `autoKill: false` to force it (not recommended for UX).

```tsx
gsap.to(window, { 
  duration: 2, 
  scrollTo: { y: 1000, autoKill: true } 
});
```
