---
name: kaneo-move
description: Move a Kaneo task to a different status/column, or to another project. Use when the user wants to change a task's status or move it.
---

# /kaneo-move — Move a Task to Another Status / Column

> **Grounding:** read `.kaneo/context.md` first; discover real IDs and column slugs
> (`list_columns`) — don't assume. See `_shared/grounding.md`.

## Available Statuses

| Status | Meaning |
|--------|---------|
| `to-do` | Not started |
| `in-progress` | Being worked on |
| `in-review` | Under review |
| `done` | Finished |

Some boards add extra columns — confirm the real slugs with `list_columns`.

## Workflow

### Step 1: Find the Task

If the user already knows the task id → go straight to Step 3.

If not:
```
mcp__kaneo__list_projects
```
Pick the project, then:
```
mcp__kaneo__list_tasks { "projectId": "<id>" }
```
Show the tasks to the user and ask which one.

### Step 2: Confirm the Selected Task

Show the detail of the task to be moved:
```
mcp__kaneo__get_task { "id": "<id>" }
```
Show: title, current status, project.

### Step 3: Determine the Target

Ask the user: **"Which status should it move to?"**
- `to-do` / `in-progress` / `in-review` / `done`

If the user names a specific column, check the real columns:
```
mcp__kaneo__list_columns { "projectId": "<id>" }
```

### Step 4: Execute

**Move by status:**
```
mcp__kaneo__set_task_status {
  "id": "<id>",
  "status": "<target-status>"
}
```

**Move to a different project:**
```
mcp__kaneo__move_task {
  "id": "<id>",
  "destinationProjectId": "<project-id>",
  "destinationStatus": "<target-status>"
}
```

### Step 5: Confirm

Show a short confirmation:
> ✅ Task "[title]" moved from `[old-status]` → `[new-status]`

- Moving to `in-review`? Say WHAT to review — add the PR link as a comment
  (`mcp__kaneo__add_comment { "taskId": "<id>", "content": "PR: <url>" }`).
- Moving to `done`? Run the `/kaneo-done` acceptance-criteria check first.
- Append the change to the `.kaneo/context.md` Activity log.

## Example prompts

> "move the checkout task to in-progress"

> "mark task [ID] as in-review"

> "all my to-do tasks in E-Commerce, move them to in-progress"

> "the task 'update API docs' is done"

## Shortcut: Move Many Tasks at Once

If the user asks to move several tasks:
```
mcp__kaneo__bulk_update_tasks {
  "taskIds": ["<id1>", "<id2>", "<id3>"],
  "operation": "status",
  "value": "<target-status>"
}
```
