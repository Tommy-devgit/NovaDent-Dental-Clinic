import { z } from "zod";

export const conversationCompletionSchema = z.object({
  externalConversationId: z.string().min(1),
  transcript: z.array(z.object({ role: z.enum(["user", "assistant"]), text: z.string().min(1) })).min(1),
  startedAt: z.coerce.date().optional(),
  endedAt: z.coerce.date().optional(),
});
