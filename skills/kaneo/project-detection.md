# Project Auto-Detection

How a skill figures out what a repo/folder actually is, so it can pick the right template and speak
the right language — automatically, without asking the user to explain their own project. Results
are written into `.kaneo/context.md` (see `context-memory.md`) and can be overridden manually.

Run this in the working directory (and, for monorepos, per sub-directory).

## Layer A — Stack (manifest → language + framework + package manager)
| Signal file | Language | Framework hints (read the file) | Type |
|---|---|---|---|
| `go.mod` | Go | imports: gin / fiber / echo / chi / gorilla | backend |
| `package.json` | JS/TS | deps: react, vue, svelte, angular, next, nuxt, astro, vite | frontend |
| `package.json` | JS/TS | deps: express, fastify, nestjs, hono, koa, hapi | backend |
| `package.json` | JS/TS | deps: react-native, expo | mobile |
| `pubspec.yaml` | Dart | flutter | mobile |
| `build.gradle` + `AndroidManifest.xml` | Kotlin/Java | android | mobile |
| `Podfile` / `*.xcodeproj` / `Package.swift` | Swift/ObjC | uikit / swiftui | mobile |
| `pyproject.toml` / `requirements.txt` | Python | django / flask / fastapi → backend; pandas / airflow / dbt → data | backend/data |
| `Cargo.toml` | Rust | actix / axum / rocket | backend |
| `composer.json` | PHP | laravel / symfony | backend |
| `pom.xml` / `build.gradle` (JVM) | Java/Kotlin | spring / quarkus / micronaut | backend |
| `*.csproj` / `*.sln` | C# | asp.net / blazor | backend |
| `Gemfile` | Ruby | rails / sinatra | backend |
| `Dockerfile` / `docker-compose.yml` / `*.tf` / `helm/` / `k8s/` / `ansible/` / `.github/workflows/` | — | terraform / kubernetes / ansible / ci | infra/devops |
| `dbt_project.yml` / heavy `*.sql` / `airflow/` | SQL/Python | dbt / airflow / spark | data |

Record: primary language(s), framework(s), package manager (npm/pnpm/yarn/pip/poetry/cargo/…),
and version if the manifest states one.

## Layer B — Architecture & flow (skim to write a short "how it works")
- **Entry points**: `cmd/`, `src/index.*`, `main.*`, `app/`, `pages/` or `app/` router.
- **API style**: REST (routes/controllers), gRPC (`*.proto`), GraphQL (`schema.graphql`).
- **Data layer**: `migrations/`, ORM models, `schema.prisma`, `*.sql`.
- **Auth pattern**: JWT / session / OAuth (from middleware or deps).
- **Key directories** map (what lives where).
- **Config / ports / env**: `.env.example`, config files.
- **CI**: `.github/workflows/`, `.gitlab-ci.yml`.
Summarise in 5–10 lines: "This is a <lang> <type> using <framework>; entry at <x>; <API style>;
data in <y>; auth via <z>."

## Layer C — Monorepo
Multiple manifests in sub-directories → treat each sub-project separately. Produce a table:
`path · language · framework · type · template variant · Kaneo board`. Detect ALL, don't stop at
the first hit.

## Unknown
No recognised manifest → `type: generic`. Ask the user once what the project is, record the answer.

## Language inference (for the team's working language)
Separate from stack: infer the human language the Kaneo team uses — sample existing card
titles/descriptions on 1–2 boards (`list_tasks`) and the repo's `README`/docs. If clearly one
language (e.g. Indonesian), propose it as the default in setup; otherwise default to English.
