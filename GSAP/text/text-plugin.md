# TextPlugin

TextPlugin allows you to animate the text content of an element, simulating typing or scrambling effects.

## Setup

```tsx
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);
```

## Basic Usage

### Typing Effect
Replaces content character by character.

```tsx
gsap.to(".desc", {
  text: "This is the new text content",
  duration: 2,
  ease: "none"
});
```

### Options
- `value`: The text string.
- `delimiter`: Separation character (default: ""). Set to " " to animate word-by-word.
- `padSpace`: If true, preserves space for the new text during animation.

```tsx
gsap.to(".desc", {
  text: {
    value: "Typewriter effect!",
    delimiter: "" 
  },
  duration: 2
});
```

## ScrambleTextPlugin (Club GSAP)
If you want the "hacker" random character decoding effect, use `ScrambleTextPlugin`.

```tsx
gsap.to(".code", {
  scrambleText: {
    text: "Access Granted",
    chars: "01",
    revealDelay: 0.5,
    tweenLength: false
  }
});
```
