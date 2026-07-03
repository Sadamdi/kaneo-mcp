# Language Protocol

The AI must speak the language the team actually uses on this board. English is the default;
Bahasa Indonesia ships built-in; any other language works too. Two scopes: **global** (all your
projects, per machine) and **local** (this project/team, shared via git).

## Resolution order (first hit wins)
1. **LOCAL** — `language:` in `.kaneo/context.md` (committed → the whole team's AIs agree here).
2. **`KANEO_LANG`** env in the MCP client config (per-machine override).
3. **GLOBAL** — `language` in `~/.config/kaneo-mcp/config.json` (via `set_user_preferences` or the
   installer wizard).
4. **Unset** → run the first-use flow below.

Use `get_user_preferences` to read the active language + its source at any time.

## First-use flow (ask once, then never again)
1. Try to **infer** the team language automatically: sample existing card titles/descriptions on
   1–2 boards (`list_tasks`) and the repo `README`/docs (`project-detection.md` "Language
   inference"). 
2. Propose it: e.g. *"Your board and docs look Indonesian — reply in Bahasa Indonesia? [Y] /
   English / other"*. Default to English if unclear.
3. Ask scope: *"Save for this project only (local, shared with your team) or globally for all your
   projects?"*
   - **local** → write `language:` into `.kaneo/context.md`.
   - **global** → call `set_user_preferences { language }`.
4. Do not ask again. Everything is also manually configurable (edit either file).

## Applying it
- All **user-facing** output (questions, summaries, reports) → in the resolved language.
- **Card content** (titles/descriptions) → in the team's language too, so the board stays
  consistent. Technical tokens (identifiers, endpoints, code) stay as-is.
- Skill mechanics and tool calls are language-independent.
