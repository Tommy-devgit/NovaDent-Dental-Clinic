// One-time setup: turns on call recording + automatic call summaries for the
// NovaDent Vapi assistant. Does NOT touch the assistant's existing system
// prompt or its `submit_patient_intake` tool (which already forwards booking
// requests to the n8n workflow) — this only adds artifactPlan/analysisPlan.
//
// Requires a REAL Vapi private key in VAPI_API_KEY (Vapi Dashboard -> Settings
// -> API Keys -> Private Key). Run once after adding it:
//
//   cd apps/landing
//   node --env-file=.env scripts/setup-vapi-assistant.mjs
//
// Safe to re-run.

function getPrivateKey() {
  const key = process.env.VAPI_API_KEY;
  if (!key || key.includes("://")) {
    console.error(
      "VAPI_API_KEY is missing or still set to the old share-link URL. Paste the real private key " +
        "from Vapi Dashboard -> Settings -> API Keys -> Private Key into apps/landing/.env (and apps/dashboard/.env) first.",
    );
    process.exit(1);
  }
  return key;
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

async function vapiFetch(privateKey, path, init = {}) {
  const response = await fetch(`https://api.vapi.ai${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${privateKey}`,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Vapi API ${init.method ?? "GET"} ${path} failed: ${response.status} ${text}`);
  }

  return response.json();
}

async function main() {
  const privateKey = getPrivateKey();
  const assistantId = requireEnv("NEXT_PUBLIC_VAPI_ASSISTANT_ID");

  console.log(`Fetching assistant ${assistantId}...`);
  const assistant = await vapiFetch(privateKey, `/assistant/${assistantId}`);

  const alreadyEnabled = assistant.artifactPlan?.recordingEnabled && assistant.analysisPlan?.summaryPlan?.enabled;

  if (alreadyEnabled) {
    console.log("Recording and call summaries are already enabled — nothing to do.");
    return;
  }

  console.log("Enabling call recording and automatic call summaries...");
  await vapiFetch(privateKey, `/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify({
      artifactPlan: {
        ...(assistant.artifactPlan ?? {}),
        recordingEnabled: true,
      },
      analysisPlan: {
        ...(assistant.analysisPlan ?? {}),
        summaryPlan: { ...(assistant.analysisPlan?.summaryPlan ?? {}), enabled: true },
      },
    }),
  });

  console.log("Done. New calls will be recorded, and the dashboard will pick up recording URLs and summaries.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
