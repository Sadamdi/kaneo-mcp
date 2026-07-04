---
name: kaneo-create
description: Create a new, well-formed Kaneo task — title, description with acceptance criteria, label, priority, assignee, and links to related tasks — in one flow. Use when the user wants to add a task/card/ticket to a Kaneo board.
---

# /kaneo-create — Create a New Task in Kaneo

Create a complete task: title, description, label, priority, assignee, and links to related work —
all in one flow. Grounded (never invents IDs or facts) and written in the team's board language.

## Before you start
- Read `.kaneo/context.md` first if it exists (board map, language, project stack). If it doesn't,
  suggest `/kaneo-setup`.
- Follow `_shared/grounding.md` (discovery-first, search-before-create, verify-after-write).
- Write card content in the team's board language (`_shared/language.md`).

## Step 1: Pick the project

```
mcp__kaneo__list_projects
```

Show the projects and ask **"Which project should this task go in?"** (or take it from
`.kaneo/context.md`'s board map / the user's request).

## Step 2: Gather what you need for the questions

```
mcp__kaneo__list_workspace_labels
mcp__kaneo__get_project { "id": "<projectId>" }
```

## Step 3: Ask everything in one message

If the user already gave the details, skip the questions and proceed.

> **New task details:**
> 1. **Title** — verb-first, e.g. "Add refresh-token rotation"
> 2. **Description / acceptance criteria** — what does "done" mean?
> 3. **Priority** — `low` / `medium` / `high` / `urgent`
> 4. **Assignee** — who works on it? (from members: [show member names])
> 5. **Labels** — pick from [show existing labels], or name new ones, or leave empty
> 6. **Due date** — (optional) ISO `YYYY-MM-DD`

## Step 4: Search for duplicates AND related tasks (grounding)

```
mcp__kaneo__search { "query": "<key words from the title>" }
```

- If a task with the same intent already exists -> update it instead (tell the user, offer
  `/kaneo-move` or an `update_task`), don't create a duplicate.
- Note any **related/integrated** tasks — you'll link them in Step 8.

## Step 5: Draft a proper description

Pick the template that matches the project type (from `.kaneo/context.md` / `_shared/project-detection.md`)
in `_shared/templates.md`, and obey the **format contract** there (GFM tables, fenced code for
formulas/schemas, `###` headings, blank lines between blocks, no raw HTML or stray glyphs). If the
user's acceptance criteria are vague, propose a concrete draft with `- [ ]` checkboxes.

## Step 6: Create labels if new

Pick a sensible hex color (see `_shared/conventions.md`):

```
mcp__kaneo__create_label { "name": "backend", "color": "#22c55e" }
```

| Label | Color | | Label | Color |
|---|---|---|---|---|
| `bug` / `security` | `#ef4444` | | `backend` | `#22c55e` |
| `feature` | `#3b82f6` | | `frontend` | `#f97316` |
| `docs` | `#eab308` | | `mobile` | `#06b6d4` |
| `design` | `#a855f7` | | `infra` | `#6b7280` |
| `chore` / `refactor` | `#94a3b8` | | `data` | `#8b5cf6` |

## Step 7: Create the task

```
mcp__kaneo__create_task {
  "projectId": "<id>",
  "title": "<title>",
  "description": "<markdown body>",
  "status": "to-do",
  "priority": "medium"
}
```

## Step 8: Attach labels, assignee, due date, and relations

```
mcp__kaneo__attach_label_to_task { "labelId": "<id>", "taskId": "<newId>" }
mcp__kaneo__set_task_assignee { "id": "<newId>", "userId": "<userId>" }
mcp__kaneo__set_task_due_date { "id": "<newId>", "dueDate": "2026-12-31" }
```

`userId` comes from `mcp__kaneo__list_workspace_members`. **Link related tasks** found in Step 4:

```
mcp__kaneo__create_task_relation { "sourceTaskId": "<newId>", "targetTaskId": "<relatedId>", "relationType": "relates_to" }
```

Use `blocks` / `blocked_by` for dependencies, `relates_to` for integrations, `duplicates` if it
supersedes another.

## Step 9: Verify and log

```
mcp__kaneo__get_task { "id": "<newId>" }
```

Confirm the real id + status back to the user. Append one line to the `.kaneo/context.md` Activity
log (`_shared/context-memory.md`).

## Example prompts
> "buatkan task untuk implementasi refresh-token rotation di Backoffice"
> "add a task in E-Commerce: fix cart total off-by-one, high priority, assign to Imam"
