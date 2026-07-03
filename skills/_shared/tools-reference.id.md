# Referensi Tools — 90 tool Kaneo MCP

Semua tool yang di-expose server `@sadamdi/kaneo-mcp`, dikelompokkan per domain. Nama di bawah = nama
polos; di kebanyakan klien muncul sebagai `mcp__kaneo__<name>`. Param bertanda `?` opsional.
`workspaceId?` default ke `KANEO_WORKSPACE_ID` / `.kaneo/context.md` bila dikosongkan.

> Jalur emas: `list_projects` → `list_columns` → aksi → verifikasi. Lihat `grounding.id.md`.

## Workspaces (4)
| Tool | Fungsi | Param | Catatan |
|------|--------|-------|---------|
| `list_workspaces` | Daftar workspace (organisasi) + ID | — | Mulai di sini bila belum tahu workspace |
| `get_workspace` | Org lengkap + member + undangan | `workspaceId?` | |
| `list_workspace_members` | Member + userId/nama/email/role | `workspaceId?` | **Pakai `id` sebagai `userId` untuk `set_task_assignee`** |
| `whoami` | Sesi/user saat ini | — | null dengan API key (jalan dengan token device-flow) |

## Projects (7)
`list_projects` · `get_project {id}` (termasuk tasks) · `create_project {workspaceId?, name, slug, icon?, description?}` · `update_project {id, name?, description?, icon?}` · `archive_project {id}` · `unarchive_project {id}` · `delete_project {id}` (destruktif — konfirmasi).

## Tasks (13)
| Tool | Param | Catatan |
|------|-------|---------|
| `list_tasks` | `{projectId}` | Daftar cepat |
| `get_task` | `{id}` | Baca sebelum tiap update |
| `create_task` | `{projectId, title, description?, status?, priority?, dueDate?, userId?}` | status default `to-do` |
| `update_task` | `{id, title?, description?, status?, priority?, dueDate?}` | Merge — baca dulu |
| `set_task_status` | `{id, status}` | `to-do`/`in-progress`/`in-review`/`done` |
| `set_task_priority` | `{id, priority}` | `no-priority`/`low`/`medium`/`high`/`urgent` |
| `set_task_assignee` | `{id, userId}` | userId dari `list_workspace_members` |
| `set_task_due_date` | `{id, dueDate}` | ISO 8601 |
| `move_task` | `{id, destinationProjectId, destinationStatus?}` | Pindah antar-project |
| `delete_task` | `{id}` | Destruktif — konfirmasi |
| `import_tasks` | `{projectId, tasks[]}` | Bikin massal |
| `export_tasks` | `{projectId}` | **Bisa besar** — analisis Python/jq |
| `bulk_update_tasks` | `{taskIds[], operation, value?}` | status/priority/assignee/delete — preview + konfirmasi |

## Columns (5)
`list_columns {projectId}` · `create_column {projectId, name, icon?, color?, isFinal?}` · `reorder_columns {projectId, columns[{id,position}]}` · `update_column {id, name?, icon?, color?}` · `delete_column {id}`.

## Komentar, aktivitas & tautan (7)
`list_comments {taskId}` · `add_comment {taskId, content}` · `update_comment {id, content}` · `delete_comment {id}` · `list_task_activity {taskId}` · `create_activity {taskId, userId, message, type}` · `list_task_external_links {taskId, workspaceId?}`.

## Labels (8)
`list_workspace_labels {workspaceId?}` · `list_task_labels {taskId}` · `create_label {workspaceId?, name, color}` · `get_label {id}` · `update_label {id, name, color}` · `delete_label {id}` · `attach_label_to_task {labelId, taskId}` · `detach_label_from_task {labelId, taskId}`.

## Time entries (4)
`list_task_time_entries {taskId}` · `get_time_entry {id}` · `create_time_entry {taskId, startTime, endTime?, description?}` · `update_time_entry {id, startTime, endTime?, description?}`.

## Notifications (9)
`list_notifications` · `create_notification {type, title?, message?, eventData?, relatedEntityId?, relatedEntityType?}` · `mark_notification_read {id}` · `mark_all_notifications_read` · `clear_all_notifications` · `get_notification_preferences` · `update_notification_preferences {…}` · `upsert_workspace_notification_rule {…}` · `delete_workspace_notification_rule {workspaceId?}`.

## Search & instance (3)
`search {query, workspaceId?}` · `get_config` (cek kesehatan) · `get_instance_status`.

## Assets (1)
`get_asset {id}`.

## Preferences (2)
`get_user_preferences` → `{language, source, stored}` · `set_user_preferences {language?, workspaceId?}`. Untuk bahasa project/tim, edit `.kaneo/context.md`.

## Integrations (27)
Konektor per-project; semua terima `{projectId, …}`.
- **GitHub (8)**, **Gitea (7)**, **Discord (4)**, **Slack (4)**, **Webhook (4)**: pola
  `get/connect/update/disconnect_<x>_integration` + verify/import/list untuk GitHub/Gitea.

## Resep respons besar (export_tasks / activity)
```python
import json
from collections import Counter
data = json.load(open('<file-output>'))
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', inner)
print(Counter(t.get('status') for t in tasks))
```
