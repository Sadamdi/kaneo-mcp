import { z } from "zod";
import type { ToolDef } from "../toolTypes.js";
import { config } from "../config.js";
import { loadPrefs, savePrefs } from "../prefsStore.js";

export const preferenceTools: ToolDef[] = [
  {
    name: "get_user_preferences",
    description:
      "Get the user's global kaneo-mcp preferences (working language, default workspace) and where the active language came from. Call this to know which language to reply in.",
    schema: {},
    handler: async () => {
      const stored = loadPrefs();
      const source = process.env.KANEO_LANG
        ? "env:KANEO_LANG"
        : stored.language
        ? "config.json"
        : "default";
      return { language: config.language, source, stored };
    },
  },
  {
    name: "set_user_preferences",
    description:
      "Persist the user's global kaneo-mcp preferences (working language and/or default workspace) to ~/.config/kaneo-mcp/config.json. Use this after the user chooses a language so they are never asked again. For a project/team-specific language, write it to .kaneo/context.md instead.",
    schema: {
      language: z.string().optional().describe("Language code or name, e.g. 'en', 'id', 'Spanish'"),
      workspaceId: z.string().optional(),
    },
    handler: async ({ language, workspaceId }: { language?: string; workspaceId?: string }) => {
      const patch: { language?: string; workspaceId?: string } = {};
      if (language !== undefined) patch.language = language;
      if (workspaceId !== undefined) patch.workspaceId = workspaceId;
      return savePrefs(patch);
    },
  },
];
