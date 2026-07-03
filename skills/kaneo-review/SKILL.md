---
name: kaneo-review
description: Review and analyse tasks on a Kaneo board — status breakdown, health checks, and insights. Use when the user wants to see the state of a project, what's in progress, or a board health report.
---

# /kaneo-review — Review a board

Read first: `_shared/grounding.md`, `_shared/conventions.md`, `_shared/context-memory.md`.

## Step 1 — Scope
One project or all? A status filter (`in-progress`, `to-do`, `in-review`, `done`, or all)? Read
`.kaneo/context.md` for the board map; reply in the team language.

## Step 2 — Data
`list_tasks` for a quick view, or `export_tasks` for full detail (analyse large output with Python —
`_shared/tools-reference.md`). For "all projects", loop `list_projects` → export each.

## Step 3 — Group + display
Group by status and show:
```
## Review: <project>  (total N)
### In Progress (n)   - [id] title — @assignee
### In Review (n)     - [id] title — @assignee
### To Do (n)         - [id] title
### Done (n)          - [id] title
```

## Step 4 — Health checks (insights)
Flag, per `_shared/conventions.md`:
- **WIP overload**: any assignee with >3 in-progress.
- **Stale**: in-progress >7 days without update (use `updatedAt`).
- **Unassigned in-progress**.
- **Missing acceptance criteria** in active cards.
- **No in-review flow** (nothing ever reaches review).
Give concrete recommendations.

## Step 5 — Drill down
On request: `get_task {id}` for full detail, `list_comments {taskId}` for discussion,
`list_task_activity {taskId}` for history.

## Example prompts
> "review the E-Commerce board" · "what's in progress across all projects?" ·
> "which project has the most stuck tasks?"
