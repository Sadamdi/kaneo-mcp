# /kaneo-move — Pindah Task ke Status / Kolom Lain

Skill untuk memindahkan task Kaneo ke status atau kolom yang berbeda.

## Status yang Tersedia

| Status | Artinya |
|--------|---------|
| `to-do` | Belum dikerjakan |
| `in-progress` | Sedang dikerjakan |
| `in-review` | Sedang direview |
| `done` | Selesai |

## Alur Kerja

### Step 1: Temukan Task

Jika user sudah tahu task ID → langsung ke Step 3.

Jika belum tahu:
```
mcp__kaneo__list_projects
```
Pilih project, lalu:
```
mcp__kaneo__list_tasks { "projectId": "<id>" }
```
Tampilkan task ke user dan minta mereka pilih yang mana.

### Step 2: Konfirmasi Task yang Dipilih

Tampilkan detail task yang akan dipindahkan:
```
mcp__kaneo__get_task { "taskId": "<id>" }
```
Tunjukkan: judul, status saat ini, project.

### Step 3: Tentukan Target

Tanya user: **"Mau dipindah ke status apa?"**
- `to-do` / `in-progress` / `in-review` / `done`

Atau jika user menyebut kolom spesifik, cek kolom yang ada:
```
mcp__kaneo__list_columns { "projectId": "<id>" }
```

### Step 4: Eksekusi

**Pindah via status:**
```
mcp__kaneo__set_task_status {
  "taskId": "<id>",
  "status": "<target-status>"
}
```

**Pindah via kolom:**
```
mcp__kaneo__move_task {
  "taskId": "<id>",
  "columnId": "<column-id>"
}
```

### Step 5: Konfirmasi

Tampilkan konfirmasi singkat:
> ✅ Task "[judul]" berhasil dipindah dari `[status-lama]` → `[status-baru]`

## Contoh Perintah User

> "pindah task implementasi checkout ke in-progress"

> "task [ID] tandai sebagai in-review"

> "semua task to-do di E-Commerce yang assignee-nya saya, pindah ke in-progress"

> "task 'update dokumentasi API' sudah selesai"

## Shortcut: Pindah Banyak Task Sekaligus

Jika user minta pindah beberapa task:
```
mcp__kaneo__bulk_update_tasks {
  "taskIds": ["<id1>", "<id2>", "<id3>"],
  "status": "<target-status>"
}
```
