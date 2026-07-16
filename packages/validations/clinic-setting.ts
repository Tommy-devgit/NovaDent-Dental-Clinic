import { z } from "zod";

const workingHoursWindowSchema = z.object({
  open: z.string().min(1),
  close: z.string().min(1),
  closed: z.boolean().optional(),
});

export const clinicSettingsUpsertSchema = z.object({
  clinicName: z.string().trim().min(1),
  address: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: z.string().email(),
  timezone: z.string().trim().min(1).default("UTC"),
  workingHours: z.record(z.string(), workingHoursWindowSchema),
  vapiConfig: z.record(z.string(), z.unknown()),
  notificationSettings: z.record(z.string(), z.unknown()),
});