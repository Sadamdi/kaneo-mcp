# /kaneo-review — Review Task di Kaneo

Skill untuk mereview dan menganalisis task di project Kaneo.

## Alur Kerja

### Step 1: Tentukan Scope Review

Tanya user (atau deteksi dari perintah):
- Review **satu project** atau **semua project**?
- Filter status tertentu? (`in-progress`, `to-do`, `in-review`, `done`, atau semua)

### Step 2: Ambil Data

**Jika satu project:**
```
mcp__kaneo__list_projects
```
Pilih project yang relevan, lalu:
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

**Jika semua project:**
Jalankan `list_projects`, lalu `export_tasks` untuk setiap project.

### Step 3: Analisis Data

Untuk response besar yang disimpan ke file, gunakan Python:

```python
import json
from collections import Counter

with open('<path-file>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', inner)

# Grup berdasarkan status
by_status = {}
for t in tasks:
    s = t.get('status', 'unknown')
    by_status.setdefault(s, []).append(t)

# Tampilkan per status
for status, items in by_status.items():
    print(f"\n=== {status.upper()} ({len(items)}) ===")
    for t in items:
        print(f"  [{t.get('id','')}] {t.get('title','')}")
```

### Step 4: Tampilkan Hasil

Format output yang baik:

```
## Review: [Nama Project]
Total task: XX

### 🔴 In Progress (N)
- [ID] Judul task

### 🟡 In Review (N)
- [ID] Judul task

### ⚪ To Do (N)
- [ID] Judul task

### ✅ Done (N)
- [ID] Judul task
```

### Step 5: Insight & Rekomendasi (Opsional)

Jika diminta atau terlihat ada anomali, berikan insight:
- Task `in-progress` terlalu banyak → perlu di-prioritas ulang
- Tidak ada task `in-review` → alur review mungkin tidak digunakan
- Banyak task `to-do` tanpa assignee → perlu assignment

## Contoh Perintah User

> "review semua task yang in progress"

> "tampilkan task di project E-Commerce, filter yang belum selesai"

> "ada berapa task per status di Simpan Pinjam?"

> "review semua project, mana yang paling banyak task in progress?"

## Tips

- Untuk review cepat satu project, `list_tasks` lebih efisien dari `export_tasks`
- Untuk review dengan deskripsi lengkap, gunakan `export_tasks`
- Jika diminta review task spesifik: `mcp__kaneo__get_task { "taskId": "..." }`
- Jika user minta lihat komentar: `mcp__kaneo__list_comments { "taskId": "..." }`
