import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const storeDir = join(homedir(), ".config", "kaneo-mcp");
const storePath = join(storeDir, "credentials.json");

export interface StoredCredentials {
  accessToken: string;
  baseUrl: string;
  obtainedAt: string;
}

export function loadCredentials(baseUrl: string): StoredCredentials | undefined {
  if (!existsSync(storePath)) return undefined;
  try {
    const raw = JSON.parse(readFileSync(storePath, "utf8")) as StoredCredentials;
    if (raw.baseUrl !== baseUrl) return undefined;
    return raw;
  } catch {
    return undefined;
  }
}

export function saveCredentials(creds: StoredCredentials): void {
  mkdirSync(storeDir, { recursive: true, mode: 0o700 });
  writeFileSync(storePath, JSON.stringify(creds, null, 2), { mode: 0o600 });
}

export function clearCredentials(): void {
  if (existsSync(storePath)) writeFileSync(storePath, "{}");
}
