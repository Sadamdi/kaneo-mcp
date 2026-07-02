const CLIENT_ID = "kaneo-mcp";

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  verification_uri_complete?: string;
  interval: number;
  expires_in: number;
}

interface TokenResponse {
  access_token?: string;
  error?: string;
}

export async function requestDeviceCode(baseUrl: string): Promise<DeviceCodeResponse> {
  const res = await fetch(`${baseUrl}/auth/device/code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID }),
  });
  if (!res.ok) {
    throw new Error(`Failed to start device authorization: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as DeviceCodeResponse;
}

export async function pollForToken(
  baseUrl: string,
  deviceCode: string,
  intervalSeconds: number,
  expiresInSeconds: number
): Promise<string> {
  const deadline = Date.now() + expiresInSeconds * 1000;
  let waitMs = Math.max(1000, intervalSeconds * 1000);

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));

    const res = await fetch(`${baseUrl}/auth/device/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        device_code: deviceCode,
        client_id: CLIENT_ID,
      }),
    });

    const body = (await res.json().catch(() => ({}))) as TokenResponse;

    if (res.ok && body.access_token) {
      return body.access_token;
    }

    if (body.error === "authorization_pending") continue;
    if (body.error === "slow_down") {
      waitMs += 2000;
      continue;
    }
    throw new Error(`Device authorization failed: ${body.error ?? res.status}`);
  }

  throw new Error("Device authorization timed out. Run the setup again.");
}

export async function runDeviceAuthorization(
  baseUrl: string,
  onPrompt: (verificationUri: string, userCode: string) => void
): Promise<string> {
  const code = await requestDeviceCode(baseUrl);
  onPrompt(code.verification_uri_complete ?? code.verification_uri, code.user_code);
  return pollForToken(baseUrl, code.device_code, code.interval, code.expires_in);
}
