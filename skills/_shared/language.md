# Language Protocol (board-content language)

This setting controls the **human language written into Kaneo** — task titles, descriptions, and
comments (the documentation the team reads). It is NOT the language of these skill files (those are
English) and NOT necessarily your chat reply language. English is the default; any language works.

Two scopes: **global** (all your projects, per machine) and **local** (this project/team, shared
via git).

## Resolution order (first hit wins)
1. **LOCAL** — `language:` in `.kaneo/context.md` (committed -> the whole team's AIs write in the
   same language on this board).
2. **`KANEO_LANG`** env in the MCP client config (per-machine override).
3. **GLOBAL** — `language` in `~/.config/kaneo-mcp/config.json` (via `set_user_preferences` or the
   installer wizard).
4. **Unset** -> run the first-use flow below.

Use `get_user_preferences` to read the active language + its source at any time.

## First-use flow (ask once, then never again) — handled by /kaneo-setup
1. Try to **infer** the team language automatically: sample existing card titles/descriptions on
   1-2 boards (`list_tasks`) and the repo `README`/docs.
2. Propose it: e.g. *"Your board and docs look Indonesian — write Kaneo cards in Bahasa Indonesia?
   [Y] / English / other"*. Default to English if unclear.
3. Ask scope: *"Save for this project only (local, shared with your team) or globally for all your
   projects?"*
   - **local** -> write `language:` into `.kaneo/context.md`.
   - **global** -> call `set_user_preferences { language }`.
4. Do not ask again. Everything is also manually configurable (edit either file).

## Applying it
- **Card content** (titles / descriptions / comments) -> in the resolved language, so the board
  stays consistent for the team.
- Technical tokens (identifiers, endpoints, code, table/column names) stay as-is regardless of
  language.
- Skill mechanics and tool calls are language-independent.
