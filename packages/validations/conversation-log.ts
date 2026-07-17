import { z } from "zod";

import { CONVERSATION_STATUSES, VAPI_PROVIDERS } from "@novadent/utils";

export const conversationFiltersSchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(CONVERSATION_STATUSES).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const conversationLogUpsertSchema = z.object({
  leadId: z.string().min(1),
  provider: z.enum(VAPI_PROVIDERS).default("VAPI"),
  externalConversationId: z.string().min(1),
  assistantId: z.string().trim().optional(),
  status: z.enum(CONVERSATION_STATUSES).default("COMPLETED"),
  durationSeconds: z.coerce.number().int().min(0).optional(),
  summary: z.string().trim().optional(),
  transcript: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional(),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
});
