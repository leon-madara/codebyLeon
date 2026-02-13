# Baseline Metrics Collection Guide

This guide explains how to collect and compare baseline metrics for the CSS architecture refactor.

## Overview

We collect two types of metrics:

1. **CSS Bundle Metrics** - File-based metrics (bundle size, parsing time)
2. **Lighthouse Metrics** - Browser-based metrics (FCP, render-blocking time)

## Prerequisites

### For CSS Bundle Metrics
- No prerequisites - works out of the box

### For Lighthouse Metrics
1. Install Lighthouse globally:
   ```bash
   npm install -g lighthouse
   ```

2. Make sure Chrome/Chromium is installed

3. Start your development server:
   ```bash
   npm run dev
   ```

## Collecting Baseline Metrics

### Step 1: Collect CSS Bundle Baseline

Run this **before** starting the refactoring:

```bash
npx tsx src/test/css-utils/collect-baseline.ts
```

This will:
- Scan all CSS files in `src/styles/`
- Calculate total bundle size (raw and gzipped)
- Measure CSS parsing time
- Save baseline to `src/test/css-utils/baseline-metrics.json`

**Output Example:**
```
✅ Baseline metrics collected successfully!

# CSS Metrics Report

Generated: 2024-02-10T12:00:00.000Z

## Bundle Size

- Total Size: 150.5 KB
- Gzipped Size: 45.2 KB
- File Count: 15

## Performance

- CSS Parsing Time: 125.50ms
```

### Step 2: Collect Lighthouse Baseline

Run this **before** starting the refactoring (with dev server running):

```bash
npx tsx src/test/css-utils/collect-lighthouse-baseline.ts
```

Or specify a custom URL:

```bash
npx tsx src/test/css-utils/collect-lighthouse-baseline.ts http://localhost:3000
```

This will:
- Run Lighthouse performance audit
- Measure First Contentful Paint (FCP)
- Measure render-blocking time
- Calculate performance score
- Save baseline to `src/test/css-utils/lighthouse-metrics.json`

**Output Example:**
```
✅ Baseline Lighthouse metrics collected successfully!

# Lighthouse Performance Metrics

Generated: 2024-02-10T12:00:00.000Z

## Current Metrics

- First Contentful Paint: 850ms
- Render-Blocking Time: 120ms
- Performance Score: 92/100
```

## Comparing Metrics After Refactoring

### Compare CSS Bundle Metrics

Run this **after each refactoring phase**:

```bash
npx tsx src/test/css-utils/compare-metrics.ts
```

This will:
- Collect current CSS metrics
- Compare with baseline
- Show percentage changes
- Indicate if targets are met

**Output Example:**
```
📊 Metrics Comparison

═══════════════════════════════════════════════════

Bundle Size:
  Baseline:  150.5 KB
  Current:   97.83 KB
  Change:    52.67 KB (35.00%)
  ✅ Target achieved: 30-40% reduction

Gzipped Size:
  Baseline:  45.2 KB
  Current:   29.38 KB
  Change:    15.82 KB (35.00%)

CSS Parsing Time:
  Baseline:  125.50ms
  Current:   87.85ms
  Change:    37.65ms (30.00%)
  ✅ Parsing time maintained or improved
```

### Compare Lighthouse Metrics

Run this **after each refactoring phase** (with dev server running):

```bash
npx tsx src/test/css-utils/compare-lighthouse-metrics.ts
```

This will:
- Run Lighthouse on current code
- Compare with baseline
- Show FCP and render-blocking changes
- Indicate if performance is maintained

**Output Example:**
```
📊 Lighthouse Metrics Comparison

═══════════════════════════════════════════════════

First Contentful Paint (FCP):
  Baseline:  850ms
  Current:   820ms
  Change:    30ms (3.53%)
  ✅ FCP maintained or improved

Render-Blocking Time:
  Baseline:  120ms
  Current:   95ms
  Change:    25ms (20.83%)
  ✅ Render-blocking time maintained or improved

Performance Score:
  Baseline:  92/100
  Current:   94/100
  Change:    +2
  ✅ Performance score maintained or improved
```

## Success Criteria

### CSS Bundle Metrics
- ✅ **Bundle size reduction**: 30-40%
- ✅ **Parsing time**: Maintained or improved (≤ baseline)

### Lighthouse Metrics
- ✅ **FCP**: Maintained or improved (≤ baseline)
- ✅ **Render-blocking time**: Maintained or improved (≤ baseline)
- ✅ **Performance score**: Maintained or improved (≥ baseline)

## Recommended Workflow

1. **Before refactoring:**
   ```bash
   # Collect CSS baseline
   npx tsx src/test/css-utils/collect-baseline.ts
   
   # Start dev server
   npm run dev
   
   # Collect Lighthouse baseline (in another terminal)
   npx tsx src/test/css-utils/collect-lighthouse-baseline.ts
   ```

2. **After each phase:**
   ```bash
   # Compare CSS metrics
   npx tsx src/test/css-utils/compare-metrics.ts
   
   # Compare Lighthouse metrics (with dev server running)
   npx tsx src/test/css-utils/compare-lighthouse-metrics.ts
   ```

3. **Document results:**
   - Save comparison outputs
   - Track progress across phases
   - Identify any regressions early

## Troubleshooting

### Lighthouse Issues

**Error: "Lighthouse not found"**
```bash
npm install -g lighthouse
```

**Error: "Chrome not found"**
- Install Chrome or Chromium
- Or specify Chrome path: `--chrome-flags="--chrome-path=/path/to/chrome"`

**Error: "Connection refused"**
- Make sure dev server is running
- Check the URL is correct (default: http://localhost:5173)

### CSS Metrics Issues

**Error: "No CSS files found"**
- Check that `src/styles/` directory exists
- Verify CSS files have `.css` extension

**Error: "Cannot read file"**
- Check file permissions
- Verify paths are correct

## Browser-Based Alternative

If Lighthouse is not available, you can measure CSS parsing time directly in the browser:

1. Open DevTools Console
2. Paste the browser parsing script (see `lighthouse-metrics.ts`)
3. Run the script
4. Copy the results

This provides a quick alternative for CSS parsing metrics without Lighthouse.

## Files Generated

- `src/test/css-utils/baseline-metrics.json` - CSS bundle baseline
- `src/test/css-utils/lighthouse-metrics.json` - Lighthouse baseline
- `lighthouse-report.json` - Detailed Lighthouse report (in project root)

## Integration with Tests

These metrics are also used in property-based tests:

- **Property 22**: Bundle Size Reduction (30-40%)
- **Property 23**: CSS Parsing Performance (≤ baseline)
- **Property 24**: First Contentful Paint (≤ baseline)
- **Property 25**: Render-Blocking Time (≤ baseline)

Run property tests:
```bash
npm test -- src/test/css-utils/properties.test.ts
```

## Notes

- Lighthouse metrics can vary between runs (±5-10%)
- Run Lighthouse multiple times and average results for accuracy
- Close other applications to reduce system load during measurement
- Use incognito/private mode to avoid extension interference
- Lighthouse requires a production-like build for accurate results
