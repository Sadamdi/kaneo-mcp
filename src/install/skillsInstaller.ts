import { cpSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

function packageRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

export function installSkills(target: "project" | "user"): string {
  const root = packageRoot();
  const skillsSrc = join(root, "skills");
  if (!existsSync(skillsSrc)) throw new Error(`skills directory not found at ${skillsSrc}`);

  const base = target === "user" ? join(homedir(), ".claude") : join(process.cwd(), ".claude");
  const skillsDest = join(base, "skills");
  mkdirSync(skillsDest, { recursive: true });

  for (const entry of readdirSync(skillsSrc)) {
    const from = join(skillsSrc, entry);
    if (!statSync(from).isDirectory()) continue;
    cpSync(from, join(skillsDest, entry), { recursive: true });
  }

  const agent = join(root, "AGENT.md");
  if (existsSync(agent)) copyFileSync(agent, join(base, "AGENT.md"));

  return skillsDest;
}
