---
name: kaneo-done
description: Mark one or more Kaneo tasks as done, with an evidence-based check that their acceptance criteria are actually met. Use when the user finished work and wants to close a task.
---

# /kaneo-done — Mark Task(s) Done (evidence-based)

Close tasks quickly, but verify they're really done before flipping the status.

## When to use
- Finished something and want to update the status.
- Mark several tasks at once.
- After a PR merged / a feature shipped.

## Step 1: Find the task
If the user named a title:
```
mcp__kaneo__search { "query": "<key words>" }
```
Show the match and confirm **"Is this the one?"**. If they named a project:
```
mcp__kaneo__list_tasks { "projectId": "<id>" }
```
Show `in-progress` / `in-review` tasks and let them pick.

## Step 2: Evidence check (grounding)
```
mcp__kaneo__get_task { "id": "<id>" }
```
Read the acceptance criteria in the description. Verify each is actually met (code merged? tests
pass? endpoint live?). If some are unmet, **warn the user** and ask whether to proceed anyway. If a
task is `in-review`, confirm the review is approved before `done`.

## Step 3: Mark done
One task:
```
mcp__kaneo__set_task_status { "id": "<id>", "status": "done" }
```
Several at once:
```
mcp__kaneo__bulk_update_tasks { "taskIds": ["<id1>", "<id2>"], "operation": "status", "value": "done" }
```

## Step 4: Closing note + log
Add a completion comment (what shipped, PR/commit ref):
```
mcp__kaneo__add_comment { "taskId": "<id>", "content": "Done: <what shipped>, PR <url>" }
```
Append to the `.kaneo/context.md` Activity log.

## Confirm
> **[N] task(s) marked done:**
> - [title 1]
> - [title 2]

## Example prompts
> "tandai task 'implementasi checkout' selesai"
> "semua task in-review di E-Commerce sudah beres"
> "done: update API docs"
