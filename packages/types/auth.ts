import { STAFF_ROLES, STAFF_STATUSES } from "@novadent/utils";

export type StaffRole = (typeof STAFF_ROLES)[number];

export type StaffStatus = (typeof STAFF_STATUSES)[number];

export interface AuthenticatedStaffUser {
  id: string;
  role: StaffRole;
  status: StaffStatus;
  email: string;
  firstName: string;
  lastName: string;
}