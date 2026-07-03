---
name: kaneo-done
description: Mark Kaneo task(s) as done with an evidence-based completion check. Use when the user finished work, merged a PR, or wants to close tasks. Verifies acceptance criteria before closing.
---

# /kaneo-done — Evidence-based completion

Don't just flip status — confirm the work is actually done.

Read first: `_shared/grounding.md`, `_shared/conventions.md`, `_shared/context-memory.md`.

## Step 1 — Find the task(s)
By id → step 2. By title → `search`. By project → `list_tasks` and show `in-progress` / `in-review`
cards to pick from. Confirm the match.

## Step 2 — Check acceptance criteria
`get_task` and read the acceptance-criteria checkboxes. For each, confirm it's met (code merged?
tests pass? deployed?). Ask the user about anything you can't verify. If criteria are unmet, **warn**
and ask whether to proceed anyway or keep it in progress.

## Step 3 — Close
`set_task_status { id, status: "done" }`. For several at once, confirm the list first, then close
each (or `bulk_update_tasks` with a preview).

## Step 4 — Completion note
`add_comment` a short note: what shipped + PR/commit reference. This is the durable record; don't
overwrite the description.

## Step 5 — Verify + log
Read back the status; append a `status … → done` entry to the Activity log in `.kaneo/context.md`.

## Example prompts
> "mark the checkout task done" · "close the auth ticket, PR #42 merged" ·
> "these three are finished: …"
