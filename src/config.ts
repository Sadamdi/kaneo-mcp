export const config = {
  apiKey: process.env.KANEO_API_KEY ?? "",
  baseUrl: (process.env.KANEO_BASE_URL ?? "https://cloud.kaneo.app/api").replace(/\/$/, ""),
  defaultWorkspaceId: process.env.KANEO_WORKSPACE_ID,
};

if (!config.apiKey) {
  console.error(
    "[kaneo-mcp] Missing KANEO_API_KEY environment variable. Create an API key in Kaneo under Settings -> Account -> Developer Settings -> API Keys."
  );
  process.exit(1);
}
