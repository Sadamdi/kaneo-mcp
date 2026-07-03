---
name: kaneo-setup
description: Onboarding pertama Kaneo di sebuah repo. Pakai saat user pertama kali menghubungkan Kaneo di sini, menyebut setup/onboarding, atau saat .kaneo/context.md belum ada. Auto-deteksi stack, infer bahasa tim, petakan board, tulis .kaneo/context.md.
---

# /kaneo-setup — Onboarding Kaneo untuk project ini

Konfigurasi Kaneo untuk repo saat ini sekali, agar semua skill berikutnya grounded & konsisten.
Auto-deteksi dulu, konfirmasi ke user, simpan ke `.kaneo/context.md`. Semua bisa di-override manual.

Baca dulu: `_shared/grounding.id.md`, `_shared/language.id.md`, `_shared/project-detection.id.md`,
`_shared/context-memory.id.md`.

## Langkah 1 — Verifikasi MCP terjangkau
Panggil `get_config`. Bila error, minta user cek MCP server / API key (lihat README) lalu berhenti.

## Langkah 2 — Bahasa (auto-infer → konfirmasi → simpan)
Ikuti `_shared/language.id.md`: cek `get_user_preferences`; bila belum ada, infer dari sampel 1–2
board (`list_projects` lalu `list_tasks`) + `README`; usulkan English/Indonesia/lainnya lalu tanya
**scope** lokal/global. lokal → `.kaneo/context.md`; global → `set_user_preferences { language }`.

## Langkah 3 — Discovery
`list_workspaces` (pilih workspace) → `list_projects` → `list_columns` tiap board → 
`list_workspace_labels`.

## Langkah 4 — Deteksi project mendalam
Jalankan `_shared/project-detection.id.md`: baca manifest (`go.mod`, `package.json`, `pubspec.yaml`,
`Cargo.toml`, `Dockerfile`, …) untuk bahasa + framework + tipe; skim entry point, gaya API, lapisan
data, CI untuk ringkasan "cara kerja". Monorepo → deteksi **per sub-direktori**.

## Langkah 5 — Petakan project ↔ board
Usulkan pemetaan sub-project ↔ board Kaneo by kemiripan nama; minta konfirmasi. Catat varian
template (backend/frontend/mobile/infra/data/generic) tiap sub-project.

## Langkah 6 — Tulis `.kaneo/context.md`
Buat file per `_shared/context-memory.id.md`. Bila sudah ada, **MERGE** — jangan timpa edit manual.

## Langkah 7 — Tawarkan label standar
Bandingkan label existing ke taksonomi `_shared/conventions.id.md`. Tawarkan buat label TIPE + AREA
yang belum ada. Buat hanya setelah user setuju.

## Langkah 8 — Ringkasan
Cetak apa yang dikonfigurasi (bahasa+scope, workspace, peta board↔project, stack tiap sub-project,
varian template) + **cara override** (edit `.kaneo/context.md` atau ulang `/kaneo-setup`). Saran
lanjut: `/kaneo-create`, `/kaneo-document`, `/kaneo-standup`.

## Contoh prompt
> "setup kaneo untuk repo ini" · "onboarding kaneo" · "atur board kaneo buat tim kami"
