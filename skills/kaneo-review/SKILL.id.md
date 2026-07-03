---
name: kaneo-review
description: Review & analisis task di board Kaneo — rincian status, health check, insight. Pakai saat user mau lihat kondisi project, apa yang in-progress, atau laporan kesehatan board.
---

# /kaneo-review — Review board

Baca dulu: `_shared/grounding.id.md`, `_shared/conventions.id.md`, `_shared/context-memory.id.md`.

## Langkah 1 — Scope
Satu project atau semua? Filter status? Baca `.kaneo/context.md` untuk peta board; balas bahasa tim.

## Langkah 2 — Data
`list_tasks` untuk cepat, atau `export_tasks` untuk detail (analisis output besar dengan Python —
`_shared/tools-reference.id.md`). "Semua project" → loop `list_projects` → export tiap board.

## Langkah 3 — Kelompokkan + tampilkan
```
## Review: <project>  (total N)
### In Progress (n)   - [id] judul — @assignee
### In Review (n)     - [id] judul — @assignee
### To Do (n)         - [id] judul
### Done (n)          - [id] judul
```

## Langkah 4 — Health check (insight)
Flag (per `_shared/conventions.id.md`): WIP overload (>3 in-progress/orang), basi (>7 hari tanpa
update), unassigned in-progress, tanpa acceptance criteria, alur in-review tak dipakai. Beri
rekomendasi konkret.

## Langkah 5 — Drill down
Sesuai permintaan: `get_task {id}`, `list_comments {taskId}`, `list_task_activity {taskId}`.

## Contoh prompt
> "review board E-Commerce" · "apa yang in-progress di semua project?" · "project mana paling macet?"
