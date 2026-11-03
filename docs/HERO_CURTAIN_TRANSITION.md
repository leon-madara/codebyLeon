# Hero Section Curtain-Lift Reveal & Typewriter Architecture

> **Branch:** `codex/codebyleon-alternate` (Next.js Alternate Branch)
> **Last Updated:** October 17, 2026
> **Target Audience:** Incoming AI coding agents and human engineers reviewing or extending the hero scroll transition.

---

## 1. Context & Purpose

### The Original Problem
Previously, scrolling past the hero section triggered a scroll-driven blur and fade-out (`opacity: 0`, `filter: blur()`). Because the hero section faded away before the next section reached the viewport, visitors experienced a noticeable visual "dead zone"—an awkward period during scrolling where the page appeared empty and content was adrift.

### The Design Goal
The user conceived a physical **"curtain lifting"** (or two-card stack) metaphor:
1. **Physical Stacking**: The hero section acts as the front card (`z-30`). Sitting directly behind it—stationary, already in position—is the `"Your Business Is Established"` section ([`RealityCheck`](../src/components/home/reality-check.tsx), `z-10`).
2. **Curtain Lift Animation**: When the user initiates a scroll, the front hero card lifts upward (`y: 0% -> -100%`), revealing the section sitting directly behind it.
3. **Finish-Before-Lift Typewriter**: If the headline word has not finished typing out when the user scrolls, the animation delays until the word finishes typing, and then lifts.
4. **Obsidian Assembly Particle FX**: Ambient floating motes/embers drift across the reveal space, then reduce and fade out $1/4$ into the lift as `"Your Business Is Established"` settles into crisp focus.
5. **Permanently Docked Capabilities Ticker**: The horizontal marquee ticker is docked permanently at the bottom of the viewport across the site, except on `/get-started.html`.

---

## 2. Key Components & File Map

| File Path | Role & Responsibilities |
| :--- | :--- |
| [`src/components/home/hero.tsx`](../src/components/home/hero.tsx) | Owns the front curtain card, the headline typewriter state machine, scroll interception/delay, curtain lift execution, and return-to-top lowering. |
| [`src/components/home/hero.module.css`](../src/components/home/hero.module.css) | Custom display fonts, headline text styles, `@keyframes blink` cursor, and multi-tier physical elevation shadows on `.heroCard`. |
| [`src/components/home/particle-canvas.tsx`](../src/components/home/particle-canvas.tsx) | Canvas 2D ambient particle system inspired by Obsidian Assembly. Generates a bounded field of 700�2800 fine grains with cubic fade out between $p = 0.25$ and $p = 0.70$. |
| [`src/app/page.tsx`](../src/app/page.tsx) | Layout composition: places `<Hero />` and `<RealityCheck />` directly at `<main>` root, and docks the fixed bottom `<CapabilityTicker />`. |
| [`src/components/home/capability-ticker.tsx`](../src/components/home/capability-ticker.tsx) | Marquee component with tightened padding (`py-2.5 sm:py-3`) for sleek bottom docking. |
| [`src/components/home/back-to-top.tsx`](../src/components/home/back-to-top.tsx) | Floats at `bottom-[calc(4rem+env(safe-area-inset-bottom))]` so it never overlaps the bottom ticker. |

---

## 3. Implementation Details & Architecture

### A. Headline Typewriter State Machine
The headline cycles through:
$$\text{"DRIVEN"} \longrightarrow \text{"GROWING"} \longrightarrow \text{"LOCAL"} \longrightarrow \text{"NEW"} \longrightarrow \text{"SMALL"} \longrightarrow \text{"DRIVEN"}$$

#### Bug Caught & Fixed
A previous implementation split `isDeleting`, `wordIndex`, and `typedWord` across independent React state hooks. When a word was cleared, calling `setIsDeleting(false)` triggered an immediate re-render whose effect cleanup cancelled the `setTimeout` intended to advance `wordIndex`. As a result, the loop was stuck endlessly retyping `"GROWING"`.

