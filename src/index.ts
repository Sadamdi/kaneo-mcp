#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KaneoApiError } from "./kaneoClient.js";
import type { ToolDef } from "./toolTypes.js";
import { projectTools } from "./tools/projects.js";
import { taskTools } from "./tools/tasks.js";
import { columnTools } from "./tools/columns.js";
import { commentTools } from "./tools/comments.js";
import { labelTools } from "./tools/labels.js";
import { searchTools } from "./tools/search.js";
import { notificationTools } from "./tools/notifications.js";
import { timeEntryTools } from "./tools/timeEntries.js";
import { assetTools } from "./tools/assets.js";
import { integrationTools } from "./tools/integrations.js";

const server = new McpServer({
  name: "kaneo-mcp",
  version: "0.1.0",
});

const allTools: ToolDef[] = [
  ...projectTools,
  ...taskTools,
  ...columnTools,
  ...commentTools,
  ...labelTools,
  ...searchTools,
  ...notificationTools,
  ...timeEntryTools,
  ...assetTools,
  ...integrationTools,
];

for (const tool of allTools) {
  server.registerTool(
    tool.name,
    {
      description: tool.description,
      inputSchema: tool.schema,
    },
    async (args: any) => {
      try {
        const result = await tool.handler(args);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message =
          err instanceof KaneoApiError
            ? err.message
            : err instanceof Error
            ? err.message
            : String(err);
        return {
          content: [{ type: "text", text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[kaneo-mcp] Server running on stdio");
}

main().catch((err) => {
  console.error("[kaneo-mcp] Fatal error:", err);
  process.exit(1);
});
