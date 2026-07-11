---
name: kaneo-search
description: Search Kaneo tasks by keyword, status, assignee, label, due date, or dependency/comment context across all projects. Use when the user wants to find tasks.
---

# /kaneo-search — Find Tasks Across All Projects

Skill for finding tasks by keyword, status, assignee, label, due date, or context.

## Workflow

### Quick keyword search

```
mcp__kaneo__search { "query": "<keywords>" }
```

Backend full-text over title+description only — fast, but no filters and comments are NOT indexed
(verified). Good for a one-shot lookup when you don't need to narrow by anything else.

### Filtered / precise search — use `search_advanced` first, not `export_tasks`

`search_advanced` gives real server-side-equivalent filtering without exporting/parsing the whole
board. Prefer it over the old `export_tasks` + Python pattern unless you need to compute something
`search_advanced` can't (e.g. custom aggregation across every field).

```
mcp__kaneo__search_advanced {
  query?, titleOnly?, projectId?,
  status?, priority?, assigneeId?, assigneeName?, labelName?,
  dueBefore?, dueAfter?, sortBy?, limit?,
  includeRelations?, includeComments?
}
```

- Pass `projectId` when you know the board — one fast call, full fidelity (labels+assignee free).
- Omit `projectId` to search the whole workspace. Filtering by `assigneeId`/`assigneeName`/`labelName`
  with no `projectId` scans every project (one call per project) — fine for a handful of boards.
- `assigneeName`/`labelName` are substring, case-insensitive. `status`/`priority`/`assigneeId` are
  exact matches.
- `includeRelations: true` attaches each result's linked tasks (blocks/related/subtask, with titles)
  — useful when the user asks "what does this depend on" or "what's blocking X" without a follow-up
  `list_task_relations` call. Costs one extra call per returned result — keep `limit` reasonable.
- `includeComments: true` (with `query`) checks each already-matched result's comments for the query
  and attaches the first hit as `matchedComment`. This does NOT widen which tasks match — comments
  aren't indexed at all, so a task whose only match is buried in a comment won't appear as a result.
  It only enriches results already found via title/description/other filters.

### Search by status across all projects

```
mcp__kaneo__search_advanced { "status": "in-review" }
```

### Search by assignee

```
mcp__kaneo__list_workspace_members            # resolve userId
mcp__kaneo__search_advanced { "assigneeId": "<userId>" }
```

Or by name substring without resolving the ID first: `{ "assigneeName": "Budi" }`.

### Search by label

```
mcp__kaneo__search_advanced { "labelName": "backend" }
```

### Fallback: custom aggregation `export_tasks` can't be replaced for

If the user wants something `search_advanced` doesn't cover (e.g. counts/histograms across every
field, or full descriptions for many tasks at once), fall back to:

```python
import json

def search_by_status(filepath, target_status):
    with open(filepath) as f:
        data = json.load(f)
    inner = json.loads(data[0]['text'])
    tasks = inner.get('tasks', [])
    return [t for t in tasks if t.get('status') == target_status]
```

### Format the results

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

> "what does the Simpanan epic depend on?" → `search_advanced` with `includeRelations: true`

> "is 'edge case X' mentioned anywhere, even in a comment?" → `search_advanced` with `query` +
> `includeComments: true` — note this only checks comments on tasks already matched some other way.

## Tips

- `search` is full-text over title+description only — no filters, no comments indexed.
- `search_advanced` covers status/priority/assignee/label/due-date/title-only — prefer it over
  `export_tasks` + Python for anything filter-shaped.
- `includeRelations`/`includeComments` cost one extra call per returned result — keep `limit` small
  when using them on a broad, unscoped search.
- Show results grouped by project for readability.
- If there are too many results, ask the user to narrow the filter.
