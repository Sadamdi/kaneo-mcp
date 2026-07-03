# /kaneo-search — Cari Task di Semua Project

Skill untuk mencari task berdasarkan kata kunci, status, assignee, atau kriteria lain.

## Alur Kerja

### Pencarian Cepat (by keyword)

```
mcp__kaneo__search { "query": "<kata kunci>" }
```

Tampilkan hasil dengan info: judul, project, status, assignee.

### Pencarian by Status di Semua Project

Jika user mau cari semua task dengan status tertentu (misal semua `in-review`):

1. Ambil semua project:
   ```
   mcp__kaneo__list_projects
   ```

2. Export tasks per project, lalu filter:
   ```python
   import json
   
   def search_by_status(filepath, target_status):
       with open(filepath) as f:
           data = json.load(f)
       inner = json.loads(data[0]['text'])
       tasks = inner.get('tasks', [])
       return [t for t in tasks if t.get('status') == target_status]
   ```

### Pencarian by Assignee

Jika user mau lihat semua task miliknya:
1. Cari user ID dari project members
2. Export tasks dan filter by `assignee.id`

```python
def search_by_assignee(filepath, user_id):
    with open(filepath) as f:
        data = json.load(f)
    inner = json.loads(data[0]['text'])
    tasks = inner.get('tasks', [])
    return [
        t for t in tasks
        if t.get('assignee') and t['assignee'].get('id') == user_id
    ]
```

### Format Hasil

```
## Hasil Pencarian: "[query]"
Ditemukan X task

### E-Commerce
- [in-progress] Implementasi halaman checkout — @Imam
- [in-review] Update API dokumentasi — @Budi

### Simpan Pinjam
- [to-do] Form pengajuan pinjaman — Unassigned
```

## Contoh Perintah User

> "cari task yang berhubungan dengan checkout"

> "tampilkan semua task yang di-assign ke saya"

> "cari task in-review di semua project"

> "ada task tentang 'dokumentasi' di mana saja?"

> "task mana yang belum punya assignee?"

## Tips

- `mcp__kaneo__search` adalah pencarian full-text — bagus untuk keyword
- Untuk filter by status/assignee, `export_tasks` + Python lebih akurat
- Tampilkan hasil terkelompok per project agar mudah dibaca
- Jika hasil terlalu banyak, tanya user mau filter lebih spesifik
