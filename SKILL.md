---
name: kaneo
description: Manage a Kaneo project board via MCP — create/move/review/document tasks, standups, sprints, and board sync. Use whenever the user mentions Kaneo, tasks, tickets, the board, or managing team work.
---

# Kaneo Task Management

Entry point for managing a Kaneo board with grounded, documentation-grade tasks. Indonesian
version: [`SKILL.id.md`](SKILL.id.md). Agent rules: [`AGENT.md`](AGENT.md).

## Prerequisite
The Kaneo MCP server must be registered. Check with `get_config`. If it fails, ask the user to set
up the MCP server (see README) — `npx @sadamdi/kaneo-mcp`.

## Always
1. If `.kaneo/context.md` exists, read it first (board map, language, project stack). Else suggest
   `/kaneo-setup`.
2. Reply in the team's language (`_shared/language.md`).
3. Follow the grounding protocol (`_shared/grounding.md`): discover IDs, search before create, read
   before write, verify after write, evidence for every technical claim, confirm before delete.

## Reference docs (`skills/_shared/`)
`grounding.md` · `language.md` · `conventions.md` · `templates.md` · `project-detection.md` ·
`context-memory.md` · `tools-reference.md` (all 91 tools).

## Choose a skill
- **Onboard a repo** → `/kaneo-setup` (auto-detect stack, infer language, map boards, write context)
- **New task** → `/kaneo-create`
- **Detailed card from code/spec** → `/kaneo-document`
- **Review / health** → `/kaneo-review`
- **Change status** → `/kaneo-move`
- **Close (evidence-based)** → `/kaneo-done`
- **Find** → `/kaneo-search`
- **Standup** → `/kaneo-standup`
- **Sprint planning** → `/kaneo-sprint`
- **Close sprint** → `/kaneo-close-sprint`
- **Reconcile with code/PRs** → `/kaneo-sync`

## Updates
If the server reports a newer version (startup check / `check_for_updates`), tell the user to run
`npx -y @sadamdi/kaneo-mcp@latest` and restart their client.

## Quick tool map
Discovery: `list_workspaces`, `list_projects`, `list_columns`, `list_workspace_members`. Read:
`list_tasks`, `get_task`, `export_tasks`, `search`. Write: `create_task`, `update_task`,
`set_task_status`/`priority`/`assignee`/`due_date`, `move_task`, `add_comment`. Full list:
`_shared/tools-reference.md`.
