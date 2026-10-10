# E2E Test Infra: CodeByLeon 7-Step Homepage Narrative

## Test Philosophy
- Opaque-box, requirement-driven. Independent of internal refactor details.
- Validates that a visitor traversing the homepage experiences the refined 7-step narrative from end to end.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Interaction + Real-World Workload Scenarios.

## Feature Inventory
| # | Feature | Source (Requirement) | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Scenario) |
|---|---------|----------------------|:-----------------:|:-----------------:|:----------------------:|:-----------------:|
| 1 | Hero CTAs & Copy Sync | ORIGINAL_REQUEST §R1 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 2 | Reality Check & Our Approach | ORIGINAL_REQUEST §R2 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 3 | Services 3 Plain-English Cards | ORIGINAL_REQUEST §R3 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 4 | Services Configurator Bridge | ORIGINAL_REQUEST §R3 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 5 | Proof / Our Work Gateway | ORIGINAL_REQUEST §R4 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 6 | Founder Commitment & Video | ORIGINAL_REQUEST §R5 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 7 | Nairobi Studio Time & Availability | ORIGINAL_REQUEST §R5 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 8 | Fast Response Guarantee | ORIGINAL_REQUEST §R6 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 9 | Final CTA 2 Conversion Paths | ORIGINAL_REQUEST §R6 | ≥5 tests | ≥5 tests | ✓ | ✓ |
| 10 | Quality Gates Baseline | ORIGINAL_REQUEST §Acceptance | ≥5 tests | ≥5 tests | ✓ | ✓ |

## Test Architecture
- **Test Runner**: Vitest (`npm run test` or `npx vitest run src/test/e2e/homepage-narrative.test.tsx`).
- **Test Case Location**: `src/test/e2e/homepage-narrative.test.tsx`.
- **Pass/Fail Semantics**: Exit code 0 indicates all assertions pass. Non-zero indicates failure.
- **Verification Surface**:
  - Exact verbatim strings checked (case-sensitive or normal whitespace).
  - Navigation targets (`href`, `to`, query parameters) verified.
  - Semantic elements (`h1`, `h2`, `section`, `a`, `button`, `video`, `role="slider"`) verified.
  - Theme attribute compatibility (`[data-theme="dark"]`, `[data-theme="light"]`) verified.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Expected Outcome |
|---|----------|--------------------|------------------|
| 1 | High-Intent Founder Direct Configurator Path | F1, F4, F9 | User starts at Hero or Bridge or Final CTA, clicks through to `/get-started.html`, and enters 7-step wizard. |
| 2 | Skeptical Prospect Proof Path | F1, F2, F5 | User reads Reality Check ("Professional Gap"), reviews 3 client snapshots, clicks to `/work` for full case studies. |
| 3 | Direct Founder Relationship Evaluation | F2, F6, F7, F8 | User confirms 1-on-1 collaboration with Leon Madara, verifies Nairobi studio time, and checks rapid response guarantee. |
| 4 | Fast Discovery Call Booking Journey | F8, F9 | User reaches bottom of homepage, sees 20-min discovery call action and fast response guarantee, triggers booking flow. |
| 5 | Dual-Theme Visual & Interactive Integrity | F1–F10 | All elements maintain high contrast, correct BEM layout, and zero JavaScript runtime errors in both dark and light modes. |

## Coverage Thresholds
- Minimum 5 test cases per feature (Tiers 1 & 2).
- Pairwise combination coverage of major section navigation transitions.
- All 5 Tier 4 end-to-end scenarios tested.
