---
name: kaneo-sprint
description: Plan a sprint/iteration in Kaneo — pick priority tasks from the backlog, balance team capacity, set assignees and due dates, and record the sprint goal. Use for sprint planning.
---

# /kaneo-sprint — Sprint Planning

## When to use
- Start of a sprint/week.
- Choosing what to work on this cycle.
- Distributing tasks evenly across the team.

## Step 1: Review the backlog
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```
Filter `to-do` and show by priority:
```python
import json
data = json.load(open('<path>'))
tasks = json.loads(data[0]['text']).get('tasks', [])
backlog = [t for t in tasks if t.get('status') == 'to-do']
for t in backlog:
    who = (t.get('assignee') or {}).get('name', 'Unassigned')
    print(f"[{t.get('priority','none')}] {t['title']} — {who}")
```

## Step 2: Ask the sprint goal
- **How many tasks can we take?** (team capacity)
- **Any must-have high-priority tasks?**
- **Sprint length / end date?**

## Step 3: Recommend the sprint set
Pick by: priority (`urgent` -> `high` -> `medium` -> `low`), then already-assigned, then related
tasks that can go in parallel (check `list_task_relations`). Cap **3-5 tasks per person**. Confirm:
**"These tasks for the sprint — agreed?"**

## Step 4: Set up each chosen task
```
mcp__kaneo__set_task_status   { "id": "<id>", "status": "in-progress" }
mcp__kaneo__set_task_due_date { "id": "<id>", "dueDate": "<sprint-end>" }
mcp__kaneo__set_task_assignee { "id": "<id>", "userId": "<userId>" }
```
Record the sprint goal as a comment on the chosen tasks:
```
mcp__kaneo__add_comment { "taskId": "<id>", "content": "Sprint <n> goal: <goal>" }
```

## Step 5: Sprint plan report
```
# Sprint Plan — [start] to [end]  · Project: [name]  · capacity: X

| # | Task | Priority | Assignee | Due |
|---|------|----------|----------|-----|
| 1 | Checkout | high | @Imam | 10 Jul |

Backlog left: Y tasks
```
Append the selection to the `.kaneo/context.md` Activity log.

## Tips
- Don't pull last sprint's `in-progress` — focus on fresh backlog.
- No due date given -> default to 7 days out.

## Example prompts
> "planning sprint minggu ini untuk E-Commerce"
> "pilih 5 task prioritas tertinggi dari backlog Simpan Pinjam"
