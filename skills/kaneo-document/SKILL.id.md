---
name: kaneo-document
description: Ubah kode/spec/fitur jadi kartu Kaneo setara dokumentasi, atau perkaya kartu tipis. Pakai saat user mau task detail/lengkap, mendokumentasikan pekerjaan, atau bilang kartu terlalu dangkal. Wajib bukti dari codebase untuk tiap klaim teknis.
---

# /kaneo-document — Kartu setara dokumentasi

Buat kartu yang terbaca seperti dokumentasi tim: endpoint, file, skema, alur — semua
**terverifikasi di codebase**, tidak dikarang. Juga memperkaya kartu tipis yang sudah ada.

Baca dulu: `_shared/grounding.id.md` (§5 aturan bukti = inti), `_shared/templates.id.md`,
`_shared/conventions.id.md`, `_shared/context-memory.id.md`, `_shared/project-detection.id.md`.

## Langkah 1 — Konteks
Baca `.kaneo/context.md` untuk peta board, bahasa, tipe/varian template project. Bila belum ada,
sarankan `/kaneo-setup` (atau deteksi langsung).

## Langkah 2 — Tentukan subjek
Yang didokumentasikan: fitur yang akan dibangun, kode yang sudah ada, spec/doc, atau kartu yang mau
diperkaya? Tentukan tipe project → pilih template dari `_shared/templates.id.md`.

## Langkah 3 — Kumpulkan BUKTI (wajib)
Sebelum menulis detail teknis, verifikasi di codebase asli: endpoint (grep route/handler untuk
`METHOD /path` + request/response); file/modul (pastikan path ada); DB (baca migrasi/model);
komponen/state (pastikan nama di source). Yang tak bisa diverifikasi → `TBD (verify)`. JANGAN
mengarang.

## Langkah 4 — Susun kartu
Blok header + `Konteks`/`Scope`/`Acceptance criteria` (≤8, teruji)/`Catatan teknis` (bukti
terverifikasi, per varian)/`Tautan`/`Definition of Done`. Judul = kata-kerja-dulu `[Area] …`.
Tulis dalam bahasa tim dari `.kaneo/context.md`.

## Langkah 5 — Create atau enrich (idempoten)
- Kartu baru: `search` duplikat dulu; bila tidak ada, `create_task`, lalu set priority + label
  (satu TIPE + satu AREA) + assignee/due bila diketahui.
- Perkaya existing: `get_task` → **merge** section baru ke deskripsi (grounding §3) → `update_task`
  (pertahankan `projectId` + `position`).

## Langkah 6 — Verifikasi + log
Baca ulang kartu; laporkan id asli + outline section. Tambah entri ke Activity log.

## Contoh prompt
> "dokumentasikan alur checkout jadi task kaneo" · "kartu ini terlalu dangkal, isi dari kode" ·
> "bikin ticket proper untuk migrasi"
