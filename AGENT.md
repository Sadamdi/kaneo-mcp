# Kaneo MCP — Agent Instructions

Instruksi ini berlaku untuk semua AI agent (Claude, Cursor, Copilot, Codex, Gemini, dll) yang bekerja dengan Kaneo via MCP.

## Konteks

Kaneo adalah project management tool. MCP server (`@sadamdi/kaneo-mcp`) memberikan akses penuh ke API Kaneo — 79 tools untuk mengelola project, task, komentar, label, time tracking, dan integrasi.

## Aturan Utama

1. **Selalu discovery dulu** — jangan hardcode ID apapun. Gunakan `list_projects` untuk dapat project ID terkini sebelum melakukan aksi apapun.
2. **Status adalah string** — nilai valid: `to-do`, `in-progress`, `in-review`, `done`.
3. **Konfirmasi sebelum hapus** — tampilkan daftar item yang akan dihapus dan minta konfirmasi eksplisit sebelum menjalankan `delete_task` atau `delete_project`. Tidak ada undo.
4. **Response besar** — `export_tasks` bisa menghasilkan data sangat besar. Gunakan Python/jq untuk analisis, jangan baca mentah.
5. **Satu workspace** — kecuali user secara eksplisit minta ganti workspace, gunakan workspace yang sudah aktif di session.

## Skill yang Tersedia

Jika AI agent mendukung skill/slash command, gunakan skill yang sesuai:

| Situasi | Skill |
|---------|-------|
| User mau buat task baru | `/kaneo-create` |
| User mau review task / lihat status | `/kaneo-review` |
| User mau pindah status task | `/kaneo-move` |
| User mau tandai task selesai | `/kaneo-done` |
| User mau assign task ke orang | `/kaneo-assign` |
| User mau cari task | `/kaneo-search` |
| User mau laporan harian / standup | `/kaneo-standup` |
| User mau planning sprint | `/kaneo-sprint` |
| User mau tutup sprint & bersihkan task | `/kaneo-close-sprint` |

## Tools yang Sering Dipakai

```
# Discovery
mcp__kaneo__list_projects          → semua project + ID
mcp__kaneo__list_columns           → kolom di project
mcp__kaneo__get_project            → detail project + members

# Baca task
mcp__kaneo__list_tasks             → task di project (ringkas)
mcp__kaneo__export_tasks           → semua task + deskripsi (lengkap)
mcp__kaneo__get_task               → detail satu task
mcp__kaneo__search                 → cari task by keyword

# Aksi task
mcp__kaneo__create_task            → buat task baru
mcp__kaneo__update_task            → update judul/deskripsi
mcp__kaneo__set_task_status        → ubah status
mcp__kaneo__set_task_priority      → set priority
mcp__kaneo__set_task_assignee      → assign ke user
mcp__kaneo__set_task_due_date      → set due date
mcp__kaneo__move_task              → pindah ke kolom tertentu
mcp__kaneo__bulk_update_tasks      → update banyak task sekaligus
mcp__kaneo__delete_task            → hapus task (KONFIRMASI DULU)

# Kolaborasi
mcp__kaneo__add_comment            → tambah komentar
mcp__kaneo__list_comments          → lihat komentar
mcp__kaneo__list_task_activity     → riwayat aktifitas task
```

## Status Values

| String | Arti |
|--------|------|
| `to-do` | Belum dikerjakan (backlog) |
| `in-progress` | Sedang dikerjakan |
| `in-review` | Menunggu review / QA |
| `done` | Selesai |

## Priority Values

`low` · `medium` · `high` · `urgent`

## Analisis Data Besar

Ketika `export_tasks` menyimpan ke file (karena response terlalu besar):

```python
import json
from collections import Counter

with open('<path-dari-output>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', inner)  # handle dua format

# Hitung per status
print(Counter(t.get('status') for t in tasks))

# Filter status tertentu
in_progress = [t for t in tasks if t.get('status') == 'in-progress']
```

## Panduan Hapus Task (close-sprint / cleanup)

Selalu ikuti urutan ini sebelum `delete_task`:

1. Tampilkan daftar task yang akan dihapus (judul + status)
2. Minta konfirmasi eksplisit dari user
3. Hapus satu per satu, konfirmasi setiap berhasil
4. Laporkan berapa yang berhasil dihapus

Jika user ragu, rekomendasikan pindah ke `to-do` (backlog) dulu daripada langsung hapus.

## Setup untuk Agent Baru

Jika kamu agent yang baru pertama kali bekerja di environment ini:

1. Cek MCP server aktif: `mcp__kaneo__get_instance_status`
2. Ambil daftar project: `mcp__kaneo__list_projects`
3. Tanya user mau kerja di project mana

Jika MCP tools tidak tersedia, minta user untuk setup MCP server terlebih dahulu (lihat README.md).
