import { z } from "zod";

export const assistantChatRequestSchema = z.object({
  message: z.string().trim().min(1),
  previousChatId: z.string().trim().optional(),
});
