# Scroll Smoothing

Smooth scrolling enables a modernized, high-end feel where the page content flows with momentum.

## Option 1: ScrollSmoother (Official, Paid)
**Requires Club GSAP Membership (`gsap-bonus` package).**

ScrollSmoother is the official GSAP plugin. It is built to work perfectly with ScrollTrigger and offers the best performance and features (like effects).

### Features
- Native scroll integration (no "scroll-jacking" issues).
- Accessible.
- Easy parallax effects with `data-speed` and `data-lag`.

### Setup
```tsx
import { useGSAP } from '@gsap/react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollSmoother);

export function App() {
  useGSAP(() => {
    ScrollSmoother.create({
      smooth: 1, // 1 second to catch up
      effects: true, // Enable data-speed/data-lag
    });
  });

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {/* Your App Content */}
      </div>
    </div>
  );
}
```

## Option 2: Lenis (Free, Popular)
**Recommended if you do not have Club GSAP.**

Lenis is a popular, free smooth scrolling library that works excellently with GSAP.

### Setup with GSAP
You must synchronize Lenis with GSAP's ticker to ensure animations stay perfectly in sync with the smooth scroll.

**Installation:**
`npm install lenis @gsap/react`

**Implementation:**
```tsx
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScrollLayout({ children }) {
  useEffect(() => {
    const lenis = new Lenis();

    // Synchronize Lenis scroll with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Lenis requires ms
    });

    // Disable GSAP's internal lag smoothing for better sync
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Cleanup
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```
