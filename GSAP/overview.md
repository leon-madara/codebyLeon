# GSAP Overview & Best Practices

This project uses **GreenSock Animation Platform (GSAP)** for high-performance animations, integrated via the `@gsap/react` package for safe use within the React component lifecycle.

## Installed Dependencies
- `gsap`: The core animation library.
- `@gsap/react`: The official React hook (`useGSAP`) for proper cleanup and scoping.
- `gsap/ScrollTrigger`: Plugin for scroll-driven animations.

> [!NOTE]
> **Club GSAP Plugins**
> Some advanced plugins like `ScrollSmoother`, `MorphSVG`, and `SplitText` are **paid** features (Club GSAP) and require a special installation token or the `gsap-bonus` package.
> This project currently looks configured for the **free public** version of GSAP.


## Core Concepts

### 1. The `useGSAP` Hook
Always use `useGSAP` instead of `useEffect` for creating GSAP animations in React components. It handles:
- **Cleanup**: Automatically kills animations when the component unmounts.
- **Scoping**: Allows you to use selector strings (e.g., `".box"`) that are scoped effectively to your component ref.

**Example Pattern:**
```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function MyComponent() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Scoped selector: only selects ".box" inside containerRef
    gsap.to(".box", { x: 100 }); 
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div className="box">Animate Me</div>
    </div>
  );
}
```

### 2. Registering Plugins
Register plugins globally once, typically in your component file (outside the component) or in a central setup file.

```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### 3. Performance Tips
- **`will-change`**: Use CSS `will-change: transform` on elements that animate heavily to promote them to their own compositor layer.
- **`fastScrollEnd`**: For aggressive scroll triggers, consider using logic to handle rapid scrolling.
- **`matchMedia`**: Use `ScrollTrigger.matchMedia()` for responsive animations that need to act differently on mobile vs. desktop.

## Directory Structure

### Core
- **[Tweens](./tweens/usage.md)**: Simple animations.
- **[Timelines](./timeline/usage.md)**: Sequencing animations.
- **[CSS](./css/properties.md)**: Shorthands and 3D transforms.
- **[Easing](./easing/visualizer.md)**: Visualizing motion feel.

### Scroll
- **[ScrollTrigger](./scrolltrigger/usage.md)**: Scroll-driven animations.
- **[ScrollSmoother](./scrollsmoother/usage.md)**: Smooth scrolling (Lenis & Official).
- **[ScrollTo](./plugins/scrollto.md)**: Programmatic scrolling.

### Advanced Effects
- **[Flip](./flip/usage.md)**: Seamless layout transitions.
- **[Staggers](./staggers/usage.md)**: Staggered animations & grids.
- **[Text](./text/text-plugin.md)**: Typing & scrambling effects.
- **[SplitText](./text/split-text.md)**: Character/Word splitting.
- **[Observer](./plugins/observer.md)**: Touch/Wheel events.

### Utils & Helpers
- **[React](./react/useGSAP.md)**: `useGSAP` hook deep dive.
- **[Utility Methods](./utils/methods.md)**: Math, Random, Interpolate.
- **[Helpers](./helpers/functions.md)**: Common custom functions.

