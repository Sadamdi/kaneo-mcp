# /kaneo-done — Tandai Task Selesai

Skill untuk menandai satu atau beberapa task sebagai `done` dengan cepat.

## Kapan Digunakan

- Selesai mengerjakan sesuatu dan mau update status
- Mau mark beberapa task sekaligus
- Setelah PR di-merge / fitur selesai deploy

## Alur Kerja

### Jika User Menyebut Judul Task

Cari task yang dimaksud:
```
mcp__kaneo__search { "query": "<kata kunci dari judul>" }
```

Tampilkan hasilnya dan konfirmasi: **"Ini task yang dimaksud?"**

### Jika User Menyebut Project

```
mcp__kaneo__list_tasks { "projectId": "<id>" }
```

Tampilkan task yang statusnya `in-progress` atau `in-review`, minta user pilih mana yang selesai.

### Tandai Selesai — Satu Task

```
mcp__kaneo__set_task_status {
  "taskId": "<id>",
  "status": "done"
}
```

### Tandai Selesai — Beberapa Task Sekaligus

```
mcp__kaneo__bulk_update_tasks {
  "taskIds": ["<id1>", "<id2>", "<id3>"],
  "status": "done"
}
```

### Konfirmasi

> ✅ **[N] task berhasil ditandai selesai:**
> - [judul task 1]
> - [judul task 2]

## Contoh Perintah User

> "tandai task 'implementasi checkout' sebagai done"

> "semua task yang in-review di E-Commerce sudah selesai semua"

> "done: update dokumentasi API"

> "mark done task [ID]"

## Tips

- Jika ada `in-review` → tanya dulu apakah review sudah approve, baru mark `done`
- Jika user bilang "selesai semua" tanpa spesifik, tanya project mana dulu
- Setelah done, tawari untuk tambah komentar penutup: `mcp__kaneo__add_comment`
