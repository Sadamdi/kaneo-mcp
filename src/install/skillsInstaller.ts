import { cpSync, existsSync, mkdirSync, copyFileSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

function packageRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

export function installSkills(target: "project" | "user"): string {
  const root = packageRoot();
  const skillSrc = join(root, "skills", "kaneo");
  if (!existsSync(skillSrc)) throw new Error(`skill directory not found at ${skillSrc}`);

  const base = target === "user" ? join(homedir(), ".claude") : join(process.cwd(), ".claude");
  const skillsDest = join(base, "skills");
  mkdirSync(skillsDest, { recursive: true });

  cpSync(skillSrc, join(skillsDest, "kaneo"), { recursive: true });

  const agent = join(root, "AGENT.md");
  if (existsSync(agent)) copyFileSync(agent, join(base, "AGENT.md"));

  return skillsDest;
}
