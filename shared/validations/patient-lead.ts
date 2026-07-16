import { z } from "zod";

import { LEAD_STATUSES, LEAD_URGENCIES } from "../constants/leads";

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

export const patientLeadUpsertSchema = z.object({
  patientName: z.string().trim().min(1),
  phone: z.string().trim().min(6),
  email: z.string().email().optional(),
  reasonForVisit: z.string().trim().min(1),
  symptoms: z.string().trim().optional(),
  urgency: z.enum(LEAD_URGENCIES).default("LOW"),
  status: z.enum(LEAD_STATUSES).default("NEW"),
  source: z.string().trim().min(1).default("vapi"),
});