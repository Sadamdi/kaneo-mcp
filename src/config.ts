export const config = {
  apiKey: process.env.KANEO_API_KEY ?? "",
  baseUrl: (process.env.KANEO_BASE_URL ?? "https://cloud.kaneo.app/api").replace(/\/$/, ""),
  defaultWorkspaceId: process.env.KANEO_WORKSPACE_ID,
};
