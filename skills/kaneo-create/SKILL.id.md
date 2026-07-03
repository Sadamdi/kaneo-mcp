---
name: kaneo-create
description: Buat task Kaneo baru lengkap — judul, deskripsi, acceptance criteria, priority, label, assignee. Pakai saat user mau menambah task, membuat ticket, atau menaruh pekerjaan di board.
---

# /kaneo-create — Buat task yang rapi

Satu alur: kumpulkan info, terapkan konvensi, hindari duplikat, verifikasi. Untuk kartu
setara-dokumentasi (endpoint/file/skema dari kode), pakai `/kaneo-document`.

Baca dulu: `_shared/grounding.id.md`, `_shared/conventions.id.md`, `_shared/templates.id.md`,
`_shared/context-memory.id.md`.

## Langkah 1 — Konteks + project
Baca `.kaneo/context.md` (peta board, bahasa, varian template). Bila belum ada, `list_projects` dan
tanya board mana. Balas dalam bahasa tim.

## Langkah 2 — Kumpulkan detail dalam satu pesan
Muat `list_workspace_labels` + `list_workspace_members`, lalu tanya (skip yang sudah diberi):
> 1. **Judul** (kata kerja dulu) 2. **Deskripsi / acceptance criteria** 3. **Priority** 4.
> **Assignee** (dari members: …) 5. **Label** 6. **Due date**

## Langkah 3 — Draft acceptance criteria
Bila deskripsi user samar, usulkan 2–5 checkbox acceptance criteria teruji dan konfirmasi. Task
tanpa acceptance criteria belum siap.

## Langkah 4 — Cari duplikat
`search { query: <kata kunci judul> }`. Bila ada yang cocok, tawarkan update (grounding §2).

## Langkah 5 — Create
Susun badan dengan blok header + Konteks/Scope/Acceptance/Catatan teknis/Tautan/DoD. 
`create_task { projectId, title, description, status: "to-do" }`.

## Langkah 6 — Set atribut
Pakai id task: `set_task_priority` (default `medium`), `set_task_assignee` (userId dari members;
"assign ke saya" → id member user; jangan menebak), `attach_label_to_task` (satu TIPE + satu AREA;
`create_label` dulu bila belum ada), `set_task_due_date`.

## Langkah 7 — Verifikasi + konfirmasi + log
`get_task` untuk konfirmasi; tampilkan ringkasan (judul, project, priority, assignee, label, due,
id). Tambah entri `created` ke Activity log.

## Contoh prompt
> "tambah task di E-Commerce: bikin halaman checkout, high, assign ke Imam, label frontend" ·
> "buat ticket fix login 500" · "task baru: tulis dokumentasi API"
