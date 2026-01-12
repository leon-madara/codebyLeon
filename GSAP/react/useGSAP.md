# React & useGSAP

The `@gsap/react` package is the official integration layer.

## The `useGSAP` Hook

### Why use it?
1. **Cleanup**: Automatically reverts animations and kills ScrollTriggers when component unmounts.
2. **Context Safe**: Works with `contextSafe()` for interaction event handlers.
3. **Scoping**: Efficiently selects descendants without `querySelector`.

### Basic Signature
```tsx
useGSAP((context, contextSafe) => {
  // GSAP Code here
  // runs on mount (like useEffect)
}, { 
  scope: containerRef, // Scoping root
  dependencies: [var1] // Re-run when these change
});
```

### Context Safe
If you create animations **outside** of the main `useGSAP` callback (e.g., in an `onClick` handler), they are **not** automatically cleaned up. Use `contextSafe` to wrap them.

```tsx
const { contextSafe } = useGSAP({ scope: container });

const onClick = contextSafe(() => {
  gsap.to(".box", { x: 100 });
});

return <button onClick={onClick}>Animate</button>;
```

### Dependency Array
Just like `useEffect`. If you update state that affects the animation setup, add it to the dependency array.

> [!WARNING]
> Be careful! Re-running `useGSAP` will kill and recreate everything inside. If you have a timeline, it restarts.

### Proper Reference Cleanup
If you need to access a timeline outside the hook, use a ref.

```tsx
const tl = useRef();

useGSAP(() => {
  tl.current = gsap.timeline()
    .to(".box", { x: 100 });
}, { scope: container });

// Can access tl.current elsewhere
```
