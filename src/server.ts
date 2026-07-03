import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { KaneoApiError } from "./kaneoClient.js";
import { config } from "./config.js";
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
import { workspaceTools } from "./tools/workspaces.js";
import { relationTools } from "./tools/relations.js";
import { preferenceTools } from "./tools/preferences.js";
import { updateTools } from "./tools/updates.js";
import { checkForUpdate, currentVersion } from "./version.js";

function buildInstructions(updateNote: string): string {
  const lang = config.language;
  const languageLine =
    lang === "unset"
      ? "The team's board language is NOT set yet. On the first interaction, infer it from existing card content and the repo README, propose it, and ask whether to save it globally (set_user_preferences) or for this project only (.kaneo/context.md 'language:'). Then never ask again. Default to English if unclear."
      : `Write all content you submit to Kaneo (task titles, descriptions, comments) and your user-facing replies in "${lang}". A project-level .kaneo/context.md 'language:' field overrides this. Technical tokens (identifiers, endpoints, code) stay as-is.`;

  return [
    "You are operating the Kaneo project-management board through this MCP server.",
    updateNote,
    "",
    `LANGUAGE: ${languageLine}`,
    "",
    "GROUNDING RULES (never hallucinate — Kaneo is a shared team board):",
    "1. Discovery first: call list_projects (and list_columns) before acting; never invent or hardcode IDs. Use list_workspaces / list_workspace_members to resolve workspace and assignee IDs.",
    "2. Search before create: run search by title keywords; if a matching task exists, update it instead of creating a duplicate.",
    "3. Read before write: call get_task before update_task; preserve existing description sections and merge changes. Put progress notes and decisions in add_comment, not by overwriting the description.",
    "4. Verify after write: read the entity back and report its real id/title/status to the user.",
    "5. Evidence rule: any endpoint, file path, schema, or component you write into a task MUST be verified in the actual codebase first; if unverifiable, mark it 'TBD (verify)' rather than inventing plausible details.",
    "6. Confirm before delete or bulk change: show a listed preview and get explicit user approval.",
    "",
    "FORMAT (Kaneo renders descriptions as GFM markdown — single newlines collapse): put a blank line between blocks; use GFM tables for tabular data; fenced code blocks for formulas/code/ASCII; numbered/bullet/task lists for steps and checklists; ### headings for sections. No raw HTML and no stray Word glyphs (never leave the section sign; write 'section 2.1'). When embedding a docx/pdf/spec, convert it to markdown first — complete content, structured, not raw paste.",
    "",
    "PROJECT CONTEXT: if a .kaneo/context.md file exists in the working repo, read it first and follow its language, board mapping, project stack, and templates. The full workflow (setup, create, document, move, done, review, search, standup, sprint, sync) lives in this package's single 'kaneo' skill (install with `npx @sadamdi/kaneo-mcp skills`).",
  ].join("\n");
}

export async function startServer(): Promise<void> {
  const update = await checkForUpdate();
  const updateNote = update.updateAvailable
    ? `\nUPDATE AVAILABLE: kaneo-mcp ${update.current} → ${update.latest}. Before doing anything else, tell the user a newer version is out and to update with \`${update.command}\`, then restart their AI client.`
    : "";

  const server = new McpServer(
    {
      name: "kaneo-mcp",
      version: currentVersion(),
    },
    {
      instructions: buildInstructions(updateNote),
    }
  );

  const allTools: ToolDef[] = [
    ...workspaceTools,
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
    ...relationTools,
    ...preferenceTools,
    ...updateTools,
  ];

  if (update.updateAvailable) {
    process.stderr.write(
      `[kaneo-mcp] Update available: ${update.current} -> ${update.latest}. Run: ${update.command}\n`
    );
  }

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

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("[kaneo-mcp] Server running on stdio\n");
}
