---
name: kaneo-setup
description: First-run onboarding for a repo — verify the Kaneo MCP, auto-detect the project (language, framework, what it does), infer and set the board language, map projects to boards, and write .kaneo/context.md. Use the first time you work with Kaneo in a project, or to reconfigure.
---

# /kaneo-setup — Onboard a Repo to Kaneo (auto-detect, once)

Run this the first time an AI works with Kaneo in a repo. It makes every later action grounded and
consistent by writing a shared `.kaneo/context.md`. It is automatic first, manual-overridable
always. Re-running MERGES — it never clobbers fields the user edited by hand.

## Step 1: Verify the server
```
mcp__kaneo__get_config
```
If the `mcp__kaneo__*` tools are missing or this errors, the MCP isn't registered — tell the user to
install/restart it (see the README) and stop.

## Step 2: Discover the workspace + boards
```
mcp__kaneo__list_projects
mcp__kaneo__list_workspace_labels
```
For each board you'll map: `mcp__kaneo__list_columns { "projectId": "<id>" }`.

## Step 3: Auto-detect the project (stack + flow)
Follow `_shared/project-detection.md`. Read manifests (`go.mod`, `package.json`, `pubspec.yaml`,
`pyproject.toml`, `Cargo.toml`, `*.csproj`, `Dockerfile`/`*.tf`, etc.) to determine language,
framework, package manager, and type (frontend / backend / mobile / infra / data). Skim entry
points, API style, DB/migrations, and CI to write a 5-10 line "how this project works" summary. For
a monorepo, detect **each** sub-project and record one row per sub-project.

## Step 4: Board-content language (ask once)
Per `_shared/language.md`: infer the team's language from existing card content (`list_tasks` on
1-2 boards) and the repo README. Propose it, then ask **local (this project) or global (all your
projects)** once, and persist:
- local -> `language:` in `.kaneo/context.md`.
- global -> `mcp__kaneo__set_user_preferences { "language": "<lang>" }`.
Default English if unclear. Never ask again.

## Step 5: Map projects to boards
Propose a `<sub-project> -> <Kaneo board>` mapping by name similarity; confirm with the user.

## Step 6: Write (or merge) `.kaneo/context.md`
Generate the file per `_shared/context-memory.md`: YAML front matter (language, workspace_id,
default_board, updated), the Project profile table, the Board map, label/title/priority
conventions, and an Activity log. If the file already exists, **merge** — keep manual edits.

## Step 7: Offer standard labels
Offer to create any missing standard TYPE (`feature`/`bug`/`chore`/`docs`/`refactor`/`security`/
`perf`) and AREA (`frontend`/`backend`/`mobile`/`infra`/`data`) labels
(`mcp__kaneo__create_label { name, color }`, colors in `_shared/conventions.md`).

## Step 8: Summary
Print what was configured (language + scope, stack per sub-project, board map) and how to override
any field (edit `.kaneo/context.md` or re-run `/kaneo-setup`).

## Example prompts
> "set up kaneo untuk repo ini"
> "kaneo belum di-setup di project ini, tolong konfigurasikan"
