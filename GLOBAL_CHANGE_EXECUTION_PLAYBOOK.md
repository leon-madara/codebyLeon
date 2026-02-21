# Global Change Execution Playbook

Purpose: A reusable workflow for implementing code changes and new features safely, with clear clarification, scoped execution, and documented outcomes.

Use this playbook together with each project's `AGENTS.md` and local engineering docs.

## 0) Core Principles

- Understand before editing.
- Change only what is required.
- Surface risk early.
- Validate with tests before completion.
- Document what changed and why.
- Ask for approval before committing to `main`.

## 1) Clarify the Request Until It Is Actionable

If the request is vague, run a clarification loop before coding.

### Clarification Loop

- Restate the request in one sentence.
- Ask targeted questions (1-3 at a time).
- For each question, provide:
1. 2-3 mutually exclusive options
2. One recommended option
3. A `Skip for now` option
- Repeat until the task has:
1. Goal
2. Scope
3. Acceptance criteria
4. Constraints

### Question Format

```md
Question: Which behavior should be the default?
Options:
1. Keep current behavior
2. Enable new behavior behind a flag (Recommended)
3. Replace current behavior globally
4. Skip for now
```

If the user skips, continue with explicit assumptions and mark them in the plan.

## 2) Map Scope, Boundaries, and Break Risk

Before implementation, define:

- Files to change
- Files explicitly out of scope (`Do Not Change`)
- Dependencies touched by the change
- What might break (behavioral, visual, API, performance, data, tests)

Create a short impact map:

```md
Target files:
- src/path/a.ts
- src/path/b.tsx

Do not change:
- src/path/c.ts
- public/*

Potential repercussions:
- Could affect route X rendering
- Could break API response typing for endpoint Y
```

## 3) Think Critically Before and During Edits

Work intentionally and line-by-line through impacted code.

Checklist:

- Confirm current behavior from source, not assumption.
- Identify edge cases and failure modes.
- Preserve existing contracts unless explicitly changing them.
- Follow project standards and best practices.
- Keep diffs minimal and reversible.

## 4) Build a Comprehensive Execution Plan

Write a stepwise plan before substantial edits:

- Step objective
- Files touched
- Risk notes
- Validation for that step

The plan must show how requirements are met while avoiding unrelated edits.

## 5) Escalate Cross-Impact and Present Options

If the change affects adjacent systems, stop and notify the user before risky edits.

Escalation format:

```md
Concern:
- Changing X will likely affect Y.

Options:
1. Minimal safe patch (Recommended): limits blast radius, preserves current contracts.
2. Broad refactor: cleaner long term, higher risk and testing cost.
3. Defer dependency changes: ship partial scope now, schedule follow-up.
```

Proceed after user choice, or continue with recommended option if explicitly authorized.

## 6) Implement the Plan

- Apply changes in planned order.
- Re-check diffs for accidental edits.
- Run required validations/tests.
- Fix issues introduced by the change.
- Avoid touching unrelated files.

## 7) Produce a Detailed Change Update Doc

At completion, provide a structured update:

- What changed
- Why it changed
- File-by-file summary
- Risks addressed
- Tests run and results
- Remaining risks or follow-ups

Suggested report template:

```md
# Change Update Report

## Summary

## Files Changed
- path/file1: why changed
- path/file2: why changed

## Behavior Impact

## Validation
- Test command + result

## Residual Risks

## Follow-ups
```

## 8) Approval and Commit Gate

After presenting results and validation:

- Ask for approval.
- After approval, ask: "Should I commit this to `main` now?"
- Do not commit without explicit user confirmation.

