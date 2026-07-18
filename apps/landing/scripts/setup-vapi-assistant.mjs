// One-time setup: wires the NovaDent Vapi assistant so it can (1) book
// appointments through a shared tool call available in both voice and text
// chat, and (2) record calls so the dashboard can offer playback.
//
// Requires a REAL Vapi private key in VAPI_API_KEY (Vapi Dashboard -> Settings
// -> API Keys -> Private Key). Run once after adding it:
//
//   cd apps/landing
//   node --env-file=.env scripts/setup-vapi-assistant.mjs
//
// Safe to re-run: it patches the existing assistant config instead of
// replacing it, and skips the prompt addition if it's already present.

const BOOKING_PROMPT_MARKER = "<novadent-appointment-booking-instructions>";

const BOOKING_PROMPT_BLOCK = `
${BOOKING_PROMPT_MARKER}
When a patient wants to book, reschedule, or request an appointment, collect
the following one at a time, in natural conversation:
1. Full name
2. Phone number
3. Preferred date
4. Preferred time
5. Reason for visit (briefly)
Then call the book_appointment tool with those fields, normalizing the date to
YYYY-MM-DD and the time to 24-hour HH:mm before calling it. After the tool
responds, relay its result message back to the patient as your reply. Do not
invent appointment confirmations yourself — always use the tool.
</novadent-appointment-booking-instructions>`.trim();

const BOOK_APPOINTMENT_TOOL_NAME = "book_appointment";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

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
  const siteUrl = requireEnv("SITE_URL");
  const toolSecret = requireEnv("VAPI_TOOL_SECRET");

  const toolServerUrl = `${siteUrl.replace(/\/$/, "")}/api/assistant/tools/book-appointment`;

  console.log(`Fetching assistant ${assistantId}...`);
  const assistant = await vapiFetch(privateKey, `/assistant/${assistantId}`);

  const model = assistant.model ?? {};
  const existingTools = Array.isArray(model.tools) ? model.tools : [];
  const otherTools = existingTools.filter((tool) => tool?.function?.name !== BOOK_APPOINTMENT_TOOL_NAME);

  const bookAppointmentTool = {
    type: "function",
    function: {
      name: BOOK_APPOINTMENT_TOOL_NAME,
      description: "Books a dental appointment request once the patient's name, phone, date, time, and reason for visit are known.",
      parameters: {
        type: "object",
        properties: {
          patientName: { type: "string", description: "Patient's full name" },
          phone: { type: "string", description: "Phone number the clinic can call back" },
          email: { type: "string", description: "Patient's email address, if given" },
          preferredDate: { type: "string", description: "Preferred date, normalized to YYYY-MM-DD" },
          preferredTime: { type: "string", description: "Preferred time, normalized to 24-hour HH:mm" },
          reasonForVisit: { type: "string", description: "Brief reason for the visit" },
          notes: { type: "string", description: "Any other relevant notes" },
          isNewPatient: { type: "boolean", description: "Whether this is a new patient" },
        },
        required: ["patientName", "phone", "preferredDate", "preferredTime", "reasonForVisit"],
      },
    },
    server: {
      url: toolServerUrl,
      secret: toolSecret,
    },
  };

  const existingMessages = Array.isArray(model.messages) ? model.messages : [];
  const systemMessageIndex = existingMessages.findIndex((message) => message.role === "system");
  const currentSystemContent = systemMessageIndex >= 0 ? existingMessages[systemMessageIndex].content ?? "" : "";
  const alreadyWired = currentSystemContent.includes(BOOKING_PROMPT_MARKER);

  const nextSystemContent = alreadyWired
    ? currentSystemContent
    : `${currentSystemContent}\n\n${BOOKING_PROMPT_BLOCK}`.trim();

  const nextMessages =
    systemMessageIndex >= 0
      ? existingMessages.map((message, index) =>
          index === systemMessageIndex ? { ...message, content: nextSystemContent } : message,
        )
      : [{ role: "system", content: nextSystemContent }, ...existingMessages];

  console.log("Patching assistant with booking tool + recording enabled...");
  await vapiFetch(privateKey, `/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify({
      model: {
        ...model,
        tools: [...otherTools, bookAppointmentTool],
        messages: nextMessages,
      },
      artifactPlan: {
        ...(assistant.artifactPlan ?? {}),
        recordingEnabled: true,
        transcriptPlan: { ...(assistant.artifactPlan?.transcriptPlan ?? {}), enabled: true },
      },
    }),
  });

  console.log("Done. The assistant can now book appointments via tool call and calls will be recorded.");
  console.log(`Tool server URL: ${toolServerUrl}`);
  if (alreadyWired) {
    console.log("(System prompt already had the booking instructions — left unchanged.)");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
