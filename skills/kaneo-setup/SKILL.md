---
name: kaneo-setup
description: First-run onboarding for Kaneo in a repo. Use when the user first connects Kaneo here, mentions setup/onboarding, or when .kaneo/context.md does not exist yet. Auto-detects the project stack, infers the team's language, maps Kaneo boards, and writes .kaneo/context.md.
---

# /kaneo-setup — Onboard Kaneo for this project

Configure Kaneo for the current repo once, so every later skill is grounded and consistent.
Auto-detect first, confirm with the user, persist to `.kaneo/context.md`. Everything is also
manually overridable.

Read first: `_shared/grounding.md`, `_shared/language.md`, `_shared/project-detection.md`,
`_shared/context-memory.md`.

## Step 1 — Verify the MCP is reachable
Call `get_config`. If it errors, tell the user to check the MCP server / API key (see README) and
stop.

## Step 2 — Language (auto-infer → confirm → persist)
Follow `_shared/language.md`:
1. Read `get_user_preferences` — if a language is already set and the user isn't re-running setup,
   keep it.
2. Otherwise infer: sample 1–2 boards (`list_projects` then `list_tasks`) and the repo `README`;
   guess the team's human language.
3. Propose it, ask English/Indonesian/other, then ask **scope**: local (this project) or global.
   - local → record in `.kaneo/context.md` `language:`.
   - global → `set_user_preferences { language }`.

## Step 3 — Discovery
`list_workspaces` (pick/confirm the workspace) → `list_projects` → `list_columns` for each board
you'll use → `list_workspace_labels`. If multiple workspaces, ask which one.

## Step 4 — Deep project detection
Run `_shared/project-detection.md` on the working directory: read manifests (`go.mod`,
`package.json`, `pubspec.yaml`, `Cargo.toml`, `Dockerfile`, …) to get language + framework + type;
skim entry points, API style, data layer, CI for a short "how it works" summary. For monorepos,
detect **per sub-directory** and record each.

## Step 5 — Map projects ↔ boards
Propose a mapping between the repo's sub-projects and Kaneo boards by name similarity; ask the user
to confirm or correct. Record which template variant (backend/frontend/mobile/infra/data/generic)
each uses.

## Step 6 — Write `.kaneo/context.md`
Create the file per `_shared/context-memory.md` (YAML front block + Project profile + Board map +
Activity log seeded with a "setup" entry). If it already exists, **merge** — never clobber manual
edits. Commit it if the user wants team sharing.

## Step 7 — Offer standard labels
Compare existing labels to the taxonomy in `_shared/conventions.md`. Offer to create missing TYPE
(`feature/bug/chore/docs/refactor/security/perf`) and AREA (`frontend/backend/mobile/infra/data/
design`) labels with the suggested colors. Only create after the user agrees.

## Step 8 — Summary
Print what was configured: language + scope, workspace, board↔project map, detected stack per
sub-project, template variants, and **how to override** anything (edit `.kaneo/context.md` or
re-run `/kaneo-setup`). Suggest next steps: `/kaneo-create`, `/kaneo-document`, `/kaneo-standup`.

## Example prompts
> "set up kaneo for this repo" · "onboard kaneo" · "configure the kaneo board for our team"
