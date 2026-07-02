import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import type { InstallTarget } from "./targets.js";

interface ServerEntry {
  command: string;
  args: string[];
  env: Record<string, string>;
}

export function writeServerEntry(
  target: InstallTarget,
  entry: ServerEntry
): { path: string; created: boolean } {
  mkdirSync(dirname(target.configPath), { recursive: true });

  let existing: Record<string, unknown> = {};
  const created = !existsSync(target.configPath);

  if (!created) {
    try {
      existing = JSON.parse(readFileSync(target.configPath, "utf8"));
    } catch {
      existing = {};
    }
  }

  const servers = (existing[target.serverKey] as Record<string, unknown>) ?? {};
  servers["kaneo"] = entry;
  existing[target.serverKey] = servers;

  writeFileSync(target.configPath, JSON.stringify(existing, null, 2) + "\n");
  return { path: target.configPath, created };
}
