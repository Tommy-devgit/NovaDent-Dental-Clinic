import { LEAD_URGENCIES } from "@novadent/utils";

type LeadUrgency = (typeof LEAD_URGENCIES)[number];

// Vapi's assistant classifies urgency with its own vocabulary; the lead model uses another.
const VAPI_URGENCY_MAP: Record<string, LeadUrgency> = {
  emergency: "URGENT",
  urgent: "HIGH",
  routine: "LOW",
  not_sure: "LOW",
};

/** Map Vapi's urgency vocabulary to a lead urgency, passing through already-valid values. */
export function mapVapiUrgency(value?: string): LeadUrgency {
  if (!value) return "LOW";
  if ((LEAD_URGENCIES as readonly string[]).includes(value)) return value as LeadUrgency;
  return VAPI_URGENCY_MAP[value.toLowerCase()] ?? "LOW";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function extractTranscript(artifact: unknown): string | undefined {
  if (!isRecord(artifact) || !Array.isArray(artifact.messages)) return undefined;
  const lines = artifact.messages
    .filter(isRecord)
    .map((entry) => {
      const role = asString(entry.role)?.toLowerCase();
      if (role !== "user" && role !== "assistant" && role !== "bot") return undefined;
      const text = asString(entry.message) ?? asString(entry.content);
      if (!text) return undefined;
      return `${role === "user" ? "Patient" : "Assistant"}: ${text}`;
    })
    .filter((line): line is string => Boolean(line));
  return lines.length > 0 ? lines.join("\n") : undefined;
}

function buildMetadata(args: Record<string, unknown>, patient: Record<string, unknown>, request: Record<string, unknown>) {
  const metadata: Record<string, unknown> = {};
  if (args.callbackConsent !== undefined) metadata.callbackConsent = args.callbackConsent;
  if (patient.isNewPatient !== undefined) metadata.isNewPatient = patient.isNewPatient;
  if (request.preferredDays !== undefined) metadata.preferredDays = request.preferredDays;
  if (request.preferredTimes !== undefined) metadata.preferredTimes = request.preferredTimes;
  if (request.insuranceProvider !== undefined) metadata.insuranceProvider = request.insuranceProvider;
  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

function buildFlat(args: Record<string, unknown>, context: { externalConversationId?: string; transcript?: string }) {
  const patient = isRecord(args.patient) ? args.patient : {};
  const request = isRecord(args.request) ? args.request : {};
  const summary = asString(args.conversationSummary);
  return {
    externalConversationId: context.externalConversationId,
    patientName: patient.fullName,
    phone: patient.phone,
    email: patient.email,
    reasonForVisit: request.reasonForVisit,
    symptoms: request.symptoms,
    urgency: mapVapiUrgency(asString(request.urgency)),
    summary,
    transcript: context.transcript ?? summary,
    metadata: buildMetadata(args, patient, request),
  };
}

/**
 * Accept any of the three shapes the intake can arrive in and return a flat object
 * for `vapiIntakeWebhookSchema`:
 *  1. Vapi's native tool-call envelope (`message.toolCallList[].arguments`) — n8n forwards verbatim.
 *  2. Nested tool arguments with n8n-injected `externalConversationId`/`transcript`.
 *  3. An already-flat payload (passed through untouched).
 * Transcript falls back to the conversation summary so a lead is never lost to a missing field.
 */
export function normalizeVapiIntake(raw: unknown): unknown {
  if (!isRecord(raw)) return raw;

  const message = raw.message;
  if (isRecord(message) && Array.isArray(message.toolCallList)) {
    const toolCall = message.toolCallList.find((call) => isRecord(call) && isRecord(call.arguments));
    const args = isRecord(toolCall) && isRecord(toolCall.arguments) ? toolCall.arguments : {};
    return buildFlat(args, {
      externalConversationId: isRecord(message.call) ? asString(message.call.id) : undefined,
      transcript: extractTranscript(message.artifact),
    });
  }

  if (isRecord(raw.patient) || isRecord(raw.request)) {
    return buildFlat(raw, {
      externalConversationId: asString(raw.externalConversationId),
      transcript: asString(raw.transcript),
    });
  }

  return raw;
}
