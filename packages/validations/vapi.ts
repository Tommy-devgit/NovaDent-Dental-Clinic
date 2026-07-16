import { z } from "zod";

import { LEAD_URGENCIES, VAPI_PROVIDERS } from "@novadent/utils";

export const vapiIntakeWebhookSchema = z.object({
  externalConversationId: z.string().min(1),
  n8nExecutionId: z.string().trim().optional(),
  provider: z.enum(VAPI_PROVIDERS).default("VAPI"),
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
