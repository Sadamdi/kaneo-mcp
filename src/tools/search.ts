import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

interface RawTask {
  id: string;
  title?: string;
  number?: number;
  description?: string;
  status?: string;
  priority?: string;
  startDate?: string | null;
  dueDate?: string | null;
  createdAt?: string;
  userId?: string | null;
  assigneeName?: string | null;
  assigneeId?: string | null;
  projectId?: string;
  labels?: { id: string; name: string; color?: string }[];
}

interface SearchResultItem {
  id: string;
  type: string;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  projectSlug?: string;
  priority?: string;
  status?: string;
  taskNumber?: number;
  relevanceScore?: number;
}

interface AdvancedResult {
  id: string;
  number?: number;
  title?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  projectName?: string;
  projectSlug?: string;
  assigneeId?: string | null;
  assigneeName?: string | null;
  labels?: string[];
  dueDate?: string | null;
  createdAt?: string;
  relevanceScore?: number;
  descriptionSnippet?: string;
  relations?: { id: string; relationType: string; taskId: string; title?: string }[];
  matchedComment?: { id: string; snippet: string };
}

const PRIORITY_RANK: Record<string, number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
  "no-priority": 0,
};

function snippet(text: string | undefined, max = 200): string | undefined {
  if (!text) return undefined;
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? flat.slice(0, max) + "…" : flat;
}

function matchesQuery(haystacks: (string | undefined)[], query: string): boolean {
  const q = query.toLowerCase();
  return haystacks.some((h) => h?.toLowerCase().includes(q));
}

async function listAllProjectIds(workspaceId: string): Promise<{ id: string; name: string; slug: string }[]> {
  const projects = (await kaneo.get<any>("/project", { workspaceId })) as any[];
  return (Array.isArray(projects) ? projects : []).map((p) => ({ id: p.id, name: p.name, slug: p.slug }));
}

async function fetchTaskRelations(taskId: string): Promise<{ id: string; relationType: string; taskId: string; title?: string }[]> {
  try {
    const raw = (await kaneo.get<any>(`/task-relation/${taskId}`)) as any;
    const list = Array.isArray(raw) ? raw : raw?.data ?? [];
    return list.map((r: any) => {
      const otherId = r.sourceTaskId === taskId ? r.targetTaskId : r.sourceTaskId;
      const other = r.sourceTaskId === taskId ? r.targetTask : r.sourceTask;
      return { id: r.id, relationType: r.relationType, taskId: otherId, title: other?.title };
    });
  } catch {
    return [];
  }
}

async function findMatchingComment(taskId: string, query: string): Promise<{ id: string; snippet: string } | undefined> {
  try {
    const raw = (await kaneo.get<any>(`/comment/${taskId}`)) as any;
    const list = Array.isArray(raw) ? raw : raw?.data ?? [];
    const q = query.toLowerCase();
    const hit = list.find((c: any) => c.content?.toLowerCase().includes(q));
    return hit ? { id: hit.id, snippet: snippet(hit.content, 200)! } : undefined;
  } catch {
    return undefined;
  }
}

async function fetchProjectTasks(projectId: string): Promise<{ project: { id: string; name: string; slug: string }; tasks: RawTask[] }> {
  const res = await kaneo.get<any>(`/task/tasks/${projectId}`);
  const data = res?.data ?? res;
  const project = { id: data?.id ?? projectId, name: data?.name ?? "", slug: data?.slug ?? "" };
  const columns = data?.columns ?? [];
  const tasks: RawTask[] = columns.flatMap((c: any) => c.tasks ?? []);
  return { project, tasks };
}

