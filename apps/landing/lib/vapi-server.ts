const VAPI_API_BASE = "https://api.vapi.ai";

export function getVapiPrivateKey() {
  const key = process.env.VAPI_API_KEY;
  // Guards against the share-link URL that has historically been pasted into this
  // env var by mistake — a real private key never contains a scheme.
  if (!key || key.includes("://")) {
    return null;
  }
  return key;
}

export function vapiServerFetch(path: string, init: RequestInit = {}) {
  const key = getVapiPrivateKey();
  if (!key) {
    throw new Error("VAPI_API_KEY is not configured with a real private key");
  }

  return fetch(`${VAPI_API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      ...init.headers,
    },
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Vapi finishes uploading the call recording shortly *after* call-end fires,
 * so the first lookup right after a call often comes back empty — a couple of
 * short retries covers that without holding up the response for long.
 */
export async function fetchCallRecordingUrl(callId: string, attempts = 3, delayMs = 3000) {
  if (!getVapiPrivateKey()) {
    return null;
  }

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) {
      await sleep(delayMs);
    }

    try {
      const response = await vapiServerFetch(`/call/${callId}`);
      if (!response.ok) continue;

      const call = (await response.json()) as {
        artifact?: { recording?: { stereoUrl?: string; mono?: { combinedUrl?: string } }; summary?: string };
        recordingUrl?: string;
      };

      const recordingUrl =
        call.artifact?.recording?.stereoUrl ?? call.artifact?.recording?.mono?.combinedUrl ?? call.recordingUrl;

      if (recordingUrl) {
        return { recordingUrl, summary: call.artifact?.summary };
      }
    } catch {
      // best-effort — fall through and retry
    }
  }

  return null;
}
