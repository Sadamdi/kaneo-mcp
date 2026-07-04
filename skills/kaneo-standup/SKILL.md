---
name: kaneo-standup
description: Generate a daily standup report from Kaneo — what's in progress, what shipped since yesterday, and blockers, grouped by person. Use for standup or a daily progress summary.
---

# /kaneo-standup — Daily Standup Report

## When to use
- Morning before standup.
- Want a quick cross-project progress snapshot.
- "What's in progress / done / blocked?"

## Step 1: Get the data
```
mcp__kaneo__list_projects
```
For each active project (has `in-progress` or `in-review` tasks):
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

## Step 2: Analyze per project/person
```python
import json
from collections import defaultdict
def analyze(path):
    data = json.load(open(path))
    tasks = json.loads(data[0]['text']).get('tasks', [])
    out = defaultdict(list)
    for t in tasks:
        s = t.get('status', '')
        if s in ('in-progress', 'in-review', 'done'):
            who = (t.get('assignee') or {}).get('name', 'Unassigned')
            out[s].append({'id': t.get('id'), 'title': t.get('title'), 'who': who})
    return out
```
Use the `.kaneo/context.md` Activity log for the "since yesterday" diff (what moved to `done`).

## Step 3: Format the report
```
# Standup — [today]

## [Project]
### In Review (ready to review)
- [title] — @assignee
### In Progress
- [title] — @assignee
### Done (since yesterday)
- [title]

## Summary
- in-progress: X · in-review: X
- Needs attention: [stale / unassigned / long-running]
```

## Step 4: Highlight blockers
Flag tasks that are stale (`in-progress` too long), unassigned, or `in-review` without approval as
**Needs attention**. Group by person so each teammate sees their line.

## Example prompts
> "/kaneo-standup"
> "buatkan laporan standup hari ini"
> "standup untuk E-Commerce saja"
