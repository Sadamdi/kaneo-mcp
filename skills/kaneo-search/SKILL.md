---
name: kaneo-search
description: Find Kaneo tasks by keyword, status, assignee, or label across one or all projects. Use when the user wants to locate tasks.
---

# /kaneo-search — Find Tasks Across Projects

## Quick search (by keyword)
```
mcp__kaneo__search { "query": "<keywords>" }
```
Searches tasks/projects/comments full-text. Show results with: title, project, status, assignee.

## Filter by status across all projects
1. `mcp__kaneo__list_projects`
2. `mcp__kaneo__export_tasks { "projectId": "<id>" }` per project, then filter:
```python
import json
def by_status(path, target):
    data = json.load(open(path))
    tasks = json.loads(data[0]['text']).get('tasks', [])
    return [t for t in tasks if t.get('status') == target]
```

## Filter by assignee
Get the userId from `mcp__kaneo__list_workspace_members`, then:
```python
def by_assignee(path, user_id):
    data = json.load(open(path))
    tasks = json.loads(data[0]['text']).get('tasks', [])
    return [t for t in tasks if t.get('assignee') and t['assignee'].get('id') == user_id]
```

## Present (grouped by project)
```
## Results: "[query]"  — X found

### E-Commerce
- [in-progress] Checkout page — @Imam
- [in-review] Update API docs — @Budi

### Simpan Pinjam
- [to-do] Loan application form — Unassigned
```

## Tips
- `search` is best for keywords; `export_tasks` + Python is more precise for status/assignee/label.
- If too many results, ask the user to narrow it.

## Example prompts
> "cari task tentang checkout"
> "tampilkan semua task yang di-assign ke saya"
> "which tasks have no assignee?"
