import { z } from "zod";

import { normalizeUkPhone } from "./phone";

export const publicAppointmentBookingSchema = z.object({
  patientName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().transform((value, ctx) => {
    const normalized = normalizeUkPhone(value);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid UK phone number" });
      return z.NEVER;
    }
    return normalized;
  }),
  email: z.preprocess((value) => (value === "" ? undefined : value), z.string().email().optional()),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  reasonForVisit: z.string().trim().min(1, "Reason for visit is required"),
  isNewPatient: z.boolean(),
  notes: z.string().trim().optional(),
});
