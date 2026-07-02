import { z } from "zod";
import { kaneo, resolveWorkspaceId } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

export const notificationTools: ToolDef[] = [
  {
    name: "list_notifications",
    description: "List the authenticated user's notifications.",
    schema: {},
    handler: async () => kaneo.get("/notification"),
  },
  {
    name: "mark_notification_read",
    description: "Mark a single notification as read.",
    schema: { id: z.string() },
    handler: async ({ id }: { id: string }) => kaneo.patch(`/notification/${id}/read`, {}),
  },
  {
    name: "mark_all_notifications_read",
    description: "Mark all notifications as read.",
    schema: {},
    handler: async () => kaneo.patch("/notification/read-all", {}),
  },
  {
    name: "clear_all_notifications",
    description: "Delete all notifications.",
    schema: {},
    handler: async () => kaneo.delete("/notification/clear-all"),
  },
  {
    name: "get_notification_preferences",
    description: "Get the authenticated user's notification delivery preferences.",
    schema: {},
    handler: async () => kaneo.get("/notification-preferences"),
  },
  {
    name: "update_notification_preferences",
    description: "Update notification delivery preferences (email, ntfy, gotify, webhook).",
    schema: {
      emailEnabled: z.boolean().optional(),
      ntfyEnabled: z.boolean().optional(),
      ntfyServerUrl: z.string().optional(),
      ntfyTopic: z.string().optional(),
      ntfyToken: z.string().optional(),
      gotifyEnabled: z.boolean().optional(),
      gotifyServerUrl: z.string().optional(),
      gotifyToken: z.string().optional(),
      webhookEnabled: z.boolean().optional(),
      webhookUrl: z.string().optional(),
      webhookSecret: z.string().optional(),
    },
    handler: async (body: Record<string, unknown>) => kaneo.put("/notification-preferences", body),
  },
  {
    name: "upsert_workspace_notification_rule",
    description: "Set which notification channels are active for a workspace, and which projects trigger them.",
    schema: {
      workspaceId: z.string().optional(),
      isActive: z.boolean(),
      emailEnabled: z.boolean(),
      ntfyEnabled: z.boolean(),
      gotifyEnabled: z.boolean(),
      webhookEnabled: z.boolean(),
      projectMode: z.enum(["all", "selected"]),
      selectedProjectIds: z.array(z.string()).optional(),
    },
    handler: async ({ workspaceId, ...body }: { workspaceId?: string; [key: string]: unknown }) =>
      kaneo.put(`/notification-preferences/workspaces/${resolveWorkspaceId(workspaceId)}`, body),
  },
  {
    name: "delete_workspace_notification_rule",
    description: "Remove a workspace's notification rule.",
    schema: { workspaceId: z.string().optional() },
    handler: async ({ workspaceId }: { workspaceId?: string }) =>
      kaneo.delete(`/notification-preferences/workspaces/${resolveWorkspaceId(workspaceId)}`),
  },
];
