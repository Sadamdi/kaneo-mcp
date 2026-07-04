# Grounding Protocol (anti-hallucination)

Kaneo is a **shared team board**. Wrong or invented data misleads real people. Every Kaneo skill
MUST follow these rules. They are not optional.

## 1. Discovery first — never invent IDs
Before any action, discover the real IDs:
- `list_workspaces` -> workspace IDs (if you don't already have one from `.kaneo/context.md`).
- `list_projects` -> project IDs + names.
- `list_columns { projectId }` -> the real status/column slugs for that board.
- `list_workspace_members` -> user IDs, names, emails (needed for `set_task_assignee`).

Never hardcode, guess, or reuse an ID from another session. If `.kaneo/context.md` records IDs,
trust it but re-validate on error.

## 2. Search before create — no duplicates
Before `create_task`, run `search { query: "<key words from the title>" }` (and/or `list_tasks`).
If a matching task already exists, **update it** (`update_task` / `set_task_status`) instead of
creating a duplicate. Report the existing task's id to the user.

## 3. Read before write — preserve, don't overwrite
Before `update_task`, call `get_task` and read the current description. Kaneo cards are living
documentation:
- **Merge** your change into the existing structure; keep every section the user/others wrote.
- Never blind-overwrite a rich description with a short one.
- Progress notes, decisions, review outcomes -> `add_comment`, not the description body.
- `update_task` already reads-and-merges the full task body (projectId + position preserved), so a
  partial `update_task` is safe.

## 4. Verify after write
After creating or changing anything, read it back (`get_task` / `list_tasks`) and report the
**real** id, title, and status to the user. Never claim success from the request alone.

## 5. Evidence rule — no plausible fiction
Any technical claim you write into a card — an endpoint, a file path, a DB table/column, a
component name, a config key — MUST be verified against the actual codebase first (grep / read the
file). If you cannot verify it, write `TBD (verify)` instead of inventing something that merely
looks right. A card that documents a fake endpoint is worse than a card that admits a gap.

## 6. Link related tasks
When a new task depends on, blocks, duplicates, or integrates with an existing one, link them with
`create_task_relation { sourceTaskId, targetTaskId, relationType }` (`blocks` / `blocked_by` /
`relates_to` / `duplicates`). Discover candidates with `search` on shared keywords first. This keeps
integrated work connected instead of siloed.

## 7. Confirm before destructive or bulk actions
`delete_task`, `delete_project`, `delete_comment`, `delete_column`, and `bulk_update_tasks` are
irreversible or wide-reaching. Always:
1. Show a numbered preview of exactly what will change (title + current state).
2. Get explicit user approval.
3. Execute one by one, reporting each result.
For "cleanup / close sprint", prefer moving unfinished tasks back to `to-do` over deleting them.

## 8. Large responses
`export_tasks` and `list_task_activity` can be huge. When a tool result is saved to a file, analyse
it with a small Python/jq script (see `tools-reference.md`), don't paste the raw blob.

## Quick self-check before you act
- Do I have the real project/column/user IDs from discovery?
- Did I search for an existing task (and a related one to link)?
- For an update: did I read the current card and preserve it?
- Is every technical detail I'm writing verified in the code?
- For a delete/bulk: did the user explicitly approve the previewed list?
