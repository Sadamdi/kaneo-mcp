import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
import { config } from "../config.js";
import type { ToolDef } from "../toolTypes.js";

const priorityEnum = z.enum(["no-priority", "low", "medium", "high", "urgent"]).optional();

interface TaskRecord {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  projectId?: string;
  position?: number;
  startDate?: string | null;
  dueDate?: string | null;
  userId?: string | null;
}

async function mergeUpdate(id: string, patch: Record<string, unknown>): Promise<unknown> {
  const query = config.defaultWorkspaceId ? { workspaceId: config.defaultWorkspaceId } : undefined;
  const current = (await kaneo.get(`/task/${id}`, query)) as TaskRecord;
  const body: Record<string, unknown> = {
    title: current.title,
    description: current.description,
    status: current.status,
    priority: current.priority,
    projectId: current.projectId,
    position: current.position,
    startDate: current.startDate ?? undefined,
    dueDate: current.dueDate ?? undefined,
  };
  if (current.userId) body.userId = current.userId;
  for (const [k, v] of Object.entries(patch)) if (v !== undefined) body[k] = v;
  return kaneo.put(`/task/${id}`, body);
}

export const taskTools: ToolDef[] = [
  {
    name: "list_tasks",
    description: "List all tasks in a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/task/tasks/${projectId}`),
  },
  {
    name: "get_task",
    description: "Get a single task by ID.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) =>
      kaneo.get(`/task/${id}`, config.defaultWorkspaceId ? { workspaceId: config.defaultWorkspaceId } : undefined),
  },
  {
    name: "create_task",
    description: "Create a new task in a project.",
    schema: {
      projectId: z.string(),
      title: z.string(),
      description: z.string().optional(),
      status: z.string().optional().describe("Status/column key, e.g. 'to-do', 'in-progress', 'done'. Defaults to 'to-do'."),
      priority: priorityEnum,
      startDate: z.string().optional().describe("ISO 8601 date string"),
      dueDate: z.string().optional().describe("ISO 8601 date string"),
      userId: z.string().optional().describe("User ID to assign the task to"),
    },
    handler: async ({ projectId, ...body }: { projectId: string; title: string; description?: string; status?: string; priority?: string; startDate?: string; dueDate?: string; userId?: string }) =>
      kaneo.post(`/task/${projectId}`, { status: "to-do", description: "", priority: "medium", ...body }),
  },
  {
    name: "update_task",
    description: "Update a task's title, description, status, priority, start date, or due date. Reads the task first and merges, so partial updates are safe and other fields are preserved.",
    schema: {
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.string().optional(),
      priority: priorityEnum,
      startDate: z.string().optional().describe("ISO 8601 date string"),
      dueDate: z.string().optional().describe("ISO 8601 date string"),
    },
    handler: async ({ id, ...patch }: { id: string; title?: string; description?: string; status?: string; priority?: string; startDate?: string; dueDate?: string }) =>
      mergeUpdate(id, patch),
  },
  {
    name: "set_task_status",
    description: "Move a task to a different status/column (e.g. 'to-do' -> 'in-progress' -> 'done').",
    schema: { id: z.string(), status: z.string() },
    handler: async ({ id, status }: { id: string; status: string }) => kaneo.put(`/task/status/${id}`, { status }),
  },
  {
    name: "set_task_priority",
    description: "Change a task's priority.",
    schema: { id: z.string(), priority: z.enum(["no-priority", "low", "medium", "high", "urgent"]) },
    handler: async ({ id, priority }: { id: string; priority: string }) => kaneo.put(`/task/priority/${id}`, { priority }),
  },
  {
    name: "set_task_assignee",
    description: "Assign a task to a user by userId.",
    schema: { id: z.string(), userId: z.string() },
    handler: async ({ id, userId }: { id: string; userId: string }) => kaneo.put(`/task/assignee/${id}`, { userId }),
  },
  {
    name: "set_task_due_date",
    description: "Set or change a task's due date.",
    schema: { id: z.string(), dueDate: z.string().describe("ISO 8601 date string") },
    handler: async ({ id, dueDate }: { id: string; dueDate: string }) => kaneo.put(`/task/due-date/${id}`, { dueDate }),
  },
  {
    name: "set_task_dates",
    description: "Set a task's start date and/or due date. Pass either or both (ISO 8601). Preserves all other fields.",
    schema: {
      id: z.string(),
      startDate: z.string().optional().describe("ISO 8601 date string"),
      dueDate: z.string().optional().describe("ISO 8601 date string"),
    },
    handler: async ({ id, ...patch }: { id: string; startDate?: string; dueDate?: string }) => mergeUpdate(id, patch),
  },
  {
    name: "move_task",
    description: "Move a task to a different project and/or status.",
    schema: {
      id: z.string(),
      destinationProjectId: z.string(),
      destinationStatus: z.string().optional(),
    },
    handler: async ({ id, ...body }: { id: string; destinationProjectId: string; destinationStatus?: string }) =>
      kaneo.put(`/task/move/${id}`, body),
  },
  {
    name: "delete_task",
    description: "Permanently delete a task. Destructive — confirm with the user first.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/task/${id}`),
  },
  {
    name: "import_tasks",
    description: "Bulk import multiple tasks into a project in one call.",
    schema: {
      projectId: z.string(),
      tasks: z.array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          status: z.string().optional(),
          priority: z.enum(["no-priority", "low", "medium", "high", "urgent"]).optional(),
          startDate: z.string().optional(),
          dueDate: z.string().optional(),
          userId: z.string().optional(),
        })
      ),
    },
    handler: async ({ projectId, tasks }: { projectId: string; tasks: Record<string, unknown>[] }) =>
      kaneo.post(`/task/import/${projectId}`, { tasks }),
  },
  {
    name: "export_tasks",
    description: "Export all tasks of a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/task/export/${projectId}`),
  },
  {
    name: "bulk_update_tasks",
    description: "Apply the same status/priority/assignee/deletion operation to multiple tasks at once.",
    schema: {
      taskIds: z.array(z.string()),
      operation: z.enum(["status", "priority", "assignee", "delete"]),
      value: z.string().optional().describe("Required for status/priority/assignee operations"),
    },
    handler: async (body: { taskIds: string[]; operation: string; value?: string }) => kaneo.patch("/task/bulk", body),
  },
];
