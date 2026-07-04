---
name: kaneo-sprint
description: Sprint/iteration planning in Kaneo — prioritize backlog tasks, assign, set due dates, and balance team capacity. Use for sprint planning.
---

# /kaneo-sprint — Sprint Planning in Kaneo

Skill to help plan a sprint/iteration: prioritize tasks, assign, set due dates, and review team
capacity.

## When to Use

- Start of a sprint / new week.
- Choosing which tasks to work on this week.
- Distributing tasks evenly across team members.

## Workflow

### Step 1: Review the Backlog

Get all `to-do` tasks in the project:
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

Filter `to-do` tasks and show them to the user:
```python
import json

with open('<filepath>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', [])

backlog = [t for t in tasks if t.get('status') == 'to-do']
print(f"Backlog: {len(backlog)} tasks")
for t in backlog:
    priority = t.get('priority', 'none')
    assignee = t.get('assignee', {}).get('name', 'Unassigned') if t.get('assignee') else 'Unassigned'
    print(f"  [{priority}] {t['title']} — {assignee}")
```

### Step 2: Ask the Sprint Goal

Ask the user:
- **How many tasks can we take this sprint?** (team capacity)
- **Any high-priority tasks that must be in the sprint?**
- **How many days / until what date is the sprint?**

### Step 3: Pick the Sprint Tasks

Recommend tasks based on:
1. Priority (`urgent` → `high` → `medium` → `low`)
2. Tasks that already have an assignee
3. Related tasks that can be worked in parallel (check `mcp__kaneo__list_task_relations`)

Confirm with the user: **"These tasks for this sprint — agreed?"**

### Step 4: Set Up the Sprint Tasks

For each chosen task, set:

**Move to in-progress (if starting right away):**
```
mcp__kaneo__set_task_status {
  "id": "<id>",
  "status": "in-progress"
}
```

**Set the due date to the sprint end:**
```
mcp__kaneo__set_task_due_date {
  "id": "<id>",
  "dueDate": "<sprint-end-date>"
}
```

**Assign if not yet assigned:**
```
mcp__kaneo__set_task_assignee {
  "id": "<id>",
  "userId": "<user-id>"
}
```

Record the sprint goal as a comment on the chosen tasks:
```
mcp__kaneo__add_comment { "taskId": "<id>", "content": "Sprint goal: <goal>" }
```

### Step 5: Sprint Plan Report

```
# 🚀 Sprint Plan — [Start Date] to [End Date]
## Project: [Project Name]

Total capacity: X tasks

| # | Task | Priority | Assignee | Due |
|---|------|----------|----------|-----|
| 1 | Implement checkout | high | @Imam | 10 Jul |
| 2 | Update API docs | medium | @Budi | 10 Jul |
| 3 | Fix login bug | urgent | @Imam | 8 Jul |

**Backlog remaining:** Y tasks (not in this sprint)
```

Append the selection to the `.kaneo/context.md` Activity log.

## Example prompts

> "help me plan this week's sprint for E-Commerce"

> "pick the 5 highest-priority tasks from the Simpan Pinjam backlog for this sprint"

> "sprint planning for all projects, due 11 July"

## Tips

- Don't pull last sprint's `in-progress` tasks — focus on fresh backlog.
- Recommend at most 3-5 tasks per person per sprint.
- If no due date is given, default to 7 days from today.
- After planning, offer to run `/kaneo-standup` on day one of the sprint.
