import { z } from "zod";

import { STAFF_ROLES, STAFF_STATUSES } from "@novadent/utils";

import { emailSchema } from "./email";
import type { StaffRole, StaffStatus } from "@novadent/types";

const authUserRoleSet = new Set<string>(STAFF_ROLES);
const authUserStatusSet = new Set<string>(STAFF_STATUSES);

export function isAuthUserRole(value: string): value is StaffRole {
  return authUserRoleSet.has(value);
}

export function isAuthUserStatus(value: string): value is StaffStatus {
  return authUserStatusSet.has(value);
}

export const staffLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
});

export const staffSessionSchema = z.object({
  id: z.string().min(1),
  email: emailSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(STAFF_ROLES),
  status: z.enum(STAFF_STATUSES),
});