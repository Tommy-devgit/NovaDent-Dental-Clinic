import { z } from "zod";

import { LEAD_STATUSES, LEAD_URGENCIES } from "@novadent/utils";

import { emailSchema } from "./email";
import { normalizeUkPhone } from "./phone";

export const patientLeadFiltersSchema = z.object({
  q: z.string().trim().optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  urgency: z.enum(LEAD_URGENCIES).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const patientLeadStatusUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
  note: z.string().trim().min(1).max(2000).optional(),
});

export const leadAssignSchema = z.object({
  assignedStaffUserId: z.string().min(1).nullable(),
});

export const leadUpdateDetailsSchema = z
  .object({
    patientName: z.string().trim().min(1).optional(),
    phone: z
      .string()
      .trim()
      .transform((value, ctx) => {
        const normalized = normalizeUkPhone(value);
        if (!normalized) {
          ctx.addIssue({ code: "custom", message: "Enter a valid UK phone number" });
          return z.NEVER;
        }
        return normalized;
      })
      .optional(),
    email: z.preprocess((value) => (value === "" ? undefined : value), emailSchema.optional()),
    reasonForVisit: z.string().trim().min(1).optional(),
    urgency: z.enum(LEAD_URGENCIES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "No changes provided" });

export const patientLeadUpsertSchema = z.object({
  patientName: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: emailSchema.optional(),
  reasonForVisit: z.string().trim().min(1),
  symptoms: z.string().trim().optional(),
  urgency: z.enum(LEAD_URGENCIES).default("LOW"),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  source: z.string().trim().min(1).default("vapi"),
});