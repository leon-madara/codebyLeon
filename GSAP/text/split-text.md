# SplitText (Club GSAP)

SplitText is a utility that splits HTML text into characters, words, and lines, wrapping them in `<div>` or `<span>` elements so they can be animated individually.

> [!IMPORTANT]
> This is a **Club GSAP** feature. It requires a paid membership.

## Setup

```tsx
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);
```

## Basic Usage

```tsx
const split = new SplitText(".headline", { type: "chars, words" });

// Animate characters
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.05,
  duration: 1
});
```

## Auto-Revert
If you need to restore the original text (e.g., for accessibility or responsiveness), call `revert()`.

```tsx
return () => {
  split.revert(); // Cleanup
}
```

## React Example

```tsx
import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

export function TypingHeader() {
  const container = useRef(null);

  useGSAP(() => {
    // Only works if you have the plugin installed!
    const split = new SplitText("h1", { type: "chars" });
    
    gsap.from(split.chars, {
      opacity: 0,
      rotateX: -90,
      stagger: 0.02
    });

    return () => split.revert();
  }, { scope: container });

  return (
    <div ref={container}>
      <h1>Animated Text</h1>
    </div>
  );
}
```
