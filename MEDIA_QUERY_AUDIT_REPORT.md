# Media Query Audit Report

**Generated:** 2026-02-09T23:25:48.620Z

## Summary

- **Total Media Queries:** 26
- **Files Analyzed:** 22
- **Breakpoint Tokens Defined:** 5

## Breakpoint Tokens

- `--breakpoint-sm`: 640px
- `--breakpoint-md`: 768px
- `--breakpoint-lg`: 1024px
- `--breakpoint-xl`: 1280px
- `--breakpoint-2xl`: 1536px

## Breakpoint Consistency Analysis

**Consistent with tokens:** 11 / 26
**Inconsistent (not using tokens):** 11 / 26

### Inconsistent Breakpoints

These media queries use hardcoded values instead of tokens:

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\components\cards.css:337**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\components\modals.css:193**
  - Query: `(min-width: 480px)`
  - Breakpoint: `480px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\configurator.css:1223**
  - Query: `(max-width: 480px)`
  - Breakpoint: `480px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\configurator.css:1360**
  - Query: `(max-width: 480px)`
  - Breakpoint: `480px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\horizontal-scroll.css:338**
  - Query: `(max-width: 600px)`
  - Breakpoint: `600px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\layout\navigation.css:302**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\about.css:82**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\blog.css:255**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\blog.css:501**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\portfolio.css:215**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\services.css:341**
  - Query: `(min-width: 900px)`
  - Breakpoint: `900px`

## Mobile-First Compliance

**Mobile-first (min-width):** 17 / 26
**Desktop-first (max-width):** 5 / 26

### Desktop-First Media Queries

These media queries use max-width (should be converted to min-width):

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\configurator.css:1170**
  - Query: `(max-width: 768px)`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\configurator.css:1223**
  - Query: `(max-width: 480px)`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\configurator.css:1360**
  - Query: `(max-width: 480px)`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\horizontal-scroll.css:291**
  - Query: `(max-width: 1024px)`

- **C:\Users\Leon\DevMode\codebyLeon\src\styles\features\horizontal-scroll.css:338**
  - Query: `(max-width: 600px)`

## Co-Location Analysis

✅ **All responsive styles are co-located with their base styles!**
## All Media Queries

### C:\Users\Leon\DevMode\codebyLeon\src\styles\components\buttons.css

- Line 260: 📱 min-width ✅
  - `(min-width: 640px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\components\cards.css

- Line 337: 📱 min-width ⚠️
  - `(min-width: 900px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\components\modals.css

- Line 193: 📱 min-width ⚠️
  - `(min-width: 480px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\features\configurator.css

- Line 240: ❓ other ⚠️
  - `(prefers-reduced-motion: reduce)`
- Line 1170: 🖥️ max-width ✅
  - `(max-width: 768px)`
- Line 1223: 🖥️ max-width ⚠️
  - `(max-width: 480px)`
- Line 1360: 🖥️ max-width ⚠️
  - `(max-width: 480px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\features\horizontal-scroll.css

- Line 291: 🖥️ max-width ✅
  - `(max-width: 1024px)`
- Line 338: 🖥️ max-width ⚠️
  - `(max-width: 600px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\features\mouse-trail.css

- Line 71: ❓ other ⚠️
  - `(prefers-reduced-motion: reduce)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\layout\navigation.css

- Line 290: 📱 min-width ✅
  - `(min-width: 640px)`
- Line 302: 📱 min-width ⚠️
  - `(min-width: 900px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\about.css

- Line 75: 📱 min-width ✅
  - `(min-width: 640px)`
- Line 82: 📱 min-width ⚠️
  - `(min-width: 900px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\blog.css

- Line 208: 📱 min-width ✅
  - `(min-width: 640px)`
- Line 229: 📱 min-width ✅
  - `(min-width: 768px)`
- Line 255: 📱 min-width ⚠️
  - `(min-width: 900px)`
- Line 457: 📱 min-width ✅
  - `(min-width: 640px)`
- Line 476: 📱 min-width ✅
  - `(min-width: 768px)`
- Line 501: 📱 min-width ⚠️
  - `(min-width: 900px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\hero.css

- Line 148: ❓ other ⚠️
  - `screen and (-ms-high-contrast: active), (-ms-high-contrast: none)`
- Line 362: ❓ other ⚠️
  - `(prefers-reduced-motion: reduce)`
- Line 451: 📱 min-width ✅
  - `(min-width: 640px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\portfolio.css

- Line 192: 📱 min-width ✅
  - `(min-width: 640px)`
- Line 215: 📱 min-width ⚠️
  - `(min-width: 900px)`

### C:\Users\Leon\DevMode\codebyLeon\src\styles\sections\services.css

- Line 341: 📱 min-width ⚠️
  - `(min-width: 900px)`

## Recommendations

1. **Update inconsistent breakpoints** to use tokens from `tokens/spacing.css`
2. **Convert max-width queries to min-width** for mobile-first approach