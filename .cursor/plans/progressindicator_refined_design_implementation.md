# ProgressIndicator Refined Design Implementation Plan

## Design Specifications (Based on User Selections)

### 1. Color Mapping for "service-launch"
**Selected:** Choose any (will use logical progression)
- **PROBLEM (Step 1)**: `#09054D` (Dark Navy Blue) - Active
- **PLAN (Step 2)**: `#FD9F98` (Coral/Peach) - Completed
- **BUILD (Step 3)**: `#378AF4` (Sky Blue) - Completed  
- **LAUNCH (Step 4)**: `#702EE3` (Vibrant Purple) - Pending

### 2. Circle Sizes
- **Active**: `w-5 h-5` (20px)
- **Completed**: `w-4 h-4` (16px)
- **Pending**: `w-4 h-4` (16px, same as completed but hollow)

### 3. White Glow for Active Step
- **Thickness**: `ring-6` (thick)
- **Style**: Soft glow (blurred white shadow)
- **Color**: Semi-transparent white (`rgba(255, 255, 255, 0.8)` or `white/80`)

### 4. Completed Step Color Darkening
- **Method**: Apply 30% darkening factor programmatically

### 5. Label Text Styling
- **Approach**: Match circle color intensity (darker circles = darker text)

### 6. Gradient Line Behavior
- **Line to Pending**: Thin light grey line (no gradient fill)
- **Fill Animation**: Fill progressively as user scrolls

### 7. Responsive Scaling
- **Approach**: Proportional scaling (active/completed ratio maintained)
- **White Glow**: Scale down proportionally

### 8. Animation/Transitions
- **State Changes**: Smooth transitions (300-500ms) for all state changes
- **Active Circle**: Scale up with animation when becoming active

### 9. Background Track Line
- **Width**: Keep current reduced width (`w-[30%] md:w-[25%]`)

### 10. Implementation Strategy
- **Approach**: Build for "service-launch" only, then replicate to others

---

## Implementation Plan

### Phase 1: Color Utilities & Darkening Function

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx`

**Tasks**:
1. Create color darkening utility function (30% darker)
2. Implement color intensity calculation for labels
3. Map theme colors to "service-launch" steps

**Color Darkening Logic**:
- Convert hex to RGB
- Reduce each RGB value by 30%
- Convert back to hex
- Handle edge cases (very dark colors)

**Color Intensity for Labels**:
- Calculate relative brightness of circle color
- Apply same intensity to label text color
- Ensure sufficient contrast for readability

---

### Phase 2: Circle Marker Styling

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx`

**Tasks**:
1. Implement size variations based on state
2. Add white glow effect for active step
3. Create hollow circle style for pending step
4. Apply color darkening to completed steps

**Circle States**:
- **Active**: 
  - Size: `w-5 h-5` (20px)
  - Color: Full theme color
  - Glow: `ring-6` with soft blur, semi-transparent white
  - Animation: Scale up on activation
  
- **Completed**:
  - Size: `w-4 h-4` (16px)
  - Color: 30% darker than theme color
  - Outline: Thin white border (`border-2 border-white/80`)
  - No glow
  
- **Pending**:
  - Size: `w-4 h-4` (16px)
  - Style: Hollow (transparent fill)
  - Outline: Light grey border (`border-2 border-muted-foreground/30`)

---

### Phase 3: White Glow Implementation

**File**: `src/index.css` or inline styles

**Tasks**:
1. Create soft glow effect using CSS
2. Combine ring utility with shadow for blur
3. Ensure glow scales responsively

**Glow Implementation**:
- Use `ring-6` for base ring
- Add `shadow-lg` with white color for blur
- Apply `shadow-white/80` for semi-transparent effect
- Consider `drop-shadow` filter for additional softness

**CSS Approach**:
```css
/* Soft glow effect */
box-shadow: 
  0 0 0 6px rgba(255, 255, 255, 0.8),
  0 0 12px rgba(255, 255, 255, 0.6),
  0 0 24px rgba(255, 255, 255, 0.4);
```

---

### Phase 4: Label Styling with Color Intensity Matching

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx`

**Tasks**:
1. Calculate color intensity for each circle
2. Apply matching intensity to label text
3. Ensure text remains readable

**Label Color Logic**:
- Active: Full theme color (bright, high intensity)
- Completed: Darkened theme color (matches circle, lower intensity)
- Pending: Light grey (`text-muted-foreground/60`)

**Intensity Calculation**:
- Use relative luminance formula
- Map circle color brightness to text color
- Maintain minimum contrast ratio for accessibility

---

### Phase 5: Gradient Line Segments

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx`

**Tasks**:
1. Update gradient segment rendering
2. Implement thin grey line for pending connection
3. Ensure progressive filling animation

**Segment Types**:
- **Active → Completed**: Full gradient, progressive fill
- **Completed → Completed**: Full gradient, already filled
- **Completed → Pending**: Thin light grey line (no gradient fill)

**Line Styling**:
- Active segments: `h-1` (thicker, 4px)
- Pending connection: `h-0.5` (thinner, 2px), light grey color

---

