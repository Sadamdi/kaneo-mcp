---
name: kaneo-document
description: Turn code or a spec into a documentation-grade Kaneo card — endpoints, files, DB schema, roles, flow — every technical claim verified against the actual codebase. Use to document a feature as a rich card, or to enrich an existing one.
---

# /kaneo-document — Documentation-Grade Card from Code/Spec

Make a Kaneo card that reads like real team documentation: what the feature does, its endpoints,
file locations, DB schema, roles, and flow — with **every technical claim verified in the code**.

## Step 1: Detect the project type
Read `.kaneo/context.md` (or run `_shared/project-detection.md`) to pick the template variant in
`_shared/templates.md` (backend / frontend / mobile / infra / data).

## Step 2: Gather VERIFIED facts (evidence rule)
Grep/read the codebase for the real:
- endpoints (`METHOD /path` + request/response + role),
- handler / service / repository file paths,
- DB tables / columns / migrations,
- config keys, cross-service calls.
Anything you cannot confirm in the code -> write `TBD (verify)`. Never invent plausible details.

## Step 3: If embedding an external doc (docx/pdf/spec)
Convert it to markdown FIRST per the format contract in `_shared/templates.md`: tables -> GFM
tables, formulas/schemas -> fenced code blocks, section numbers -> `###` headings, remove stray
Word glyphs, blank line between blocks. Keep the content complete — "complete" means all of it,
structured, not raw pasted formatting.

## Step 4: Search first (grounding)
```
mcp__kaneo__search { "query": "<feature keywords>" }
```
- Found an existing card -> **enrich** it: `get_task` -> merge -> `update_task` (preserve existing
  sections, add the verified detail).
- Not found -> create a new card.

## Step 5: Build the card
Use the full template + header block from `_shared/templates.md`:
```
> **Repo**: `<repo>`  ·  **Area**: <backend|frontend|...>  ·  **Type**: <feature|...>  ·  **Status**: <status>
> **Source**: <doc path or code refs>
```
then Context / Scope / Acceptance criteria / Technical notes (verified endpoints, files, DB, roles) /
Flow / Links / DoD. Write it in the team's board language.

## Step 6: Create/update, label, verify, log
```
mcp__kaneo__create_task { "projectId": "<id>", "title": "<title>", "description": "<markdown>", "status": "<status>", "priority": "<p>" }
mcp__kaneo__attach_label_to_task { "labelId": "<backendLabelId>", "taskId": "<id>" }
```
Attach `backend`/`frontend`/... + a type label. Link related tasks with `create_task_relation`.
Read it back (`get_task`) and report the real id + status. Append to the `.kaneo/context.md`
Activity log.

## Example prompts
> "dokumentasikan fitur payment QRIS ke Kaneo, verifikasi ke kode"
> "enrich the Order Lifecycle card with the real endpoints from the codebase"
