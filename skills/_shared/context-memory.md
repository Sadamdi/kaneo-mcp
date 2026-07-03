# Project Context Memory — `.kaneo/context.md`

The way an AI **remembers** a project across sessions and stays consistent with the rest of the
team. It is a single committed file at the repo root: **`.kaneo/context.md`**. Commit it so every
teammate's AI shares the same understanding.

## Protocol (every skill)
1. **Read `.kaneo/context.md` first** if it exists. Trust it over re-detecting (IDs, language,
   stack, templates). Re-validate only on error.
2. If it does NOT exist, suggest running `/kaneo-setup` to create it.
3. **After** any create / status-change / completion, append one line to the Activity log.
4. `/kaneo-setup` creates and refreshes it. When refreshing, **MERGE** — never clobber fields the
   user edited by hand.

## File structure
````markdown
---
language: en            # team working language for this project (overrides global prefs)
workspace_id: <id>
default_board: <project name or id>
updated: 2026-07-03
---

# Kaneo Context — <repo name>

## Project profile
| Path | Language | Framework | Type | Template | Entry | API | DB |
|------|----------|-----------|------|----------|-------|-----|----|
| .    | Go 1.25  | Fiber     | backend | backend | cmd/api | REST | Postgres |

<5–10 line "how this project works" summary from project-detection.md Layer B>

## Board map
| Kaneo project | ID | Purpose | Columns |
|---------------|----|---------|---------|
| <name> | <id> | <what it tracks> | to-do, in-progress, in-review, done |

Labels in use: <type labels> + <area labels>
Title convention: `[<Area>] <verb-first summary>`
Priority: urgent=blocker/security · high=this cycle · medium=normal · low=nice-to-have

## Activity log (most recent first, keep ~15)
- 2026-07-03 · created · <taskId> · [Auth] Add refresh-token rotation
- 2026-07-03 · status in-progress → done · <taskId> · [Cart] Fix total off-by-one
````

## Notes
- `language` here is LOCAL and wins over the global `~/.config/kaneo-mcp/config.json` and
  `KANEO_LANG` env (see `language.md`).
- Any field is manually editable; edits survive `/kaneo-setup` re-runs (merge, not overwrite).
- For monorepos, the Project profile table has one row per sub-project, each with its own template
  variant and board.
