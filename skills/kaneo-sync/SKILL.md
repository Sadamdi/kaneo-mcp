---
name: kaneo-sync
description: Reconcile the Kaneo board with reality (git history, branches, merged PRs, code). Use when the user says the board is out of date, wants to sync tasks with what's actually done, or after finishing a batch of work. Proposes status moves and missing cards, applies after one confirmation.
---

# /kaneo-sync — Reconcile board with reality

Keep the board honest: move statuses to match real progress, and surface work that exists in code
but not on the board.

Read first: `_shared/grounding.md`, `_shared/context-memory.md`, `_shared/conventions.md`.

## Step 1 — Load both sides
- Board: read `.kaneo/context.md`, then `export_tasks` for the relevant board(s) (analyse large
  output with Python — see `_shared/tools-reference.md`).
- Reality: gather signals the user can provide or you can read — `git log --oneline`, current
  branches, merged PR titles, recently changed files, CI status. Ask the user for anything you
  can't see (e.g. "which PRs merged since the last sync?").

## Step 2 — Cross-check
For each in-progress / in-review card, look for evidence it's actually done (a merged PR, a commit
referencing it, the feature present in code). For each recent piece of work, check whether a card
exists. Apply grounding §5: only claim a match with real evidence.

## Step 3 — Propose a reconciliation plan
Present ONE combined list:
- **Move to done**: cards whose work is verifiably shipped (with the evidence).
- **Move to in-review / in-progress**: cards whose real state differs.
- **Create**: work found in code with no card (draft titles + type).
- **Flag**: stale (`in-progress` >7d), unassigned in-progress, or cards with no acceptance criteria.
Ask for a single confirmation (the user can edit the list).

## Step 4 — Apply
After approval: `set_task_status` / `move_task` for moves; `/kaneo-document` for new cards;
`add_comment` with the evidence (PR/commit) on each moved card. Verify each change.

## Step 5 — Log
Append the sync summary to the Activity log in `.kaneo/context.md` (what moved, what was created).

## Example prompts
> "sync the board with what we actually shipped" · "the board is out of date, reconcile it" ·
> "update kaneo from the merged PRs" · "which cards are stale?"
