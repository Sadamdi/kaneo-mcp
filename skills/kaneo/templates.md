# Card Templates + Format Contract

Read this before writing any task description. Part 1 is the **format contract** (how to make it
render); Part 2 is the **card structure**; Part 3 is **per-type technical notes**; Part 4 is a
**filled example**.

---

## Part 1 — Format contract (non-negotiable)

Kaneo renders descriptions as markdown (TipTap + GFM: tables, fenced code with highlighting,
headings, ordered/unordered/task lists, blockquotes, links). Raw multi-line text collapses into
mush. So:

| Content | Write it as |
|---|---|
| Two paragraphs | Separated by a **blank line** (single newlines collapse) |
| Any tabular data (variables, scenarios, RACI, endpoints) | **GFM table** with a `|---|` row |
| Formula / calculation / pseudo-code / ASCII layout | **Fenced code block** ```` ``` ```` |
| Real source code | Fenced block with a language tag ```` ```go ```` |
| A sequence of steps / a flow | **Numbered list** |
| A set of items | **Bullet list** |
| A checklist / acceptance criteria | **Task list** `- [ ]` / `- [x]` |
| A section title | `###` or `####` heading |
| Emphasis | `**bold**`, `*italic*`, `` `inline code` `` |

**Never:**
- Leave the section sign `§` — write "section 2.1"; turn `§11 Dashboard` into `### 11. Dashboard`.
- Leave smart quotes / other Word glyphs from a docx paste.
- Paste raw HTML.
- Paste a docx/spreadsheet block unconverted. **Convert to markdown first.** "Complete" means all
  the content, structured — not raw formatting.

---

## Part 2 — Card structure

Every card starts with a header block, then the body sections (omit ones that don't apply).

**Header block:**

```
> **Repo**: `<repo or sub-project>`  ·  **Area**: <frontend|backend|mobile|infra|data>  ·  **Type**: <feature|bug|chore|docs|refactor|security|perf>  ·  **Status**: <to-do|in-progress|in-review|done>
> **Source**: <spec/doc/issue link, or "conversation with <user>">
```

**Body sections:**

```
## Context
Why this exists — the problem, the trigger, the intended outcome. 1–3 sentences.

## Scope
- In: what this task covers
- Out: what it explicitly does NOT cover

## Acceptance criteria
- [ ] Testable, user-observable condition 1
- [ ] Condition 2
(Keep to about 8. Each must be verifiable.)

## Technical notes
Verified references only (see the evidence rule): endpoints, files, tables, components, configs.

## Links
Spec / design / PR / related tasks.

## Definition of Done
Merged + tests pass + docs updated + card moved to done (adjust to team norms).
```

**Title**: verb-first, about 10 words, optional `[Area]` prefix — "Add refresh-token rotation",
"Fix 500 on login when email has uppercase".

**Labels**: apply one TYPE (`feature`/`bug`/`chore`/`docs`/`refactor`/`security`/`perf`) + one
AREA (`frontend`/`backend`/`mobile`/`infra`/`data`/`design`).

**Priority**: `urgent` = blocker/security/data-loss/prod-down · `high` = core this cycle ·
`medium` = normal (default) · `low` = nice-to-have.

---

## Part 3 — Technical notes by project type

### Backend
- **Endpoints**: `METHOD /path` — request body (fields + types), response, status codes, role.
- **Data**: tables/collections touched, new migrations, indexes.
- **Modules/files**: handler / service / repository paths.
- **Cross-service**: which services it calls / is called by; idempotency.
- **Non-functional**: performance target, rate limits, audit/logging.

### Frontend
- **Routes/pages** added or changed.
- **Components**: new/modified and where they live.
- **State/data**: stores, API endpoints consumed, caching.
- **UX acceptance**: loading / empty / error / success states.
- **Responsive + a11y**: breakpoints, keyboard/screen-reader basics.

### Mobile
- **Screens/flows**; **Platforms** iOS/Android (+ min versions).
- **Native**: permissions, deep links, push, offline/sync.
- **Store impact**: new permission, version bump, review risk.

### Infra / DevOps
- **Resources**: services, queues, buckets, DNS, secrets.
- **Environments**: dev/staging/prod — what changes where.
- **IaC files**: terraform/helm/compose/workflow paths.
- **Rollout & rollback**: deploy, revert, blast radius.
- **Observability**: metrics/alerts/dashboards to add.

### Data
- **Pipelines/jobs**: source → transform → sink.
- **Schemas/models**: tables, dbt models, contracts.
- **Quality**: tests/validations, expected row counts.
- **Backfill/migration**: one-off steps, reprocessing.

### Bug (any type)
```
## Summary — one line: what's broken.
## Steps to reproduce — 1. … 2. …
## Expected vs actual
## Environment — version / browser / device / OS / commit.
## Evidence — logs / screenshot ref / stack trace.
## Suspected cause — verified pointers only.
```

---

## Part 4 — Filled example (backend, render-clean)

````markdown
> **Repo**: `koperasi-shu-backend`  ·  **Area**: backend  ·  **Type**: feature  ·  **Status**: to-do
> **Source**: `Probis/.../BP-Management SHU_ SISTEM POINT.docx` (BP-SHU-003 Hybrid)

## Context
Compute each member's SHU by combining the traditional pool (savings + loan proportion) with a
contribution-point bonus pool, then summing them.

## Acceptance criteria
- [ ] Pool split validates `pct_tradisional + pct_bonus_poin = 100%`
- [ ] Unit test matches the doc's worked example (traditional Rp160jt + bonus Rp40jt = Rp200jt)
- [ ] Rounding uses floor; the remainder goes to the reserve fund

## Technical notes

### Pool split

```
Total_Dana_SHU_Anggota = SHU_Kotor × pct_anggota
Pool_Tradisional       = Total_Dana_SHU_Anggota × pct_tradisional   // ex: 80%
Pool_Bonus_Poin        = Total_Dana_SHU_Anggota × pct_bonus_poin     // ex: 20%
```

### Worked example

| Member | Savings | Loan | Points (locked) | SHU total |
|--------|---------|------|-----------------|-----------|
| Budi   | Rp 50.000.000 | Rp 80.000.000 | 500 | Rp 43.333.333 |
| Siti   | Rp 80.000.000 | Rp 120.000.000 | 1.200 | Rp 68.800.000 |

### Endpoints
- `POST /api/shu/periods/{id}/calculate` — body `{ pct_tradisional, pct_bonus_poin }`, role: Pengurus.

## Definition of Done
Merged + unit test green + Swagger updated + card moved to done.
````

This is the default template. Teams may customize their locally installed copy of this file.
