# Kaneo MCP — Agent Instructions

For every AI agent (Claude, Cursor, Copilot, Codex, Gemini, …) working with Kaneo through this MCP.

## Context
Kaneo is a team project-management board. The `@sadamdi/kaneo-mcp` server gives full access to the
Kaneo API — **103 tools** for projects, tasks, comments, labels, time tracking, notifications,
workspaces/members, task relations, workflow rules, and integrations. It's a **shared team board**,
so correctness matters — never guess or invent.

## Golden rules
1. **Discovery first** — `list_projects` / `list_columns` / `list_workspace_members` before acting;
   never hardcode or invent IDs.
2. **Search before create** — no duplicate tasks; also look for a related task to link.
3. **Read before write** — `get_task` first; merge, preserve; progress -> `add_comment`.
4. **Verify after write** — read back, report the real id/status.
5. **Evidence rule** — every endpoint/file/schema in a card must be verified in the codebase, else
   `TBD (verify)`.
6. **Confirm before delete/bulk** — preview + explicit approval.

Details: `skills/_shared/grounding.md`.

## Format contract (make cards render)
Kaneo renders descriptions as GFM markdown; single newlines collapse. Use blank lines between
blocks, GFM tables for tabular data, fenced code blocks for formulas/code, numbered/bullet/task
lists, `###` headings. No raw HTML and no stray Word glyphs (write "section N" in words). When
embedding a docx/pdf/spec, convert to markdown first — complete content, structured. Full contract +
templates: `skills/_shared/templates.md`.

## Board-content language
Write card content (titles, descriptions, comments) in the **team's board language** — separate
from these English skill files and from your chat language. Resolution: `.kaneo/context.md`
`language:` (local) -> `KANEO_LANG` env -> global config (`get_user_preferences`) -> infer + ask
once via `/kaneo-setup`, then persist. Default English. Technical tokens stay as-is.
Details: `skills/_shared/language.md`.

## Project context memory
If `.kaneo/context.md` exists, read it first and follow its board map, language, stack, and
templates. If it doesn't, run `/kaneo-setup`. After each create / status change / completion, append
to its Activity log. Format: `skills/_shared/context-memory.md`.

## Auto-sync the board (always-on)
Keep Kaneo in sync with the work as it happens — don't wait to be asked:
- **New work / feature / bug / meaningful change** → create or update the matching task
  (`/kaneo-create` for a quick task, `/kaneo-document` for a documentation-grade card verified
  against the code). Search first so you update instead of duplicating.
- **Work progresses** → move the status (`/kaneo-move`): `to-do` → `in-progress` when you start,
  `in-review` when a PR opens (add the PR link as a comment), `done` when it's merged/shipped
  (`/kaneo-done`, after the acceptance-criteria check).
- **Link related work** with `create_task_relation`.
Do all of this grounded (never invent IDs; verify after writing) and in the team's board language.
Teams turn this on by pointing their always-on agent rules (CLAUDE.md / AGENTS.md / a Cursor rule)
at this file — see the README "Auto-sync" section.

## Skills (10)
| Situation | Skill |
|-----------|-------|
| First-time setup / onboarding in a repo | `/kaneo-setup` |
| Create a new task | `/kaneo-create` |
| Documentation-grade card from code/spec | `/kaneo-document` |
| Review a board / health check | `/kaneo-review` |
| Move a task's status | `/kaneo-move` |
| Mark task(s) done (evidence-based) | `/kaneo-done` |
| Find tasks | `/kaneo-search` |
| Daily standup report | `/kaneo-standup` |
| Sprint planning | `/kaneo-sprint` |
| Close a sprint | `/kaneo-close-sprint` |

Assigning is handled inside `/kaneo-create` and `/kaneo-move` (resolve `userId` via
`list_workspace_members`). Install the skills with `npx @sadamdi/kaneo-mcp skills`.

## Frequently used tools
```
# Discovery
mcp__kaneo__list_projects          -> all projects + IDs
mcp__kaneo__list_columns           -> columns/statuses in a project
mcp__kaneo__get_project { id }     -> project detail + tasks
mcp__kaneo__list_workspace_members -> members + userId (for assignee)

# Read tasks
mcp__kaneo__list_tasks             -> tasks in a project
mcp__kaneo__export_tasks           -> all tasks + descriptions (large — use Python/jq)
mcp__kaneo__get_task { id }        -> one task
mcp__kaneo__search { query }       -> full-text search

# Act on tasks (note: id, not taskId)
mcp__kaneo__create_task            -> create
mcp__kaneo__update_task { id }     -> update (reads + merges the full body)
mcp__kaneo__set_task_status { id, status }
mcp__kaneo__set_task_priority { id, priority }
mcp__kaneo__set_task_assignee { id, userId }
mcp__kaneo__set_task_dates { id, startDate?, dueDate? }
mcp__kaneo__move_task { id, destinationProjectId, destinationStatus? }
mcp__kaneo__bulk_update_tasks { taskIds[], operation, value }
mcp__kaneo__create_task_relation { sourceTaskId, targetTaskId, relationType }
mcp__kaneo__delete_task { id }     -> CONFIRM FIRST

# Collaboration
mcp__kaneo__add_comment { taskId, content }
mcp__kaneo__list_comments { taskId }
```
Full reference of all 103 tools: `skills/_shared/tools-reference.md`.

## Status & priority values
Status: `to-do` -> `in-progress` -> `in-review` -> `done` (some boards add extra columns — check
`list_columns`). Priority: `low` · `medium` · `high` · `urgent`.

## Staying up to date
On startup the server checks npm for a newer version. If one exists, tell the user to run
`npx -y @sadamdi/kaneo-mcp@latest` and restart their client before continuing.

## If tools aren't available
`mcp__kaneo__*` missing -> ask the user to register/restart the MCP server (see README). Verify with
`get_config`.
