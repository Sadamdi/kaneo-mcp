---
name: kaneo-create
description: Create a new Kaneo task with a proper title, description, acceptance criteria, priority, labels, and assignee. Use when the user wants to add a task, create a ticket, or put work on the board.
---

# /kaneo-create — Create a well-formed task

One flow: gather info, apply conventions, avoid duplicates, verify. For heavy documentation-grade
cards (endpoints/files/schema from code), use `/kaneo-document` instead.

Read first: `_shared/grounding.md`, `_shared/conventions.md`, `_shared/templates.md`,
`_shared/context-memory.md`.

## Step 1 — Context + project
Read `.kaneo/context.md` (board map, language, template variant). If missing, `list_projects` and
ask which board. Reply in the team's language.

## Step 2 — Collect details in one message
Load `list_workspace_labels` and `list_workspace_members`, then ask (skip anything the user already
gave):
> 1. **Title** (verb-first) 2. **Description / acceptance criteria** 3. **Priority** (low/medium/
> high/urgent) 4. **Assignee** (from members: …) 5. **Label(s)** (existing: … or new) 6. **Due date**

## Step 3 — Draft acceptance criteria
If the user's description is vague, propose 2–5 testable acceptance-criteria checkboxes
(`_shared/conventions.md`) and confirm. A task without acceptance criteria is not ready.

## Step 4 — Search for duplicates
`search { query: <title keywords> }`. If a match exists, offer to update it instead (grounding §2).

## Step 5 — Create
Build the body with the header block + Context/Scope/Acceptance/Technical notes/Links/DoD from the
template variant. `create_task { projectId, title, description, status: "to-do" }`.

## Step 6 — Set attributes
Using the returned task id: `set_task_priority` (default `medium` if unspecified),
`set_task_assignee` (userId from members; "assign to me" → the user's member id; never guess),
`attach_label_to_task` (one TYPE + one AREA; `create_label` first if missing), `set_task_due_date`.

## Step 7 — Verify + confirm + log
`get_task` to confirm; show a summary (title, project, priority, assignee, labels, due, id). Append
a `created` entry to the Activity log in `.kaneo/context.md`.

## Example prompts
> "add a task in E-Commerce: build the checkout page, high, assign to Imam, label frontend" ·
> "create a ticket to fix the login 500" · "new task: write API docs"
