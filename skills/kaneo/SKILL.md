---
name: kaneo
description: Manage a Kaneo project board through the kaneo MCP — create, document, move, review, search, assign, comment, plan sprints, and sync tasks. Use whenever the user mentions Kaneo, a task/board/card, a project column, standup, sprint, or wants work tracked. Grounded (never invents IDs) and writes render-clean markdown.
---

# Kaneo

One skill for everything you do on a Kaneo board through `mcp__kaneo__*` tools. Kaneo is a shared
team board, so **accuracy matters** — never guess an ID, never invent an endpoint, never leave a
card half-written. Read this file top-to-bottom the first time; after that, jump to the workflow
you need.

Reference files in this folder:
- `templates.md` — card templates per project type **and the markdown FORMAT CONTRACT** (read it
  before writing any description).
- `tools-reference.md` — every tool, its exact params, and gotchas.
- `context-memory.md` — the `.kaneo/context.md` shared-memory file format.
- `project-detection.md` — how to auto-detect a repo's stack/framework/flow.

## Prerequisite check

Confirm the MCP server is reachable before anything else:

```
mcp__kaneo__get_config
```

If the `mcp__kaneo__*` tools don't exist or this errors, the server isn't registered — tell the
user to install/restart it (`npx @sadamdi/kaneo-mcp` or see the README) and stop.

## Golden rules (always)

1. **Discovery first — never hardcode IDs.** Get real IDs from `list_projects`, `list_columns`,
   `list_workspace_members` (or trust `.kaneo/context.md` if it exists).
2. **Search before create.** Run `search` first; if a matching task exists, update it instead of
   making a duplicate.
3. **Read before write.** `get_task` before `update_task`; merge into the existing description,
   never blind-overwrite. Progress notes and decisions go to `add_comment`, not the description.
4. **Verify after write.** Read the task back and report the real id/title/status. Never claim
   success from the request alone.
5. **Evidence rule.** Every endpoint / file path / table / component you put in a card must be
   verified in the actual codebase first (grep/read). Can't verify it → write `TBD (verify)`,
   never invent something that merely looks right.
6. **Confirm before delete or bulk change.** Show a numbered preview, get explicit approval,
   execute one by one. Prefer moving unfinished tasks back to `to-do` over deleting.

## Format contract (how to write descriptions so they render)

Kaneo renders task descriptions as **markdown** (TipTap + GFM). If you paste raw multi-line text,
it collapses into unreadable paragraphs. Every description you write MUST obey:

- **Blank line between blocks.** Single newlines collapse — separate every paragraph, list, table,
  and code block with a blank line.
- **Tables → GFM tables** (`| col | col |` with a `|---|---|` separator row). Never paste
  spreadsheet/docx rows as plain lines.
- **Formulas, calculations, ASCII layouts, code → fenced code blocks** (```` ``` ````), with a
  language tag when it's real code (```` ```go ````).
- **Steps/flows → numbered lists**; enumerations → bullet lists; checklists → `- [ ]` task lists.
- **Section titles → `###` / `####` headings.**
- **No raw HTML.** No stray Word glyphs — never leave the section-sign character or smart quotes;
  write "section 2.1" in words, and turn a "Section 11 Dashboard" line into `### 11. Dashboard`.
- When embedding an external doc (docx/pdf/spec), **convert it to markdown first** — "complete"
  means all the content, structured, not raw pasted formatting.

Full templates and a filled example are in `templates.md`.

## Language (what language to write on the board)

Write card content (titles, descriptions, comments) and your replies in the **team's language**.
Resolve it in this order (first hit wins):

