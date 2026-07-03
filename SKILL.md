# Kaneo Task Management Skill

Skill untuk mengelola task di Kaneo project management via MCP tools.

## Kapan Digunakan

Invoke skill ini ketika user menyebut: "kaneo", "task", "project board", "tambah task", "pindah task", "review task", "in progress", "to-do", "done", atau minta manage pekerjaan di Kaneo.

## Prasyarat

MCP server Kaneo harus sudah terdaftar. Cek dengan:
```
mcp__kaneo__get_instance_status
```
Jika error, minta user setup MCP server terlebih dahulu.

## Aturan Utama

1. **Selalu mulai dengan discovery** — jangan pernah hardcode ID. Gunakan `list_projects` untuk mendapatkan project ID terkini.
2. **Status adalah string** — nilai valid: `to-do`, `in-progress`, `in-review`, `done`
3. **export_tasks bisa sangat besar** — gunakan Python/jq untuk analisis, jangan baca mentah-mentah
4. **Konfirmasi sebelum delete** — tanya user sebelum menjalankan `delete_task` atau `delete_project`

---

## Step 0: Discovery (Selalu Lakukan Pertama)

### Cari tahu workspace dan project yang ada:
```
mcp__kaneo__list_projects
```
Ini mengembalikan semua project beserta ID-nya. Simpan ID yang relevan sebelum lanjut.

### Cari tahu kolom di sebuah project:
```
mcp__kaneo__list_columns { "projectId": "<id>" }
```

---

## Workflows

### Lihat Task di Project

```
mcp__kaneo__list_tasks { "projectId": "<id>" }
```

Untuk export lengkap dengan deskripsi (hasil besar — lihat Tips Analisis):
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

---

### Buat Task Baru

```
mcp__kaneo__create_task {
  "projectId": "<id>",
  "title": "Judul task",
  "description": "Detail (opsional)",
  "status": "to-do"
}
```

---

### Pindah Task / Ubah Status

```
mcp__kaneo__set_task_status {
  "taskId": "<task-id>",
  "status": "in-progress"
}
```

Atau pindah ke kolom spesifik (gunakan `list_columns` untuk dapat columnId):
```
mcp__kaneo__move_task {
  "taskId": "<task-id>",
  "columnId": "<column-id>"
}
```

---

### Update Isi Task

```
mcp__kaneo__update_task {
  "taskId": "<task-id>",
  "title": "Judul baru",
  "description": "Deskripsi baru"
}
```

---

### Lihat Detail Task

```
mcp__kaneo__get_task { "taskId": "<task-id>" }
```

---

### Assign Task ke User

```
mcp__kaneo__set_task_assignee {
  "taskId": "<task-id>",
  "userId": "<user-id>"
}
```

---

### Set Priority

```
mcp__kaneo__set_task_priority {
  "taskId": "<task-id>",
  "priority": "high"
}
```
Nilai valid: `low`, `medium`, `high`, `urgent`

---

### Set Due Date

```
mcp__kaneo__set_task_due_date {
  "taskId": "<task-id>",
  "dueDate": "2026-12-31"
}
```

---

### Tambah Komentar

```
mcp__kaneo__add_comment {
  "taskId": "<task-id>",
  "content": "Komentar disini"
}
```

---

### Cari Task

```
mcp__kaneo__search { "query": "kata kunci" }
```

---

### Hapus Task (Konfirmasi Dulu!)

Tanya user sebelum menjalankan ini:
```
mcp__kaneo__delete_task { "taskId": "<task-id>" }
```

---

## Tips Analisis Data Besar

Ketika `export_tasks` menyimpan ke file, gunakan Python untuk analisis:

```python
import json
from collections import Counter

with open('<path-dari-output>') as f:
    data = json.load(f)

# Struktur bisa berbeda — cek dulu
inner = json.loads(data[0]['text'])

# Jika format { project: {...}, tasks: [...] }
tasks = inner.get('tasks', inner)

# Hitung per status
statuses = Counter(t.get('status', '') for t in tasks)
print('Distribusi status:', dict(statuses))

# Filter in-progress
in_progress = [t['title'] for t in tasks if t.get('status') == 'in-progress']
print(f'In Progress ({len(in_progress)}):')
for t in in_progress:
    print(f'  - {t}')
```

---

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Tools `mcp__kaneo__*` tidak muncul | Restart Claude Code |
| Auth error / 401 | Cek API key di konfigurasi MCP server |
| Project not found | Jalankan `list_projects` untuk refresh |
| Response terlalu besar | Gunakan Python script di atas |
| Task ID tidak diketahui | Jalankan `list_tasks` di project yang relevan |
