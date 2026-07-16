import type { StaffRole, StaffStatus } from "./auth";

export interface StaffUserRecord {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  status: StaffStatus;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}