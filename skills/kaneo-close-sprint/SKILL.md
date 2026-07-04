---
name: kaneo-close-sprint
description: Close a Kaneo sprint — review results, move unfinished tasks back to the backlog (never delete by default), and clean up only with explicit confirmation. Use when a sprint ends.
---

# /kaneo-close-sprint — Close a Sprint & Tidy Up

## Warning
This skill can **permanently delete tasks**. Always confirm before `delete_task`. There is no undo.
Default to MOVING unfinished tasks back to `to-do`, not deleting.

## Step 1: Review the sprint
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```
```python
import json
from collections import Counter
data = json.load(open('<path>'))
tasks = json.loads(data[0]['text']).get('tasks', [])
print(Counter(t.get('status') for t in tasks))
```

## Step 2: Summary
```
# Sprint Summary — [Project]
Done       : X  -> keep
In Progress: X  -> unfinished
In Review  : X  -> unfinished
To Do      : X  -> not started
Velocity: X of Y done (XX%)
```

## Step 3: Ask what to do per group
- **`in-progress` / `in-review`**: "Move to backlog (`to-do`), carry to next sprint (keep
  `in-progress`), or delete?"
- **`to-do` not worked**: "Keep in backlog, or delete any?"

## Step 4: Execute
Move to backlog (default, safe):
```
mcp__kaneo__bulk_update_tasks { "taskIds": ["<id1>", "<id2>"], "operation": "status", "value": "to-do" }
```
Delete (CONFIRM FIRST — no undo). Show the list:
```
Will permanently delete:
- [id] Title 1
- [id] Title 2
Type "YA HAPUS" to confirm, or "batal" to cancel.
```
After explicit confirmation, delete one by one:
```
mcp__kaneo__delete_task { "id": "<id>" }
```

## Step 5: Closing report
```
# Sprint Closed — [Project]
- Done: X · Carried over: X · Back to backlog: X · Deleted: X
Backlog now: X tasks
```
Append to the `.kaneo/context.md` Activity log. Offer `/kaneo-sprint` for the next one.

## Delete rule
Never delete without explicit confirmation showing title + current status + a specific keyword
(not just "yes"). If the user hesitates, recommend moving to backlog instead.

## Example prompts
> "tutup sprint E-Commerce"
> "sprint selesai, pindah semua yang belum done ke backlog"
