import { AUTH_USER_ROLES, AUTH_USER_STATUSES } from "../constants/auth";
import type { AuthUserRole, AuthUserStatus } from "../types/auth";

const authUserRoleSet = new Set<string>(AUTH_USER_ROLES);
const authUserStatusSet = new Set<string>(AUTH_USER_STATUSES);

export function isAuthUserRole(value: string): value is AuthUserRole {
  return authUserRoleSet.has(value);
}

export function isAuthUserStatus(value: string): value is AuthUserStatus {
  return authUserStatusSet.has(value);
}