#### Current Pattern
Implemented as a **single-lifecycle recursive sequencer** inside a single `useEffect`:
- Uses local closure variables (`wordIdx`, `charIdx`, `isDeleting`) and a recursive `tick()` function with single `timer` tracking.
- Zero state synchronization race conditions; zero cascading re-renders.
- Holds complete words for `1800ms`, deletes at `45ms/char`, pauses `250ms` between words, and types forward at `85ms/char`.

### B. Scroll Delay & Completion Protocol
When the user attempts to scroll (via wheel, touch drag, down arrow, page down, space bar, or clicking the "Scroll" cue):
1. **Check Completion**: Inspects `isCompleteRef.current`.
2. **If Mid-Typing (`!isCompleteRef.current`)**:
   - Sets `pendingLiftRef.current = true`.
   - If it was deleting, it immediately reverses to typing forward.
   - Wakes up the sequencer via `tickRef.current?.()` and accelerates typing speed to `45ms/char`.
   - As soon as the final letter lands, it pauses `160ms` for visual legibility, then triggers `triggerCurtainLift()`.
   - Halts further typewriter deletion so the completed word remains cleanly displayed on the lifted card.
3. **If Already Completed (`isCompleteRef.current`)**:
   - Triggers `triggerCurtainLift()` immediately.

### C. Physical Stacking & Curtain Reveal
- **Front Card**: The `<Hero />` root element is `fixed inset-0 z-30` with `will-change: transform`.
- **Card Shadow**: Uses `.heroCard` with multi-tier box shadows:
  ```css
  .heroCard {
    border-bottom: 1px solid var(--border);
    box-shadow: 0 30px 65px -15px rgba(29, 25, 19, 0.22), 0 14px 28px -10px rgba(29, 25, 19, 0.14), 0 0 0 1px var(--border);
  }
  :global(.dark) .heroCard {
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow: 0 40px 85px -12px rgba(0, 0, 0, 0.85), 0 18px 36px -10px rgba(0, 0, 0, 0.65), 0 0 1px 1px rgba(255, 255, 255, 0.08);
  }
  ```
- **Stationary Background Card**: `<RealityCheck />` sits at `top: 0` (`min-height: 100svh`, flex-centered). When `<Hero />` translates up to `y: "-100%"`, `"Your Business Is Established"` is revealed stationary underneath.
- **Scroll Lock & Hand-off**:
  - While curtain is down (`!isLifted`), body scroll is locked (`overflow: hidden; overscroll-behavior: none`).
  - The body remains locked for the 1.8-second lift and a 700ms reading hold. It unlocks after wheel/key input has been quiet for 220ms and any initiating touch has ended. Direct section links bypass this hold.
- **Return to Top**:
  - If the user scrolls back to the very top (`window.scrollY <= 0`) and performs an intentional scroll-up gesture (`deltaY < -20` or touch drag down $> 25\text{px}$), or clicks `#top`, `lowerCurtain()` slides the curtain back down and re-engages scroll lock.

### D. Obsidian Assembly Particles
- Located in [`src/components/home/particle-canvas.tsx`](../src/components/home/particle-canvas.tsx).
- Positioned at `fixed inset-0 z-20` (between `RealityCheck` at `z-10` and `Hero` at `z-30`).
- Progress $p \in [0, 1]$ drives opacity:
  $$I(p) = \begin{cases} 1 & p \le 0.25 \\ 0 & p \ge 0.70 \\ 1 - t^2(3 - 2t) \quad \text{where } t = \frac{p - 0.25}{0.45} & 0.25 < p < 0.70 \end{cases}$$

---

## 4. Verification & Testing

### Verification Checklist
- [x] ESLint runs clean: `node node_modules/eslint/bin/eslint.js src/components/home/hero.tsx src/app/page.tsx` (0 errors, 0 warnings).
- [x] Typewriter cycles continuously through all 5 words without stopping on `"GROWING"`.
- [x] Initiating scroll mid-word finishes typing before lifting curtain.
- [x] `"Your Business Is Established"` appears stationary behind the lifted card.
- [x] Bottom capability ticker is permanently docked across home page and absent on `/get-started.html`.
- [x] Reduced motion preference (`prefers-reduced-motion`) falls back gracefully to a static card.

