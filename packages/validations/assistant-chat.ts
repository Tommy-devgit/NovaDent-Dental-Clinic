import { z } from "zod";

export const assistantChatRequestSchema = z.object({
  message: z.string().trim().min(1),
  sessionId: z.string().trim().optional(),
  previousChatId: z.string().trim().optional(),
});
