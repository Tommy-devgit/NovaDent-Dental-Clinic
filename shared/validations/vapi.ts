import { z } from "zod";

import { LEAD_URGENCIES } from "../constants/leads";
import { conversationLogUpsertSchema } from "./conversation-log";

export const vapiIntakeWebhookSchema = conversationLogUpsertSchema.extend({
  patientName: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: z.string().email().optional(),
  reasonForVisit: z.string().trim().min(1),
  symptoms: z.string().trim().optional(),
  urgency: z.enum(LEAD_URGENCIES).default("LOW"),
  appointmentRequestedAt: z.coerce.date().optional(),
});