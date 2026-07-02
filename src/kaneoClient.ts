import { config } from "./config.js";
import { runDeviceAuthorization } from "./auth/deviceFlow.js";
import { loadCredentials, saveCredentials } from "./auth/tokenStore.js";

export class KaneoApiError extends Error {
  constructor(public status: number, public body: string) {
    super(`Kaneo API error ${status}: ${body}`);
  }
}

type Query = Record<string, string | number | boolean | undefined>;

let cachedToken: string | undefined;

async function resolveToken(): Promise<string> {
  if (config.apiKey) return config.apiKey;
  if (cachedToken) return cachedToken;

  const stored = loadCredentials(config.baseUrl);
  if (stored) {
    cachedToken = stored.accessToken;
    return cachedToken;
  }

  const token = await runDeviceAuthorization(config.baseUrl, (verificationUri, userCode) => {
    process.stderr.write(
      `[kaneo-mcp] Sign in to Kaneo: open ${verificationUri} and enter code ${userCode}\n`
    );
  });

  cachedToken = token;
  saveCredentials({ accessToken: token, baseUrl: config.baseUrl, obtainedAt: new Date().toISOString() });
  return token;
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(config.baseUrl + path);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T = unknown>(
  method: string,
  path: string,
  opts: { query?: Query; body?: unknown } = {}
): Promise<T> {
  const token = await resolveToken();
  const res = await fetch(buildUrl(path, opts.query), {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new KaneoApiError(res.status, text);
  }
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export const kaneo = {
  get: <T = unknown>(path: string, query?: Query) => request<T>("GET", path, { query }),
  post: <T = unknown>(path: string, body?: unknown, query?: Query) =>
    request<T>("POST", path, { body, query }),
  put: <T = unknown>(path: string, body?: unknown, query?: Query) =>
    request<T>("PUT", path, { body, query }),
  patch: <T = unknown>(path: string, body?: unknown, query?: Query) =>
    request<T>("PATCH", path, { body, query }),
  delete: <T = unknown>(path: string, query?: Query) => request<T>("DELETE", path, { query }),
};

export function resolveWorkspaceId(workspaceId?: string): string {
  const id = workspaceId ?? config.defaultWorkspaceId;
  if (!id) {
    throw new Error(
      "workspaceId is required (pass it explicitly, or set KANEO_WORKSPACE_ID in the MCP env config). Find it in your Kaneo URL: cloud.kaneo.app/dashboard/workspace/<workspaceId>/..."
    );
  }
  return id;
}