### Automated Test Scripts
Scripts in `<appDataDir>/brain/<conversation-id>/scratch/`:
- `test_comprehensive.js`: Validates all 5 words cycle, simulates mid-word scroll delay, captures screenshots, and asserts visibility of revealed elements.
- Run command:
  ```powershell
  $env:NODE_PATH="C:\Users\Leon Madara\AppData\Local\npm-cache\_npx\e41f203b7505f1fb\node_modules"
  node "<appDataDir>/brain/<conversation-id>/scratch/test_comprehensive.js"
  ```

---

## 5. Potential Improvements & Review Recommendations for Next Agent

1. **Mobile Safari Elastic Overscroll**:
   - On iOS Safari, elastic bounce at `scrollY = 0` can sometimes emit negative `deltaY` touch movements. Consider adding a small debounce timer (~300ms) before allowing `lowerCurtain()` right after a user has scrolled back up from lower sections.
2. **GSAP ScrollTrigger Refresh Sync**:
   - When the curtain lifts and unlocks `overflow`, check if `ScrollTrigger.refresh()` should be called once the 1.8s lift transition completes to ensure horizontal pinning in `RealityCheck` has exact pixel coordinates on dynamic-height viewports.
3. **Custom Timing Tuning**:
   - Review typewriter hold duration (`1800ms`) and finish-acceleration speed (`45ms/char`) against user feel in real-world browsing sessions.
4. **Hero Parallax Polish (Optional)**:
   - If desired, explore applying a slight negative parallax translation (`y: "-15%"`) or subtle brightness shift to the background card (`RealityCheck`) while the foreground curtain is lifting, emphasizing the physical 3D separation between the two layers.


## October 17 repair follow-up

The original checklist above records the earlier implementation's claims. The repair pass found and addressed:

- `npm run dev` used Unix `tee` under Windows cmd.exe. It now runs `next dev --webpack -p 3000`; output stays in the terminal. The explicit port-3105 command remains available in `ALTERNATE_BRANCH.md`.
- Next.js 16.4 blocks dev assets for `127.0.0.1` unless that hostname is allowed. The local loopback hostname is now included alongside the existing development origin.
- Returning to the hero now restarts the sequencer, clears pending lift state and particle frames, resets the document and card scroll positions, and restores scroll locking. The lifted card is inert and hidden from assistive technology.
- Repeated scroll events no longer continually wake the finish-typing timer. Keyboard interception ignores interactive controls and modifier keys; Enter retains normal button/link behaviour. Mobile navigation is exempt while open, and anchor handling uses capture so existing section handlers can take over after unlocking.
- The scroll cue follows the content above the ticker. Short desktop heights use a smaller headline and tighter spacing; tall mobile content can scroll inside the card.
- The particle canvas no longer combines conflicting absolute/fixed and z-index utilities, and unmounts after fading. Outstanding animation frames are cancelled on return/unmount.
- Section indicators now use viewport geometry rather than nested offsetTop values and refresh when curtain state changes.

Verification from this repair pass is recorded in the Task Observer report. Full-project TypeScript checking still reports missing socket.io modules in the websocket examples and an unreachable nullish-coalescing expression in configurator.tsx; these are outside the curtain change.

### Controlled exit timing

The upward exit now takes 1.8 seconds with cubic-bezier(0.65, 0, 0.35, 1): a gentle start, controlled travel and a soft stop. Particle timing uses the same duration. The return retains its existing 1.05-second timing. Browser travel samples confirmed gradual acceleration and completion, followed by a successful return to top 0 with body scroll locked. Focused hero ESLint passed.


### Approved particle veil and scroll hold

The current implementation supersedes the earlier sparse ember treatment and immediate-unlock behaviour:

- Canvas 2D draws 700�2800 small neutral grains over a theme-aware translucent surface, between Reality Check and the rising curtain. It mounts only during the lift and unmounts after fading.
- The field starts thinning at 25% of the lift and fades by 95%, revealing crisp content without changing its position.
- Body scrolling stays locked through the 1.8-second lift and a 700ms hold. Continuing wheel/key events and active touches extend the lock until the gesture settles; a subsequent gesture scrolls normally.
- Same-page section navigation bypasses the hold so existing destination handlers can run. Back-to-top cancels the release timer and resets the reveal. Unmount clears both animation and release work. Reduced motion retains the static layout.
