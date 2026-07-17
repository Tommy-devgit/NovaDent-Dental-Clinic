import { z } from "zod";

import { CONVERSATION_STATUSES, LEAD_URGENCIES, VAPI_PROVIDERS } from "@novadent/utils";

export const vapiIntakeWebhookSchema = z.object({
  externalConversationId: z.string().min(1),
  assistantId: z.string().trim().optional(),
  n8nExecutionId: z.string().trim().optional(),
  provider: z.enum(VAPI_PROVIDERS).default("VAPI"),
  status: z.enum(CONVERSATION_STATUSES).default("COMPLETED"),
  durationSeconds: z.coerce.number().int().min(0).optional(),
  patientName: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: z.string().email().optional(),
  reasonForVisit: z.string().trim().min(1),
  symptoms: z.string().trim().optional(),
  urgency: z.enum(LEAD_URGENCIES).default("LOW"),
  transcript: z.string().min(1),
  summary: z.string().trim().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
  appointmentRequestedAt: z.coerce.date().optional(),
});
