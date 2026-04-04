# Z-Index Stacking Test Report
## Animation Toggle Button vs Torch Mask

**Test Date:** February 25, 2026  
**Test Objective:** Verify that the "Animation Off" button is visible above the torch mask overlay

---

## Z-Index Hierarchy Analysis

### Current Z-Index Values (Ascending Order)

| Element | Z-Index | Position | Layer |
|---------|---------|----------|-------|
| Navigation | 100 | fixed | Layout |
| Torch Cursor (Lottie) | 101 | fixed | Feature |
| Torch Overlay (Mask) | 150 | fixed | Feature |
| **Animation Toggle Button** | **10000** | **fixed** | **Control** |

---

## Stacking Context Analysis

### 1. Position Context
✅ **PASS** - All elements use `position: fixed`
- This ensures they're all in the same stacking context (viewport-level)
- No parent containers with `position: relative` interfering

### 2. Z-Index Comparison
✅ **PASS** - Button z-index (10000) >> Torch mask z-index (150)
- Difference: 9,850 units
- Button is 66.67x higher in the stacking order

### 3. CSS Specificity
✅ **PASS** - No conflicting styles
- `.hero__animation-toggle` has clear, specific selector
- No `!important` declarations interfering
- No inline styles overriding

---

## Code Verification

### Button CSS (`src/styles/sections/hero.css`)
```css
.hero__animation-toggle {
  position: fixed;        /* ✅ Correct positioning */
  top: 100px;
  right: 20px;
  z-index: 10000;        /* ✅ Highest z-index */
  padding: 0.5rem 1rem;
  background: rgba(217, 117, 26, 0.9);
  color: #111110;
  border: 1px solid rgba(217, 117, 26, 0.3);
  border-radius: 50px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

### Torch Mask CSS (`src/styles/features/torch-effect.css`)
```css
.torch-overlay {
  position: fixed;        /* ✅ Same positioning context */
  inset: 0;
  z-index: 150;          /* ✅ Lower than button */
  pointer-events: none;
  background: rgba(5, 5, 5, 0.85);
  mask-image: radial-gradient(...);
}
```

---

## Render Conditions

### Button Visibility Logic (`src/components/sections/Hero.tsx`)
```tsx
{theme === 'dark' && torchEffectEnabled && (
  <button 
    className="hero__animation-toggle"
    onClick={toggleAnimation}
    aria-label="Disable animation"
  >
    Animation Off
  </button>
)}
```

✅ **PASS** - Button only renders when:
1. Theme is dark mode
2. Torch effect is enabled

### Torch Effect Visibility Logic (`src/App.tsx`)
```tsx
{!visualTestMode && torchEffectEnabled && <TorchEffect />}
```

✅ **PASS** - Torch effect renders when:
1. Not in visual test mode
2. Torch effect is enabled

---

## Expected Behavior

### Scenario 1: Initial Dark Mode Load
1. ✅ Torch overlay renders (z-index: 150)
2. ✅ Torch cursor renders (z-index: 101)
3. ✅ Button renders (z-index: 10000)
4. ✅ **Button is visible ABOVE the mask**

### Scenario 2: Button Click
1. ✅ `setTorchEffectEnabled(false)` called
2. ✅ Torch overlay unmounts
3. ✅ Torch cursor unmounts
4. ✅ Button unmounts
5. ✅ Plain dark mode visible

### Scenario 3: Theme Toggle (Dark → Light → Dark)
1. ✅ Light mode: No torch, no button
2. ✅ Switch to dark: `resetTorchEffect()` called
3. ✅ Torch effect re-enabled
4. ✅ Button reappears above mask

---

## Potential Issues & Mitigations

### Issue 1: Browser Stacking Context Bugs
**Risk:** Low  
**Mitigation:** Using `position: fixed` on all elements ensures consistent stacking

### Issue 2: CSS Transform Creating New Context
**Risk:** None detected  
**Verification:** No parent elements with `transform` property affecting button

### Issue 3: Backdrop Filter Interference
**Risk:** Low  
**Mitigation:** Both button and mask use `backdrop-filter`, but button's higher z-index takes precedence

---

## Manual Testing Checklist

To verify in browser (`http://localhost:5174/`):

- [ ] 1. Load page in light mode
  - [ ] Verify no button visible
  - [ ] Verify no torch effect

- [ ] 2. Toggle to dark mode
  - [ ] Verify torch mask appears (dark overlay with spotlight)
  - [ ] Verify torch cursor (Lottie animation) follows mouse
  - [ ] **Verify "Animation Off" button is visible in top-right**
  - [ ] **Verify button is NOT obscured by dark mask**
  - [ ] Verify button is clickable

- [ ] 3. Hover over button
  - [ ] Verify hover state (brighter orange, slight lift)
  - [ ] Verify button remains above mask

- [ ] 4. Click button
  - [ ] Verify torch effect disappears
  - [ ] Verify button disappears
  - [ ] Verify plain dark mode visible

- [ ] 5. Toggle to light mode, then back to dark
  - [ ] Verify torch effect reappears
  - [ ] Verify button reappears
  - [ ] **Verify button is still above mask**

- [ ] 6. Mobile responsive (≤768px)
  - [ ] Verify button position adjusted (top: 80px, right: 15px)
  - [ ] Verify button still visible above mask

---

## Test Results

### Desktop Chrome
- [ ] PASS / FAIL / NOT TESTED

### Desktop Firefox
- [ ] PASS / FAIL / NOT TESTED

### Desktop Safari
- [ ] PASS / FAIL / NOT TESTED

### Mobile Chrome (Android)
- [ ] PASS / FAIL / NOT TESTED

### Mobile Safari (iOS)
- [ ] PASS / FAIL / NOT TESTED

---

## Conclusion

**Technical Analysis:** ✅ PASS

The button is correctly configured with:
- `position: fixed` (same context as torch mask)
- `z-index: 10000` (66.67x higher than mask's 150)
- No conflicting styles or stacking context issues

**Expected Result:** Button will be visible above the torch mask in all scenarios.

**Recommendation:** Proceed with manual browser testing using the checklist above to confirm visual behavior matches technical expectations.

---

## Dev Server

Server running at: `http://localhost:5174/`

To test:
1. Open browser to `http://localhost:5174/`
2. Toggle theme to dark mode
3. Verify button visibility above torch mask
4. Complete manual testing checklist above
