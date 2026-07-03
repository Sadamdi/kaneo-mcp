---
name: kaneo-sync
description: Selaraskan board Kaneo dengan realita (git history, branch, PR merged, kode). Pakai saat user bilang board ketinggalan, mau sinkron task dengan yang benar-benar selesai, atau setelah menyelesaikan sekumpulan pekerjaan. Usulkan perpindahan status + kartu yang hilang, terapkan setelah satu konfirmasi.
---

# /kaneo-sync — Selaraskan board dengan realita

Jaga board tetap jujur: pindahkan status sesuai progres nyata, dan munculkan pekerjaan yang ada di
kode tapi belum di board.

Baca dulu: `_shared/grounding.id.md`, `_shared/context-memory.id.md`, `_shared/conventions.id.md`.

## Langkah 1 — Muat kedua sisi
- Board: baca `.kaneo/context.md`, lalu `export_tasks` board terkait (analisis output besar dengan
  Python — `_shared/tools-reference.id.md`).
- Realita: kumpulkan sinyal — `git log --oneline`, branch, judul PR merged, file yang baru berubah,
  status CI. Tanya user untuk yang tak terlihat (mis. "PR mana yang merged sejak sync terakhir?").

## Langkah 2 — Cross-check
Tiap kartu in-progress/in-review: cari bukti benar-benar selesai (PR merged, commit, fitur ada di
kode). Tiap pekerjaan baru: cek apakah ada kartunya. Terapkan grounding §5: klaim hanya dengan bukti.

## Langkah 3 — Usulkan rencana rekonsiliasi
Satu daftar gabungan: **Pindah ke done** (dengan bukti), **Pindah ke in-review/in-progress**,
**Buat** (kerja di kode tanpa kartu), **Flag** (basi >7h, unassigned in-progress, tanpa acceptance
criteria). Minta satu konfirmasi.

## Langkah 4 — Terapkan
Setelah setuju: `set_task_status`/`move_task`; `/kaneo-document` untuk kartu baru; `add_comment`
bukti (PR/commit) di tiap kartu yang dipindah. Verifikasi tiap perubahan.

## Langkah 5 — Log
Tambah ringkasan sync ke Activity log di `.kaneo/context.md`.

## Contoh prompt
> "sinkron board dengan yang benar-benar kita rilis" · "board ketinggalan, rekonsiliasi" ·
> "update kaneo dari PR yang merged" · "kartu mana yang basi?"
