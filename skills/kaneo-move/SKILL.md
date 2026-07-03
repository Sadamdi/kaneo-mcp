---
name: kaneo-move
description: Move a Kaneo task to a different status or column. Use when the user wants to change a task's status, start work, send something to review, or reorganise the board.
---

# /kaneo-move — Change a task's status/column

Read first: `_shared/grounding.md`, `_shared/conventions.md`.

Statuses: `to-do` → `in-progress` → `in-review` → `done` (a board may have extra columns — check
`list_columns`).

## Step 1 — Find the task
If the user gave an id, go to step 2. Otherwise `search` by title keywords or `list_tasks` on the
board and let them pick. Confirm with `get_task` (title + current status).

## Step 2 — Target status
Ask the target status if not given. Enforce status semantics (`_shared/conventions.md`):
- → **in-progress**: fine; note WIP if the assignee already has >3 in-progress.
- → **in-review**: ask WHAT to review; add a comment with the PR/branch link
  (`add_comment`) so reviewers have context.
- → **done**: hand off to `/kaneo-done` (check acceptance criteria + add a completion note) rather
  than a bare status flip.

## Step 3 — Apply + verify + log
`set_task_status { id, status }` (or `move_task` for a specific column/project). Read back, confirm
the real new status, and append a `status <old> → <new>` line to the Activity log in
`.kaneo/context.md`.

## Example prompts
> "move the checkout task to in progress" · "send the auth ticket to review" ·
> "put task abc123 back to to-do"
