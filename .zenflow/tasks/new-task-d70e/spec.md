# Technical Specification: Horizontal Scroll Refinement

## Task Difficulty
**Medium** - Requires careful GSAP ScrollTrigger configuration adjustments and potential state management changes.

## Technical Context
- **Language**: TypeScript/React
- **Framework**: React 18.3.1
- **Animation Library**: GSAP 3.14.2 with ScrollTrigger plugin
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS

## Problem Analysis

The horizontal scroll section (`MultiCardScrollSection.tsx`) implements a three-card horizontal scrolling experience where each card has 4 "beats" (story steps). Currently, there are two related issues:

1. **Premature Card Transition**: When scrolling through a card's beats, the scroll can transition to the next card before the last (4th) beat is fully visible
2. **Unrefined Snap Behavior**: The snap configuration doesn't ensure users see the complete final beat before moving to the next card section

### Current Implementation (Lines 116-249)

The ScrollTrigger setup:
- Uses `pin: true` to pin each card section during horizontal scroll
- `scrub: 0.5` for smooth scroll-linked animation
- `snap` configuration snaps to beat positions (`1 / (TOTAL_BEATS - 1)` = 1/3)
- `end` is calculated as `+=${scrollDistance}` where `scrollDistance = (TOTAL_BEATS - 1) * window.innerWidth * 0.8`

**Root Cause**: The snap points are at 0, 0.33, 0.66, and 1.0, but there's no enforcement that progress must reach 1.0 (100%) before unpinning and transitioning to the next card.

## Implementation Approach

### Solution: Enhanced ScrollTrigger End Calculation with Progress Threshold

Modify the ScrollTrigger configuration to:

1. **Extend the scroll distance** to ensure the last beat has adequate scroll space to become fully visible
2. **Adjust snap configuration** to include a final "hold" point at the end
3. **Add progress-based transition guard** to prevent premature card transitions

### Key Changes

#### 1. Extend Scroll Distance (Line 129)
```typescript
// Current
const scrollDistance = (TOTAL_BEATS - 1) * window.innerWidth * 0.8;

// New - Add extra space for the final beat
const scrollDistance = TOTAL_BEATS * window.innerWidth * 0.8;
```

**Rationale**: Adding one extra viewport width ensures the last beat has room to fully animate in and remain visible.

#### 2. Update Snap Configuration (Lines 142-147)
```typescript
// Current
snap: {
  snapTo: 1 / (TOTAL_BEATS - 1),
  duration: { min: 0.3, max: 0.8 },
  delay: 0.05,
  ease: 'power2.inOut',
}

// New
snap: {
  snapTo: (value) => {
    const snapPoints = Array.from({ length: TOTAL_BEATS }, (_, i) => i / (TOTAL_BEATS - 1));
    const closest = snapPoints.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    return closest;
  },
  duration: { min: 0.4, max: 1.0 },
  delay: 0.1,
  ease: 'power2.inOut',
}
```

**Rationale**: 
- Creates explicit snap points at 0, 0.33, 0.66, and 1.0
- Longer duration (max 1.0s vs 0.8s) makes snapping more deliberate
- Longer delay (0.1s vs 0.05s) requires more intentional scrolling before snap triggers

#### 3. Pin Spacing Adjustment
The current `pinSpacing: true` is correct but we should ensure proper spacing calculation.

#### 4. Optional: Add `onLeave` and `onLeaveBack` Guards
```typescript
scrollTrigger: {
  // ... existing config
  onLeave: (self) => {
    // Only allow leaving if we're at the last beat (progress ~= 1.0)
    if (self.progress < 0.95) {
      self.scroll(self.end * 0.95); // Snap to last beat position
    }
  },
}
```

## Files to Modify

1. **`src/components/HorizontalScroll/MultiCardScrollSection.tsx`** (Lines 116-249)
   - Update scroll distance calculation
   - Modify snap configuration
   - Optionally add transition guards

## Data Model / API Changes
None - This is purely a client-side animation refinement.

## Verification Approach

### Manual Testing
1. **Desktop Testing** (viewport > 900px):
   - Scroll through each card's 4 beats
   - Verify the last beat (4th beat) is fully visible and remains visible for a comfortable duration
   - Verify you cannot scroll to the next card until beat 4 is fully in view
   - Test with slow scrolling, fast scrolling, and scroll wheel
   - Verify snap behavior feels natural and not too aggressive

2. **Responsive Testing**:
   - Verify mobile view (< 900px) still works correctly (it uses a different layout without horizontal scroll)
   - Test at 900px breakpoint

3. **Cross-Browser Testing**:
   - Chrome/Edge (Chromium)
   - Firefox
   - Safari (if available)

### Automated Testing
- Run existing tests: `npm run test`
- Run build to ensure no TypeScript errors: `npm run build`

### Key Metrics to Verify
- Last beat visibility duration before transition
- Smooth snap behavior without jarring jumps
- No layout shift or visual glitches
- Consistent behavior across all three cards (Launch, Brand Refresh, Ongoing Support)

## Risk Assessment

**Low Risk**:
- Changes are isolated to animation configuration
- Mobile layout is unaffected
- No state management or data flow changes
- Easy to revert if issues arise

## Alternative Approaches Considered

1. **Hard Block Scrolling**: Prevent scroll events when not at last beat
   - **Rejected**: Too restrictive, poor UX
   
2. **Increase Pin Duration**: Simply extend the pin without changing snap
   - **Rejected**: Doesn't solve the snap precision issue

3. **Remove Snap Entirely**: Let users free-scroll
   - **Rejected**: Loses the polished, beat-aligned experience

## Success Criteria

- [ ] Users can see the complete 4th beat of each card before transitioning
- [ ] Snap behavior feels refined and intentional
- [ ] No regression in mobile view
- [ ] No TypeScript or build errors
- [ ] Smooth animation performance (60fps)
