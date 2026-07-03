---
name: kaneo
description: Kelola board Kaneo via MCP — buat/pindah/review/dokumentasi task, standup, sprint, sinkron board. Pakai kapan pun user menyebut Kaneo, task, tiket, board, atau mengelola kerja tim.
---

# Manajemen Task Kaneo

Titik masuk mengelola board Kaneo dengan task yang grounded & setara dokumentasi. Versi English:
[`SKILL.md`](SKILL.md). Aturan agent: [`AGENT.id.md`](AGENT.id.md).

## Prasyarat
Server MCP Kaneo harus terdaftar. Cek dengan `get_config`. Bila gagal, minta user setup MCP server
(lihat README) — `npx @sadamdi/kaneo-mcp`.

## Selalu
1. Bila `.kaneo/context.md` ada, baca dulu (peta board, bahasa, stack). Kalau tidak, sarankan
   `/kaneo-setup`.
2. Balas dalam bahasa tim (`_shared/language.id.md`).
3. Ikuti protokol grounding (`_shared/grounding.id.md`): temukan ID, search sebelum create, read
   sebelum write, verifikasi setelah write, bukti untuk tiap klaim teknis, konfirmasi sebelum hapus.

## Dokumen referensi (`skills/_shared/`)
`grounding.id.md` · `language.id.md` · `conventions.id.md` · `templates.id.md` ·
`project-detection.id.md` · `context-memory.id.md` · `tools-reference.id.md` (semua 91 tool).

## Pilih skill
- **Onboarding repo** → `/kaneo-setup` · **Task baru** → `/kaneo-create` · **Kartu detail dari
  kode/spec** → `/kaneo-document` · **Review/health** → `/kaneo-review` · **Ubah status** →
  `/kaneo-move` · **Tutup (berbasis bukti)** → `/kaneo-done` · **Cari** → `/kaneo-search` ·
  **Standup** → `/kaneo-standup` · **Sprint planning** → `/kaneo-sprint` · **Tutup sprint** →
  `/kaneo-close-sprint` · **Selaraskan dengan kode/PR** → `/kaneo-sync`

## Update
Bila server melaporkan versi baru (cek saat start / `check_for_updates`), minta user jalankan
`npx -y @sadamdi/kaneo-mcp@latest` dan restart klien.

## Peta tool cepat
Discovery: `list_workspaces`, `list_projects`, `list_columns`, `list_workspace_members`. Baca:
`list_tasks`, `get_task`, `export_tasks`, `search`. Tulis: `create_task`, `update_task`,
`set_task_*`, `move_task`, `add_comment`. Daftar lengkap: `_shared/tools-reference.id.md`.
