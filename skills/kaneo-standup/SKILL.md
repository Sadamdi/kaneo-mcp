# /kaneo-standup — Laporan Harian dari Kaneo

Skill untuk menghasilkan laporan standup harian berdasarkan kondisi task di Kaneo.

## Kapan Digunakan

- Pagi sebelum standup meeting
- Ingin tahu progress semua project sekaligus
- Mau laporan singkat: apa yang dikerjakan, apa yang selesai, ada blocker?

## Alur Kerja

### Step 1: Ambil Data Semua Project

```
mcp__kaneo__list_projects
```

Untuk setiap project yang aktif (ada task in-progress atau in-review):
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

### Step 2: Analisis Per Project

Gunakan Python untuk ekstrak task yang relevan:

```python
import json
from collections import defaultdict

def analyze_project(filepath):
    with open(filepath) as f:
        data = json.load(f)
    inner = json.loads(data[0]['text'])
    tasks = inner.get('tasks', [])
    
    result = defaultdict(list)
    for t in tasks:
        status = t.get('status', '')
        if status in ('in-progress', 'in-review', 'done'):
            result[status].append({
                'id': t.get('id'),
                'title': t.get('title'),
                'assignee': t.get('assignee', {}).get('name', 'Unassigned') if t.get('assignee') else 'Unassigned'
            })
    return result
```

### Step 3: Format Laporan Standup

Output format yang jelas dan ringkas:

```
# 🗓️ Standup — [Tanggal Hari Ini]

## [Nama Project 1]

### ✅ In Review (siap di-review)
- [judul task] — @assignee

### 🔄 In Progress (sedang dikerjakan)
- [judul task] — @assignee

### ✅ Done (baru selesai)
- [judul task]

---

## [Nama Project 2]
(kosong jika tidak ada aktifitas)

---

## Ringkasan
- Total in-progress: X task
- Total in-review: X task
- Perlu perhatian: [task yang sudah lama in-progress tanpa update]
```

### Step 4: Highlight Blocker (Opsional)

Jika ada task yang:
- Sudah `in-progress` terlalu lama (lihat `updatedAt`)
- Tidak punya assignee
- Sudah `in-review` tapi belum di-approve

Tandai sebagai **⚠️ Perlu Perhatian**.

## Contoh Perintah User

> "/kaneo-standup"

> "buatkan laporan standup hari ini"

> "apa saja yang lagi in-progress di semua project?"

> "standup report untuk project E-Commerce saja"

## Tips

- Fokus pada project yang benar-benar aktif, skip project yang semua tasknya `to-do` atau `done`
- Urutkan: `in-review` → `in-progress` → `done` (prioritas review lebih tinggi)
- Jika ada banyak project, tanya user mana yang mau di-highlight dulu
