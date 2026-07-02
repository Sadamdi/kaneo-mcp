import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
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
    name: "list_task_activity",
    description: "Get the activity log (status changes, assignments, etc.) for a task.",
    schema: { taskId: z.string() },
    handler: async ({ taskId }: { taskId: string }) => kaneo.get(`/activity/${taskId}`),
  },
];
