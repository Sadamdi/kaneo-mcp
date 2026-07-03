import { cpSync, existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from "fs";
import { homedir } from "os";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

function packageRoot(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "..", "..");
}

function copySkill(srcDir: string, destDir: string, lang: string): void {
  mkdirSync(destDir, { recursive: true });
  for (const entry of readdirSync(srcDir)) {
    const from = join(srcDir, entry);
    if (statSync(from).isDirectory()) continue;
    if (entry === "SKILL.id.md") continue;
    if (entry === "SKILL.md") {
      const idVariant = join(srcDir, "SKILL.id.md");
      const chosen = lang === "id" && existsSync(idVariant) ? idVariant : from;
      copyFileSync(chosen, join(destDir, "SKILL.md"));
      continue;
    }
    copyFileSync(from, join(destDir, entry));
  }
}

export function installSkills(target: "project" | "user", lang: string): string {
  const root = packageRoot();
  const skillsSrc = join(root, "skills");
  if (!existsSync(skillsSrc)) throw new Error(`skills directory not found at ${skillsSrc}`);

  const base = target === "user" ? join(homedir(), ".claude") : join(process.cwd(), ".claude");
  const skillsDest = join(base, "skills");
  mkdirSync(skillsDest, { recursive: true });

  for (const entry of readdirSync(skillsSrc)) {
    const from = join(skillsSrc, entry);
    if (!statSync(from).isDirectory()) continue;
    if (entry === "_shared") {
      cpSync(from, join(skillsDest, "_shared"), { recursive: true });
      continue;
    }
    copySkill(from, join(skillsDest, entry), lang);
  }

  const agent = lang === "id" && existsSync(join(root, "AGENT.id.md"))
    ? join(root, "AGENT.id.md")
    : join(root, "AGENT.md");
  if (existsSync(agent)) copyFileSync(agent, join(base, "AGENT.md"));

  return skillsDest;
}
