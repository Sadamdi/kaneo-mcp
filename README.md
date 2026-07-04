# kaneo-mcp

An [MCP](https://modelcontextprotocol.io) server for [Kaneo](https://kaneo.app), the open source
project management tool ([github.com/usekaneo/kaneo](https://github.com/usekaneo/kaneo)). It gives
AI assistants full access to Kaneo's REST API — projects, tasks, boards, comments, labels, time
tracking, notifications, and integrations — so they can read and manage your workspace directly.

Built against the official [Kaneo API reference](https://kaneo.app/docs/api-reference/introduction)
and its OpenAPI spec at `https://cloud.kaneo.app/api/openapi`.

Works with any Kaneo instance — the hosted [cloud.kaneo.app](https://cloud.kaneo.app) or a
self-hosted deployment.

[![npm version](https://img.shields.io/npm/v/@sadamdi/kaneo-mcp.svg)](https://www.npmjs.com/package/@sadamdi/kaneo-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@sadamdi/kaneo-mcp.svg)](https://www.npmjs.com/package/@sadamdi/kaneo-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![Add to Cursor](https://img.shields.io/badge/Cursor-Add%20kaneo--mcp-000000?style=for-the-badge&logo=cursor)](cursor://anysphere.cursor-deeplink/mcp/install?name=kaneo&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBzYWRhbWRpL2thbmVvLW1jcCIsInNlcnZlIl0sImVudiI6e319)

Package on npm: [npmjs.com/package/@sadamdi/kaneo-mcp](https://www.npmjs.com/package/@sadamdi/kaneo-mcp)

## Quick install

```bash
npx @sadamdi/kaneo-mcp
```

This opens an interactive setup wizard: pick which client to register (Cursor, Claude Desktop, or
Claude Code — project or global), and it writes the config for you. No cloning, no manual JSON
editing.

If you'd rather set it up by hand, jump to [manual client config](#manual-client-config) below.

## Authentication

Two ways to authenticate — both work on Kaneo Cloud and self-hosted instances. Pick whichever fits:

**API key** — sign in to Kaneo, go to **Settings → Account → Developer Settings → API Keys**,
click **Create API Key**, copy it. Works no matter how you originally signed in (Google, GitHub,
email) — API keys are independent of your session. Paste it when the installer asks, or set
`KANEO_API_KEY` yourself.

**Browser sign-in (OAuth device flow)** — no API key needed. Either leave the installer's API-key
prompt blank (the first tool call then prints a URL + code), or run it explicitly:

```bash
npx @sadamdi/kaneo-mcp login          # opens browser sign-in against KANEO_BASE_URL (cloud by default)
npx @sadamdi/kaneo-mcp login --url https://kaneo.mycompany.com/api   # self-hosted
npx @sadamdi/kaneo-mcp logout         # clear the cached token
```

Open the printed URL, approve the code, and you're signed in. The token is cached at
`~/.config/kaneo-mcp/credentials.json` (mode 600) so you only do this once per machine.

## Workspace ID

Most tools need a `workspaceId`. It's in the URL when you're inside a workspace:

```
https://cloud.kaneo.app/dashboard/workspace/<WORKSPACE_ID>/...
```

The installer asks for it and sets `KANEO_WORKSPACE_ID` so you don't have to pass it on every
call. It can still be overridden per call for multi-workspace setups.

## Manual client config

Every client uses the same command and environment variables:

```json
{
  "mcpServers": {
    "kaneo": {
      "command": "npx",
      "args": ["-y", "@sadamdi/kaneo-mcp", "serve"],
      "env": {
        "KANEO_API_KEY": "your-api-key-here",
        "KANEO_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
```

Drop that block into:

- **Cursor** — `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global)
- **Claude Desktop** — `claude_desktop_config.json`
- **Claude Code** — `.mcp.json` in the project root, or `claude mcp add kaneo --env KANEO_API_KEY=your-api-key-here --env KANEO_WORKSPACE_ID=your-workspace-id -- npx -y @sadamdi/kaneo-mcp serve`
- **Cline** — same block via its "Configure MCP Servers" panel
- **Codex CLI** — `~/.codex/config.toml`:
  ```toml
  [mcp_servers.kaneo]
  command = "npx"
  args = ["-y", "@sadamdi/kaneo-mcp", "serve"]

  [mcp_servers.kaneo.env]
  KANEO_API_KEY = "your-api-key-here"
  KANEO_WORKSPACE_ID = "your-workspace-id"
  ```

Omit the `env` block entirely to use browser sign-in instead of an API key.

## Set it up by talking to your AI (one prompt does everything)

Copy this into any AI with terminal + file access (Claude Code, Cursor, Cline, Codex, …). It
registers the MCP server, installs the skills, runs first-time project setup, and turns on
auto-sync (so from then on the AI keeps your Kaneo board updated as you work). Fill the
`[brackets]`:

```
Set up Kaneo for this project — MCP server, skills, and auto-sync.

1. Register the MCP server if it isn't already. Detect my client (Cursor .cursor/mcp.json,
   Claude Desktop config, or Claude Code .mcp.json) and add an "mcpServers" entry named "kaneo":
   command "npx", args ["-y", "@sadamdi/kaneo-mcp", "serve"], env:
     - KANEO_API_KEY     = [PASTE_KEY or leave out to sign in via `npx @sadamdi/kaneo-mcp login`]
     - KANEO_WORKSPACE_ID = [PASTE_WORKSPACE_ID or omit]
     - KANEO_BASE_URL     = [omit for cloud, or https://your-instance/api for self-hosted]
2. Install the skills into this repo: run `npx @sadamdi/kaneo-mcp skills`.
3. Run /kaneo-setup: auto-detect this repo's stack, infer the board language, confirm the
   project<->board mapping, and write .kaneo/context.md.
4. Turn on auto-sync: append this rule to my agent instructions (CLAUDE.md or AGENTS.md at the
   repo root, or a .cursor/rules/kaneo.mdc file) so every future session follows it —
   "Kaneo board sync: read .kaneo/context.md first. Whenever you make a meaningful change, add a
   feature, fix a bug, or start new work in this repo, automatically create or update the matching
   Kaneo task with the kaneo skills (/kaneo-create or /kaneo-document), move its status as work
   progresses (/kaneo-move), and mark it done when finished (/kaneo-done). Never invent IDs; verify
   after writing."

Overrides: [LANGUAGE: auto | en | id | <any>]  [SCOPE: local | global]  [BOARD: auto | <name>].
Then tell me to restart the client, and verify by calling the list_projects tool.
```

That's the whole thing — after it runs, just work normally and the AI files/updates Kaneo tasks for
you. Details on each piece are in [Skills](#skills-documentation-grade-board-management),
[Auto-sync](#auto-sync-keep-the-board-updated-as-you-work), and
[Language support](#language-support) below.

## Available tools (102)

| Category | Tools |
|---|---|
| Workspaces | `list_workspaces`, `get_workspace`, `list_workspace_members`, `whoami` |
| Projects | `list_projects`, `get_project`, `create_project`, `update_project`, `archive_project`, `unarchive_project`, `delete_project` |
| Tasks | `list_tasks`, `get_task`, `create_task`, `update_task`, `set_task_status`, `set_task_priority`, `set_task_assignee`, `set_task_due_date`, `set_task_dates`, `move_task`, `delete_task`, `import_tasks`, `export_tasks`, `bulk_update_tasks` |
| Relations / Workflow rules | `list_task_relations`, `create_task_relation`, `delete_task_relation`, `list_workflow_rules`, `upsert_workflow_rule`, `delete_workflow_rule` |
| Columns | `list_columns`, `create_column`, `reorder_columns`, `update_column`, `delete_column` |
| Comments / Activity | `list_comments`, `add_comment`, `update_comment`, `delete_comment`, `list_task_activity`, `create_activity`, `list_task_external_links` |
| Labels | `list_workspace_labels`, `list_task_labels`, `create_label`, `get_label`, `update_label`, `delete_label`, `attach_label_to_task`, `detach_label_from_task` |
| Time Entries | `list_task_time_entries`, `get_time_entry`, `create_time_entry`, `update_time_entry` |
| Notifications | `list_notifications`, `create_notification`, `mark_notification_read`, `mark_all_notifications_read`, `clear_all_notifications`, `get_notification_preferences`, `update_notification_preferences`, `upsert_workspace_notification_rule`, `delete_workspace_notification_rule` |
| Assets | `get_asset` |
| Search / Instance | `search`, `get_config`, `get_instance_status` |
| Preferences / Updates | `get_user_preferences`, `set_user_preferences`, `check_for_updates` |
| GitHub | `get_github_app_info`, `list_github_repositories`, `verify_github_repository`, `get_github_integration`, `connect_github_integration`, `update_github_integration`, `disconnect_github_integration`, `import_github_issues` |
| Gitea | `list_gitea_repositories`, `verify_gitea_repository`, `get_gitea_integration`, `connect_gitea_integration`, `update_gitea_integration`, `disconnect_gitea_integration`, `import_gitea_issues` |
| Discord | `get_discord_integration`, `connect_discord_integration`, `update_discord_integration`, `disconnect_discord_integration` |
| Slack | `get_slack_integration`, `connect_slack_integration`, `update_slack_integration`, `disconnect_slack_integration` |
| Webhooks | `get_webhook_integration`, `connect_webhook_integration`, `update_webhook_integration`, `disconnect_webhook_integration` |
| Telegram | `get_telegram_integration`, `connect_telegram_integration`, `update_telegram_integration`, `disconnect_telegram_integration` |

This mirrors every endpoint in the [Kaneo API reference](https://kaneo.app/docs/api-reference/introduction)
that operates within a workspace context. Organization-level admin endpoints (member/role
management across an entire organization) are intentionally out of scope, since they carry a
different risk profile than task/project operations.

A typical flow: `search` or `list_projects` to find the target → `list_columns` to see valid
statuses → `create_task` / `update_task` / `set_task_status` to act. Grounding rules (never invent
IDs or facts) are enforced via the server's MCP instructions, so they reach every client — even
without the skills installed.

## Language support

The default language is **English**, but you can change it — **Bahasa Indonesia** ships built-in,
and any other language works too. There are two scopes:

| Scope | Where | Applies to | How to set |
|-------|-------|------------|-----------|
| **Global** | `~/.config/kaneo-mcp/config.json` | all your projects, this machine | installer wizard, or `set_user_preferences`, or edit the file |
| **Local** | `.kaneo/context.md` (`language:`) | this project/team (committed, shared) | `/kaneo-setup`, or edit the file |
| **Per-machine override** | `KANEO_LANG` env in the client config | this machine | edit the MCP config `env` |

Resolution order (first wins): **local** `.kaneo/context.md` → `KANEO_LANG` → **global** config →
if nothing is set, the AI infers your team's language from the board and docs, asks once, and saves
it. Read the active language any time with `get_user_preferences`.

## Skills (documentation-grade board management)

Ten focused skills turn any AI into a grounded Kaneo teammate: consistent templates, project
auto-detection, render-clean markdown, and no hallucinated data. The skill files are English; the
language they *write onto the board* is configurable (see [Language support](#language-support)).
Install them into your AI client:

```bash
npx @sadamdi/kaneo-mcp skills                 # into ./.claude/skills (this project)
npx @sadamdi/kaneo-mcp skills --target user   # into ~/.claude/skills (all projects)
```

| Skill | Use it to |
|-------|-----------|
| `/kaneo-setup` | Onboard a repo: auto-detect stack, infer + set the board language, map boards, write `.kaneo/context.md` |
| `/kaneo-create` | Create a well-formed task (title, acceptance criteria, labels, assignee, links to related tasks) |
| `/kaneo-document` | Turn code/spec into a documentation-grade card (every claim verified in the code) |
| `/kaneo-review` | Review a board + health checks (WIP, stale, unassigned, missing criteria) |
| `/kaneo-move` | Change a task's status / project with the right semantics |
| `/kaneo-done` | Close tasks with an evidence-based acceptance-criteria check |
| `/kaneo-search` | Find tasks by keyword / status / assignee / label |
| `/kaneo-standup` | Daily standup report grouped by person |
| `/kaneo-sprint` | Sprint planning with team-capacity balancing |
| `/kaneo-close-sprint` | Close a sprint (carry over, safe cleanup) |

Shared references live in `skills/_shared/` (grounding, conventions, templates + the markdown format
contract, project-detection, context-memory, language, and the full 102-tool reference). Just talk
to your AI naturally ("buatkan task…", "set up kaneo here", "what's our standup?") and it routes to
the right skill.

## Auto-sync (keep the board updated as you work)

The skills are on-demand, but you can make the board update **automatically** — every meaningful
change or new task lands on Kaneo without you asking. It works because AI coding agents read a rules
file at the start of every session:

1. `npx @sadamdi/kaneo-mcp skills` installs the skills **and** an `AGENT.md` (into `.claude/`) that
   already contains an **"Auto-sync the board"** rule.
2. Point your agent's always-on instructions at it. Add one line to the file your client
   auto-loads — `CLAUDE.md` / `AGENTS.md` at the repo root, or a `.cursor/rules/kaneo.mdc` (Cursor):

   > **Kaneo board sync.** Read `.kaneo/context.md` first. Whenever you make a meaningful change,
   > add a feature, fix a bug, or start new work in this repo, automatically create or update the
   > matching Kaneo task (`/kaneo-create` or `/kaneo-document`), move its status as work progresses
   > (`/kaneo-move`), and mark it done when finished (`/kaneo-done`). Follow `.claude/AGENT.md`.

   The one-prompt setup above does this step for you (step 4).

From then on: implement a feature → a `to-do`/`in-progress` card appears; open a PR → it moves to
`in-review`; merge → `done` — grounded (never invents IDs) and in your board language. Because the
rule lives in a committed file, every teammate's AI behaves the same.

## Project context (`.kaneo/context.md`)

`/kaneo-setup` writes a committed `.kaneo/context.md` at your repo root. It records the team
language, workspace/board map, detected stack per sub-project, template variants, label taxonomy,
and an activity log. Every skill reads it first, so your AI (and your whole team's AIs) stay
consistent and remember context across sessions. Commit it to share; edit any field manually.

## Staying up to date

Every time the server starts it checks npm for a newer version. If one exists, it tells your AI (via
the server instructions and the `check_for_updates` tool) to notify you. To update:

```bash
npx -y @sadamdi/kaneo-mcp@latest        # runs the newest version
# or, if pinned in a client config, bump the version and restart the client
```

`npx @sadamdi/kaneo-mcp` (no version) already fetches the latest on each run. Restart your AI client
after updating so it reloads the tools.

## Sharing with teammates

Each person runs `npx @sadamdi/kaneo-mcp` themselves and authenticates with their own API key or
browser sign-in — nobody shares credentials, nobody clones a repo. Commit `.kaneo/context.md` so
everyone's AI shares the same board map, language, and templates.

## Running from source

```bash
git clone https://github.com/Sadamdi/kaneo-mcp.git
cd kaneo-mcp
npm install && npm run build
node dist/cli.js serve
```

Use `"command": "node", "args": ["/abs/path/to/kaneo-mcp/dist/cli.js", "serve"]` in a client config
in place of the `npx` line if you build locally.

## Self-hosted Kaneo

Kaneo is open source and self-hostable — this MCP works against any instance. Point it at your
deployment with `KANEO_BASE_URL` (the API base, ending in `/api`):

```json
{
  "mcpServers": {
    "kaneo": {
      "command": "npx",
      "args": ["-y", "@sadamdi/kaneo-mcp", "serve"],
      "env": {
        "KANEO_BASE_URL": "https://kaneo.mycompany.com/api",
        "KANEO_API_KEY": "your-api-key-here",
        "KANEO_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
```

Both auth methods work: an API key from your instance, or browser sign-in
(`npx @sadamdi/kaneo-mcp login --url https://kaneo.mycompany.com/api`). The installer wizard also
asks for the base URL — press Enter for cloud, or type your self-hosted URL.

## License

MIT
