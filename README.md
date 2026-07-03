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

## Set it up by talking to your AI instead

Copy this into any AI assistant with terminal or file access (Claude, Cursor, Cline, Codex, etc.):

```
Set up the kaneo-mcp MCP server for me. Run `npx @sadamdi/kaneo-mcp` in an interactive
terminal and follow its prompts (or add an mcpServers entry named "kaneo" with
command "npx", args ["-y", "@sadamdi/kaneo-mcp", "serve"], to whichever client config
you detect I'm using — Cursor, Claude Desktop, or Claude Code). My Kaneo API key is
[PASTE_KEY_HERE] and my workspace ID is [PASTE_WORKSPACE_ID_HERE] — set those as
KANEO_API_KEY and KANEO_WORKSPACE_ID in the env block. If I didn't give you a key,
leave the env block without KANEO_API_KEY so I can sign in via browser on first use.
Tell me to restart the client afterward, then verify by calling the list_projects tool.
```

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
| **Local** | `.kaneo/context.md` (`language:`) | this project/team (committed, shared) | the `kaneo` skill's setup, or edit the file |
| **Per-machine override** | `KANEO_LANG` env in the client config | this machine | edit the MCP config `env` |

Resolution order (first wins): **local** `.kaneo/context.md` → `KANEO_LANG` → **global** config →
if nothing is set, the AI infers your team's language from the board and docs, asks once, and saves
it. Read the active language any time with `get_user_preferences`.

## Skill (documentation-grade board management)

One skill — **`kaneo`** — turns any AI into a grounded Kaneo teammate: consistent templates,
project auto-detection, render-clean markdown, and no hallucinated data. It's written in English;
the language it *writes on the board* is configurable (see [Language support](#language-support)).
Install it into your AI client:

```bash
npx @sadamdi/kaneo-mcp skills                 # into ./.claude/skills (this project)
npx @sadamdi/kaneo-mcp skills --target user   # into ~/.claude/skills (all projects)
```

The single `kaneo` skill covers every workflow — setup/onboarding, create, document, move, mark
done, review, search, standup, sprint planning, close-sprint, and sync — each with concrete
`mcp__kaneo__*` call examples. Its reference files sit alongside it in `skills/kaneo/`:
`templates.md` (card templates + the markdown format contract), `tools-reference.md`,
`context-memory.md`, and `project-detection.md`.

Just talk to your AI naturally ("create a task…", "set up kaneo here", "what's our standup?") and
it routes to the right workflow.

## Project context (`.kaneo/context.md`)

The `kaneo` skill's setup workflow writes a committed `.kaneo/context.md` at your repo root. It
records the team language, workspace/board map, detected stack per sub-project, template variants,
label taxonomy, and an activity log. The skill reads it first, so your AI (and your whole team's
AIs) stay consistent and remember context across sessions. Commit it to share; edit any field
manually.

## Set it up by talking to your AI (skill-aware)

Fill the bracketed overrides, then paste into any AI with terminal/file access:

```
Set up Kaneo for this project.
1. If the kaneo MCP server isn't registered, add it: command "npx", args ["-y",
   "@sadamdi/kaneo-mcp", "serve"], with env:
   - KANEO_BASE_URL = [URL: cloud | https://your-instance/api]   (omit for cloud)
   - auth = [AUTH: apikey <key> | browser]   (apikey -> set KANEO_API_KEY=<key>; browser -> leave
     it out and run `npx @sadamdi/kaneo-mcp login`)
   - KANEO_WORKSPACE_ID = [optional]
2. Install the skill: run `npx @sadamdi/kaneo-mcp skills`.
3. Run the kaneo skill's setup: auto-detect this repo's stack, infer our team's language from the
   board and docs, confirm the project↔board mapping, and write .kaneo/context.md.
Overrides: [LANGUAGE: auto | en | id | <any>]  [SCOPE: local | global]  [BOARD: auto | <name>].
Then restart the client and verify by calling list_projects.
```

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
