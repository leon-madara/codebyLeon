# Staggers

Staggers allow you to animate a group of objects with a small delay between each one, creating a "wave" or "flow" effect.

## Grid Staggers
GSAP has an advanced grid stagger system that automatically calculates delays based on row/column position.

```tsx
gsap.to(".grid-item", {
  scale: 0.5,
  stagger: {
    grid: "auto", // Automatically detect grid size [rows, columns]
    from: "center", // "start", "end", "center", "edges", index number
    amount: 1, // Total time to split among all staggers
    axis: null, // "x" or "y" (optional)
    ease: "power1.inOut" // Ease of the distribution
  }
});
```

## Functional Staggers
You can pass a function to calculate values dynamically.

```tsx
gsap.to(".box", {
  y: 100,
  stagger: function(index, target, list) {
    // Custom logic
    return index * 0.1;
  }
});
```

## Advanced Stagger Options

| Property | Description |
| :--- | :--- |
| `amount` | Totally duration of logic for all elements combined. |
| `each` | Fixed time between each element start. |
| `from` | Where the wave starts: `"start"`, `"end"`, `"center"`, `"edges"`, or generic index. |
| `grid` | Array `[rows, columns]` or `"auto"`. |
| `axis` | If defined, limits stagger to `"x"` (rows) or `"y"` (columns). |

```tsx
// Ripple from edges inward
gsap.from(".tile", {
  scale: 0,
  stagger: {
    grid: "auto",
    from: "edges",
    amount: 1.5,
    ease: "power4.out"
  }
});
```
