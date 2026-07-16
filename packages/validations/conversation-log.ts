import { z } from "zod";

import { VAPI_PROVIDERS } from "@novadent/utils";

export const conversationLogUpsertSchema = z.object({
  leadId: z.string().min(1),
  provider: z.enum(VAPI_PROVIDERS).default("VAPI"),
  externalConversationId: z.string().min(1),
  summary: z.string().trim().optional(),
  transcript: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
});