1. `language:` in `.kaneo/context.md` (this project's team language, shared via git).
2. `KANEO_LANG` env in the MCP config.
3. Global preference — `mcp__kaneo__get_user_preferences`.
4. Unset → infer it: sample a board's existing cards (`list_tasks`) and the repo README; propose
   the language you see, ask **once** whether to save it for **this project** (write `language:` in
   `.kaneo/context.md`) or **globally** (`set_user_preferences { language }`), then never ask
   again. Default to English if unclear.

Technical tokens (identifiers, endpoints, code) always stay as-is regardless of language.

## Project context memory

If `.kaneo/context.md` exists at the repo root, **read it first** and trust its board map,
language, and stack over re-detecting. If it doesn't exist, offer to run the **Setup** workflow.
After every create / status change / completion, append one line to its Activity log. Format spec:
`context-memory.md`.

## Step 0 — Discovery (do this first every session)

```
mcp__kaneo__list_projects
```

Returns every project with its id. Then for the board you'll touch:

```
mcp__kaneo__list_columns { "projectId": "<id>" }
```

Valid status slugs are usually `to-do`, `in-progress`, `in-review`, `done` (some boards add
`reject`). Use the real slugs this call returns — don't assume.

---

# Workflows

## Setup / onboarding (first time in a repo)

Use when there's no `.kaneo/context.md` yet, or the user says "set up kaneo here".

1. Check the server: `mcp__kaneo__get_config`.
2. Discover the workspace + boards:
   ```
   mcp__kaneo__list_projects
   mcp__kaneo__list_workspace_labels
   ```
3. Detect the project stack/framework/flow — follow `project-detection.md` (read `go.mod` /
   `package.json` / `pubspec.yaml` / etc.; for a monorepo, detect each sub-project).
4. Infer the team language from existing cards + README (see **Language** above); propose it and
   ask local-vs-global **once**.
5. Propose a project → board mapping (match by name), confirm with the user.
6. Write `.kaneo/context.md` (see `context-memory.md`). If it already exists, **merge** — never
   clobber fields the user edited by hand.
7. Offer to create any missing standard TYPE/AREA labels (see the label table under **Create**).
8. Print a summary of what was configured and how to override any field (edit `.kaneo/context.md`
   or re-run this workflow).

## Create a task

1. Pick the project (`list_projects`; or from `.kaneo/context.md` board map).
2. Gather what you need for the questions:
   ```
   mcp__kaneo__list_workspace_labels
   mcp__kaneo__get_project { "id": "<projectId>" }
   ```
3. Ask the user in **one** message (skip anything they already gave):
   > **New task details:**
   > 1. **Title** — verb-first, e.g. "Add refresh-token rotation"
   > 2. **Description / acceptance criteria** — what does "done" mean?
   > 3. **Priority** — `low` / `medium` / `high` / `urgent`
   > 4. **Assignee** — who works on it? (from members below)
   > 5. **Labels** — pick existing or name new ones
   > 6. **Due date** — optional (ISO `YYYY-MM-DD`)
4. **Search for duplicates** before creating:
   ```
   mcp__kaneo__search { "query": "<key words from the title>" }
   ```
   If a match exists, update it instead and tell the user.
5. Draft the description with the right template from `templates.md` (per project type) — obey the
   **format contract**. If acceptance criteria are vague, propose a concrete draft.
6. Create the label(s) if new (pick a hex color from the table below):
   ```
   mcp__kaneo__create_label { "name": "<name>", "color": "#3b82f6" }
   ```
   | Label | Color | | Label | Color |
   |---|---|---|---|---|
   | `bug` / `security` | `#ef4444` | | `backend` | `#22c55e` |
   | `feature` | `#3b82f6` | | `frontend` | `#f97316` |
   | `docs` | `#eab308` | | `mobile` | `#06b6d4` |
   | `design` | `#a855f7` | | `infra` | `#6b7280` |
   | `chore` / `refactor` | `#94a3b8` | | `data` | `#8b5cf6` |
7. Create the task:
   ```
   mcp__kaneo__create_task {
     "projectId": "<id>",
     "title": "<title>",
     "description": "<markdown body>",
     "status": "to-do",
     "priority": "medium"
   }
   ```
8. Attach labels, set assignee/due date if given:
   ```
   mcp__kaneo__attach_label_to_task { "labelId": "<id>", "taskId": "<newId>" }
   mcp__kaneo__set_task_assignee { "id": "<newId>", "userId": "<userId>" }
   ```
   (Get `userId` from `mcp__kaneo__list_workspace_members`.)
9. **Verify**: `mcp__kaneo__get_task { "id": "<newId>" }` — confirm and report the real id +
   status. Append to the `.kaneo/context.md` Activity log.

## Document a feature (documentation-grade card)

Use when turning code or a spec into a rich card that reads like real documentation.

1. Detect the project type (`project-detection.md`) → pick the template variant in `templates.md`.
2. **Gather verified facts from the codebase** (evidence rule): grep/read for the real endpoints,
   handler/service/repository files, DB tables/migrations, roles. Anything you can't confirm →
   `TBD (verify)`.
3. If embedding an external doc (docx/pdf/spec), convert it to markdown per the format contract —
   tables become GFM tables, formulas become fenced blocks, section numbers become headings, and
   stray Word glyphs are removed. Keep the content complete; only fix the formatting.
4. Search for an existing card first; if found, **enrich** it (get_task → merge → update_task).
5. Create/update with the full template body, attach `backend`/`frontend`/… + a type label,
   verify, and log it.

## Move a task / change status

1. Find the task (skip if the user gave an id):
   ```
   mcp__kaneo__list_tasks { "projectId": "<id>" }
   ```
2. Confirm the current state: `mcp__kaneo__get_task { "id": "<id>" }`.
3. Change status (use a real slug from `list_columns`):
   ```
   mcp__kaneo__set_task_status { "id": "<id>", "status": "in-progress" }
   ```
   To move to another project: `mcp__kaneo__move_task { "id": "<id>",
   "destinationProjectId": "<pid>", "destinationStatus": "to-do" }`.
4. Moving to `in-review` should say **what** to review — add the PR link as a comment:
   ```
   mcp__kaneo__add_comment { "taskId": "<id>", "content": "PR: <url>" }
   ```
   Moving to `done` → run the **Mark done** checks first.
5. Confirm: "Moved '<title>' from `<old>` → `<new>`". Log it.

## Mark done (evidence-based)

1. `get_task` and read the acceptance criteria in the description.
2. Verify each is actually met (code merged? tests pass? endpoint live?). If some aren't, warn the
   user and ask whether to proceed.
3. `mcp__kaneo__set_task_status { "id": "<id>", "status": "done" }`.
4. Add a completion comment (what shipped, PR/commit ref):
   ```
   mcp__kaneo__add_comment { "taskId": "<id>", "content": "Done: <what shipped>, PR <url>" }
   ```
5. Append to the Activity log.

## Review a board / health check

1. `mcp__kaneo__list_tasks { "projectId": "<id>" }` (or `export_tasks` for full descriptions —
   analyse big results with the Python recipe in `tools-reference.md`).
2. Report: counts per status; **health flags** — anyone with >3 `in-progress` (WIP limit), tasks
   `in-progress` >7 days without update (stale), `in-progress`/`in-review` with no assignee, cards
   missing acceptance criteria.
3. Suggest concrete fixes (reassign, split, nudge) — don't change anything without asking.

## Search for tasks

```
mcp__kaneo__search { "query": "<keywords>" }
```

Searches tasks/projects/comments. To filter by label/assignee/priority, `export_tasks` for the
project and filter with the Python recipe in `tools-reference.md`.

## Daily standup

1. `export_tasks` for the relevant board(s).
2. Group by assignee. For each person: **In progress**, **moved to done since yesterday** (use the
   Activity log in `.kaneo/context.md` for the "since yesterday" diff), **blockers** (stale or
   flagged).
3. Output a compact per-person summary.

## Sprint planning

1. `list_tasks` on the backlog board; show `to-do` items with priority.
2. Propose a sprint set: priority-first, respect capacity (~3–5 tasks per person), account for
   dependencies. Confirm with the user.
3. For each chosen task: set priority, assignee, and record the sprint goal via `add_comment`.
   Log the selection.

## Close a sprint

1. `list_tasks`; split into finished (`done`) vs unfinished.
2. **Default: move unfinished back to `to-do`** (never delete by default):
   ```
   mcp__kaneo__set_task_status { "id": "<id>", "status": "to-do" }
   ```
   Only delete a task with explicit per-task confirmation.
3. Output a retro summary: shipped vs carried-over, and why.

## Sync board with reality

1. `export_tasks` for the board.
2. Cross-check `in-progress`/`in-review` cards against what the user reports merged (git log,
   branches, PRs). Look for features that exist in code but have no card.
3. Propose a single batch: status moves + new cards to create. Apply after **one** combined
   confirmation. Update the Activity log.

## Common atomic operations

```
mcp__kaneo__set_task_priority  { "id": "<id>", "priority": "high" }
mcp__kaneo__set_task_due_date  { "id": "<id>", "dueDate": "2026-12-31" }
mcp__kaneo__add_comment        { "taskId": "<id>", "content": "<note>" }
mcp__kaneo__set_task_assignee  { "id": "<id>", "userId": "<userId>" }
```

Assignee `userId` comes from `mcp__kaneo__list_workspace_members`.

## Delete a task (confirm first)

Show what will be deleted, get an explicit "yes", then:

```
mcp__kaneo__delete_task { "id": "<id>" }
```

## Big responses

`export_tasks` and `list_task_activity` can be large. When the result is saved to a file, analyse
it with the Python recipe in `tools-reference.md` instead of pasting the raw blob.

## Troubleshooting

| Problem | Fix |
|---|---|
| `mcp__kaneo__*` tools missing | Register/restart the MCP server (see README); verify with `get_config` |
| 401 / auth error | Check the API key or run `kaneo-mcp login` for browser sign-in |
| "Workspace ID could not be determined" | The task id is wrong/stale, or set `KANEO_WORKSPACE_ID` |
| Project not found | Re-run `list_projects` |
| Response too large | Use the Python recipe in `tools-reference.md` |

## Staying up to date

On startup the server checks npm for a newer version. If the server instructions or
`mcp__kaneo__check_for_updates` report one, tell the user to run
`npx -y @sadamdi/kaneo-mcp@latest` and restart their client before continuing.
