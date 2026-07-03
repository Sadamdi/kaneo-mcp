---
name: kaneo-search
description: Find Kaneo tasks by keyword, status, assignee, label, or priority across projects. Use when the user is looking for a task, wants everything matching a filter, or can't remember where a task lives.
---

# /kaneo-search — Find tasks

Read first: `_shared/grounding.md`, `_shared/tools-reference.md`.

## Keyword search (fast)
`search { query: <keywords>, workspaceId? }` → show title, project, status, assignee for each hit.

## Filter by status / label / assignee / priority
`search` covers text; for structured filters, `export_tasks` per project and filter in Python
(`_shared/tools-reference.md`):
```python
import json
data = json.load(open('<file>'))
tasks = json.loads(data[0]['text']).get('tasks', [])
hits = [t for t in tasks if t.get('status') == 'in-review']          # or priority/label
```
For assignee: resolve the userId via `list_workspace_members`, then filter by `assignee.id`.
For "my tasks": find the user's own member id first.

## Output
Group results by project, then status. Show `[id] title — status — @assignee`. Offer follow-ups:
open one (`get_task`), move it (`/kaneo-move`), or close it (`/kaneo-done`).

## Example prompts
> "find the task about refresh tokens" · "show all in-review tasks" ·
> "what's assigned to me?" · "all urgent bugs across projects"
