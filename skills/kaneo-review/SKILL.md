---
name: kaneo-review
description: Review and analyze Kaneo tasks for a project or across all projects, grouped by status, with health checks (WIP limits, stale tasks, unassigned, missing acceptance criteria). Use when the user wants to see board status or an overview.
---

# /kaneo-review — Review Tasks in Kaneo

Review and analyze tasks for a project (or all projects), grouped by status, with health insights.

## Step 1: Decide the scope
Ask (or infer): review **one project** or **all**? Filter a status (`to-do` / `in-progress` /
`in-review` / `done`), or all? Read `.kaneo/context.md` for the board map first.

## Step 2: Get the data
Discovery first:
```
mcp__kaneo__list_projects
```
One project (quick): `mcp__kaneo__list_tasks { "projectId": "<id>" }`.
Full detail (descriptions): `mcp__kaneo__export_tasks { "projectId": "<id>" }` — large; analyse
with the Python recipe in `_shared/tools-reference.md`, don't paste raw.

## Step 3: Analyze (Python for big exports)
```python
import json
from collections import Counter
data = json.load(open('<saved-output-file>'))
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', inner)
by_status = {}
for t in tasks:
    by_status.setdefault(t.get('status', 'unknown'), []).append(t)
print(Counter(t.get('status') for t in tasks))
```

## Step 4: Present
```
## Review: [Project Name]  — total: XX

### In Progress (N)
- [id] Title — @assignee

### In Review (N)
- [id] Title — @assignee

### To Do (N)
### Done (N)
```

## Step 5: Health checks + insight
Flag issues (don't change anything without asking):
- **WIP limit**: anyone with **>3** `in-progress` tasks.
- **Stale**: `in-progress` **>7 days** with no update (check `updatedAt`).
- **Unassigned** `in-progress` / `in-review` tasks.
- Cards **missing acceptance criteria** in their description.
- No `in-review` at all -> the review step may be unused.
Suggest concrete fixes (reassign, split, nudge, add criteria).

## Extras
- Spec task: `mcp__kaneo__get_task { "id": "<id>" }`.
- Comments: `mcp__kaneo__list_comments { "taskId": "<id>" }`.

## Example prompts
> "review semua task in-progress"
> "berapa task per status di Simpan Pinjam?"
> "review all projects — which has the most in-progress?"
