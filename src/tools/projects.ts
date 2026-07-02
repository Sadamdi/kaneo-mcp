import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const projectTools: ToolDef[] = [
  {
    name: "list_projects",
    description:
      "List all projects in a Kaneo workspace, including their tasks. Use this first to discover project IDs and slugs.",
    schema: { workspaceId: z.string().optional().describe("Workspace ID. Defaults to KANEO_WORKSPACE_ID if not set.") },
    handler: async ({ workspaceId }: { workspaceId?: string }) =>
      kaneo.get("/project", { workspaceId: resolveWorkspaceId(workspaceId) }),
  },
  {
    name: "get_project",
    description: "Get a single project by ID, including its tasks.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.get(`/project/${id}`),
  },
  {
    name: "create_project",
    description: "Create a new project in a workspace.",
    schema: {
      workspaceId: z.string().optional(),
      name: z.string(),
      slug: z.string().describe("Short unique code for the project, e.g. 'ECO'"),
      icon: z.string().optional(),
      description: z.string().optional(),
    },
    handler: async (args: { workspaceId?: string; name: string; slug: string; icon?: string; description?: string }) =>
      kaneo.post("/project", {
        workspaceId: resolveWorkspaceId(args.workspaceId),
        name: args.name,
        slug: args.slug,
        icon: args.icon ?? "Layout",
        description: args.description,
      }),
  },
  {
    name: "update_project",
    description: "Update a project's name, description, or icon.",
    schema: {
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
    },
    handler: async ({ id, ...body }: { id: string; name?: string; description?: string; icon?: string }) =>
      kaneo.put(`/project/${id}`, body),
  },
  {
    name: "archive_project",
    description: "Archive a project (soft-remove, can be restored with unarchive_project).",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.put(`/project/${id}/archive`, {}),
  },
  {
    name: "unarchive_project",
    description: "Restore a previously archived project.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.put(`/project/${id}/unarchive`, {}),
  },
  {
    name: "delete_project",
    description: "Permanently delete a project. Destructive — confirm with the user first.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.delete(`/project/${id}`),
  },
];
