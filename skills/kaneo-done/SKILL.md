---
name: kaneo-done
description: Quickly mark one or more Kaneo tasks as done, with a check that their acceptance criteria are met. Use when the user finished work and wants to close a task.
---

# /kaneo-done — Mark Task(s) Done

Skill for quickly marking one or more tasks as `done`.

## When to Use

- Finished something and want to update the status.
- Want to mark several tasks at once.
- After a PR is merged / a feature finishes deploying.

## Workflow

### If the User Names a Task Title

Find the intended task:
```
mcp__kaneo__search { "query": "<key words from the title>" }
```

Show the result and confirm: **"Is this the task you meant?"**

### If the User Names a Project

```
mcp__kaneo__list_tasks { "projectId": "<id>" }
```

Show the tasks that are `in-progress` or `in-review` and ask the user which are done.

### Evidence Check (enhancement)

Before flipping the status, read the task and verify it's really done:
```
mcp__kaneo__get_task { "id": "<id>" }
```
Check the acceptance criteria in the description — are they met (code merged? tests pass? endpoint
live?)? If some are unmet, warn the user and ask whether to proceed. If a task is `in-review`,
confirm the review is approved first.

### Mark Done — One Task

```
mcp__kaneo__set_task_status {
  "id": "<id>",
  "status": "done"
}
```

### Mark Done — Several Tasks at Once

```
mcp__kaneo__bulk_update_tasks {
  "taskIds": ["<id1>", "<id2>", "<id3>"],
  "operation": "status",
  "value": "done"
}
```

### Confirm

> ✅ **[N] task(s) marked done:**
> - [task title 1]
> - [task title 2]

Add a closing comment (what shipped, PR/commit ref) and append to the `.kaneo/context.md` Activity
log:
```
mcp__kaneo__add_comment { "taskId": "<id>", "content": "Done: <what shipped>, PR <url>" }
```

## Example prompts

> "mark the task 'implement checkout' as done"

> "all in-review tasks in E-Commerce are finished"

> "done: update API docs"

> "mark done task [ID]"

## Tips

- If a task is `in-review` → ask first whether the review is approved, then mark `done`.
- If the user says "all done" without specifics, ask which project first.
- After done, offer to add a closing comment (`mcp__kaneo__add_comment`).
