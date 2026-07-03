# Card Templates (per project type)

All cards share a **header block** + the description structure from `conventions.md`, then a
type-specific **Technical notes** checklist. Fill only verified facts (grounding.md §5). Pick the
template variant from the project type in `.kaneo/context.md` (auto-detected per
`project-detection.md`).

## Header block (all cards)
```
> **Repo**: `<repo or sub-project>`  ·  **Area**: <frontend|backend|mobile|infra|data>  ·  **Type**: <feature|bug|chore|docs|refactor|security|perf>  ·  **Status**: <to-do|in-progress|in-review|done>
> **Source**: <spec/doc/issue link, or "conversation with <user>">
```

## Generic body (from conventions.md)
`## Context` → `## Scope` (In/Out) → `## Acceptance criteria` (checkboxes ≤8) →
`## Technical notes` (per type below) → `## Links` → `## Definition of Done`.

## Technical notes by type

### Backend
- **Endpoints**: `METHOD /path` — request body (fields+types), response, status codes, authz/role.
- **Data**: tables/collections touched, new migrations, indexes.
- **Modules/files**: handler / service / repository paths.
- **Cross-service**: which other services it calls / is called by; idempotency.
- **Non-functional**: performance target, rate limits, audit/logging.

### Frontend
- **Routes/pages** added or changed.
- **Components**: new/modified, and where they live.
- **State/data**: stores, API endpoints consumed, caching.
- **UX acceptance**: loading state, empty state, error state, success state.
- **Responsive + a11y**: breakpoints, keyboard/screen-reader basics.

### Mobile
- **Screens/flows** affected.
- **Platforms**: iOS / Android (and min versions).
- **Native concerns**: permissions, deep links, push, offline/sync.
- **Store impact**: new permission, version bump, review risk.

### Infra / DevOps
- **Resources**: services, queues, buckets, DNS, secrets.
- **Environments**: dev/staging/prod; what changes where.
- **IaC files**: terraform/helm/compose/workflow paths.
- **Rollout & rollback**: how to deploy, how to revert, blast radius.
- **Observability**: metrics/alerts/dashboards to add.

### Data
- **Pipelines/jobs**: source → transform → sink.
- **Schemas/models**: tables, dbt models, contracts.
- **Quality**: tests/validations, expected row counts.
- **Backfill/migration**: one-off steps, reprocessing.

### Generic (fallback)
Context + Scope + Acceptance criteria + any verified technical notes + Links + DoD.

## Bug template (any type)
```
## Summary
One line: what's broken.

## Steps to reproduce
1. …
2. …

## Expected vs actual
- Expected: …
- Actual: …

## Environment
Version / browser / device / OS / commit.

## Evidence
Logs / screenshot ref / stack trace.

## Suspected cause / scope
(verified pointers only)
```
