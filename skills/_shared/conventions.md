# Ticket Conventions (how a good Kaneo card looks)

Distilled from engineering ticket-writing best practices (Linear/Jira/GitHub norms). Every card an
AI creates should follow this so the board reads like real team documentation, not one-line stubs.

## Title
- **Verb first**, imperative: "Add refresh-token rotation", "Fix cart total off-by-one".
- ~10 words max. Specific, not vague ("Fix login" -> "Fix 500 on login when email has uppercase").
- Optional scope prefix in brackets: `[Auth] ...`, `[Checkout] ...`, `[Infra] ...`.

## Description structure (the canonical card body)
Use these sections (omit ones that truly don't apply). Full per-type variants in `templates.md`.

```
## Context
Why this exists — the problem, the trigger, the intended outcome. 1-3 sentences.

## Scope
- In: what this task covers
- Out: what it explicitly does NOT cover (prevents scope creep)

## Acceptance criteria
- [ ] Testable, user-observable condition 1
- [ ] Condition 2
(Keep to about 8. Each must be verifiable — someone can check it's true.)

## Technical notes
Verified references only (see grounding.md rule 5): endpoints, files, tables, components, configs.

## Links
Spec / design / PR / related tasks.

## Definition of Done
Merged + tests pass + docs updated + card moved to done (adjust to team norms).
```

## Labels taxonomy (apply two)
- One **TYPE**: `feature` · `bug` · `chore` · `docs` · `refactor` · `security` · `perf`
- One **AREA**: `frontend` · `backend` · `mobile` · `infra` · `data` · `design`
Create a label if missing (`create_label` needs a hex color). Suggested colors:
`bug`/`security` `#ef4444` · `feature` `#3b82f6` · `docs` `#eab308` · `design` `#a855f7` ·
`backend` `#22c55e` · `frontend` `#f97316` · `mobile` `#06b6d4` · `infra` `#6b7280` ·
`data` `#8b5cf6` · `chore`/`refactor` `#94a3b8` · `perf` `#facc15`.

## Priority semantics
- `urgent` — blocker, security hole, data loss, production down.
- `high` — core work for the current cycle/sprint.
- `medium` — normal planned work (default).
- `low` — nice-to-have, cleanup, can slip.

## Status hygiene
- Statuses move **with** the work: `to-do -> in-progress -> in-review -> done`.
- WIP limit: warn if one person has **>3** `in-progress` tasks.
- Stale flag: a task `in-progress` **>7 days** with no update needs a nudge.
- Moving to `in-review` should say WHAT to review (link a PR via `add_comment`).
- Moving to `done` should have its acceptance criteria met (see `kaneo-done`).

## One task = one deliverable
If a task needs more than ~8 acceptance criteria or covers several deliverables, split it or use a
checklist of subtasks inside the acceptance criteria. Link split-out tasks with
`create_task_relation`.
