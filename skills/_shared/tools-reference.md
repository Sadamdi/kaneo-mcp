# Tools Reference — all 90 Kaneo MCP tools

Every tool the `@sadamdi/kaneo-mcp` server exposes, grouped by domain. Tool names below are the
bare names; in most clients they appear as `mcp__kaneo__<name>`. Params marked `?` are optional.
`workspaceId?` defaults to `KANEO_WORKSPACE_ID` / `.kaneo/context.md` when omitted.

> Golden path: `list_projects` → `list_columns` → act → verify. See `grounding.md`.

## Workspaces (4)
| Tool | Purpose | Params | Notes |
|------|---------|--------|-------|
| `list_workspaces` | List workspaces (organizations) + IDs | — | Start here if you don't know the workspace |
| `get_workspace` | Full org incl. members + invitations | `workspaceId?` | |
| `list_workspace_members` | Members + userId/name/email/role | `workspaceId?` | **Use `id` as `userId` for `set_task_assignee`** |
| `whoami` | Current session/user | — | Returns null with a plain API key (works with device-flow token) |

## Projects (7)
`list_projects` (—) · `get_project {id}` (includes tasks) · `create_project {workspaceId?, name, slug, icon?, description?}` · `update_project {id, name?, description?, icon?}` · `archive_project {id}` · `unarchive_project {id}` · `delete_project {id}` (destructive — confirm).

## Tasks (13)
| Tool | Params | Notes |
|------|--------|-------|
| `list_tasks` | `{projectId}` | Quick list |
| `get_task` | `{id}` | Read before every update |
| `create_task` | `{projectId, title, description?, status?, priority?, dueDate?, userId?}` | status defaults `to-do` |
| `update_task` | `{id, title?, description?, status?, priority?, dueDate?}` | Merge — read first |
| `set_task_status` | `{id, status}` | status: `to-do`/`in-progress`/`in-review`/`done` |
| `set_task_priority` | `{id, priority}` | `no-priority`/`low`/`medium`/`high`/`urgent` |
| `set_task_assignee` | `{id, userId}` | userId from `list_workspace_members` |
| `set_task_due_date` | `{id, dueDate}` | ISO 8601 |
| `move_task` | `{id, destinationProjectId, destinationStatus?}` | Cross-project move |
| `delete_task` | `{id}` | Destructive — confirm |
| `import_tasks` | `{projectId, tasks[]}` | Bulk create |
| `export_tasks` | `{projectId}` | **Can be huge** — analyse with Python/jq |
| `bulk_update_tasks` | `{taskIds[], operation, value?}` | operation: status/priority/assignee/delete — preview + confirm |

## Columns (5)
`list_columns {projectId}` · `create_column {projectId, name, icon?, color?, isFinal?}` · `reorder_columns {projectId, columns[{id,position}]}` · `update_column {id, name?, icon?, color?}` · `delete_column {id}`.

## Comments, activity & links (7)
`list_comments {taskId}` · `add_comment {taskId, content}` · `update_comment {id, content}` · `delete_comment {id}` (confirm) · `list_task_activity {taskId}` · `create_activity {taskId, userId, message, type}` · `list_task_external_links {taskId, workspaceId?}`.

## Labels (8)
`list_workspace_labels {workspaceId?}` · `list_task_labels {taskId}` · `create_label {workspaceId?, name, color}` (color = hex) · `get_label {id}` · `update_label {id, name, color}` · `delete_label {id}` · `attach_label_to_task {labelId, taskId}` · `detach_label_from_task {labelId, taskId}`.

## Time entries (4)
`list_task_time_entries {taskId}` · `get_time_entry {id}` · `create_time_entry {taskId, startTime, endTime?, description?}` · `update_time_entry {id, startTime, endTime?, description?}`.

## Notifications (9)
`list_notifications` · `create_notification {type, title?, message?, eventData?, relatedEntityId?, relatedEntityType?}` · `mark_notification_read {id}` · `mark_all_notifications_read` · `clear_all_notifications` · `get_notification_preferences` · `update_notification_preferences {emailEnabled?, ntfyEnabled?, gotifyEnabled?, webhookEnabled?, …}` · `upsert_workspace_notification_rule {workspaceId?, isActive, emailEnabled, ntfyEnabled, gotifyEnabled, webhookEnabled, projectMode, selectedProjectIds?}` · `delete_workspace_notification_rule {workspaceId?}`.

## Search & instance (3)
`search {query, workspaceId?}` (tasks/projects/comments) · `get_config` (instance flags — good health check) · `get_instance_status` (has users/admin).

## Assets (1)
`get_asset {id}` — fetch an uploaded attachment.

## Preferences (2)
`get_user_preferences` → `{language, source, stored}` · `set_user_preferences {language?, workspaceId?}` → persists to `~/.config/kaneo-mcp/config.json`. For project/team language, edit `.kaneo/context.md` instead.

## Integrations (27)
Per-project connectors; all take `{projectId, …}`.
- **GitHub (8)**: `get_github_app_info` · `list_github_repositories` · `verify_github_repository {repositoryOwner, repositoryName}` · `get_github_integration {projectId}` · `connect_github_integration {projectId, repositoryOwner, repositoryName}` · `update_github_integration {projectId, isActive?, commentTaskLinkOnGitHubIssue?}` · `disconnect_github_integration {projectId}` · `import_github_issues {projectId}`.
- **Gitea (7)**: `list_gitea_repositories {baseUrl, accessToken}` · `verify_gitea_repository {…}` · `get/connect/update/disconnect_gitea_integration` · `import_gitea_issues {projectId}`.
- **Discord (4)** / **Slack (4)** / **Webhook (4)**: `get/connect/update/disconnect_<x>_integration {projectId, webhookUrl?, events?, …}`.

## Big-response recipe (export_tasks / activity)
```python
import json
from collections import Counter
data = json.load(open('<saved-output-file>'))
inner = json.loads(data[0]['text'])       # tool result is text-wrapped
tasks = inner.get('tasks', inner)
print(Counter(t.get('status') for t in tasks))
```
