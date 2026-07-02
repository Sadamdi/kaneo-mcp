import { homedir, platform } from "os";
import { join } from "path";

export interface InstallTarget {
  id: string;
  label: string;
  configPath: string;
  serverKey: string;
}

function appDataDir(): string {
  if (platform() === "win32") return process.env.APPDATA ?? join(homedir(), "AppData", "Roaming");
  if (platform() === "darwin") return join(homedir(), "Library", "Application Support");
  return process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config");
}

export function getInstallTargets(cwd: string): InstallTarget[] {
  return [
    {
      id: "cursor-user",
      label: "Cursor (all projects)",
      configPath: join(homedir(), ".cursor", "mcp.json"),
      serverKey: "mcpServers",
    },
    {
      id: "cursor-project",
      label: "Cursor (this project only)",
      configPath: join(cwd, ".cursor", "mcp.json"),
      serverKey: "mcpServers",
    },
    {
      id: "claude-desktop",
      label: "Claude Desktop",
      configPath: join(appDataDir(), "Claude", "claude_desktop_config.json"),
      serverKey: "mcpServers",
    },
    {
      id: "claude-code-project",
      label: "Claude Code (this project only)",
      configPath: join(cwd, ".mcp.json"),
      serverKey: "mcpServers",
    },
  ];
}
