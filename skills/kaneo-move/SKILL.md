---
name: kaneo-move
description: Move a Kaneo task to a different status/column (to-do, in-progress, in-review, done) or to another project. Use when the user wants to change a task's status or move it.
---

# /kaneo-move — Move a Task to Another Status / Project

## Status values
| Status | Meaning |
|--------|---------|
| `to-do` | Not started (backlog) |
| `in-progress` | Being worked on |
| `in-review` | Awaiting review / QA |
| `done` | Finished |

Some boards add extra columns — confirm the real slugs with `list_columns`.

## Step 1: Find the task
If the user gave an id -> go to Step 3. Otherwise:
```
mcp__kaneo__list_projects
mcp__kaneo__list_tasks { "projectId": "<id>" }
```
Show the tasks and let the user pick.

## Step 2: Confirm the current state
```
mcp__kaneo__get_task { "id": "<id>" }
```
Show: title, current status, project.

## Step 3: Determine the target
Ask **"Move to which status?"** (`to-do` / `in-progress` / `in-review` / `done`). If the user
names a specific column, list the real ones:
```
mcp__kaneo__list_columns { "projectId": "<id>" }
```

## Step 4: Execute
Change status (use a real slug):
```
mcp__kaneo__set_task_status { "id": "<id>", "status": "in-progress" }
```
Move to another project:
```
mcp__kaneo__move_task { "id": "<id>", "destinationProjectId": "<pid>", "destinationStatus": "to-do" }
```
Move many at once:
```
mcp__kaneo__bulk_update_tasks { "taskIds": ["<id1>", "<id2>"], "operation": "status", "value": "in-progress" }
```

## Step 5: Semantics + confirm
- Moving to `in-review` should say WHAT to review — add the PR link as a comment:
  `mcp__kaneo__add_comment { "taskId": "<id>", "content": "PR: <url>" }`.
- Moving to `done` -> run the `/kaneo-done` acceptance-criteria check first.
- Confirm: "Moved '<title>' from `<old>` -> `<new>`". Append to the `.kaneo/context.md` Activity log.

## Example prompts
> "pindah task checkout ke in-progress"
> "task [id] tandai in-review"
> "semua task to-do saya di E-Commerce pindah ke in-progress"
