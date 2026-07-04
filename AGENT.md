# Kaneo MCP — Agent Instructions

For every AI agent (Claude, Cursor, Copilot, Codex, Gemini, …) working with Kaneo through this MCP.

## What Kaneo is
Kaneo is a team project-management board. The `@sadamdi/kaneo-mcp` server exposes the full Kaneo API
for projects, tasks, comments, labels, time tracking, notifications, workspaces/members, and
integrations. Because it's a **shared team board**, correctness matters — never guess or invent.

## The skill
There is one skill: **`kaneo`** (in `skills/kaneo/`). It handles every board action — setup,
create, document, move, done, review, search, standup, sprint, close-sprint, sync — with concrete
`mcp__kaneo__*` call examples. Install it with `kaneo-mcp skills`. Supporting references live beside
it: `templates.md` (card templates + the markdown format contract), `tools-reference.md`,
`context-memory.md`, `project-detection.md`.

## Golden rules
1. **Discovery first** — `list_projects` / `list_columns` / `list_workspace_members` before acting;
   never hardcode or invent IDs.
2. **Search before create** — no duplicate tasks.
3. **Read before write** — `get_task` first; merge, preserve; progress → `add_comment`.
4. **Verify after write** — read back, report the real id/status.
5. **Evidence rule** — every endpoint/file/schema in a card must be verified in the codebase, else
   `TBD (verify)`.
6. **Confirm before delete/bulk** — preview + explicit approval.

## Format contract (make cards render)
Kaneo renders descriptions as markdown (GFM). Single newlines collapse. Use blank lines between
blocks; GFM tables for tabular data; fenced code blocks for formulas/code; numbered/bullet/task
lists; `###` headings. No raw HTML, no stray Word glyphs (write "section N" in words).
Full contract + templates: `skills/kaneo/templates.md`.

## Language (board-content language)
Write card content (titles, descriptions, comments) and replies in the **team's language**.
Resolution: `.kaneo/context.md` `language:` (local) → `KANEO_LANG` env → global config
(`get_user_preferences`) → infer from the board + README and ask once, then persist
(`set_user_preferences` for global, `.kaneo/context.md` for project). Default English. Technical
tokens (identifiers, endpoints, code) stay as-is.

## Project context memory
If `.kaneo/context.md` exists, read it first and follow its board map, language, stack, and
templates. If it doesn't, offer the setup workflow. After each create/status-change/completion,
append to its Activity log. Format: `skills/kaneo/context-memory.md`.

## Staying up to date
On startup the server checks npm for a newer version. If one exists, the server's instructions and
the `check_for_updates` tool report it — tell the user to run `npx -y @sadamdi/kaneo-mcp@latest`
and restart their client before continuing.

## If tools aren't available
`mcp__kaneo__*` tools missing → ask the user to register/restart the MCP server (see README).
Verify with `get_config`.
