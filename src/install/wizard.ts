import { createInterface } from "readline/promises";
import { getInstallTargets } from "./targets.js";
import { writeServerEntry } from "./mergeConfig.js";

function ask(rl: ReturnType<typeof createInterface>, question: string): Promise<string> {
  return rl.question(question);
}

export async function runInstaller(): Promise<void> {
  const targets = getInstallTargets(process.cwd());
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  process.stdout.write("\nkaneo-mcp setup\n\n");
  process.stdout.write("Where should this be registered?\n");
  targets.forEach((t, i) => process.stdout.write(`  ${i + 1}) ${t.label}\n`));

  const choiceRaw = await ask(rl, `\nChoice [1-${targets.length}]: `);
  const choice = targets[Number(choiceRaw.trim()) - 1];
  if (!choice) {
    process.stdout.write("Invalid choice, aborting.\n");
    rl.close();
    process.exitCode = 1;
    return;
  }

  process.stdout.write(
    "\nAuthentication: paste an API key (Settings -> Account -> Developer Settings -> API Keys)\n" +
      "or leave blank to sign in with your browser instead.\n"
  );
  const apiKey = (await ask(rl, "API key (optional): ")).trim();
  const workspaceId = (await ask(rl, "Workspace ID (optional, from the Kaneo URL): ")).trim();
  const baseUrl = (
    await ask(rl, "Kaneo API base URL [https://cloud.kaneo.app/api]: ")
  ).trim();

  rl.close();

  const env: Record<string, string> = {};
  if (apiKey) env.KANEO_API_KEY = apiKey;
  if (workspaceId) env.KANEO_WORKSPACE_ID = workspaceId;
  if (baseUrl) env.KANEO_BASE_URL = baseUrl;

  const entry = {
    command: "npx",
    args: ["-y", "@sadamdi/kaneo-mcp", "serve"],
    env,
  };

  const result = writeServerEntry(choice, entry);
  process.stdout.write(
    `\n${result.created ? "Created" : "Updated"} ${result.path}\n` +
      "Restart your AI client to pick up the new MCP server.\n"
  );

  if (!apiKey) {
    process.stdout.write(
      "\nNo API key provided — the first tool call will open a browser to sign in.\n"
    );
  }
}
