# Memori Konteks Project — `.kaneo/context.md`

Cara AI **mengingat** sebuah project lintas sesi dan tetap konsisten dengan tim. Berupa satu file
di-commit di root repo: **`.kaneo/context.md`**. Commit agar AI seluruh tim berbagi pemahaman sama.

## Protokol (setiap skill)
1. **Baca `.kaneo/context.md` dulu** bila ada. Percayai di atas deteksi ulang. Validasi ulang hanya
   saat error.
2. Bila belum ada, sarankan jalankan `/kaneo-setup`.
3. **Setelah** create / ubah status / selesai, tambahkan satu baris ke Activity log.
4. `/kaneo-setup` membuat & menyegarkannya. Saat refresh, **MERGE** — jangan menimpa field yang
   diedit manual user.

## Struktur file
````markdown
---
language: id            # bahasa kerja tim project ini (override prefs global)
workspace_id: <id>
default_board: <nama/id project>
updated: 2026-07-03
---

# Konteks Kaneo — <nama repo>

## Profil project
| Path | Bahasa | Framework | Tipe | Template | Entry | API | DB |
|------|--------|-----------|------|----------|-------|-----|----|
| .    | Go 1.25 | Fiber | backend | backend | cmd/api | REST | Postgres |

<ringkasan 5–10 baris "cara kerja project" dari project-detection Lapisan B>

## Peta board
| Project Kaneo | ID | Tujuan | Kolom |
|---------------|----|--------|-------|
| <nama> | <id> | <yang dilacak> | to-do, in-progress, in-review, done |

Label dipakai: <label tipe> + <label area>
Konvensi judul: `[<Area>] <ringkasan kata-kerja-dulu>`
Priority: urgent=blocker/security · high=sprint ini · medium=normal · low=nice-to-have

## Activity log (terbaru dulu, simpan ~15)
- 2026-07-03 · created · <taskId> · [Auth] Tambah rotasi refresh-token
- 2026-07-03 · status in-progress → done · <taskId> · [Cart] Perbaiki total
````

## Catatan
- `language` di sini LOKAL dan menang atas global (`~/.config/kaneo-mcp/config.json`) dan
  `KANEO_LANG` (lihat `language.id.md`).
- Semua field bisa diedit manual; edit bertahan saat `/kaneo-setup` dijalankan ulang (merge).
- Untuk monorepo, tabel Profil project satu baris per sub-project.
