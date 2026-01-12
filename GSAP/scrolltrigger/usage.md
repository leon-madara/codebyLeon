# GSAP ScrollTrigger

ScrollTrigger enables scroll-driven animations, pinning of elements, and parallax effects.

## Setup
Register the plugin once (globally) before using it.

```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

## Basic Usage
You can add a `scrollTrigger` object directly to any tween or timeline.

```tsx
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box", // Element that triggers the animation
    start: "top 80%", // When top of .box hits 80% down from viewport top
    end: "bottom 20%", // When bottom of .box hits 20% down from viewport top
    markers: true // Dev only: shows start/end markers
  }
});
```

## Toggle Actions
Control what happens when the user scrolls in/out of the trigger area.
Format: `"onEnter onLeave onEnterBack onLeaveBack"`
Common actions: `"play"`, `"pause"`, `"resume"`, `"reverse"`, `"restart"`, `"reset"`, `"complete"`, `"none"`.

```tsx
scrollTrigger: {
  trigger: ".box",
  toggleActions: "play pause resume reset"
}
```

## Scrubbing
Links the animation progress directly to the scrollbar.

```tsx
scrollTrigger: {
  trigger: ".container",
  scrub: true, // Smoothness: true = direct, 1 = 1 second delay (smoother)
  start: "top top",
  end: "bottom top"
}
```

## Pinning
Fixes an element in place while scrolling continues.

```tsx
scrollTrigger: {
  trigger: ".hero",
  pin: true, // Pins the trigger element
  // pin: ".other-element" // Pins a specific element
  start: "top top",
  end: "+=500%" // Pin for 5x viewport height
}
```

## React Best Practices
Always create ScrollTriggers inside `useGSAP`.

### 1. Refreshing on Updates
If your DOM content changes size dynamically (e.g., images loading, accordions opening), you might need to call `ScrollTrigger.refresh()`.

### 2. Fast Scroll End
If using large pinned sections, fast scrolling can sometimes glitch. Use `fastScrollEnd: true` or adjust logic to detect rapid movement.

### 3. Responsive Animations (`matchMedia`)
Use `ScrollTrigger.matchMedia` for different animations on mobile/desktop.

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 800px)", () => {
    // Desktop Setup
    ScrollTrigger.create({ ... });
  });

  mm.add("(max-width: 799px)", () => {
    // Mobile Setup
    ScrollTrigger.create({ ... });
  });
});
```
