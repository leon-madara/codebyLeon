# Observer Plugin

Observer provides a way to detect and respond to "scroll-like" intentions (mouse wheel, touch swipe, pointer dragging) without actually moving the scrollbar. This is perfect for full-screen carousels, storytelling sites, or complex UI interactions.

## Setup

```tsx
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

gsap.registerPlugin(Observer);
```

## Basic Usage

```tsx
Observer.create({
  target: window, // Can be any element
  type: "wheel,touch,pointer", // active input types
  onUp: () => console.log("up"), 
  onDown: () => console.log("down"),
  onLeft: () => console.log("left"),
  onRight: () => console.log("right"),
  onChange: (self) => console.log("velocity:", self.velocityY)
});
```

## Key Configuration Options

| Option | Description |
| :--- | :--- |
| `type` | Comma-delimited list: `"wheel,touch,pointer"` |
| `tolerance` | Minimum distance required to trigger (default: 10) |
| `preventDefault` | If true, prevents default scrolling behavior (good for locking) |
| `debounce` | Adds a debounce time to prevent rapid firing |
| `wheelSpeed` | Multiplier for wheel velocity (default: 1) |

## React Example (Swipeable Component)

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Observer);

export function SwipeCard() {
  const cardRef = useRef(null);

  useGSAP(() => {
    Observer.create({
      target: cardRef.current,
      type: "touch,pointer",
      onRight: () => gsap.to(cardRef.current, { x: 100, opacity: 0 }),
      onLeft: () => gsap.to(cardRef.current, { x: -100, opacity: 0 })
    });
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="card">
      Swipe Me
    </div>
  );
}
```
