import { AUTH_USER_ROLES, AUTH_USER_STATUSES } from "../constants/auth";

export type AuthUserRole = (typeof AUTH_USER_ROLES)[number];

export type AuthUserStatus = (typeof AUTH_USER_STATUSES)[number];

export interface AuthenticatedUser {
  id: string;
  role: AuthUserRole;
  status: AuthUserStatus;
  email: string;
  name?: string | null;
}