# Kaneo MCP — Instruksi Agent

Untuk semua AI agent (Claude, Cursor, Copilot, Codex, Gemini, …) yang bekerja dengan Kaneo via MCP.
Versi English: [`AGENT.md`](AGENT.md).

## Apa itu Kaneo
Kaneo = board manajemen project tim. Server `@sadamdi/kaneo-mcp` meng-expose API Kaneo penuh (91
tool): project, task, komentar, label, time tracking, notifikasi, workspace/member, integrasi.
Karena ini **board tim bersama**, akurasi penting — jangan menebak atau mengarang.

## Baca ini dulu (skills/_shared/)
- `grounding.id.md` — protokol anti-halusinasi (**wajib**).
- `language.id.md` — bahasa balasan (global vs lokal, auto-infer).
- `conventions.id.md` — kartu yang baik (judul, section, label, priority, status).
- `templates.id.md` — template per tipe project (backend/frontend/mobile/infra/data).
- `project-detection.id.md` — auto-deteksi stack + alur project.
- `context-memory.id.md` — `.kaneo/context.md`, memori project bersama.
- `tools-reference.id.md` — semua tool, param, dan jebakannya.

## Aturan emas (dari grounding)
1. **Discovery dulu** — `list_projects`/`list_columns`/`list_workspace_members` sebelum aksi; jangan
   hardcode/mengarang ID.
2. **Search sebelum create** — jangan duplikat.
3. **Read sebelum write** — `get_task` dulu; merge, pertahankan; progres → `add_comment`.
4. **Verifikasi setelah write** — baca ulang, laporkan id/status asli.
5. **Aturan bukti** — tiap endpoint/file/skema di kartu wajib diverifikasi di codebase, kalau tidak
   `TBD (verify)`.
6. **Konfirmasi sebelum delete/bulk** — preview + persetujuan eksplisit.

## Bahasa
Balas dalam bahasa tim. Resolusi: `.kaneo/context.md` `language:` (lokal) → `KANEO_LANG` → config
global (`get_user_preferences`) → tanya sekali (auto-infer dari board + docs) lalu simpan.

## Memori konteks project
Bila `.kaneo/context.md` ada, baca dulu dan ikuti peta board, bahasa, stack, template. Bila tidak,
sarankan `/kaneo-setup`. Setelah tiap create/ubah status/selesai, tambah ke Activity log-nya.

## Skills (12)
| Situasi | Skill |
|---------|-------|
| Setup pertama / onboarding di repo | `/kaneo-setup` |
| Buat task baru | `/kaneo-create` |
| Kartu setara-dokumentasi dari kode/spec | `/kaneo-document` |
| Review board / health check | `/kaneo-review` |
| Pindah status task | `/kaneo-move` |
| Tandai selesai (berbasis bukti) | `/kaneo-done` |
| Cari task | `/kaneo-search` |
| Laporan standup harian | `/kaneo-standup` |
| Sprint planning | `/kaneo-sprint` |
| Tutup sprint | `/kaneo-close-sprint` |
| Selaraskan board dengan git/PR/kode | `/kaneo-sync` |

Assign ditangani di dalam `/kaneo-create` dan `/kaneo-move` (userId via `list_workspace_members`).

## Tetap update
Saat start, server cek npm untuk versi baru. Bila ada, instruksi server dan tool `check_for_updates`
melaporkannya — minta user jalankan `npx -y @sadamdi/kaneo-mcp@latest` dan restart klien sebelum
lanjut.

## Bila tool tak tersedia
Tool `mcp__kaneo__*` hilang → minta user daftarkan/restart MCP server (lihat README). Verifikasi
dengan `get_config`.
