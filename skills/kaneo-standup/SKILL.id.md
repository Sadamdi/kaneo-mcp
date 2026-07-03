---
name: kaneo-standup
description: Buat laporan standup harian dari board Kaneo — yang in-progress, in-review, baru selesai, dan blocker. Pakai saat user mau standup, ringkasan harian, atau snapshot progres.
---

# /kaneo-standup — Laporan standup harian

Baca dulu: `_shared/grounding.id.md`, `_shared/context-memory.id.md`.

## Langkah 1 — Board aktif
Baca peta board `.kaneo/context.md`; `list_projects`. Fokus board dengan aktivitas
`in-progress`/`in-review` (skip yang semua `to-do`/`done`).

## Langkah 2 — Tarik + analisis
`export_tasks` per board aktif; dengan Python kumpulkan `in-progress`, `in-review`, dan `done`
terbaru + assignee + `updatedAt` (`_shared/tools-reference.id.md`).

## Langkah 3 — Laporan (dikelompokkan per orang)
```
# Standup — <tanggal>
## <Project>
### In Review (siap)   - judul — @assignee
### In Progress        - judul — @assignee
### Baru selesai       - judul
## Per orang
@Imam: 2 in-progress, 1 in-review   @Budi: 1 in-progress
## ⚠️ Perlu perhatian
- <basi >7h> · <unassigned in-progress> · <in-review mandek>
```
Pakai Activity log `.kaneo/context.md` untuk diff kemarin-vs-hari-ini. Balas bahasa tim.

## Contoh prompt
> "/kaneo-standup" · "laporan harian" · "semua lagi ngerjain apa?" · "standup board E-Commerce"
