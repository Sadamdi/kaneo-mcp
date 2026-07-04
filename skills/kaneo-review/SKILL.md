---
name: kaneo-review
description: Review and analyze Kaneo tasks for one project or across all projects, grouped by status, with insights and health checks. Use when the user wants a board overview or status review.
---

# /kaneo-review — Review Tasks in Kaneo

Skill for reviewing and analyzing tasks in a Kaneo project.

> **Grounding:** read `.kaneo/context.md` first for the board map; discover real IDs. See
> `_shared/grounding.md`.

## Workflow

### Step 1: Determine the Review Scope

Ask the user (or infer from the request):
- Review **one project** or **all projects**?
- Filter to a specific status? (`in-progress`, `to-do`, `in-review`, `done`, or all)

### Step 2: Get the Data

**One project:**
```
mcp__kaneo__list_projects
```
Pick the relevant project, then:
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

**All projects:**
Run `list_projects`, then `export_tasks` for each project.

### Step 3: Analyze the Data

For large responses saved to a file, use Python:

```python
import json
from collections import Counter

with open('<file-path>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', inner)

# Group by status
by_status = {}
for t in tasks:
    s = t.get('status', 'unknown')
    by_status.setdefault(s, []).append(t)

for status, items in by_status.items():
    print(f"\n=== {status.upper()} ({len(items)}) ===")
    for t in items:
        print(f"  [{t.get('id','')}] {t.get('title','')}")
```

### Step 4: Present the Result

A good output format:

```
## Review: [Project Name]
Total tasks: XX

### 🔴 In Progress (N)
- [ID] Task title

### 🟡 In Review (N)
- [ID] Task title

### ⚪ To Do (N)
- [ID] Task title

### ✅ Done (N)
- [ID] Task title
```

### Step 5: Insight & Recommendations (optional — enhancement)

If asked, or if you spot anomalies, give health-check insights:
- Too many `in-progress` tasks (WIP limit: warn if one person has **>3**) → re-prioritize.
- No `in-review` tasks → the review flow may be unused.
- Many `to-do` tasks without an assignee → they need assignment.
- Tasks `in-progress` **>7 days** with no update (check `updatedAt`) → stale, needs a nudge.
- Cards missing acceptance criteria in their description.

## Example prompts

> "review all in-progress tasks"

> "show tasks in E-Commerce, filter to unfinished ones"

> "how many tasks per status in Simpan Pinjam?"

> "review all projects — which has the most in-progress?"

## Tips

- For a quick single-project review, `list_tasks` is more efficient than `export_tasks`.
- For a review with full descriptions, use `export_tasks`.
- To review a specific task: `mcp__kaneo__get_task { "id": "..." }`.
- To see comments: `mcp__kaneo__list_comments { "taskId": "..." }`.
