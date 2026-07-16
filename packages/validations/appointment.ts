import { z } from "zod";

import { APPOINTMENT_STATUSES } from "@novadent/utils";

export const appointmentStatusUpdateSchema = z.object({
  status: z.enum(APPOINTMENT_STATUSES),
  notes: z.string().trim().optional(),
});

export const appointmentRescheduleSchema = z.object({
  scheduledFor: z.coerce.date(),
});

export const appointmentUpsertSchema = z.object({
  leadId: z.string().min(1),
  scheduledFor: z.coerce.date(),
  durationMinutes: z.coerce.number().int().min(5).max(480).default(30),
  status: z.enum(APPOINTMENT_STATUSES).default("SCHEDULED"),
  notes: z.string().trim().optional(),
  location: z.string().trim().optional(),
});