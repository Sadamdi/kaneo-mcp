---
name: kaneo-sprint
description: Plan a sprint/iteration in Kaneo — pick priorities from the backlog, assign, set due dates, and balance team capacity. Use when the user wants to plan a sprint, pick this week's work, or distribute tasks.
---

# /kaneo-sprint — Sprint planning

Read first: `_shared/grounding.md`, `_shared/conventions.md`, `_shared/context-memory.md`.

## Step 1 — Backlog
`export_tasks` for the board; filter `to-do`. Show them sorted by priority with current assignee
(`_shared/tools-reference.md`).

## Step 2 — Sprint parameters
Ask: team capacity (people × ~3–5 tasks each), any must-include high-priority items, and sprint
length / end date.

## Step 3 — Select
Recommend tasks by: priority (`urgent`→`high`→`medium`→`low`), existing assignee, and related work
that can go in parallel. Respect ~3–5 tasks per person. Confirm the selection with the user.

## Step 4 — Set up each selected task
`set_task_due_date` (sprint end; default +7 days if unstated), `set_task_assignee` where missing
(userId from `list_workspace_members`), optionally `set_task_status` → `in-progress` for work
starting immediately. Record the sprint goal as an `add_comment` on the chosen tasks.

## Step 5 — Plan output + log
```
# Sprint Plan — <start> → <end>  ·  <project>
| # | Task | Priority | Assignee | Due |
Backlog remaining: N
```
Append a `sprint planned` entry to the Activity log. Offer `/kaneo-standup` for day one.

## Example prompts
> "plan this week's sprint for E-Commerce" · "pick the 5 highest-priority backlog items" ·
> "sprint until July 11, assign evenly"
