---
name: kaneo
description: Overview and router for managing a Kaneo project board through the kaneo MCP. Points to the focused kaneo-* skills. Use when the user mentions Kaneo, a task/board/card, standup, or sprint, and you need to pick the right sub-skill.
---

# Kaneo Task Management — Skill Index

Manage tasks on a Kaneo board via the `mcp__kaneo__*` tools. This is the index — for a specific job,
use the focused skill below. Kaneo is a shared team board, so be grounded: never invent IDs or
facts.

## Prerequisite
```
mcp__kaneo__get_config
```
If the tools are missing, ask the user to register/restart the MCP server (see README), then stop.

## Pick a skill
| You want to… | Skill |
|--------------|-------|
| Set up Kaneo in a repo (auto-detect + language config) | `/kaneo-setup` |
| Create a new task | `/kaneo-create` |
| Document a feature as a rich card (verified from code) | `/kaneo-document` |
| Review a board + health checks | `/kaneo-review` |
| Move a task's status / project | `/kaneo-move` |
| Mark task(s) done (evidence-based) | `/kaneo-done` |
| Find tasks | `/kaneo-search` |
| Daily standup report | `/kaneo-standup` |
| Plan a sprint | `/kaneo-sprint` |
| Close a sprint | `/kaneo-close-sprint` |

## Always
1. **Discovery first** — `list_projects` before acting; never hardcode IDs.
2. **Read `.kaneo/context.md` first** if it exists (board map, language, stack); else run
   `/kaneo-setup`.
3. **Search before create**; **read before write**; **verify after write**.
4. **Board-content language** = the team's (`.kaneo/context.md` `language:`); skill files stay
   English.
5. **Format contract** — cards render as GFM markdown: tables, fenced code for formulas, `###`
   headings, no stray glyphs.
6. **Confirm before delete/bulk.**

Shared references: `skills/_shared/` (`grounding.md`, `conventions.md`, `templates.md`,
`project-detection.md`, `context-memory.md`, `language.md`, `tools-reference.md`). Universal agent
rules: `AGENT.md`.

## Big responses
`export_tasks` / `list_task_activity` can be huge — analyse with the Python recipe in
`skills/_shared/tools-reference.md`, don't paste the raw blob.

## Troubleshooting
| Problem | Fix |
|---------|-----|
| `mcp__kaneo__*` tools missing | Register/restart the MCP server; verify with `get_config` |
| 401 / auth error | Check the API key or run `kaneo-mcp login` for browser sign-in |
| "Workspace ID could not be determined" | Bad/stale task id, or set `KANEO_WORKSPACE_ID` |
| Project not found | Re-run `list_projects` |
| Response too large | Use the Python recipe in `skills/_shared/tools-reference.md` |
