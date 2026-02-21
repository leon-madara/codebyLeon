# codebyLeon Change Execution Playbook

Purpose: Project-specific execution guide for modifications and new features in `codebyLeon`. Use this together with:

- `AGENTS.md`
- `GLOBAL_CHANGE_EXECUTION_PLAYBOOK.md`

This file applies the global workflow to this project's React + TypeScript + GSAP + layered CSS architecture.

## 1) Mandatory Context Sequence

Before editing:

1. Read `AGENTS.md`.
2. Read `GLOBAL_CHANGE_EXECUTION_PLAYBOOK.md`.
3. Read targeted system docs based on change type:
- CSS changes: `docs/CSS_COMPONENT_OWNERSHIP.md` first, then `docs/CSS_ARCHITECTURE_STYLE_GUIDE.md`.
- Animation changes: `GSAP/overview.md` and `GSAP/react/useGSAP.md`.
- Theme changes: `docs/theme_strategy.md`.
- Hero/configurator work: `docs/hero_design_spec.md` or `docs/configurator_spec.md`.

## 2) Clarify Request With Guided Choices

If request details are missing, ask focused questions in short batches.

Each question must include:

1. 2-3 options
2. A recommended option
3. `Skip for now`

Example:

```md
Question: How should this ship?
1. Behind a runtime flag (Recommended)
2. Enabled by default
3. Limited to one route
4. Skip for now
```

Continue until scope, acceptance criteria, and constraints are clear.

## 3) File Scope and Boundaries (Project Rules)

Before coding, list:

- Exact files to change
- Files out of scope
- Risk notes per file

Project constraints:

- One component maps to one CSS file; do not create duplicate CSS ownership.
- No inline styles.
- No `!important`.
- Scroll-driven motion must use GSAP ScrollTrigger.
- GSAP in React must use `useGSAP` (not `useEffect`).
- No mixed animation systems on the same element.
- No `any` unless explicitly justified and approved.

## 4) Critical Review Method

For each target file:

- Read current logic line-by-line.
- Confirm existing behavior and contracts.
- Check dependent files before edits.
- Keep diff minimal and localized.
- Re-open diff for accidental style/logic drift.

## 5) Cross-Impact Escalation

If a change affects other areas, notify user before broad edits.

High-risk zones in this project:

- `src/components/HorizontalScroll/`
- `src/components/StoryScroll/`
- `src/pages/HomePage.tsx`
- `src/styles/tokens/` and theme variable sources
- Shared UI in `src/components/ui/`

Provide options and recommendation:

1. Minimal patch (Recommended)
2. Coordinated refactor
3. Phased rollout

## 6) Execution Plan Template

Use this structure before substantial edits:

```md
Plan
1. Update [files] for [goal] and preserve [contract].
2. Apply style/animation changes in owned layers only.
3. Validate with required tests.
4. Document behavior impact and residual risks.
```

## 7) Validation Matrix

Required baseline:

- `npm run test`
- `npm run build`

When applicable:

- CSS changes: `npm run css:gates`
- Visual/animation/layout changes: `npm run test:visual` (recommended)

If any suite is skipped, state why.

## 8) Required Change Update Report

At completion, include:

- Summary of request and final behavior
- File-by-file changes with rationale
- Repercussions considered and how mitigated
- Test commands and outcomes
- Remaining risks and follow-ups

## 9) Approval and Commit Gate

After user reviews update report:

1. Ask for approval.
2. Then ask: "Should I commit this to `main` now?"
3. Commit only with explicit confirmation.

