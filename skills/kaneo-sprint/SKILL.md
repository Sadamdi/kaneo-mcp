# /kaneo-sprint — Sprint Planning di Kaneo

Skill untuk membantu planning sprint/iterasi: prioritas task, assign, set due date, dan review kapasitas tim.

## Kapan Digunakan

- Awal sprint/minggu baru
- Mau pilih task mana yang dikerjakan minggu ini
- Mau distribusi task ke anggota tim secara merata

## Alur Kerja

### Step 1: Review Backlog

Ambil semua task `to-do` di project:
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

Filter task `to-do`, tampilkan ke user:
```python
import json

with open('<filepath>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', [])

backlog = [t for t in tasks if t.get('status') == 'to-do']
print(f"Backlog: {len(backlog)} task")
for t in backlog:
    priority = t.get('priority', 'none')
    assignee = t.get('assignee', {}).get('name', 'Unassigned') if t.get('assignee') else 'Unassigned'
    print(f"  [{priority}] {t['title']} — {assignee}")
```

### Step 2: Tanya Sprint Goal

Tanya user:
- **Berapa task yang bisa dikerjakan sprint ini?** (kapasitas tim)
- **Ada task prioritas tinggi yang wajib masuk sprint?**
- **Sprint berapa hari / sampai tanggal berapa?**

### Step 3: Pilih Task untuk Sprint

Rekomendasikan task berdasarkan:
1. Priority (`urgent` → `high` → `medium` → `low`)
2. Task yang sudah punya assignee
3. Task yang berkaitan (bisa dikerjakan paralel)

Konfirmasi ke user: **"Task berikut yang masuk sprint ini, setuju?"**

### Step 4: Setup Task Sprint

Untuk setiap task yang dipilih, set:

**Pindah ke in-progress (jika langsung dikerjakan):**
```
mcp__kaneo__set_task_status {
  "taskId": "<id>",
  "status": "in-progress"
}
```

**Set due date akhir sprint:**
```
mcp__kaneo__set_task_due_date {
  "taskId": "<id>",
  "dueDate": "<tanggal-akhir-sprint>"
}
```

**Assign jika belum:**
```
mcp__kaneo__set_task_assignee {
  "taskId": "<id>",
  "userId": "<user-id>"
}
```

### Step 5: Laporan Sprint Plan

```
# 🚀 Sprint Plan — [Tanggal Mulai] s/d [Tanggal Selesai]
## Project: [Nama Project]

Total kapasitas: X task

| # | Task | Priority | Assignee | Due |
|---|------|----------|----------|-----|
| 1 | Implementasi checkout | high | @Imam | 10 Jul |
| 2 | Update dokumentasi API | medium | @Budi | 10 Jul |
| 3 | Fix bug login | urgent | @Imam | 8 Jul |

**Backlog tersisa:** Y task (belum masuk sprint ini)
```

## Contoh Perintah User

> "bantu planning sprint minggu ini untuk project E-Commerce"

> "pilih 5 task prioritas tertinggi dari backlog Simpan Pinjam untuk sprint ini"

> "sprint planning untuk semua project, due tanggal 11 Juli"

## Tips

- Jangan masukkan task `in-progress` dari sprint sebelumnya — fokus ke backlog baru
- Rekomendasikan maksimal 3-5 task per orang per sprint
- Jika tidak ada due date disebutkan, default ke 7 hari dari hari ini
- Setelah planning selesai, tawarkan untuk jalankan `/kaneo-standup` di hari pertama sprint
