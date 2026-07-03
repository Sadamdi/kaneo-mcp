import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const workspaceTools: ToolDef[] = [
  {
    name: "list_workspaces",
    description:
      "List the workspaces (organizations) the authenticated user can access, with their IDs. Use this first when you don't know the workspace ID, or to let the user pick one.",
    schema: {},
    handler: async () => kaneo.get("/auth/organization/list"),
  },
  {
    name: "get_workspace",
    description:
      "Get full details of a workspace (organization) including members and pending invitations.",
    schema: { workspaceId: z.string().optional() },
    handler: async ({ workspaceId }: { workspaceId?: string }) =>
      kaneo.get("/auth/organization/get-full-organization", {
        organizationId: resolveWorkspaceId(workspaceId),
      }),
  },
  {
    name: "list_workspace_members",
    description:
      "List all members of a workspace with their user IDs, names, emails, and roles. Use this to resolve the userId needed by set_task_assignee before assigning a task.",
    schema: { workspaceId: z.string().optional() },
    handler: async ({ workspaceId }: { workspaceId?: string }) =>
      kaneo.get(`/workspace/${resolveWorkspaceId(workspaceId)}/members`),
  },
  {
    name: "whoami",
    description:
      "Return the current session and user. Works when authenticated with a device-flow token; returns null when authenticated with a plain API key (API keys are session-independent).",
    schema: {},
    handler: async () => kaneo.get("/auth/get-session"),
  },
];
