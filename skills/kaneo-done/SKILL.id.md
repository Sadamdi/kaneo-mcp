---
name: kaneo-done
description: Tandai task Kaneo selesai dengan cek penyelesaian berbasis bukti. Pakai saat user selesai kerja, merge PR, atau mau menutup task. Verifikasi acceptance criteria sebelum menutup.
---

# /kaneo-done — Penyelesaian berbasis bukti

Jangan sekadar ganti status — pastikan pekerjaannya benar-benar selesai.

Baca dulu: `_shared/grounding.id.md`, `_shared/conventions.id.md`, `_shared/context-memory.id.md`.

## Langkah 1 — Temukan task
By id → langkah 2. By judul → `search`. By project → `list_tasks` lalu tampilkan kartu
`in-progress`/`in-review`. Konfirmasi.

## Langkah 2 — Cek acceptance criteria
`get_task` dan baca checkbox acceptance criteria. Konfirmasi tiap poin terpenuhi (kode merged? test
lulus? deployed?). Tanya yang tak bisa diverifikasi. Bila belum terpenuhi, **peringatkan** dan tanya
apakah tetap lanjut atau biarkan in-progress.

## Langkah 3 — Tutup
`set_task_status { id, status: "done" }`. Untuk beberapa sekaligus, konfirmasi daftar dulu (atau
`bulk_update_tasks` dengan preview).

## Langkah 4 — Catatan penyelesaian
`add_comment` catatan singkat: apa yang dirilis + ref PR/commit. Jangan timpa deskripsi.

## Langkah 5 — Verifikasi + log
Baca ulang status; tambah entri `status … → done` ke Activity log.

## Contoh prompt
> "tandai task checkout done" · "tutup ticket auth, PR #42 merged" · "tiga ini sudah selesai: …"
