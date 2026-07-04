---
name: kaneo-standup
description: Generate a daily standup report from Kaneo — what's in progress, what's ready for review, what's done, and blockers. Use for a standup or a daily progress summary.
---

# /kaneo-standup — Daily Report from Kaneo

Skill for generating a daily standup report based on the state of tasks in Kaneo.

## When to Use

- In the morning before the standup meeting.
- Want to know the progress across all projects at once.
- Want a short report: what's being worked on, what's done, any blockers?

## Workflow

### Step 1: Get the Data for All Projects

```
mcp__kaneo__list_projects
```

For each active project (has `in-progress` or `in-review` tasks):
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

### Step 2: Analyze Per Project

Use Python to extract the relevant tasks:

```python
import json
from collections import defaultdict

def analyze_project(filepath):
    with open(filepath) as f:
        data = json.load(f)
    inner = json.loads(data[0]['text'])
    tasks = inner.get('tasks', [])

    result = defaultdict(list)
    for t in tasks:
        status = t.get('status', '')
        if status in ('in-progress', 'in-review', 'done'):
            result[status].append({
                'id': t.get('id'),
                'title': t.get('title'),
                'assignee': t.get('assignee', {}).get('name', 'Unassigned') if t.get('assignee') else 'Unassigned'
            })
    return result
```

For the "done since yesterday" diff, use the Activity log in `.kaneo/context.md`
(`_shared/context-memory.md`).

### Step 3: Format the Standup Report

A clear, concise output:

```
# 🗓️ Standup — [Today's Date]

## [Project 1]

### ✅ In Review (ready to review)
- [task title] — @assignee

### 🔄 In Progress (being worked on)
- [task title] — @assignee

### ✅ Done (just finished)
- [task title]

---

## [Project 2]
(empty if no activity)

---

## Summary
- Total in-progress: X tasks
- Total in-review: X tasks
- Needs attention: [tasks stuck in-progress with no update]
```

### Step 4: Highlight Blockers (optional)

Mark as **⚠️ Needs Attention** any task that is:
- `in-progress` for too long (check `updatedAt`),
- unassigned,
- `in-review` but not yet approved.

## Example prompts

> "/kaneo-standup"

> "make today's standup report"

> "what's in progress across all projects?"

> "standup report for E-Commerce only"

## Tips

- Focus on truly active projects; skip projects where everything is `to-do` or `done`.
- Order: `in-review` → `in-progress` → `done` (review has higher priority).
- If there are many projects, ask the user which to highlight first.
