import type { ToolDef } from "../toolTypes.js";
import { checkForUpdate } from "../version.js";

export const updateTools: ToolDef[] = [
  {
    name: "check_for_updates",
    description:
      "Check whether a newer version of the kaneo-mcp server is published on npm. If updateAvailable is true, tell the user to update by running the returned command, then restarting their AI client.",
    schema: {},
    handler: async () => checkForUpdate(),
  },
];
