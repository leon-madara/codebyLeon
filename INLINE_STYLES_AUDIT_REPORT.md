# Inline Styles Audit Report

**Generated:** 2026-02-09T23:41:34.166Z

## Summary

- **Total TSX/JSX Files Scanned:** 52
- **Files with Inline Styles:** 17
- **Total Inline Style Attributes:** 21
- **Static Styles (hardcoded values):** 0 (0.0%)
- **Dynamic Styles (computed values):** 0 (0.0%)

## Baseline Count

**21** inline style attributes found across 17 files.

This baseline will be used to measure the 90% reduction target (Requirement 9.1).

## By File

- **src\components\SafeImage.tsx**: 3 inline styles
- **src\components\HorizontalScroll\beats\card1\LaunchBeat.tsx**: 2 inline styles
- **src\components\HorizontalScroll\beats\card3\SuccessBeat.tsx**: 2 inline styles
- **src\components\TorchEffect.tsx**: 1 inline styles
- **src\components\HorizontalScroll\WaveDivider.tsx**: 1 inline styles
- **src\components\HorizontalScroll\ServiceTabs.tsx**: 1 inline styles
- **src\components\HorizontalScroll\ProgressIndicator.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card2\TransformationBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card2\StrategyBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card2\ProcessBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card2\OutdatedBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card1\ProblemBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card1\PlanBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card1\BuildBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card3\WorkflowBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card3\ModelBeat.tsx**: 1 inline styles
- **src\components\HorizontalScroll\beats\card3\BottlenecksBeat.tsx**: 1 inline styles

## By Type

- **Pure Static:** 0 (should be converted to CSS classes)
- **Pure Dynamic:** 0 (should use CSS custom properties)
- **Mixed (static + dynamic):** 0 (requires case-by-case analysis)

## Detailed Occurrences

### src\components\TorchEffect.tsx

**Line 118** [MIXED]
```tsx
style={{
                    '--cursor-x': `${mousePos.x}
```
Properties: 

### src\components\SafeImage.tsx

**Line 71** [MIXED]
```tsx
style={style}
```
Properties: 

**Line 87** [MIXED]
```tsx
style={style}
```
Properties: 

**Line 105** [MIXED]
```tsx
style={style}
```
Properties: 

### src\components\HorizontalScroll\WaveDivider.tsx

**Line 13** [MIXED]
```tsx
style={{ '--wave-transform': isTop ? 'rotate(180deg)' : 'none' }
```
Properties: 

### src\components\HorizontalScroll\ServiceTabs.tsx

**Line 28** [MIXED]
```tsx
style={{
                    '--tab-bg-color': index === 0 ? 'hsl(145, 40%, 35%)' : 
                    ...}
```
Properties: 

### src\components\HorizontalScroll\ProgressIndicator.tsx

**Line 61** [MIXED]
```tsx
style={{
                      '--progress-width': index < currentBeat
                        ? '100%'
...}
```
Properties: 

### src\components\HorizontalScroll\beats\card2\TransformationBeat.tsx

**Line 50** [MIXED]
```tsx
style={{ '--animation-delay': `${0.5 + i * 0.1}
```
Properties: 

### src\components\HorizontalScroll\beats\card2\StrategyBeat.tsx

**Line 25** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.15}
```
Properties: 

### src\components\HorizontalScroll\beats\card2\ProcessBeat.tsx

**Line 33** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.2}
```
Properties: 

### src\components\HorizontalScroll\beats\card2\OutdatedBeat.tsx

**Line 21** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.1}
```
Properties: 

### src\components\HorizontalScroll\beats\card1\ProblemBeat.tsx

**Line 21** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.1}
```
Properties: 

### src\components\HorizontalScroll\beats\card1\PlanBeat.tsx

**Line 25** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.15}
```
Properties: 

### src\components\HorizontalScroll\beats\card1\LaunchBeat.tsx

**Line 36** [MIXED]
```tsx
style={{ '--animation-delay': `${0.3 + i * 0.15}
```
Properties: 

**Line 54** [MIXED]
```tsx
style={{ '--animation-delay': `${0.5 + i * 0.1}
```
Properties: 

### src\components\HorizontalScroll\beats\card1\BuildBeat.tsx

**Line 33** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.2}
```
Properties: 

### src\components\HorizontalScroll\beats\card3\WorkflowBeat.tsx

**Line 33** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.2}
```
Properties: 

### src\components\HorizontalScroll\beats\card3\SuccessBeat.tsx

**Line 28** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.15}
```
Properties: 

**Line 51** [MIXED]
```tsx
style={{ '--animation-delay': `${0.5 + i * 0.1}
```
Properties: 

### src\components\HorizontalScroll\beats\card3\ModelBeat.tsx

**Line 25** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.15}
```
Properties: 

### src\components\HorizontalScroll\beats\card3\BottlenecksBeat.tsx

**Line 21** [MIXED]
```tsx
style={{ '--animation-delay': `${i * 0.1}
```
Properties: 

## Recommendations

### Static Styles (Task 25.2)
Convert static inline styles to CSS classes:
- Extract hardcoded values to appropriate CSS files
- Replace `style={{...}}` with `className="..."`
- Use existing component CSS files or create new ones as needed

### Dynamic Styles (Task 25.3)
Convert dynamic inline styles to CSS custom properties:
- Define CSS rules using custom properties: `animation-delay: var(--delay)`
- Set custom properties via inline styles: `style={{ "--delay": `${index * 100}ms` }}`
- This maintains dynamic behavior while centralizing styling logic
