# Auto-Deteksi Project

Cara skill mengetahui sebuah repo/folder itu apa, agar bisa memilih template dan bahasa yang
tepat — otomatis, tanpa menyuruh user menjelaskan project-nya sendiri. Hasil ditulis ke
`.kaneo/context.md` (lihat `context-memory.id.md`) dan bisa di-override manual.

Jalankan di direktori kerja (dan, untuk monorepo, per sub-direktori).

## Lapisan A — Stack (manifest → bahasa + framework + package manager)
| File sinyal | Bahasa | Petunjuk framework (baca file-nya) | Tipe |
|---|---|---|---|
| `go.mod` | Go | gin / fiber / echo / chi | backend |
| `package.json` | JS/TS | react, vue, svelte, angular, next, nuxt, astro, vite | frontend |
| `package.json` | JS/TS | express, fastify, nestjs, hono, koa | backend |
| `package.json` | JS/TS | react-native, expo | mobile |
| `pubspec.yaml` | Dart | flutter | mobile |
| `build.gradle` + `AndroidManifest.xml` | Kotlin/Java | android | mobile |
| `Podfile` / `*.xcodeproj` / `Package.swift` | Swift | uikit / swiftui | mobile |
| `pyproject.toml` / `requirements.txt` | Python | django/flask/fastapi→backend; pandas/airflow/dbt→data | backend/data |
| `Cargo.toml` | Rust | actix / axum / rocket | backend |
| `composer.json` | PHP | laravel / symfony | backend |
| `pom.xml` / `build.gradle` (JVM) | Java/Kotlin | spring / quarkus | backend |
| `*.csproj` | C# | asp.net / blazor | backend |
| `Gemfile` | Ruby | rails / sinatra | backend |
| `Dockerfile` / `docker-compose` / `*.tf` / `helm/` / `k8s/` / `ansible/` / `.github/workflows/` | — | terraform/kubernetes/ansible/ci | infra |
| `dbt_project.yml` / `*.sql` banyak / `airflow/` | SQL/Python | dbt/airflow/spark | data |

Catat: bahasa utama, framework, package manager, versi bila ada.

## Lapisan B — Arsitektur & alur (skim untuk ringkasan "cara kerja")
Entry point (`cmd/`, `src/index.*`, `main.*`, router `app/`/`pages/`); gaya API (REST/gRPC/GraphQL);
lapisan data (`migrations/`, ORM, `schema.prisma`); pola auth (JWT/session/OAuth); peta direktori
kunci; config/port/env; CI. Ringkas 5–10 baris: "Ini <bahasa> <tipe> pakai <framework>; entry di
<x>; <gaya API>; data di <y>; auth via <z>."

## Lapisan C — Monorepo
Banyak manifest di sub-direktori → tiap sub-project terpisah. Buat tabel:
`path · bahasa · framework · tipe · varian template · board Kaneo`. Deteksi SEMUA.

## Tidak dikenal
Tidak ada manifest dikenal → `type: generic`. Tanya user sekali, catat jawabannya.

## Inferensi bahasa (bahasa kerja tim)
Terpisah dari stack: infer bahasa manusia yang dipakai tim — sampel judul/deskripsi kartu di 1–2
board (`list_tasks`) + `README`/docs repo. Bila jelas satu bahasa (mis. Indonesia), usulkan sebagai
default saat setup; kalau ragu, default English.
