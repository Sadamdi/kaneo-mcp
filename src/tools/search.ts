import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const searchTools: ToolDef[] = [
  {
    name: "search",
    description:
      "Global search across tasks, projects, and comments within a workspace. Use this to find a task/project by name before acting on it.",
    schema: { query: z.string(), workspaceId: z.string().optional() },
    handler: async ({ query, workspaceId }: { query: string; workspaceId?: string }) =>
      kaneo.get("/search", { q: query, workspaceId: resolveWorkspaceId(workspaceId) }),
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
