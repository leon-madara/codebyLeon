# Mouse Trail Restoration Plan

## Issue Identified ❌

The mouse trail CSS (`src/styles/mouse-trail.css`) is **NOT imported** in the React app.

### Current State:
- ✅ CSS file exists: `src/styles/mouse-trail.css`
- ✅ Hook exists: `src/hooks/useMouseTrail.ts`
- ✅ Hook is called in `App.tsx`
- ❌ CSS is NOT imported anywhere in React app
- ⚠️ CSS only loaded in old `index.html` (which is now replaced)

### Expected Behavior:
- 1 main cursor dot (dark navy, 14px)
- 3 trailing dots with graduated sizes:
  - Dot 1: Blue (12px)
  - Dot 2: Purple (9px)
  - Dot 3: Coral/Peach (6px)

---

## Test Plan

### Test 1: Check CSS Import
```bash
# Search for mouse-trail.css import
grep -r "mouse-trail" src/
```

**Expected**: Should find import in `src/index.css` or `src/App.tsx`
**Actual**: ❌ Not found

### Test 2: Check Hook Initialization
```typescript
// In src/App.tsx
useMouseTrail(); // ✅ Called
```

**Status**: ✅ Hook is called

### Test 3: Visual Test (After Fix)
1. Run `npm run dev`
2. Move mouse on page
3. Should see:
   - Main cursor (dark navy, 14px)
   - 3 trailing dots (blue, purple, coral)
   - Smooth following motion
   - Dots coalesce when stationary

---

## Restoration Steps

### Step 1: Import CSS ✅
Add import to `src/index.css`:
```css
@import './styles/mouse-trail.css';
```

### Step 2: Verify Hook Configuration ✅
Check `useMouseTrail` hook has correct config:
- 3 trail elements
- Colors: blue, purple, coral
- Sizes: 12px, 9px, 6px
- Cursor: 14px

### Step 3: Create React Component (Optional)
Convert to proper React component for better control:
```typescript
<MouseTrail 
  trailCount={3}
  colors={['hsl(214, 90%, 59%)', 'hsl(262, 76%, 54%)', 'hsl(4, 96%, 79%)']}
  sizes={[12, 9, 6]}
/>
```

### Step 4: Test in Browser
- Visual verification
- Check console for errors
- Test smooth following
- Test coalescing behavior

---

## Implementation Plan

### Phase 1: Quick Fix (5 minutes)
1. Import CSS in `src/index.css`
2. Test in browser
3. Verify 4 dots appear

### Phase 2: React Component (15 minutes)
1. Create `src/components/MouseTrail/MouseTrail.tsx`
2. Create `src/components/MouseTrail/index.ts`
3. Convert hook to component
4. Add props for customization
5. Update `App.tsx` to use component

### Phase 3: Enhancement (Optional)
1. Add theme-aware colors
2. Add disable prop
3. Add custom cursor shapes
4. Add click effects

---

## Files to Modify

### Immediate Fix:
- `src/index.css` - Add CSS import

### React Component (Phase 2):
- `src/components/MouseTrail/MouseTrail.tsx` - New component
- `src/components/MouseTrail/MouseTrail.module.css` - Scoped styles
- `src/components/MouseTrail/index.ts` - Export
- `src/App.tsx` - Use component instead of hook

---

## Expected Result

After fix, moving mouse should show:
```
     🔵 ← Blue (12px, closest to cursor)
    🟣 ← Purple (9px, middle)
   🟠 ← Coral (6px, farthest)
  ⚫ ← Main cursor (14px, dark navy)
```

All dots should:
- Follow cursor smoothly
- Have graduated sizes
- Coalesce when mouse stops
- Respect `prefers-reduced-motion`

---

## Next Steps

1. ✅ Import CSS
2. ✅ Test in browser
3. ⏳ Create React component (optional)
4. ⏳ Add to component library
