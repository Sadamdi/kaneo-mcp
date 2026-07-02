Copy everything below into your AI assistant's chat (Claude, Cursor, Cline, Codex, or anything
with terminal/file access) and fill in the two bracketed values first.

---

Set up the kaneo-mcp MCP server on my machine so you (or my AI assistant) can manage my Kaneo
workspace.

My Kaneo API key: [PASTE_API_KEY_HERE]
My Kaneo workspace ID: [PASTE_WORKSPACE_ID_HERE]

Do the following:

1. Clone `https://github.com/Sadamdi/kaneo-mcp.git` into a sensible local directory (ask me where
   if you're unsure).
2. Run `npm install` and `npm run build` inside it.
3. Detect which AI tool config you're running as (Claude Code, Claude Desktop, Cursor, Cline,
   Codex, or something else) and add an MCP server entry named `kaneo` to its config file, pointing
   `command` at `node` and `args` at the absolute path to the built `dist/index.js`. Set the
   `KANEO_API_KEY` and `KANEO_WORKSPACE_ID` environment variables in that entry using the values I
   gave you above. If you can't tell which client I'm using, ask me, or write the config for all of
   them.
4. Tell me to restart the AI client so it picks up the new MCP server.
5. After restart, verify the connection by calling the `list_projects` tool and showing me the
   result.

If a config file already has other MCP servers defined, merge in the new `kaneo` entry without
removing the existing ones.
