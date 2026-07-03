---
name: kaneo-sprint
description: Rencanakan sprint/iterasi di Kaneo — pilih prioritas dari backlog, assign, set due date, seimbangkan kapasitas tim. Pakai saat user mau planning sprint, memilih kerja minggu ini, atau membagi task.
---

# /kaneo-sprint — Sprint planning

Baca dulu: `_shared/grounding.id.md`, `_shared/conventions.id.md`, `_shared/context-memory.id.md`.

## Langkah 1 — Backlog
`export_tasks` board; filter `to-do`. Tampilkan urut priority + assignee saat ini
(`_shared/tools-reference.id.md`).

## Langkah 2 — Parameter sprint
Tanya: kapasitas tim (orang × ~3–5 task), item high-priority wajib masuk, panjang sprint / tanggal
akhir.

## Langkah 3 — Pilih
Rekomendasi by priority (`urgent`→`high`→`medium`→`low`), assignee existing, kerja terkait yang bisa
paralel. Maks ~3–5 task/orang. Konfirmasi pilihan.

## Langkah 4 — Setup tiap task terpilih
`set_task_due_date` (akhir sprint; default +7 hari), `set_task_assignee` bila kosong (userId dari
`list_workspace_members`), opsional `set_task_status` → `in-progress` untuk yang langsung dikerjakan.
Catat sprint goal via `add_comment`.

## Langkah 5 — Output + log
```
# Sprint Plan — <mulai> → <akhir>  ·  <project>
| # | Task | Priority | Assignee | Due |
Backlog tersisa: N
```
Tambah entri `sprint planned` ke Activity log. Tawarkan `/kaneo-standup` hari pertama.

## Contoh prompt
> "planning sprint minggu ini untuk E-Commerce" · "pilih 5 backlog prioritas tertinggi" ·
> "sprint sampai 11 Juli, assign merata"
