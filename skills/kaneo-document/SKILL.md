---
name: kaneo-document
description: Turn code, a spec, or a feature into a documentation-grade Kaneo card, or enrich an existing thin card. Use when the user wants a detailed/complete task, to document work on the board, or says a card is too shallow. Requires codebase evidence for every technical claim.
---

# /kaneo-document — Documentation-grade cards

Produce cards that read like real team documentation: endpoints, files, schema, flow — all
**verified in the codebase**, never invented. Also enriches existing thin cards.

Read first: `_shared/grounding.md` (§5 evidence rule is central), `_shared/templates.md`,
`_shared/conventions.md`, `_shared/context-memory.md`, `_shared/project-detection.md`.

## Step 1 — Context
Read `.kaneo/context.md` for the board map, language, and the project type/template variant. If it
doesn't exist, suggest `/kaneo-setup` first (or detect on the fly).

## Step 2 — Identify the subject
What is being documented? A feature to build, code that already exists, a spec/doc, or an existing
card to enrich? Determine the project type (backend/frontend/mobile/infra/data) → pick the template
from `_shared/templates.md`.

## Step 3 — Gather EVIDENCE (mandatory)
Before writing any technical detail, verify it in the actual codebase:
- Endpoints: grep routes/handlers for the real `METHOD /path` + request/response.
- Files/modules: confirm the paths exist (handler/service/repository/component).
- DB: read migrations/models for real tables/columns.
- Components/state: confirm names in the source.
Anything you cannot verify → write `TBD (verify)`. Do NOT fabricate plausible-looking details.

## Step 4 — Build the card
Header block + `Context` / `Scope` / `Acceptance criteria` (≤8, testable) / `Technical notes`
(the verified evidence, per template variant) / `Links` / `Definition of Done`. Title = verb-first
`[Area] …`. Write in the team language from `.kaneo/context.md`.

## Step 5 — Create or enrich (idempotent)
- New card: `search` for duplicates first; if none, `create_task`, then set priority + labels
  (one TYPE + one AREA) + assignee/due if known.
- Enrich existing: `get_task` → **merge** the new sections into the current description, preserving
  everything already there (grounding §3) → `update_task` (keep `projectId` + `position`).

## Step 6 — Verify + log
Read the card back; report its real id + a short outline of the sections. Append an entry to the
Activity log in `.kaneo/context.md`.

## Example prompts
> "document the checkout flow as a kaneo task" · "make a detailed card for the auth module" ·
> "this card is too shallow, fill it in from the code" · "create a proper ticket for the migration"
