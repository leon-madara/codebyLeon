# GSAP Timelines

Timelines allow you to sequence multiple animations, control them as a group, and manage complex choreography without calculating delays manually.

## Creating a Timeline

```tsx
const tl = gsap.timeline();

tl.to(".box", { x: 100 })
  .to(".circle", { y: 100 }) // Runs after previous tween ends
  .to(".triangle", { rotation: 360 }); // Runs after circle ends
```

## Timeline Parameters
You can pass a configuration object to the `timeline()` constructor.

```tsx
const tl = gsap.timeline({
  repeat: -1,
  repeatDelay: 1,
  yoyo: true,
  defaults: { 
    duration: 1, 
    ease: "power1.inOut" 
  } // Applied to all children
});
```

## The Position Parameter
The secret weapon of timelines. It controls precisely **when** an animation starts.

| Value | Meaning |
| :--- | :--- |
| `1` | Absolute time: Start at 1 second. |
| `"<"` | Start at the **same time** as the PREVIOUS tween. |
| `">"` | Start **after** the PREVIOUS tween ends (default behavior). |
| `"+=1"` | Start 1 second **after** the PREVIOUS tween ends. |
| `"-=0.5"` | Start 0.5 seconds **before** the PREVIOUS tween ends (overlap). |
| `"<50%"` | Start when the PREVIOUS tween is 50% done. |

**Example:**
```tsx
const tl = gsap.timeline();

tl.to(".first", { x: 100 })
  .to(".second", { x: 100 }, "<") // Runs WITH .first
  .to(".third", { x: 100 }, "+=0.5"); // Runs 0.5s after .second ends
```

## Controlling Timelines
You have full control over playback.

```tsx
tl.play();
tl.pause();
tl.reverse();
tl.restart();
tl.timeScale(2); // Double speed
tl.seek(1.5); // Jump to 1.5 seconds
```

## React Example

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function IntroSequence() {
  const container = useRef(null);
  
  // Store timeline in a ref if you need to control it externally
  const tlRef = useRef<gsap.core.Timeline>();

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(".header", { opacity: 0, y: -50 })
      .from(".sub-text", { opacity: 0 }, "-=0.2")
      .from(".button", { scale: 0, ease: "back.out" }, "-=0.1");

    tlRef.current = tl;
  }, { scope: container });

  return (
    <div ref={container}>
      <h1 className="header">Welcome</h1>
      <p className="sub-text">To the future</p>
      <button className="button" onClick={() => tlRef.current?.reverse()}>
        Reverse
      </button>
    </div>
  );
}
```
