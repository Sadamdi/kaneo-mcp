import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export function currentVersion(): string {
  try {
    const pkgPath = join(dirname(fileURLToPath(import.meta.url)), "..", "package.json");
    return JSON.parse(readFileSync(pkgPath, "utf8")).version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function isNewer(latest: string, current: string): boolean {
  const a = latest.split(".").map((n) => parseInt(n, 10) || 0);
  const b = current.split(".").map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) > (b[i] ?? 0)) return true;
    if ((a[i] ?? 0) < (b[i] ?? 0)) return false;
  }
  return false;
}

export interface UpdateInfo {
  current: string;
  latest: string | null;
  updateAvailable: boolean;
  command: string;
}

export async function checkForUpdate(timeoutMs = 1500): Promise<UpdateInfo> {
  const current = currentVersion();
  const command = "npx -y @sadamdi/kaneo-mcp@latest";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch("https://registry.npmjs.org/@sadamdi/kaneo-mcp/latest", {
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return { current, latest: null, updateAvailable: false, command };
    const latest = (await res.json()).version as string;
    return { current, latest, updateAvailable: isNewer(latest, current), command };
  } catch {
    return { current, latest: null, updateAvailable: false, command };
  }
}
