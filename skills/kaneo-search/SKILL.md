---
name: kaneo-search
description: Search Kaneo tasks by keyword, status, assignee, or other criteria across all projects. Use when the user wants to find tasks.
---

# /kaneo-search — Find Tasks Across All Projects

Skill for finding tasks by keyword, status, assignee, or other criteria.

## Workflow

### Quick Search (by keyword)

```
mcp__kaneo__search { "query": "<keywords>" }
```

Show results with: title, project, status, assignee.

### Search by Status Across All Projects

If the user wants all tasks with a certain status (e.g. everything `in-review`):

1. Get all projects:
   ```
   mcp__kaneo__list_projects
   ```

2. Export tasks per project, then filter:
   ```python
   import json

   def search_by_status(filepath, target_status):
       with open(filepath) as f:
           data = json.load(f)
       inner = json.loads(data[0]['text'])
       tasks = inner.get('tasks', [])
       return [t for t in tasks if t.get('status') == target_status]
   ```

### Search by Assignee

If the user wants to see all their tasks:
1. Get the user ID from `mcp__kaneo__list_workspace_members`.
2. Export tasks and filter by `assignee.id`:

```python
def search_by_assignee(filepath, user_id):
    with open(filepath) as f:
        data = json.load(f)
    inner = json.loads(data[0]['text'])
    tasks = inner.get('tasks', [])
    return [
        t for t in tasks
        if t.get('assignee') and t['assignee'].get('id') == user_id
    ]
```

### Format the Results

```
## Search Results: "[query]"
Found X tasks

### E-Commerce
- [in-progress] Implement checkout page — @Imam
- [in-review] Update API docs — @Budi

### Simpan Pinjam
- [to-do] Loan application form — Unassigned
```

## Example prompts

> "find tasks related to checkout"

> "show all tasks assigned to me"

> "find in-review tasks across all projects"

> "is there a task about 'documentation' anywhere?"

> "which tasks have no assignee?"

## Tips

- `mcp__kaneo__search` is full-text — great for keywords.
- To filter by status/assignee, `export_tasks` + Python is more precise.
- Show results grouped by project for readability.
- If there are too many results, ask the user to narrow the filter.
