---
name: kaneo-move
description: Pindahkan task Kaneo ke status/kolom lain. Pakai saat user mau ubah status task, mulai kerja, kirim ke review, atau menata board.
---

# /kaneo-move — Ubah status/kolom task

Baca dulu: `_shared/grounding.id.md`, `_shared/conventions.id.md`.

Status: `to-do` → `in-progress` → `in-review` → `done` (board bisa punya kolom tambahan — cek
`list_columns`).

## Langkah 1 — Temukan task
Bila user beri id, ke langkah 2. Kalau tidak, `search` by kata kunci judul atau `list_tasks` lalu
minta pilih. Konfirmasi dengan `get_task` (judul + status saat ini).

## Langkah 2 — Status target
Tanya status target bila belum diberi. Terapkan semantik status:
- → **in-progress**: oke; catat WIP bila assignee sudah >3 in-progress.
- → **in-review**: tanya APA yang direview; tambah komentar berisi link PR/branch (`add_comment`).
- → **done**: serahkan ke `/kaneo-done` (cek acceptance criteria + catatan penyelesaian).

## Langkah 3 — Terapkan + verifikasi + log
`set_task_status { id, status }` (atau `move_task` untuk kolom/project spesifik). Baca ulang,
konfirmasi status baru asli, tambah baris `status <lama> → <baru>` ke Activity log.

## Contoh prompt
> "pindah task checkout ke in progress" · "kirim ticket auth ke review" · "balikin task abc123 ke to-do"
