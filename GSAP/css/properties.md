# CSS Plugin

GSAP is essentially a high-performance property manipulator. The CSSPlugin (built-in) handles all standard CSS properties.

## Transform Shorthands
GSAP uses optimized shorthands for transforms. Always use these instead of strings like `transform: "translateX(10px)"`.

| GSAP Property | CSS Equivalent |
| :--- | :--- |
| `x` | `translateX` |
| `y` | `translateY` |
| `rotation` | `rotate` (degrees) |
| `scale` | `scale` (uniform) |
| `scaleX`, `scaleY` | `scaleX`, `scaleY` |
| `skewX`, `skewY` | `skewX`, `skewY` |
| `rotationX`, `rotationY` | `rotateX`, `rotateY` (3D) |
| `z` | `translateZ` (3D) |

```tsx
gsap.to(".box", { 
  x: 100, 
  rotation: 360, 
  scale: 1.5 
});
```

## 3D Transforms & Perspective
To work with 3D, ensure parent has `perspective`.

```css
.container {
  perspective: 1000px;
}
```
```tsx
gsap.to(".card", {
  rotationY: 180,
  transformStyle: "preserve-3d"
});
```

## Special Properties

### `autoAlpha`
Combines `opacity` and `visibility`. 
- `autoAlpha: 0` sets `opacity: 0` AND `visibility: hidden`.
- `autoAlpha: 1` sets `opacity: 1` AND `visibility: visible`.
This improves performance by removing hidden elements from the rendering pipeline.

```tsx
// Better than opacity: 0
gsap.set(".popup", { autoAlpha: 0 });
gsap.to(".popup", { autoAlpha: 1 });
```

### `clearProps`
Removes inline styles applied by GSAP after animation ends.

```tsx
gsap.to(".box", {
  x: 100,
  clearProps: "all" // or "x,transform"
});
```
