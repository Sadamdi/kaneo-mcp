# /kaneo-close-sprint — Tutup Sprint & Bersihkan Task

Skill untuk menutup sprint: review hasil, pindah task yang belum selesai ke backlog, dan hapus task yang tidak relevan.

## ⚠️ Peringatan

Skill ini dapat **menghapus task secara permanen**. Selalu konfirmasi ke user sebelum menjalankan `delete_task`. Tidak ada undo.

---

## Alur Kerja

### Step 1: Review Sprint yang Akan Ditutup

Ambil semua task di project:
```
mcp__kaneo__export_tasks { "projectId": "<id>" }
```

Analisis hasil sprint:
```python
import json
from collections import Counter

with open('<filepath>') as f:
    data = json.load(f)
inner = json.loads(data[0]['text'])
tasks = inner.get('tasks', [])

statuses = Counter(t.get('status') for t in tasks)
print("Hasil sprint:")
for status, count in statuses.items():
    print(f"  {status}: {count} task")
```

### Step 2: Tampilkan Ringkasan Sprint

```
# 📊 Ringkasan Sprint — [Nama Project]

✅ Done       : X task  → akan dipertahankan
🔄 In Progress: X task  → belum selesai
🟡 In Review  : X task  → belum selesai
⚪ To Do      : X task  → tidak dikerjakan

Sprint Velocity: X dari Y task selesai (XX%)
```

### Step 3: Tanya Apa yang Dilakukan per Status

Tanya user untuk setiap grup task yang belum `done`:

**Task `in-progress` dan `in-review`:**
> "Ada X task yang belum selesai. Mau dipindah ke backlog (to-do), dilanjutkan ke sprint berikutnya (tetap in-progress), atau dihapus?"

**Task `to-do` yang tidak sempat dikerjakan:**
> "Ada Y task to-do yang tidak masuk sprint ini. Mau tetap di backlog, atau ada yang mau dihapus?"

### Step 4: Eksekusi Keputusan User

**Pindah ke backlog:**
```
mcp__kaneo__bulk_update_tasks {
  "taskIds": ["<id1>", "<id2>"],
  "status": "to-do"
}
```

**Hapus task (KONFIRMASI DULU — tidak bisa di-undo):**

Tampilkan daftar task yang akan dihapus:
```
Akan dihapus permanen:
- [ID] Judul task 1
- [ID] Judul task 2

Ketik "YA HAPUS" untuk konfirmasi, atau "batal" untuk membatalkan.
```

Setelah user konfirmasi dengan kata kunci yang jelas, hapus satu per satu:
```
mcp__kaneo__delete_task { "taskId": "<id>" }
```

### Step 5: Laporan Penutup Sprint

```
# ✅ Sprint Ditutup — [Nama Project]

## Hasil Akhir
- Selesai (done): X task
- Dilanjutkan ke sprint berikutnya: X task
- Dikembalikan ke backlog: X task
- Dihapus: X task

## Task yang Dilanjutkan
- [judul task] — @assignee

## Backlog Sekarang
Total: X task tersisa
```

Tawari untuk langsung mulai sprint berikutnya:
> "Mau langsung planning sprint berikutnya? Ketik `/kaneo-sprint`"

---

## Contoh Perintah User

> "tutup sprint project E-Commerce"

> "close sprint, hapus semua task yang belum dikerjakan"

> "sprint selesai, pindah semua yang belum done ke backlog"

---

## Aturan Hapus Task

Jangan hapus task tanpa konfirmasi eksplisit. Minimal tampilkan:
1. Judul task yang akan dihapus
2. Status saat ini
3. Minta konfirmasi dengan kata kunci spesifik (bukan sekedar "ya")

Jika user ragu, rekomendasikan untuk pindah ke backlog dulu, bukan langsung hapus.
