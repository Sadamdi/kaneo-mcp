import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const labelTools: ToolDef[] = [
  {
    name: "list_workspace_labels",
    description: "List all labels defined in a workspace.",
    schema: { workspaceId: z.string().optional() },
    handler: async ({ workspaceId }: { workspaceId?: string }) =>
      kaneo.get(`/label/workspace/${resolveWorkspaceId(workspaceId)}`),
  },
  {
    name: "list_task_labels",
    description: "List labels attached to a specific task.",
    schema: { taskId: z.string() },
    handler: async ({ taskId }: { taskId: string }) => kaneo.get(`/label/task/${taskId}`),
  },
  {
    name: "create_label",
    description: "Create a new label in a workspace.",
    schema: {
      workspaceId: z.string().optional(),
      name: z.string(),
      color: z.string().describe("Hex color, e.g. '#22c55e'"),
    },
    handler: async ({ workspaceId, name, color }: { workspaceId?: string; name: string; color: string }) =>
      kaneo.post("/label", { workspaceId: resolveWorkspaceId(workspaceId), name, color }),
  },
  {
    name: "get_label",
    description: "Get a single label by ID.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.get(`/label/${id}`),
  },
  {
    name: "update_label",
    description: "Rename or recolor an existing label.",
    schema: { id: z.string(), name: z.string(), color: z.string().describe("Hex color, e.g. '#22c55e'") },
    handler: async ({ id, ...body }: { id: string; name: string; color: string }) => kaneo.put(`/label/${id}`, body),
  },
  {
    name: "delete_label",
    description: "Delete a label from the workspace entirely.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/label/${id}`),
  },
  {
    name: "attach_label_to_task",
    description: "Attach an existing label to a task.",
    schema: { labelId: z.string(), taskId: z.string() },
    handler: async ({ labelId, taskId }: { labelId: string; taskId: string }) =>
      kaneo.put(`/label/${labelId}/task`, { taskId }),
  },
  {
    name: "detach_label_from_task",
    description: "Remove a label from a task.",
    schema: { labelId: z.string(), taskId: z.string() },
    handler: async ({ labelId, taskId }: { labelId: string; taskId: string }) =>
      kaneo.delete(`/label/${labelId}/task`, { taskId }),
  },
];
