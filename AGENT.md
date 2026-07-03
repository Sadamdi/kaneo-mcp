# Kaneo MCP — Agent Instructions

For every AI agent (Claude, Cursor, Copilot, Codex, Gemini, …) working with Kaneo through this MCP.
Indonesian version: [`AGENT.id.md`](AGENT.id.md).

## What Kaneo is
Kaneo is a team project-management board. The `@sadamdi/kaneo-mcp` server exposes the full Kaneo API
(91 tools) for projects, tasks, comments, labels, time tracking, notifications, workspaces/members,
and integrations. Because it's a **shared team board**, correctness matters — never guess or invent.

## Read these first (skills/_shared/)
- `grounding.md` — anti-hallucination protocol (**mandatory**).
- `language.md` — which language to reply in (global vs local, auto-infer).
- `conventions.md` — how a good card looks (title, sections, labels, priority, status).
- `templates.md` — card templates per project type (backend/frontend/mobile/infra/data).
- `project-detection.md` — auto-detect the project's stack + flow.
- `context-memory.md` — `.kaneo/context.md`, the shared project memory.
- `tools-reference.md` — every tool, its params, and gotchas.

## Golden rules (from grounding.md)
1. **Discovery first** — `list_projects` / `list_columns` / `list_workspace_members` before acting;
   never hardcode or invent IDs.
2. **Search before create** — no duplicate tasks.
3. **Read before write** — `get_task` first; merge, preserve; progress → `add_comment`.
4. **Verify after write** — read back, report the real id/status.
5. **Evidence rule** — every endpoint/file/schema in a card must be verified in the codebase, else
   `TBD (verify)`.
6. **Confirm before delete/bulk** — preview + explicit approval.

## Language
Reply in the team's language. Resolution: `.kaneo/context.md` `language:` (local) → `KANEO_LANG`
env → global config (`get_user_preferences`) → ask once (auto-infer from board + docs) and persist.

## Project context memory
If `.kaneo/context.md` exists, read it first and follow its board map, language, stack, and
templates. If it doesn't, suggest `/kaneo-setup`. After each create/status-change/completion, append
to its Activity log.

## Skills (12)
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
| Reconcile board with git/PRs/code | `/kaneo-sync` |

Assigning is handled inside `/kaneo-create` and `/kaneo-move` (resolve userId via
`list_workspace_members`).

## Staying up to date
On startup the server checks npm for a newer version. If one exists, the server's instructions and
a `check_for_updates` tool report it — tell the user to run `npx -y @sadamdi/kaneo-mcp@latest` and
restart their client before continuing.

## If tools aren't available
`mcp__kaneo__*` tools missing → ask the user to register/restart the MCP server (see README).
Verify with `get_config`.
