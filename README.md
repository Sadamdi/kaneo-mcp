# kaneo-mcp

An [MCP](https://modelcontextprotocol.io) server for [Kaneo](https://kaneo.app), the open source
project management tool ([github.com/usekaneo/kaneo](https://github.com/usekaneo/kaneo)). It gives
AI assistants full access to Kaneo's REST API — projects, tasks, boards, comments, labels, time
tracking, notifications, and integrations — so they can read and manage your workspace directly.

Built against the official [Kaneo API reference](https://kaneo.app/docs/api-reference/introduction)
and its OpenAPI spec at `https://cloud.kaneo.app/api/openapi`.

Works with any Kaneo instance — the hosted [cloud.kaneo.app](https://cloud.kaneo.app) or a
self-hosted deployment — through a personal API key. There's no OAuth flow and no browser
automation involved; you generate a key once and the server calls Kaneo's REST API with it.

## 1. Get your Kaneo API key

Your sign-in method (Google, GitHub, email, whatever) doesn't matter here. API keys are
independent of your session and authenticate the same way no matter how you logged in.

1. Sign in to Kaneo.
2. Go to **Settings → Account → Developer Settings → API Keys**.
3. Click **Create API Key**, name it, and copy the value immediately — it's shown once.

## 2. Find your workspace ID

Most endpoints need a `workspaceId`. It's in the URL when you're inside a workspace:

```
https://cloud.kaneo.app/dashboard/workspace/<WORKSPACE_ID>/...
```

Set `KANEO_WORKSPACE_ID` so you don't need to pass it on every call. It can still be overridden
per call for multi-workspace use.

## 3. Install and build

```bash
git clone https://github.com/Sadamdi/kaneo-mcp.git
cd kaneo-mcp
npm install
npm run build
```

This produces `dist/index.js`, a stdio MCP server.

## 4. Configure your MCP client

Every MCP client needs the same command and environment variables:

- `KANEO_API_KEY` — required
- `KANEO_WORKSPACE_ID` — optional but recommended
- `KANEO_BASE_URL` — only for self-hosted Kaneo, defaults to `https://cloud.kaneo.app/api`

### Claude Code

```bash
claude mcp add kaneo -- node "C:/path/to/kaneo-mcp/dist/index.js"
```

or in `.mcp.json`:

```json
{
  "mcpServers": {
    "kaneo": {
      "command": "node",
      "args": ["C:/path/to/kaneo-mcp/dist/index.js"],
      "env": {
        "KANEO_API_KEY": "your-api-key-here",
        "KANEO_WORKSPACE_ID": "your-workspace-id"
      }
    }
  }
}
```

### Claude Desktop

Same block in `claude_desktop_config.json`.

### Cursor

Same block in `.cursor/mcp.json`.

### Cline

Same block in `cline_mcp_settings.json`.

### Codex CLI

`~/.codex/config.toml`:

```toml
[mcp_servers.kaneo]
command = "node"
args = ["C:/path/to/kaneo-mcp/dist/index.js"]

[mcp_servers.kaneo.env]
KANEO_API_KEY = "your-api-key-here"
KANEO_WORKSPACE_ID = "your-workspace-id"
```

Any other MCP-capable client follows the same shape: `command: node`, `args: [".../dist/index.js"]`,
and the same two environment variables.

### Let an AI do this for you

Instead of doing steps 3–4 by hand, paste the contents of [SETUP_PROMPT.md](SETUP_PROMPT.md) into
your AI assistant along with your API key and workspace ID. It will clone, build, and wire up the
config file for whichever client you're using.

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
management across an entire organization) are intentionally out of scope for now, since they
carry a different risk profile than task/project operations.

A typical flow: `search` or `list_projects` to find the target → `list_columns` to see valid
statuses → `create_task` / `update_task` / `set_task_status` to act.

## Sharing with teammates

Each person should generate their own API key rather than sharing one. Clone this repo, build it,
and point your own client config at your own key and workspace ID. If this gets published to npm,
swap `command`/`args` for `"npx"` / `["-y", "kaneo-mcp"]` and skip the local build step entirely.

Never commit a real API key. `.env` is gitignored — use `.env.example` as a template for local
testing.

## Self-hosted Kaneo

Set `KANEO_BASE_URL` to `https://<your-instance>/api`. Nothing else changes.

## License

MIT
