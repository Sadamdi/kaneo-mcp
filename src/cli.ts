#!/usr/bin/env node
import { startServer } from "./server.js";
import { runInstaller } from "./install/wizard.js";

const args = process.argv.slice(2);
const wantsServe = args.includes("serve");
const wantsInstall = args.includes("install");

async function main(): Promise<void> {
  if (wantsServe) {
    await startServer();
    return;
  }
  if (wantsInstall || process.stdin.isTTY) {
    await runInstaller();
    return;
  }
  await startServer();
}

main().catch((err) => {
  process.stderr.write(`[kaneo-mcp] Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
