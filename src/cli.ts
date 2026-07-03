#!/usr/bin/env node
import { startServer } from "./server.js";
import { runInstaller } from "./install/wizard.js";
import { installSkills } from "./install/skillsInstaller.js";

const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

async function main(): Promise<void> {
  if (args.includes("serve")) {
    await startServer();
    return;
  }

  if (args.includes("skills")) {
    const target = flag("--target") === "user" ? "user" : "project";
    const lang = flag("--lang") === "id" ? "id" : "en";
    const dest = installSkills(target, lang);
    process.stdout.write(
      `Installed Kaneo skills (${lang}) into ${dest}\n` +
        "Restart your AI client, then run the /kaneo-setup skill to configure this project.\n"
    );
    return;
  }

  if (args.includes("install") || process.stdin.isTTY) {
    await runInstaller();
    return;
  }

  await startServer();
}

main().catch((err) => {
  process.stderr.write(`[kaneo-mcp] Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