### Phase 6: Animation & Transitions

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx` and `src/index.css`

**Tasks**:
1. Add smooth transitions for all state changes
2. Implement scale-up animation for active circle
3. Ensure progressive gradient fill animation

**Animation Specifications**:
- **State Transitions**: `transition-all duration-300 ease-out` (300ms)
- **Circle Scale**: `scale-110` with `transition-transform duration-300`
- **Gradient Fill**: `transition-all duration-500 ease-out` (500ms for smooth fill)
- **Color Changes**: `transition-colors duration-300`

**Active Circle Animation**:
- Initial: `scale-100`
- Active: `scale-110` with smooth transition
- Use `transform: scale()` for smooth animation

---

### Phase 7: Responsive Adjustments

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx`

**Tasks**:
1. Implement proportional scaling across breakpoints
2. Scale white glow proportionally
3. Maintain size ratios on all screen sizes

**Responsive Sizing**:
- **Mobile**: 
  - Active: `w-4 h-4` (16px)
  - Completed: `w-3 h-3` (12px)
  - Glow: `ring-4`
  
- **Tablet**: 
  - Active: `w-5 h-5` (20px)
  - Completed: `w-4 h-4` (16px)
  - Glow: `ring-5`
  
- **Desktop**: 
  - Active: `w-5 h-5` (20px)
  - Completed: `w-4 h-4` (16px)
  - Glow: `ring-6`

**Proportional Ratio**:
- Maintain 1.25:1 ratio (active:completed) across all breakpoints

---

### Phase 8: Component Structure Updates

**File**: `src/components/HorizontalScroll/ProgressIndicator.tsx`

**Tasks**:
1. Update marker data calculation with new sizing logic
2. Implement color darkening for completed steps
3. Add glow effect calculation
4. Update label color intensity matching

**Key Functions to Add**:
- `darkenColor(hex: string, percent: number): string`
- `calculateColorIntensity(hex: string): number`
- `getCircleSize(state: 'active' | 'completed' | 'pending', isMobile: boolean): string`
- `getGlowStyle(isActive: boolean, color: string, isMobile: boolean): object`

---

### Phase 9: CSS Updates

**File**: `src/index.css`

**Tasks**:
1. Update `.progress-marker-circle` styles
2. Add active state with glow effect
3. Add completed state with white outline
4. Add pending state with hollow style
5. Update label styles for color intensity matching

**New CSS Classes**:
- `.progress-marker-circle.active` - Large size, glow effect
- `.progress-marker-circle.completed` - Smaller size, white outline, darkened color
- `.progress-marker-circle.pending` - Hollow, grey outline
- `.progress-marker-label.active` - Full color intensity
- `.progress-marker-label.completed` - Matched color intensity
- `.progress-marker-label.pending` - Muted grey

---

### Phase 10: Testing & Refinement

**Test Cases**:
1. **Initial State (progress = 0)**:
   - PROBLEM: Active (large, bright, glow)
   - PLAN, BUILD, LAUNCH: Pending (hollow, grey)

2. **Step 1 Complete (progress = 0.33)**:
   - PROBLEM: Completed (smaller, darkened, white outline)
   - PLAN: Active (large, bright, glow)
   - BUILD, LAUNCH: Pending

3. **Step 2 Complete (progress = 0.66)**:
   - PROBLEM, PLAN: Completed (smaller, darkened)
   - BUILD: Active (large, bright, glow)
   - LAUNCH: Pending

4. **Step 3 Complete (progress = 1.0)**:
   - PROBLEM, PLAN, BUILD: Completed
   - LAUNCH: Active (large, bright, glow)

**Edge Cases**:
- Rapid progress changes (smooth animations)
- Responsive breakpoint transitions
- Color contrast accessibility
- Glow visibility on different backgrounds

---

## Implementation Sequence

1. **Step 1**: Create color utility functions (darkening, intensity)
2. **Step 2**: Update circle marker sizing and styling logic
3. **Step 3**: Implement white glow effect for active step
4. **Step 4**: Add color darkening for completed steps
5. **Step 5**: Update label styling with color intensity matching
6. **Step 6**: Refine gradient line segments (thin grey for pending)
7. **Step 7**: Add smooth animations and transitions
8. **Step 8**: Implement responsive scaling
9. **Step 9**: Update CSS classes
10. **Step 10**: Test and refine

---

## Success Criteria

- ✅ Active step is visually prominent (larger, brighter, white glow)
- ✅ Completed steps are smaller and progressively darker (30% darkening)
- ✅ Pending step is hollow with grey outline
- ✅ Labels match circle color intensity
- ✅ Gradient lines fill progressively
- ✅ Thin grey line connects to pending step
- ✅ Smooth animations for all state changes
- ✅ Proportional scaling across breakpoints
- ✅ White glow scales responsively
- ✅ All elements align with design reference images

---

## Files to Modify

1. **`src/components/HorizontalScroll/ProgressIndicator.tsx`**
   - Add color utility functions
   - Update marker data calculation
   - Implement size variations
   - Add glow effect logic
   - Update label color matching

2. **`src/index.css`**
   - Update `.progress-marker-circle` styles
   - Add active/completed/pending state styles
   - Add glow effect styles
   - Update label styles

---

## Notes

- Build specifically for "service-launch" section first
- Use theme colors: `#09054D`, `#FD9F98`, `#378AF4`, `#702EE3`
- Maintain existing segment-by-segment filling logic
- Ensure accessibility (color contrast, readable text)
- Test on multiple screen sizes and browsers
