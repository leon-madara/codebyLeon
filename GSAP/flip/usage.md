# Flip Plugin

The Flip plugin helps you animate layout changes seamlessly. It follows the "FLIP" technique: **F**irst, **L**ast, **I**nvert, **P**lay.

It effectively records the state of elements, allows you to change the DOM (reparenting, changing classes, resizing), and then instantly animates the elements from their old position to the new one.

## Setup

```tsx
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);
```

## Basic Usage

1. **Get State**: Record the current state of elements.
2. **Change State**: Apply your DOM changes (change classes, appendChild to new container, etc.).
3. **Animate**: Call `Flip.from(state)`.

```tsx
const boxes = gsap.utils.toArray(".box");

// 1. Capture State
const state = Flip.getState(boxes);

// 2. Make Layout Changes
container.classList.toggle("flex-row");
container.classList.toggle("flex-column");

// 3. Animate
Flip.from(state, {
  duration: 1,
  ease: "power1.inOut",
  absolute: true, // Crucial for smooth layout transitions
  stagger: 0.1,
  onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1 }),
  onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0 })
});
```

## React Example

Use `useGSAP` context or refs to manage state cleanly.

```tsx
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(Flip);

export function FlipLayout() {
  const [layout, setLayout] = useState('row');
  const container = useRef(null);

  useGSAP(() => {
    // We don't typically put Flip.getState() inside useGSAP if it's tied to a state change re-render.
    // In React, layout changes happen via state updates.
    // However, Flip works best when you capture state BEFORE the update, and animate AFTER.
    
    // For simple cases in React, `useLayoutEffect` or `useGSAP` with a dependency might work,
    // but often we need to capture state *before* the DOM updates.
    
    // A common pattern is using a custom hook or capturing in the event handler.
  }, { scope: container });

  const toggleLayout = () => {
    const boxes = gsap.utils.toArray(".box");
    const state = Flip.getState(boxes);
    
    // Trigger React State Change (which updates DOM)
    setLayout(prev => prev === 'row' ? 'column' : 'row');
    
    // Wait for DOM to update, then Flip
    // In standard React, this might require a flushSync or a useEffect hook that listens to `layout`.
  };
  
  // React-Specific Pattern using useLayoutEffect (internal to useGSAP)
  useGSAP(() => {
    // This runs after every render.
    // Ideally, you'd store the 'previous' state in a ref and compare?
    // Actually, simple Flip usage in React usually involves:
    // 1. Capture state in the event handler.
    // 2. Update state.
    // 3. useGSAP (or useLayoutEffect) runs after render, calling Flip.from(state).
  }, [layout]); 
  
  // BETTER REACT PATTERN:
  const stateRef = useRef();
  
  const handleClick = () => {
    stateRef.current = Flip.getState(".box");
    setLayout(prev => prev === 'row' ? 'column' : 'row');
  };
  
  useGSAP(() => {
    if (stateRef.current) {
      Flip.from(stateRef.current, {
        duration: 1,
        ease: "power1.out",
        absolute: true
      });
      stateRef.current = null;
    }
  }, [layout]); // Run when layout changes

  return (
    <div className={`container ${layout}`} ref={container}>
      <div className="box">A</div>
      <div className="box">B</div>
      <button onClick={handleClick}>Toggle</button>
    </div>
  );
}
```
