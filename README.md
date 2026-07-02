# kaneo-mcp

An [MCP](https://modelcontextprotocol.io) server for [Kaneo](https://kaneo.app), the open source
project management tool ([github.com/usekaneo/kaneo](https://github.com/usekaneo/kaneo)). It gives
AI assistants full access to Kaneo's REST API — projects, tasks, boards, comments, labels, time
tracking, notifications, and integrations — so they can read and manage your workspace directly.

Built against the official [Kaneo API reference](https://kaneo.app/docs/api-reference/introduction)
and its OpenAPI spec at `https://cloud.kaneo.app/api/openapi`.

Works with any Kaneo instance — the hosted [cloud.kaneo.app](https://cloud.kaneo.app) or a
self-hosted deployment.

[![Add to Cursor](https://img.shields.io/badge/Cursor-Add%20kaneo--mcp-000000?style=for-the-badge&logo=cursor)](cursor://anysphere.cursor-deeplink/mcp/install?name=kaneo&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBzYWRhbWRpL2thbmVvLW1jcCIsInNlcnZlIl0sImVudiI6e319)

## Quick install

```bash
npx @sadamdi/kaneo-mcp
```

This opens an interactive setup wizard: pick which client to register (Cursor, Claude Desktop, or
Claude Code — project or global), and it writes the config for you. No cloning, no manual JSON
editing.

If you'd rather set it up by hand, jump to [manual client config](#manual-client-config) below.

## Authentication

Two ways to authenticate, pick whichever fits:

**API key** — sign in to Kaneo, go to **Settings → Account → Developer Settings → API Keys**,
click **Create API Key**, copy it. Works no matter how you originally signed in (Google, GitHub,
email) — API keys are independent of your session. Paste it when the installer asks, or set
`KANEO_API_KEY` yourself.

**Browser sign-in (device flow)** — leave the API key prompt blank. On first use, the server
prints a URL and a short code to your terminal; open the URL, approve the code, and you're signed
in. The resulting token is cached at `~/.config/kaneo-mcp/credentials.json` (mode 600) so you only
do this once per machine.

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

## Available tools (79)

| Category | Tools |
|---|---|
| Projects | `list_projects`, `get_project`, `create_project`, `update_project`, `archive_project`, `unarchive_project`, `delete_project` |
| Tasks | `list_tasks`, `get_task`, `create_task`, `update_task`, `set_task_status`, `set_task_priority`, `set_task_assignee`, `set_task_due_date`, `move_task`, `delete_task`, `import_tasks`, `export_tasks`, `bulk_update_tasks` |
| Columns | `list_columns`, `create_column`, `reorder_columns`, `update_column`, `delete_column` |
| Comments / Activity | `list_comments`, `add_comment`, `list_task_activity` |
| Labels | `list_workspace_labels`, `list_task_labels`, `create_label`, `get_label`, `update_label`, `delete_label`, `attach_label_to_task`, `detach_label_from_task` |
| Time Entries | `list_task_time_entries`, `get_time_entry`, `create_time_entry`, `update_time_entry` |
| Notifications | `list_notifications`, `mark_notification_read`, `mark_all_notifications_read`, `clear_all_notifications`, `get_notification_preferences`, `update_notification_preferences`, `upsert_workspace_notification_rule`, `delete_workspace_notification_rule` |
| Assets | `get_asset` |
| Search / Instance | `search`, `get_config`, `get_instance_status` |
| GitHub | `get_github_app_info`, `list_github_repositories`, `verify_github_repository`, `get_github_integration`, `connect_github_integration`, `update_github_integration`, `disconnect_github_integration`, `import_github_issues` |
| Gitea | `list_gitea_repositories`, `verify_gitea_repository`, `get_gitea_integration`, `connect_gitea_integration`, `update_gitea_integration`, `disconnect_gitea_integration`, `import_gitea_issues` |
| Discord | `get_discord_integration`, `connect_discord_integration`, `update_discord_integration`, `disconnect_discord_integration` |
| Slack | `get_slack_integration`, `connect_slack_integration`, `update_slack_integration`, `disconnect_slack_integration` |
| Webhooks | `get_webhook_integration`, `connect_webhook_integration`, `update_webhook_integration`, `disconnect_webhook_integration` |

This mirrors every endpoint in the [Kaneo API reference](https://kaneo.app/docs/api-reference/introduction)
that operates within a workspace context. Organization-level admin endpoints (member/role
management across an entire organization) are intentionally out of scope, since they carry a
different risk profile than task/project operations.

A typical flow: `search` or `list_projects` to find the target → `list_columns` to see valid
statuses → `create_task` / `update_task` / `set_task_status` to act.

## Sharing with teammates

Each person runs `npx @sadamdi/kaneo-mcp` themselves and authenticates with their own API key or
their own browser sign-in — nobody shares credentials, nobody clones a repo.

## Running from source

```bash
git clone https://github.com/Sadamdi/kaneo-mcp.git
cd kaneo-mcp
npm install
npm run build
node dist/cli.js serve
```

Use `"command": "node", "args": ["/absolute/path/to/kaneo-mcp/dist/cli.js", "serve"]` in a client
config in place of the `npx` line if you build locally instead.

## Self-hosted Kaneo

Set `KANEO_BASE_URL` to `https://<your-instance>/api`. Device-flow sign-in works against
self-hosted instances too, as long as the server allows the `kaneo-mcp` client id (it does by
default).

## License

MIT
