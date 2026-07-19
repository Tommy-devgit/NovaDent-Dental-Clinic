import { z } from "zod";

import { emailSchema } from "./email";

export const STAFF_ROLES = ["ADMIN", "RECEPTIONIST"] as const;
export const STAFF_STATUSES = ["ACTIVE", "INVITED", "SUSPENDED"] as const;

export const staffCreateSchema = z.object({
  email: emailSchema,
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  role: z.enum(STAFF_ROLES),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const staffUpdateSchema = z
  .object({
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    role: z.enum(STAFF_ROLES).optional(),
    status: z.enum(STAFF_STATUSES).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: "No changes provided" });

export const staffPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type StaffCreateInput = z.infer<typeof staffCreateSchema>;
export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>;
