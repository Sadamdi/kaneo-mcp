---
name: kaneo-create
description: Create a complete new task in Kaneo — title, description, label, priority, assignee, and due date — all in one flow. Use when the user wants to add a task/card/ticket to a board.
---

# /kaneo-create — Create a New Task in Kaneo

Skill for creating a complete new task: title, description, label, priority, and assignee — all in
one flow.

> **Before you start (grounding):** read `.kaneo/context.md` first if it exists (board map,
> language, project stack; else suggest `/kaneo-setup`). Discover real IDs, never hardcode. Write
> card content in the team's board language (`_shared/language.md`). See `_shared/grounding.md`.

## Workflow

### Step 1: Pick the Project

```
mcp__kaneo__list_projects
```

Show the project list and ask the user: **"Which project should this task go in?"**

### Step 2: Collect All the Info at Once

Once the project is picked, fetch the data needed for the questions:

```
mcp__kaneo__list_workspace_labels
mcp__kaneo__get_project { "id": "<projectId>" }
```

Then ask the user in **one message**, everything at once:

---

> **Fill in the new task details:**
>
> 1. **Title** — what's the task called?
> 2. **Description** — (optional) details or acceptance criteria
> 3. **Priority** — `low` / `medium` / `high` / `urgent`
> 4. **Assign to** — who works on it? (from members: [show member names])
> 5. **Label** — pick an existing one: [show existing labels], name a new one, or leave empty
> 6. **Due date** — (optional) format: `YYYY-MM-DD`

---

If the user already gave all the info in their first message, skip the questions and proceed.

**Also (grounding):** before creating, search for a duplicate or a related task —
`mcp__kaneo__search { "query": "<key words from the title>" }`. If a matching task exists, update it
instead of duplicating. Note any related task to link in Step 5.

### Step 3: Create a New Label (if requested)

If the user wants a new label that doesn't exist yet:

```
mcp__kaneo__create_label {
  "name": "<label-name>",
  "color": "<hex-color>"
}
```

Pick a sensible color based on the label name:
- `bug` / `error` → red `#ef4444`
- `feature` / `enhancement` → blue `#3b82f6`
- `docs` / `documentation` → yellow `#eab308`
- `design` / `ui` → purple `#a855f7`
- `backend` / `api` → green `#22c55e`
- `frontend` → orange `#f97316`
- other labels → gray `#6b7280`

### Step 4: Write a Proper Description (enhancement)

Don't leave the description as a one-liner. Pick the template that matches the project type (from
`.kaneo/context.md` / `_shared/project-detection.md`) in `_shared/templates.md` and follow the
**format contract** there:
- Kaneo renders markdown — put a blank line between blocks.
- Tables → GFM tables; formulas/schemas/code → fenced code blocks; steps → numbered lists;
  acceptance criteria → `- [ ]` checkboxes; sections → `###` headings.
- No raw HTML, no stray Word glyphs.
For a documentation-grade card verified against code, use `/kaneo-document` instead.

### Step 5: Create the Task

```
mcp__kaneo__create_task {
  "projectId": "<id>",
  "title": "<title>",
  "description": "<description>",
  "status": "to-do"
}
```

### Step 6: Set All the Attributes (in parallel where possible)

Run these after the task is created, using the task `id` from the response:

**Priority:**
```
mcp__kaneo__set_task_priority {
  "id": "<id>",
  "priority": "<low|medium|high|urgent>"
}
```

**Assignee:**
```
mcp__kaneo__set_task_assignee {
  "id": "<id>",
  "userId": "<user-id>"
}
```

**Label:**
```
mcp__kaneo__attach_label_to_task {
  "taskId": "<id>",
  "labelId": "<label-id>"
}
```

**Due date (if any):**
```
mcp__kaneo__set_task_due_date {
  "id": "<id>",
  "dueDate": "YYYY-MM-DD"
}
```

**Link a related task (enhancement)** — if Step 2 found related/integrated work:
```
mcp__kaneo__create_task_relation {
  "sourceTaskId": "<id>",
  "targetTaskId": "<related-id>",
  "relationType": "relates_to"
}
```
(`blocks` / `blocked_by` for dependencies, `relates_to` for integrations, `duplicates` to supersede.)

### Step 7: Confirm to the User

Read the task back (`mcp__kaneo__get_task { "id": "<id>" }`) to verify, then show a full summary of
the new task:

```
✅ Task created!

📋 [Task Title]
   Project  : [Project Name]
   Priority : 🔴 urgent / 🟠 high / 🟡 medium / ⚪ low
   Assign   : @[assignee name]
   Label    : [label name]
   Due      : [date] (if any)
   ID       : [task-id]
```

Append one line to the `.kaneo/context.md` Activity log (`_shared/context-memory.md`).

---

## Example prompts

> "create a new task in E-Commerce"
> *(the AI asks for all the details in one message)*

> "create a task: implement the checkout page, priority high, assign to Imam, label frontend"

> "add a task in Simpan Pinjam: build the loan application form, urgent, assign to me, new label: 'MVP'"

---

## Tips

- If the user says "assign to me" — take the user ID from the member data already loaded in Step 2.
- If the label doesn't exist in the workspace yet, create it before attaching.
- If the user doesn't mention a priority, default to `medium`.
- If the user doesn't mention an assignee, leave it unassigned — don't guess.
- Always show the task ID in the final confirmation (useful for `/kaneo-move` and `/kaneo-done`).
- Grounding: search before creating, don't invent IDs, and verify the task after creating it.
