---
name: kaneo-close-sprint
description: Tutup sprint di Kaneo — ringkas hasil, kembalikan kerja belum selesai ke backlog, opsional arsip/hapus. Pakai saat user mau menutup sprint atau membersihkan board. Tidak pernah menghapus tanpa konfirmasi eksplisit.
---

# /kaneo-close-sprint — Tutup sprint

Aksi default AMAN: pindahkan kerja belum selesai ke `to-do`, jangan hapus. Penghapusan butuh
konfirmasi eksplisit per item (tak bisa di-undo).

Baca dulu: `_shared/grounding.id.md`, `_shared/conventions.id.md`, `_shared/context-memory.id.md`.

## Langkah 1 — Review hasil
`export_tasks`; hitung per status (Python — `_shared/tools-reference.id.md`). Tampilkan retro:
```
# Retro sprint — <project>
Done: N   ·   Belum selesai: M (in-progress P, in-review Q, to-do R)
Selesai: - judul …
Dibawa: - judul (status) …
```

## Langkah 2 — Bawa ke backlog
Task belum selesai, default `set_task_status` → `to-do`. Konfirmasi daftar.

## Langkah 3 — Cleanup (opsional, eksplisit)
Hanya bila user minta hapus: (1) daftarkan persis task yang akan dihapus, (2) konfirmasi eksplisit,
(3) `delete_task` satu per satu. Tanpa undo. Bila ragu, sarankan biarkan di `to-do`.

## Langkah 4 — Log
Tambah entri `sprint closed` (jumlah done, jumlah dibawa) ke Activity log.

## Contoh prompt
> "tutup sprint E-Commerce" · "wrap up sprint, bawa sisanya ke backlog" · "bersihkan task selesai"
