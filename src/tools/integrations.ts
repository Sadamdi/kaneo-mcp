import { z } from "zod";
import { kaneo } from "../kaneoClient.js";
import type { ToolDef } from "../toolTypes.js";

const eventFlags = {
  taskCreated: z.boolean().optional(),
  taskStatusChanged: z.boolean().optional(),
  taskPriorityChanged: z.boolean().optional(),
  taskTitleChanged: z.boolean().optional(),
  taskDescriptionChanged: z.boolean().optional(),
  taskCommentCreated: z.boolean().optional(),
};

export const integrationTools: ToolDef[] = [
  {
    name: "get_github_app_info",
    description: "Get GitHub App installation info for the current workspace/organization.",
    schema: {},
    handler: async () => kaneo.get("/github-integration/app-info"),
  },
  {
    name: "list_github_repositories",
    description: "List GitHub repositories accessible to the connected GitHub App installation.",
    schema: {},
    handler: async () => kaneo.get("/github-integration/repositories"),
  },
  {
    name: "verify_github_repository",
    description: "Verify access to a GitHub repository before connecting it to a project.",
    schema: { repositoryOwner: z.string(), repositoryName: z.string() },
    handler: async (body: { repositoryOwner: string; repositoryName: string }) =>
      kaneo.post("/github-integration/verify", body),
  },
  {
    name: "get_github_integration",
    description: "Get the GitHub integration configured for a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/github-integration/project/${projectId}`),
  },
  {
    name: "connect_github_integration",
    description: "Connect a GitHub repository to a project.",
    schema: { projectId: z.string(), repositoryOwner: z.string(), repositoryName: z.string() },
    handler: async ({ projectId, ...body }: { projectId: string; repositoryOwner: string; repositoryName: string }) =>
      kaneo.post(`/github-integration/project/${projectId}`, body),
  },
  {
    name: "update_github_integration",
    description: "Update a project's GitHub integration settings.",
    schema: { projectId: z.string(), isActive: z.boolean().optional(), commentTaskLinkOnGitHubIssue: z.boolean().optional() },
    handler: async ({ projectId, ...body }: { projectId: string; isActive?: boolean; commentTaskLinkOnGitHubIssue?: boolean }) =>
      kaneo.patch(`/github-integration/project/${projectId}`, body),
  },
  {
    name: "disconnect_github_integration",
    description: "Remove the GitHub integration from a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.delete(`/github-integration/project/${projectId}`),
  },
  {
    name: "import_github_issues",
    description: "Import issues from the connected GitHub repository as tasks.",
    schema: { projectId: z.string() },
    handler: async (body: { projectId: string }) => kaneo.post("/github-integration/import-issues", body),
  },
  {
    name: "list_gitea_repositories",
    description: "List repositories accessible from a Gitea instance using an access token.",
    schema: { baseUrl: z.string(), accessToken: z.string() },
    handler: async (body: { baseUrl: string; accessToken: string }) => kaneo.post("/gitea-integration/repositories", body),
  },
  {
    name: "verify_gitea_repository",
    description: "Verify access to a Gitea repository before connecting it to a project.",
    schema: { baseUrl: z.string(), accessToken: z.string(), repositoryOwner: z.string(), repositoryName: z.string() },
    handler: async (body: { baseUrl: string; accessToken: string; repositoryOwner: string; repositoryName: string }) =>
      kaneo.post("/gitea-integration/verify", body),
  },
  {
    name: "get_gitea_integration",
    description: "Get the Gitea integration configured for a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/gitea-integration/project/${projectId}`),
  },
  {
    name: "connect_gitea_integration",
    description: "Connect a Gitea repository to a project.",
    schema: { projectId: z.string(), baseUrl: z.string(), repositoryOwner: z.string(), repositoryName: z.string(), accessToken: z.string().optional() },
    handler: async ({ projectId, ...body }: { projectId: string; baseUrl: string; repositoryOwner: string; repositoryName: string; accessToken?: string }) =>
      kaneo.post(`/gitea-integration/project/${projectId}`, body),
  },
  {
    name: "update_gitea_integration",
    description: "Update a project's Gitea integration settings.",
    schema: { projectId: z.string(), isActive: z.boolean().optional(), commentTaskLinkOnGiteaIssue: z.boolean().optional() },
    handler: async ({ projectId, ...body }: { projectId: string; isActive?: boolean; commentTaskLinkOnGiteaIssue?: boolean }) =>
      kaneo.patch(`/gitea-integration/project/${projectId}`, body),
  },
  {
    name: "disconnect_gitea_integration",
    description: "Remove the Gitea integration from a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.delete(`/gitea-integration/project/${projectId}`),
  },
  {
    name: "import_gitea_issues",
    description: "Import issues from the connected Gitea repository as tasks.",
    schema: { projectId: z.string() },
    handler: async (body: { projectId: string }) => kaneo.post("/gitea-integration/import-issues", body),
  },
  {
    name: "get_discord_integration",
    description: "Get the Discord webhook integration configured for a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/discord-integration/project/${projectId}`),
  },
  {
    name: "connect_discord_integration",
    description: "Connect a Discord webhook to a project for event notifications.",
    schema: { projectId: z.string(), webhookUrl: z.string(), channelName: z.string().optional(), events: z.object(eventFlags).optional() },
    handler: async ({ projectId, ...body }: { projectId: string; webhookUrl: string; channelName?: string; events?: Record<string, boolean> }) =>
      kaneo.post(`/discord-integration/project/${projectId}`, body),
  },
  {
    name: "update_discord_integration",
    description: "Update a project's Discord webhook integration.",
    schema: { projectId: z.string(), webhookUrl: z.string().optional(), channelName: z.string().optional(), isActive: z.boolean().optional(), events: z.object(eventFlags).optional() },
    handler: async ({ projectId, ...body }: { projectId: string; [key: string]: unknown }) =>
      kaneo.patch(`/discord-integration/project/${projectId}`, body),
  },
  {
    name: "disconnect_discord_integration",
    description: "Remove the Discord integration from a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.delete(`/discord-integration/project/${projectId}`),
  },
  {
    name: "get_slack_integration",
    description: "Get the Slack webhook integration configured for a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/slack-integration/project/${projectId}`),
  },
  {
    name: "connect_slack_integration",
    description: "Connect a Slack webhook to a project for event notifications.",
    schema: { projectId: z.string(), webhookUrl: z.string(), channelName: z.string().optional(), events: z.object(eventFlags).optional() },
    handler: async ({ projectId, ...body }: { projectId: string; webhookUrl: string; channelName?: string; events?: Record<string, boolean> }) =>
      kaneo.post(`/slack-integration/project/${projectId}`, body),
  },
  {
    name: "update_slack_integration",
    description: "Update a project's Slack webhook integration.",
    schema: { projectId: z.string(), webhookUrl: z.string().optional(), channelName: z.string().optional(), isActive: z.boolean().optional(), events: z.object(eventFlags).optional() },
    handler: async ({ projectId, ...body }: { projectId: string; [key: string]: unknown }) =>
      kaneo.patch(`/slack-integration/project/${projectId}`, body),
  },
  {
    name: "disconnect_slack_integration",
    description: "Remove the Slack integration from a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.delete(`/slack-integration/project/${projectId}`),
  },
  {
    name: "get_webhook_integration",
    description: "Get the generic webhook integration configured for a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.get(`/generic-webhook-integration/project/${projectId}`),
  },
  {
    name: "connect_webhook_integration",
    description: "Connect a generic outgoing webhook to a project for event notifications.",
    schema: { projectId: z.string(), webhookUrl: z.string(), secret: z.string().optional(), events: z.object(eventFlags).optional() },
    handler: async ({ projectId, ...body }: { projectId: string; webhookUrl: string; secret?: string; events?: Record<string, boolean> }) =>
      kaneo.post(`/generic-webhook-integration/project/${projectId}`, body),
  },
  {
    name: "update_webhook_integration",
    description: "Update a project's generic webhook integration.",
    schema: { projectId: z.string(), webhookUrl: z.string().optional(), secret: z.string().optional(), isActive: z.boolean().optional(), events: z.object(eventFlags).optional() },
    handler: async ({ projectId, ...body }: { projectId: string; [key: string]: unknown }) =>
      kaneo.patch(`/generic-webhook-integration/project/${projectId}`, body),
  },
  {
    name: "disconnect_webhook_integration",
    description: "Remove the generic webhook integration from a project.",
    schema: { projectId: z.string() },
    handler: async ({ projectId }: { projectId: string }) => kaneo.delete(`/generic-webhook-integration/project/${projectId}`),
  },
];
