import { z } from "zod";

export const bookAppointmentToolArgsSchema = z.object({
  patientName: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: z.string().trim().email().optional(),
  preferredDate: z.string().trim().min(1),
  preferredTime: z.string().trim().min(1),
  reasonForVisit: z.string().trim().min(1),
  notes: z.string().trim().optional(),
  isNewPatient: z.boolean().optional(),
});

const toolCallSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  arguments: z.record(z.string(), z.unknown()).optional(),
  parameters: z.record(z.string(), z.unknown()).optional(),
});

export const vapiToolCallWebhookSchema = z.object({
  message: z.object({
    type: z.literal("tool-calls"),
    call: z.object({ id: z.string() }).optional(),
    chat: z.object({ id: z.string() }).optional(),
    toolCallList: z.array(toolCallSchema).min(1),
  }),
});
