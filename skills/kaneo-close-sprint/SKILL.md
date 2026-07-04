---
name: kaneo-close-sprint
description: Close a Kaneo sprint — review results, move unfinished tasks back to the backlog, and clean up tasks only with explicit confirmation. Use when a sprint ends.
---

# /kaneo-close-sprint — Close a Sprint & Clean Up Tasks

Skill for closing a sprint: review the results, move unfinished tasks back to the backlog, and
delete tasks that are no longer relevant.

## ⚠️ Warning

This skill can **permanently delete tasks**. Always confirm with the user before running
`delete_task`. There is no undo.

---

## Workflow

### Step 1: Review the Sprint to Close

Get all tasks in the project:
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

Analyze the sprint result:
```python
import json
from collections import Counter

with open('<filepath>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', [])

statuses = Counter(t.get('status') for t in tasks)
print("Sprint result:")
for status, count in statuses.items():
    print(f"  {status}: {count} tasks")
```

### Step 2: Show the Sprint Summary

```
# 📊 Sprint Summary — [Project Name]

✅ Done       : X tasks  → will be kept
🔄 In Progress: X tasks  → unfinished
🟡 In Review  : X tasks  → unfinished
⚪ To Do      : X tasks  → not worked on

Sprint Velocity: X of Y tasks done (XX%)
```

### Step 3: Ask What to Do Per Status

Ask the user for each group of non-`done` tasks:

**`in-progress` and `in-review` tasks:**
> "There are X unfinished tasks. Move them to the backlog (`to-do`), carry them to the next sprint
> (keep `in-progress`), or delete them?"

**`to-do` tasks that weren't worked on:**
> "There are Y to-do tasks that didn't make this sprint. Keep them in the backlog, or delete any?"

### Step 4: Execute the User's Decision

**Move to the backlog:**
```
mcp__kaneo__bulk_update_tasks {
  "taskIds": ["<id1>", "<id2>"],
  "operation": "status",
  "value": "to-do"
}
```

**Delete tasks (CONFIRM FIRST — no undo):**

Show the list of tasks to delete:
```
Will be permanently deleted:
- [ID] Task title 1
- [ID] Task title 2

Type "YA HAPUS" to confirm, or "cancel" to abort.
```

After the user confirms with a clear keyword, delete one by one:
```
mcp__kaneo__delete_task { "id": "<id>" }
```

### Step 5: Sprint Closing Report

```
# ✅ Sprint Closed — [Project Name]

## Final Result
- Done: X tasks
- Carried to next sprint: X tasks
- Returned to backlog: X tasks
- Deleted: X tasks

## Carried-Over Tasks
- [task title] — @assignee

## Backlog Now
Total: X tasks remaining
```

Append to the `.kaneo/context.md` Activity log. Offer to start the next sprint:
> "Want to plan the next sprint right away? Run `/kaneo-sprint`"

---

## Example prompts

> "close the E-Commerce sprint"

> "close sprint, delete all the tasks that weren't worked on"

> "sprint is over, move everything not done back to the backlog"

---

## Task Deletion Rule

Never delete a task without explicit confirmation. At minimum show:
1. The title of the task to delete
2. Its current status
3. A specific confirmation keyword (not just "yes")

If the user hesitates, recommend moving to the backlog first rather than deleting.
