---
name: kaneo-close-sprint
description: Close a sprint in Kaneo — summarise results, carry unfinished work back to the backlog, and optionally archive/delete. Use when the user wants to wrap up a sprint or clean the board. Never deletes without explicit confirmation.
---

# /kaneo-close-sprint — Close a sprint

Default action is SAFE: move unfinished work to `to-do`, don't delete. Deletion needs explicit
per-item confirmation (irreversible).

Read first: `_shared/grounding.md`, `_shared/conventions.md`, `_shared/context-memory.md`.

## Step 1 — Review results
`export_tasks`; count by status (Python — `_shared/tools-reference.md`). Show a retro summary:
```
# Sprint retro — <project>
Done: N   ·   Unfinished: M (in-progress P, in-review Q, to-do R)
Completed: - title …
Carrying over: - title (status) …
```

## Step 2 — Carry over
For unfinished tasks, default to `set_task_status` → `to-do` (back to backlog). Confirm the list.

## Step 3 — Cleanup (optional, explicit)
Only if the user asks to remove tasks:
1. List exactly which tasks would be deleted (title + status).
2. Get explicit confirmation.
3. `delete_task` one by one, reporting each. No undo.
If unsure, recommend keeping them in `to-do` instead of deleting.

## Step 4 — Log
Append a `sprint closed` entry (done count, carried-over count) to the Activity log in
`.kaneo/context.md`.

## Example prompts
> "close the sprint for E-Commerce" · "wrap up this sprint and carry over what's left" ·
> "clean up the finished tasks"
