# GSAP Tweens

Tweens are the building blocks of GSAP. They define the change of properties over time for a specific target.

## Basic Methods

### `gsap.to()`
Animates from the **current** state to the defined destination values.
```tsx
gsap.to(".circle", { 
  x: 100, 
  duration: 1, 
  ease: "power2.out" 
});
```

### `gsap.from()`
Animates **from** the defined values **to** the current state. Useful for entrance animations.
```tsx
gsap.from(".headline", { 
  opacity: 0, 
  y: 50, 
  duration: 1 
});
```

### `gsap.fromTo()`
Defines both the **start** and **end** values explicitly. This gives you full control and is safer when animations might restart.
```tsx
gsap.fromTo(".box", 
  { opacity: 0, scale: 0.5 }, // Start
  { opacity: 1, scale: 1, duration: 0.5 } // End
);
```

### `gsap.set()`
Sets properties immediately (essentially a zero-duration tween).
```tsx
gsap.set(".hidden-element", { autoAlpha: 0 });
```

## Common Properties

| Property | Description | Example |
| :--- | :--- | :--- |
| `duration` | Length of animation in seconds (default: 0.5) | `duration: 1.5` |
| `delay` | Time to wait before starting | `delay: 0.2` |
| `ease` | The rate of change style (see [Visualizer](https://gsap.com/docs/v3/Eases/)) | `ease: "elastic.out(1, 0.3)"` |
| `stagger` | Delay between each target's animation | `stagger: 0.1` |
| `repeat` | How many times to repeat (-1 for infinite) | `repeat: 1` |
| `yoyo` | If true, alternates back and forth on repeat | `yoyo: true` |

## Staggers
Staggers are incredibly powerful for lists or grid items.

```tsx
// Animates each ".item" one after another with 0.1s gap
gsap.from(".item", {
  y: 20,
  opacity: 0,
  stagger: 0.1 
});

// Grid stagger (from center)
gsap.to(".grid-cell", {
  scale: 0.5,
  stagger: {
    amount: 1,
    grid: "auto",
    from: "center"
  }
});
```

## React Example (with Scoping)

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function StaggeredList() {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from("li", {
      x: -20,
      opacity: 0,
      stagger: 0.1
    });
  }, { scope: container });

  return (
    <ul ref={container}>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  );
}
```
