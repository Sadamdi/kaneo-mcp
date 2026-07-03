import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const commentTools: ToolDef[] = [
  {
    name: "list_comments",
    description: "List comments on a task.",
    schema: { taskId: z.string() },
    handler: async ({ taskId }: { taskId: string }) => kaneo.get(`/comment/${taskId}`),
  },
  {
    name: "add_comment",
    description: "Add a comment to a task.",
    schema: { taskId: z.string(), content: z.string().min(1) },
    handler: async ({ taskId, content }: { taskId: string; content: string }) =>
      kaneo.post(`/comment/${taskId}`, { content }),
  },
  {
    name: "update_comment",
    description: "Edit an existing comment by its comment ID.",
    schema: { id: z.string(), content: z.string().min(1) },
    handler: async ({ id, content }: { id: string; content: string }) =>
      kaneo.put(`/comment/${id}`, { content }),
  },
  {
    name: "delete_comment",
    description: "Delete a comment by its comment ID. Destructive — confirm with the user first.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/comment/${id}`),
  },
  {
    name: "list_task_activity",
    description: "Get the activity log (status changes, assignments, etc.) for a task.",
    schema: { taskId: z.string() },
    handler: async ({ taskId }: { taskId: string }) => kaneo.get(`/activity/${taskId}`),
  },
  {
    name: "create_activity",
    description:
      "Record a custom activity-log entry on a task (e.g. an audit note or automated event).",
    schema: {
      taskId: z.string(),
      userId: z.string(),
      message: z.string(),
      type: z.string().describe("Activity type label, e.g. 'note', 'deploy', 'review'"),
    },
    handler: async (body: { taskId: string; userId: string; message: string; type: string }) =>
      kaneo.post("/activity/create", body),
  },
  {
    name: "list_task_external_links",
    description: "List external links (e.g. GitHub/Gitea issues) attached to a task.",
    schema: { taskId: z.string(), workspaceId: z.string().optional() },
    handler: async ({ taskId, workspaceId }: { taskId: string; workspaceId?: string }) =>
      kaneo.get(`/external-link/task/${taskId}`, { workspaceId: resolveWorkspaceId(workspaceId) }),
  },
];
