---
name: kaneo-search
description: Cari task Kaneo by keyword, status, assignee, label, atau priority lintas project. Pakai saat user mencari task, mau semua yang cocok filter, atau lupa task ada di mana.
---

# /kaneo-search — Cari task

Baca dulu: `_shared/grounding.id.md`, `_shared/tools-reference.id.md`.

## Pencarian keyword (cepat)
`search { query: <kata kunci>, workspaceId? }` → tampilkan judul, project, status, assignee.

## Filter by status / label / assignee / priority
`search` untuk teks; untuk filter terstruktur, `export_tasks` per project lalu filter di Python:
```python
import json
data = json.load(open('<file>'))
tasks = json.loads(data[0]['text']).get('tasks', [])
hits = [t for t in tasks if t.get('status') == 'in-review']
```
Assignee: resolve userId via `list_workspace_members`, lalu filter `assignee.id`. "Task saya": cari
id member user dulu.

## Output
Kelompokkan per project lalu status. `[id] judul — status — @assignee`. Tawarkan lanjutan: buka
(`get_task`), pindah (`/kaneo-move`), tutup (`/kaneo-done`).

## Contoh prompt
> "cari task soal refresh token" · "tampilkan semua task in-review" · "apa yang diassign ke saya?"
