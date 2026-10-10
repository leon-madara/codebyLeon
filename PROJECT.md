# Project: CodeByLeon 7-Step Homepage Narrative Overhaul

## Architecture
- **Stack**: React 18 + Vite 5 + TypeScript + GSAP 3 (ScrollTrigger, useGSAP) + Tailwind CSS 3 / CSS Architecture.
- **Narrative Flow on HomePage (`src/pages/HomePage.tsx`)**:
  1. **Hero (`Hero.tsx`)**: Bold brand headline with typing & 3D cube peel, clear value prop, Primary CTA to `/get-started.html`, Secondary CTA to `/work`.
  2. **The Reality Check & Our Approach (`RealityCheck.tsx`)**: New section diagnosing the "Professional Gap" (established offline vs. outdated online presence) and presenting our bespoke, handcrafted code approach (zero page builders).
  3. **Services & Configurator Bridge (`ServicesIntro.tsx` + `ServicesMatrix.tsx`)**: 3 plain-English service cards + dedicated Bridge Card linking to 7-step project configurator on `/get-started.html`.
  4. **Founder Commitment (`AboutVideoIntro.tsx` + `AboutManifesto.tsx`)**: Personal founder video, bio promising 1-on-1 collaboration with Leon Madara (no account managers or junior devs), live Nairobi studio time & availability badge.
  5. **Proof / Work Gateway (`WorkGatewayStrip.tsx`)**: 3 client snapshots (Kossy Langat, Delivah Dispatch, Legit Logistics) with route link to `/work`.
  6. **Blog (`Blog.tsx`)**: Editorial insight cards.
  7. **Fast Response Guarantee & Final CTA (`FinalCTA.tsx`)**: Verbatim response promise ("We will contact you within hours, if not minutes") + 2 conversion paths (20-min discovery call or configure project online).

## Code Layout & Component Ownership
- `src/components/sections/Hero.tsx` ↔ `src/styles/sections/hero.css`
- `src/components/sections/RealityCheck.tsx` ↔ `src/styles/sections/reality-check.css`
- `src/components/sections/ServicesMatrix.tsx` ↔ `src/styles/sections/services.css`
- `src/components/sections/WorkGatewayStrip.tsx` ↔ `src/styles/sections/portfolio.css`
- `src/components/sections/AboutVideoIntro.tsx` & `AboutManifesto.tsx` ↔ `src/styles/sections/about.css`
- `src/components/sections/FinalCTA.tsx` ↔ `src/styles/sections/final-cta.css`
- Global section imports ↔ `src/index.css`
- CSS Architecture doc ↔ `docs/CSS_COMPONENT_OWNERSHIP.md`
- Multi-page configurator ↔ `get-started.html` & `src/styles/features/configurator.css`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Hero Copy & CTAs | Headline "Bold Websites for Driven Brands.", Subheadline "We build websites and designs to make your business look as professional as it is.", Primary CTA "Configure Your Project" (`/get-started.html`), Secondary CTA "View Previous Work" (`/work`). | M2 | R1 |
| F2 | The Reality Check & Our Approach | New Section diagnosing the "Professional Gap" in plain English (offline reputation vs outdated web presence) + bespoke handcrafted code (zero page-builder bloat). | M2 | R2 |
| F3 | Services 3 Plain-English Cards | 3 clear service cards: "A Brand-New Custom Website", "Complete Website Redesign & Modernization", "Custom Portals & Automated Workflows". | M3 | R3 |
| F4 | Services Configurator Bridge Card | Prominent bridge card highlighting the 7-step interactive configurator with direct link to `/get-started.html`. | M3 | R3 |
| F5 | Proof / Our Work Gateway | 3 client snapshots (Kossy Langat, Delivah Dispatch, Legit Logistics) + prominent button to `/work`. | M3 | R4 |
| F6 | Founder Commitment Copy & Video | Video by Leon Madara + bio guaranteeing direct 1-on-1 collaboration with Leon (no account reps or junior devs). | M4 | R5 |
| F7 | Live Nairobi Studio Time & Availability | Dynamic Nairobi clock (`Intl.DateTimeFormat` Africa/Nairobi) + pulsing availability indicator. | M4 | R5 |
| F8 | Fast Response Guarantee | Verbatim response promise: "We will contact you within hours, if not minutes." | M4 | R6 |
| F9 | Final CTA Two Conversion Paths | 2 conversion paths: "Book a 20-minute discovery call" and "Configure your project online" (`/get-started.html`), preserving `id="final-cta"`. | M4 | R6 |
| F10 | Comprehensive Test Suite & Quality Gates | Pass `npm run test` (100%), `npm run build` (tsc 0 errors), `npm run css:gates` (0 violations), `npm run perf:audit`. | M1 & M5 | AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | E2E Testing Suite & Infra | Create opaque-box narrative E2E tests and test harness covering all 10 features, publish TEST_READY.md | none | DONE |
| M2 | Hero & Reality Check Narrative | Implement F1 (Hero copy & CTAs) and F2 (RealityCheck section, CSS, index.css import, CSS ownership registration) | none | DONE |
| M3 | Services & Work Gateway | Implement F3 (3 service tiers), F4 (configurator bridge card), and F5 (client snapshots & /work gateway sync) | M2 (interface contracts) | DONE |
| M4 | Founder Commitment & Final CTA | Implement F6/F7 (Founder 1-on-1 copy & video verification) and F8/F9 (FinalCTA response guarantee & 2 conversion paths) | M2 (interface contracts) | DONE |
| M5 | Final Quality Gates & Forensic Audit | Run full test suite, build, css:gates, perf:audit, and forensic integrity audit | M1, M2, M3, M4 | DONE |

## Interface Contracts

### Navigation & Route Endpoints
- `/get-started.html`: Standalone 7-step wizard (Rollup multi-page build). Query parameter support: `?intent=discovery-call`, `?tier=...`.
- `/work`: Case studies gateway page (`OurWorkPage.tsx`).
- `/work/kossy-langat`, `/work/delivah-dispatch-hub`, `/work/legit-logistics`: Individual client case study routes.
- `/#final-cta`: Preserved anchor ID for external navigation (e.g. from `ProcessPage.tsx`).

### Reality Check Component Interface
```tsx
// src/components/sections/RealityCheck.tsx
export function RealityCheck(): JSX.Element;
// ID: id="reality-check"
// CSS class: .reality-check
```

### Services Matrix Interface
```tsx
// src/components/sections/ServicesMatrix.tsx
// SERVICE_TIERS contains 3 plain-English service titles:
// 1. "A Brand-New Custom Website"
// 2. "Complete Website Redesign & Modernization"
// 3. "Custom Portals & Automated Workflows"
// Bridge card: links to /get-started.html
```

### Final CTA Interface
```tsx
// src/components/sections/FinalCTA.tsx
export function FinalCTA(): JSX.Element;
// ID: id="final-cta"
// Guarantee text: "We will contact you within hours, if not minutes."
// Button 1: "Book a 20-minute discovery call"
// Button 2: "Configure your project online" (/get-started.html)
```
