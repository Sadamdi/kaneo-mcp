#!/usr/bin/env node
import { startServer } from "./server.js";
import { runInstaller } from "./install/wizard.js";
import { installSkills } from "./install/skillsInstaller.js";
import { config } from "./config.js";
import { runDeviceAuthorization } from "./auth/deviceFlow.js";
import { saveCredentials, clearCredentials } from "./auth/tokenStore.js";

const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

async function login(): Promise<void> {
  const baseUrl = flag("--url") ?? config.baseUrl;
  process.stdout.write(`Signing in to Kaneo at ${baseUrl}...\n`);
  const token = await runDeviceAuthorization(baseUrl, (uri, code) => {
    process.stdout.write(`\nOpen ${uri}\nand enter code: ${code}\n\nWaiting...\n`);
  });
  saveCredentials({ accessToken: token, baseUrl, obtainedAt: new Date().toISOString() });
  process.stdout.write("\nSigned in. Credentials saved to ~/.config/kaneo-mcp/credentials.json\n");
}

async function main(): Promise<void> {
  if (args.includes("serve")) {
    await startServer();
    return;
  }

  if (args.includes("skills")) {
    const target = flag("--target") === "user" ? "user" : "project";
    const dest = installSkills(target);
    process.stdout.write(
      `Installed the Kaneo skill into ${dest}\n` +
        "Restart your AI client, then ask it to set up Kaneo for this project.\n"
    );
    return;
  }

  if (args.includes("login")) {
    await login();
    return;
  }

  if (args.includes("logout")) {
    const removed = clearCredentials();
    process.stdout.write(removed ? "Signed out. Cached credentials removed.\n" : "No cached credentials.\n");
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
