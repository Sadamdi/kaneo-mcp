import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const storeDir = join(homedir(), ".config", "kaneo-mcp");
const storePath = join(storeDir, "config.json");

export interface Prefs {
  language?: string;
  workspaceId?: string;
}

export function loadPrefs(): Prefs {
  if (!existsSync(storePath)) return {};
  try {
    return JSON.parse(readFileSync(storePath, "utf8")) as Prefs;
  } catch {
    return {};
  }
}

export function savePrefs(patch: Prefs): Prefs {
  const current = loadPrefs();
  const merged = { ...current, ...patch };
  mkdirSync(storeDir, { recursive: true, mode: 0o700 });
  writeFileSync(storePath, JSON.stringify(merged, null, 2), { mode: 0o600 });
  return merged;
}
