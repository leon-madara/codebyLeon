# Utility Methods

GSAP provides a suite of utility methods in `gsap.utils`. These help with math, array manipulation, and random number generation.

## Common Methods

### `gsap.utils.toArray()`
Converts a selector or NodeList into a true Array.
```tsx
const boxes = gsap.utils.toArray(".box");
boxes.forEach(box => { ... });
```

### `gsap.utils.random()`
Generates random numbers or picks random array elements.
```tsx
gsap.utils.random(0, 100); // Random number between 0 and 100
gsap.utils.random(0, 100, 5); // Snap to increments of 5
gsap.utils.random(["red", "blue", "green"]); // Pick random color
```

### `gsap.utils.mapRange()`
Maps a number from one range to another (like Processing's map function).
```tsx
// Map input 0-100 to output 0-1
const mapper = gsap.utils.mapRange(0, 100, 0, 1);
console.log(mapper(50)); // 0.5
```

### `gsap.utils.interpolate()`
Linearly interpolates between values.
```tsx
gsap.utils.interpolate(0, 500, 0.5); // 250
gsap.utils.interpolate("red", "blue", 0.5); // Purple-ish color
```

### `gsap.utils.snap()`
Snaps a value to the closest increment or array value.
```tsx
const snapper = gsap.utils.snap(10); // Snap to closest 10
snapper(23); // 20
snapper(27); // 30
```

### `gsap.utils.selector()` (Replaced by `useGSAP` scope)
In modern React, `useGSAP` scoping handles this, but it's useful to know.
```tsx
const q = gsap.utils.selector(ref);
gsap.to(q(".box"), { x: 100 });
```
