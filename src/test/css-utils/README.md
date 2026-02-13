# CSS Testing Infrastructure

This directory contains utilities for testing and monitoring the CSS architecture refactoring process.

## Overview

The CSS testing infrastructure provides three main capabilities:

1. **CSS Parsing**: Parse CSS files and extract information about selectors, tokens, specificity, and structure
2. **Metrics Collection**: Collect and track metrics like bundle size, parsing time, and performance
3. **Visual Regression Testing**: Ensure no visual changes occur during refactoring

## Files

### Core Utilities

- `parser.ts` - CSS parsing utilities using css-tree
  - Parse CSS files and extract AST
  - Calculate selector specificity
  - Find duplicate tokens
  - Identify high-specificity selectors
  - Find !important declarations

- `metrics.ts` - Metrics collection and comparison utilities
  - Calculate bundle sizes (raw and gzipped)
  - Measure CSS parsing time
  - Compare metrics against baseline
  - Generate reports

### Scripts

- `collect-baseline.ts` - Collect initial baseline metrics before refactoring
- `compare-metrics.ts` - Compare current metrics with baseline

### Tests

- `parser.test.ts` - Unit tests for CSS parser utilities
- `metrics.test.ts` - Unit tests for metrics utilities

## Usage

### 1. Collect Baseline Metrics

Before starting the CSS refactoring, collect baseline metrics:

```bash
npm run css:baseline
```

This will:
- Scan all CSS files in `src/styles/`
- Calculate total bundle size (raw and gzipped)
- Measure CSS parsing time
- Save baseline to `baseline-metrics.json`

### 2. Compare Metrics After Changes

After making CSS changes, compare with baseline:

```bash
npm run css:compare
```

This will:
- Collect current metrics
- Compare with baseline
- Show bundle size reduction percentage
- Indicate if 30-40% reduction target is met

### 3. Run Unit Tests

Test the CSS utilities:

```bash
npm test
```

This runs all unit tests including CSS parser and metrics tests.

### 4. Run Visual Regression Tests

Ensure no visual changes occurred:

```bash
# Run visual regression tests
npm run test:visual

# Run with UI mode for debugging
npm run test:visual:ui

# Update baseline screenshots
npm run test:visual:update
```

## Visual Regression Testing

Visual regression tests are located in `src/test/visual-regression/` and use Playwright.

### Initial Setup

1. Start the dev server: `npm run dev`
2. Generate baseline screenshots: `npm run test:visual:update`
3. Commit the baseline screenshots to version control

### After CSS Changes

1. Make CSS changes
2. Run visual regression tests: `npm run test:visual`
3. If tests fail, review the diff images in `playwright-report/`
4. If changes are intentional, update baselines: `npm run test:visual:update`

## Metrics Targets

The CSS architecture refactor has the following targets:

- **Bundle Size Reduction**: 30-40%
- **Maximum Specificity**: (0,0,2,0)
- **!important Declarations**: 0 (except utilities)
- **File Size**: < 500 lines per file
- **Inline Styles**: 90% reduction

## Integration with Tasks

This infrastructure supports the following tasks from the implementation plan:

- **Task 1**: Set up CSS testing infrastructure ✅
- **Task 6**: Checkpoint - Phase 1 Complete
- **Task 13**: Checkpoint - Phase 2 Complete
- **Task 22**: Checkpoint - Phase 3 Complete
- **Task 28**: Checkpoint - Phase 4 Complete
- **Task 29-33**: Testing & Optimization (Phase 5)

## Example Workflow

```bash
# 1. Collect baseline before starting
npm run css:baseline

# 2. Make CSS changes (e.g., extract tokens)
# ... edit CSS files ...

# 3. Run unit tests to verify utilities work
npm test

# 4. Compare metrics
npm run css:compare

# 5. Run visual regression tests
npm run test:visual

# 6. If visual tests fail, review diffs
npm run test:visual:ui

# 7. If changes are intentional, update baselines
npm run test:visual:update
```

## Troubleshooting

### "No baseline metrics found"

Run `npm run css:baseline` to create the initial baseline.

### Visual regression tests fail

1. Review the diff images in `playwright-report/`
2. If changes are expected, update baselines: `npm run test:visual:update`
3. If changes are unexpected, investigate CSS changes

### Parsing errors

Check that CSS files have valid syntax. The parser will throw errors for invalid CSS.

## API Reference

### Parser Functions

```typescript
// Calculate specificity for a selector
calculateSpecificity(selector: string): SpecificityScore

// Check if specificity exceeds maximum (0,0,2,0)
exceedsMaxSpecificity(specificity: SpecificityScore): boolean

// Parse a CSS file
parseCSSFile(filePath: string): CSSFileInfo

// Find all CSS files in a directory
findCSSFiles(dir: string): string[]

// Find duplicate token definitions
findDuplicateTokens(cssFiles: CSSFileInfo[]): Map<string, TokenInfo[]>

// Find high-specificity selectors
findHighSpecificitySelectors(cssFiles: CSSFileInfo[]): SelectorInfo[]

// Find !important declarations
findImportantDeclarations(cssFiles: CSSFileInfo[]): SelectorInfo[]
```

### Metrics Functions

```typescript
// Calculate bundle size
calculateBundleSize(cssDir: string): BundleMetrics

// Collect current metrics
collectCurrentMetrics(cssDir: string): PerformanceMetrics

// Create baseline
createBaseline(cssDir: string, version: string, description: string): BaselineMetrics

// Load baseline
loadBaselineMetrics(inputPath?: string): BaselineMetrics | null

// Compare metrics
compareMetrics(current: PerformanceMetrics, baseline: BaselineMetrics): ComparisonResult

// Generate report
generateMetricsReport(current: PerformanceMetrics, baseline?: BaselineMetrics): string

// Format bytes
formatBytes(bytes: number): string
```
