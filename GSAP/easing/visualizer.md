# Easing

Easing determines the "feel" of an animation—how it accelerates and decelerates.

## Standard Eases
GSAP uses a standard naming convention: `[Name].[Type]`.

### Types
- `.in`: Starts slow, speeds up.
- `.out`: Starts fast, slows down (Default).
- `.inOut`: Starts slow, speeds up, then slows down.

### Names (by Intensity)
1. `none` (Linear)
2. `power1` (Subtle)
3. `power2` (Standard - Default)
4. `power3` (Strong)
5. `power4` (Very Strong)
6. `expo` (Explosive - waits until end)
7. `circ` (Circular)

### Special Eases
- `back`: Overshoots slightly (`back.out(1.7)`).
- `elastic`: Bounces like rubber (`elastic.out(1, 0.3)`).
- `bounce`: Bounces like a ball (`bounce.out`).
- `steps`: Stepped motion (`steps(5)`).

## Visualizer
Always check the [GSAP Ease Visualizer](https://gsap.com/docs/v3/Eases/) to find the perfect curve.

## CustomEase
Create your own Bezier curves (like CSS cubic-bezier).

```tsx
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);

CustomEase.create("hop", "M0,0 C0,0 0.1,0.9 1,1");

gsap.to(".box", { 
  x: 100, 
  ease: "hop" 
});
```
