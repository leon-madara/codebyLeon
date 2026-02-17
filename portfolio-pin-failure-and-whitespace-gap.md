# Portfolio Pin Not Working + White Space — Root Cause Analysis & Fix Plan

## Your Requirements (Restated)

1. **Pin the Portfolio section** (`#portfolio`, `.portfolio`) for **20vh of scroll distance** so users can see and settle on the content before scrolling past.
2. **Snap at the top** — the section should align cleanly to the viewport top when it arrives.
3. Investigate **why the GSAP pin isn't working** and whether the Hero's GSAP is interfering.
4. Investigate the **white space** on the page (likely caused by the curtain effect).
5. Consider a **CSS-only approach** for the pin instead of GSAP, to avoid the conflict entirely.

---

## Root Cause Analysis

### Problem 1: Portfolio GSAP Pin Not Working

The pin is *technically active* — GSAP does create a `pin-spacer` wrapper and sets `position: fixed` on the Portfolio section. **But it fights with the Hero's curtain animation.**

Here's the conflict flow:

1. **Hero** has a `ScrollTrigger` that pins itself for `700%` of viewport scroll.
2. During its scrub timeline, the Hero **reaches directly into `#portfolio`** and animates it:
   ```javascript
   gsap.set('#portfolio', { zIndex: 10, position: 'relative' });
   tl.fromTo('#portfolio', { y: 0 }, { y: -window.innerHeight }, ">+=0.2");
   ```
3. This manually sets `transform: translateY(-100vh)` on Portfolio.
4. Portfolio's **own** `ScrollTrigger.create({ pin: true })` also tries to manage transforms on the same element.
5. Two GSAP instances fighting over the same element's transforms = broken behavior.

**Key issue:** When GSAP creates a pin, it wraps the element in a `pin-spacer` div and manages `transform` internally. The Hero's timeline also sets `transform` on the same element — they conflict.

### Problem 2: White Space

The `pin-spacer` that GSAP creates around `#portfolio` is **7,560px tall** (should be ~1,300px).

**Why:** The pin-spacer height is calculated when `ScrollTrigger.create()` runs. At that point, the Portfolio element's position is affected by the Hero's 700% pin-spacer above it. The calculations compound, producing a massive gap.

---

## Proposed Fix: CSS-Only Pin via `position: sticky`

Using CSS `position: sticky` completely sidesteps the GSAP transform conflict — it's handled by the browser compositor, not JS transforms.

### Files to modify:

1. **Portfolio.tsx** — Remove the GSAP pin `useGSAP` block and unused imports.
2. **portfolio.css** — Add `position: sticky; top: 0;` to `.portfolio`, wrap in a container for the 20vh hold.
3. **Hero.tsx** — Adjust the curtain effect target if needed (sticky elements interact differently with `translateY`).
