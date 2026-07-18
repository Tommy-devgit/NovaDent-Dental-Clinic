import { z } from "zod";

import { CONVERSATION_STATUSES } from "@novadent/utils";

export const conversationCompletionSchema = z.object({
  externalConversationId: z.string().min(1),
  channel: z.enum(["voice", "chat"]).default("voice"),
  status: z.enum(CONVERSATION_STATUSES).optional(),
  transcript: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().min(1) })).min(1),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
});
