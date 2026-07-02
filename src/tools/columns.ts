import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const columnTools: ToolDef[] = [
  {
    name: "list_columns",
    description: "List the columns (statuses) of a project's board.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/column/${projectId}`),
  },
  {
    name: "create_column",
    description: "Create a new column on a project's board.",
    schema: {
      projectId: z.string(),
      name: z.string(),
      icon: z.string().optional(),
      color: z.string().optional(),
      isFinal: z.boolean().optional().describe("Whether this column represents a 'done' state"),
    },
    handler: async ({ projectId, ...body }: { projectId: string; name: string; icon?: string; color?: string; isFinal?: boolean }) =>
      kaneo.post(`/column/${projectId}`, body),
  },
  {
    name: "reorder_columns",
    description: "Reorder the columns of a project's board.",
    schema: {
      projectId: z.string(),
      columns: z.array(z.object({ id: z.string(), position: z.number() })),
    },
    handler: async ({ projectId, columns }: { projectId: string; columns: { id: string; position: number }[] }) =>
      kaneo.put(`/column/reorder/${projectId}`, { columns }),
  },
  {
    name: "update_column",
    description: "Update a column's name, icon, or color.",
    schema: {
      id: z.string(),
      name: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
    },
    handler: async ({ id, ...body }: { id: string; name?: string; icon?: string; color?: string }) =>
      kaneo.patch(`/column/${id}`, body),
  },
  {
    name: "delete_column",
    description: "Delete a column from a project's board.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/column/${id}`),
  },
];