export const searchTools: ToolDef[] = [
  {
    name: "search",
    description:
      "Fast full-text search across tasks and projects within a workspace (backend FTS over title+description only — verified: comment content is NOT indexed despite the name, and unknown query params are silently ignored by the API). Use this for a quick lookup by keyword. For status/priority/assignee/label filters, cross-project scans, title-only matching, linked-task context, or a comment-content check, use search_advanced instead.",
    schema: { query: z.string(), workspaceId: z.string().optional() },
    handler: async ({ query, workspaceId }: { query: string; workspaceId?: string }) =>
      kaneo.get("/search", { q: query, workspaceId: resolveWorkspaceId(workspaceId) }),
  },
  {
    name: "search_advanced",
    description:
      "Filtered task search with real status/priority/assignee/label/due-date filters and sorting — the plain `search` tool's API only does full-text over title+description and ignores every other param, so use this whenever you need to narrow results by anything else. " +
      "Fast path (single API call): pass `projectId` to scope to one board — the project's task list already includes labels and assignee, so all filters apply with no extra calls. " +
      "Cross-project path: omit `projectId` to search the whole workspace. If you only filter by `query`/`status`/`priority` this uses the fast backend full-text search (1 call) then filters client-side. If you filter by `assigneeId`/`assigneeName`/`labelName` with no `projectId`, this scans every project's task list (one call per project — slower on large workspaces, but still typically fast for a handful of boards). " +
      "`query` matches title+description by default (substring, case-insensitive); set `titleOnly: true` to match the title only. Results include a `descriptionSnippet` (first ~200 chars) instead of the full body to keep output compact — call get_task for the full description. " +
      "Set `includeRelations: true` to attach each result's linked tasks (blocks/related/subtask, with titles) for dependency context — one extra call per returned result, bounded by `limit`. Set `includeComments: true` (with `query`) to also check each already-returned result's comments for the query text and attach the first match as `matchedComment` — comments are not indexed by the backend at all, so this only enriches results already found via title/description/filters, it does not surface tasks whose only match is buried in a comment.",
    schema: {
      workspaceId: z.string().optional().describe("Defaults to KANEO_WORKSPACE_ID if not set."),
      query: z.string().optional().describe("Free-text term/phrase. Matches title+description unless titleOnly is set."),
      titleOnly: z.boolean().optional().describe("If true, `query` only matches the task title, not the description."),
      projectId: z.string().optional().describe("Scope to one project/board. Enables fast, full-fidelity filtering (labels+assignee included free)."),
      status: z.string().optional().describe("Exact column/status slug, e.g. 'to-do', 'in-progress', 'in-review', 'done'."),
      priority: z.enum(["no-priority", "low", "medium", "high", "urgent"]).optional(),
      assigneeId: z.string().optional().describe("Exact assignee user ID match."),
      assigneeName: z.string().optional().describe("Case-insensitive substring match on assignee display name."),
      labelName: z.string().optional().describe("Case-insensitive substring match on any attached label's name."),
      dueBefore: z.string().optional().describe("ISO date — only tasks with dueDate on/before this."),
      dueAfter: z.string().optional().describe("ISO date — only tasks with dueDate on/after this."),
      sortBy: z.enum(["relevance", "createdAt", "dueDate", "priority"]).optional().describe("Default: relevance if query given, else createdAt desc."),
      limit: z.number().optional().describe("Max results to return. Default 50."),
      includeRelations: z.boolean().optional().describe("Attach each returned task's linked tasks (blocks/related/subtask + their titles) via one extra call per returned result. Bounded by `limit` — cheap for small result sets, costly for large ones."),
      includeComments: z.boolean().optional().describe("For each already-returned result, also check its comments for `query` and attach the first match as `matchedComment` (one extra call per returned result, bounded by `limit`). Does NOT expand which tasks match — comment text is not indexed by the backend, so a task whose only match is in a comment won't appear as a result at all; this only enriches results already found some other way (e.g. title/description match, or no query at all)."),
    },
    handler: async (args: {
      workspaceId?: string;
      query?: string;
      titleOnly?: boolean;
      projectId?: string;
      status?: string;
      priority?: string;
      assigneeId?: string;
      assigneeName?: string;
      labelName?: string;
      dueBefore?: string;
      dueAfter?: string;
      sortBy?: string;
      limit?: number;
      includeRelations?: boolean;
      includeComments?: boolean;
    }) => {
      const workspaceId = resolveWorkspaceId(args.workspaceId);
      const limit = args.limit ?? 50;
      const needsFullFidelity = !!(args.assigneeId || args.assigneeName || args.labelName);
      let results: AdvancedResult[] = [];
      let scanned: { projects: number; mode: string };

      const passesFilters = (t: RawTask): boolean => {
        if (args.status && t.status !== args.status) return false;
        if (args.priority && t.priority !== args.priority) return false;
        if (args.assigneeId && t.assigneeId !== args.assigneeId) return false;
        if (args.assigneeName && !t.assigneeName?.toLowerCase().includes(args.assigneeName.toLowerCase())) return false;
        if (args.labelName) {
          const has = (t.labels ?? []).some((l) => l.name?.toLowerCase().includes(args.labelName!.toLowerCase()));
          if (!has) return false;
        }
        if (args.dueBefore && (!t.dueDate || t.dueDate > args.dueBefore)) return false;
        if (args.dueAfter && (!t.dueDate || t.dueDate < args.dueAfter)) return false;
        if (args.query) {
          const fields = args.titleOnly ? [t.title] : [t.title, t.description];
          if (!matchesQuery(fields, args.query)) return false;
        }
        return true;
      };

      if (args.projectId) {
        const { project, tasks } = await fetchProjectTasks(args.projectId);
        results = tasks.filter(passesFilters).map((t) => ({
          id: t.id,
          number: t.number,
          title: t.title,
          status: t.status,
          priority: t.priority,
          projectId: project.id,
          projectName: project.name,
          projectSlug: project.slug,
          assigneeId: t.assigneeId,
          assigneeName: t.assigneeName,
          labels: (t.labels ?? []).map((l) => l.name),
          dueDate: t.dueDate,
          createdAt: t.createdAt,
          descriptionSnippet: snippet(t.description),
        }));
        scanned = { projects: 1, mode: "single-project" };
      } else if (needsFullFidelity) {
        const projects = await listAllProjectIds(workspaceId);
        for (const p of projects) {
          const { tasks } = await fetchProjectTasks(p.id);
          for (const t of tasks) {
            if (!passesFilters(t)) continue;
            results.push({
              id: t.id,
              number: t.number,
              title: t.title,
              status: t.status,
              priority: t.priority,
              projectId: p.id,
              projectName: p.name,
              projectSlug: p.slug,
              assigneeId: t.assigneeId,
              assigneeName: t.assigneeName,
              labels: (t.labels ?? []).map((l) => l.name),
              dueDate: t.dueDate,
              createdAt: t.createdAt,
              descriptionSnippet: snippet(t.description),
            });
          }
        }
        scanned = { projects: projects.length, mode: "cross-project-scan" };
      } else {
        const raw = args.query
          ? await kaneo.get<{ results: SearchResultItem[] }>("/search", { q: args.query, workspaceId })
          : { results: [] as SearchResultItem[] };
        const items = args.query ? raw.results.filter((r) => r.type === "task") : [];
        // if no query but status/priority filters given with no projectId, we still need a real
        // task list — fall back to a cross-project scan (no shortcut without a query or projectId).
        if (!args.query) {
          const projects = await listAllProjectIds(workspaceId);
          for (const p of projects) {
            const { tasks } = await fetchProjectTasks(p.id);
            for (const t of tasks) {
              if (!passesFilters(t)) continue;
              results.push({
                id: t.id,
                number: t.number,
                title: t.title,
                status: t.status,
                priority: t.priority,
                projectId: p.id,
                projectName: p.name,
                projectSlug: p.slug,
                assigneeId: t.assigneeId,
                assigneeName: t.assigneeName,
                labels: (t.labels ?? []).map((l) => l.name),
                dueDate: t.dueDate,
                createdAt: t.createdAt,
                descriptionSnippet: snippet(t.description),
              });
            }
          }
          scanned = { projects: projects.length, mode: "cross-project-scan-no-query" };
        } else {
          results = items
            .filter((r) => {
              if (args.status && r.status !== args.status) return false;
              if (args.priority && r.priority !== args.priority) return false;
              if (args.titleOnly && !r.title?.toLowerCase().includes(args.query!.toLowerCase())) return false;
              return true;
            })
            .map((r) => ({
              id: r.id,
              number: r.taskNumber,
              title: r.title,
              status: r.status,
              priority: r.priority,
              projectId: r.projectId,
              projectName: r.projectName,
              projectSlug: r.projectSlug,
              relevanceScore: r.relevanceScore,
              descriptionSnippet: snippet(r.description),
            }));
          scanned = { projects: 0, mode: "fast-fts" };
        }
      }

      const sortBy = args.sortBy ?? (args.query && scanned.mode === "fast-fts" ? "relevance" : "createdAt");
      results.sort((a, b) => {
        switch (sortBy) {
          case "relevance":
            return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
          case "dueDate":
            return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
          case "priority":
            return (PRIORITY_RANK[b.priority ?? "no-priority"] ?? 0) - (PRIORITY_RANK[a.priority ?? "no-priority"] ?? 0);
          case "createdAt":
          default:
            return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
        }
      });

      const truncated = results.length > limit;
      const page = results.slice(0, limit);

      if (args.includeRelations) {
        await Promise.all(page.map(async (r) => { r.relations = await fetchTaskRelations(r.id); }));
      }
      if (args.includeComments && args.query) {
        await Promise.all(page.map(async (r) => { r.matchedComment = await findMatchingComment(r.id, args.query!); }));
      }

      return {
        count: results.length,
        returned: page.length,
        truncated,
        searchMode: scanned.mode,
        projectsScanned: scanned.projects,
        results: page,
      };
    },
  },
  {
    name: "get_config",
    description: "Get instance-wide configuration flags (registration, SMTP, OAuth providers).",
    schema: {},
    handler: async () => kaneo.get("/config"),
  },
  {
    name: "get_instance_status",
    description: "Check whether the Kaneo instance has users and an admin set up.",
    schema: {},
    handler: async () => kaneo.get("/instance/status"),
  },
];
