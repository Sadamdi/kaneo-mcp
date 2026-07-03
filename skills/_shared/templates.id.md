# Template Kartu (per tipe project)

Semua kartu berbagi **blok header** + struktur deskripsi dari `conventions.id.md`, lalu checklist
**Catatan teknis** spesifik tipe. Isi hanya fakta terverifikasi (grounding §5). Pilih varian dari
tipe project di `.kaneo/context.md` (auto-deteksi via `project-detection.id.md`).

## Blok header (semua kartu)
```
> **Repo**: `<repo/sub-project>`  ·  **Area**: <frontend|backend|mobile|infra|data>  ·  **Type**: <feature|bug|chore|docs|refactor|security|perf>  ·  **Status**: <to-do|in-progress|in-review|done>
> **Source**: <tautan spec/doc/issue, atau "percakapan dengan <user>">
```

## Badan generik
`## Konteks` → `## Scope` (Termasuk/Tidak) → `## Acceptance criteria` (checkbox ≤8) →
`## Catatan teknis` (per tipe di bawah) → `## Tautan` → `## Definition of Done`.

## Catatan teknis per tipe

### Backend
- **Endpoint**: `METHOD /path` — request body (field+tipe), response, status code, authz/role.
- **Data**: tabel yang tersentuh, migrasi baru, index.
- **Modul/file**: path handler/service/repository.
- **Lintas-service**: memanggil/dipanggil siapa; idempotensi.
- **Non-fungsional**: target performa, rate limit, audit/log.

### Frontend
- **Route/halaman** ditambah/diubah.
- **Komponen**: baru/diubah + lokasinya.
- **State/data**: store, endpoint API yang dikonsumsi, caching.
- **Acceptance UX**: loading, empty, error, success state.
- **Responsif + a11y**: breakpoint, dasar keyboard/screen-reader.

### Mobile
- **Layar/flow** terdampak.
- **Platform**: iOS / Android (+ versi min).
- **Native**: permission, deep link, push, offline/sync.
- **Dampak store**: permission baru, bump versi, risiko review.

### Infra / DevOps
- **Resource**: service, queue, bucket, DNS, secret.
- **Environment**: dev/staging/prod; apa berubah di mana.
- **File IaC**: path terraform/helm/compose/workflow.
- **Rollout & rollback**: cara deploy, cara revert, blast radius.
- **Observability**: metrik/alert/dashboard.

### Data
- **Pipeline/job**: source → transform → sink.
- **Skema/model**: tabel, model dbt, kontrak.
- **Kualitas**: test/validasi, jumlah baris diharapkan.
- **Backfill/migrasi**: langkah sekali jalan, reprocessing.

### Generik (fallback)
Konteks + Scope + Acceptance criteria + catatan teknis terverifikasi + Tautan + DoD.

## Template bug (semua tipe)
```
## Ringkasan
Satu baris: apa yang rusak.

## Langkah reproduksi
1. …

## Diharapkan vs aktual
- Diharapkan: …
- Aktual: …

## Environment
Versi / browser / device / OS / commit.

## Bukti
Log / ref screenshot / stack trace.

## Dugaan penyebab / scope
(pointer terverifikasi saja)
```
