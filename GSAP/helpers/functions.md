# Helper Functions

These are common custom functions often shared in the GSAP community.

## Horizontal Loop
Creates a seamless infinite loop of elements (like a marquee). 
Check the [GSAP Docs](https://gsap.com/docs/v3/HelperFunctions#horizontal-loop) for the full helper code, as it is quite long.

## ScrollTo (Native Alternative)
If you don't use ScrollToPlugin but want simple scrolling:
```tsx
function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if(el) el.scrollIntoView({ behavior: 'smooth' });
}
```
