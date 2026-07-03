---
name: kaneo-standup
description: Generate a daily standup report from the Kaneo board — what's in progress, in review, recently done, and any blockers. Use when the user wants a standup, a daily summary, or a progress snapshot.
---

# /kaneo-standup — Daily standup report

Read first: `_shared/grounding.md`, `_shared/context-memory.md`.

## Step 1 — Active boards
Read `.kaneo/context.md` board map; `list_projects`. Focus on boards with `in-progress` / `in-review`
activity (skip all-`to-do`/all-`done` ones).

## Step 2 — Pull + analyse
`export_tasks` per active board; with Python, collect `in-progress`, `in-review`, and recently
`done` tasks with assignee and `updatedAt` (`_shared/tools-reference.md`).

## Step 3 — Report (grouped by person)
```
# Standup — <date>
## <Project>
### In Review (ready)
- title — @assignee
### In Progress
- title — @assignee
### Done recently
- title
## By person
@Imam: 2 in-progress, 1 in-review   @Budi: 1 in-progress
## ⚠️ Needs attention
- <stale >7d> · <unassigned in-progress> · <in-review not moving>
```
Use the Activity log in `.kaneo/context.md` for a yesterday-vs-today diff when available. Reply in
the team language.

## Example prompts
> "/kaneo-standup" · "daily report" · "what's everyone working on?" ·
> "standup for the E-Commerce board"
