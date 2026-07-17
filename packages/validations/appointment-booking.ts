import { z } from "zod";

export const publicAppointmentBookingSchema = z.object({
  patientName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(6, "Phone number is required"),
  email: z.preprocess((value) => (value === "" ? undefined : value), z.string().email().optional()),
  preferredDate: z.string().min(1, "Preferred date is required"),
  preferredTime: z.string().min(1, "Preferred time is required"),
  reasonForVisit: z.string().trim().min(1, "Reason for visit is required"),
  isNewPatient: z.boolean(),
  notes: z.string().trim().optional(),
});
