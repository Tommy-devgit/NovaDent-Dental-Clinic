import { z } from "zod";

import { CONVERSATION_STATUSES, LEAD_URGENCIES, VAPI_PROVIDERS } from "@novadent/utils";

import { emailSchema } from "./email";

// LLM-driven callers (n8n agents, etc.) don't reliably match enum casing exactly even
// when told to — normalize before validating so "high"/"High"/"HIGH" all work the same.
function upperCaseEnum<T extends readonly [string, ...string[]]>(values: T) {
  return z.preprocess((value) => (typeof value === "string" ? value.toUpperCase() : value), z.enum(values));
}

export const vapiIntakeWebhookSchema = z.object({
  externalConversationId: z.string().min(1),
  assistantId: z.string().trim().optional(),
  n8nExecutionId: z.string().trim().optional(),
  provider: upperCaseEnum(VAPI_PROVIDERS).default("VAPI"),
  status: upperCaseEnum(CONVERSATION_STATUSES).default("COMPLETED"),
  durationSeconds: z.coerce.number().int().min(0).optional(),
  patientName: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: emailSchema.optional(),
  reasonForVisit: z.string().trim().min(1),
  symptoms: z.string().trim().optional(),
  urgency: upperCaseEnum(LEAD_URGENCIES).default("LOW"),
  transcript: z.string().min(1),
  summary: z.string().trim().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
  appointmentRequestedAt: z.coerce.date().optional(),
});
