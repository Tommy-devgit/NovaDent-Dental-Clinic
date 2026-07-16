import { cookies } from "next/headers";

import type { AuthenticatedStaffUser } from "@novadent/types";
import { signJwt, verifyJwt } from "@novadent/utils";

export const STAFF_SESSION_COOKIE = "novadent_staff_session";

function getSessionSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  return secret;
}

export async function createStaffSessionToken(session: AuthenticatedStaffUser) {
  return signJwt(session as unknown as Record<string, unknown>, getSessionSecret());
}

export async function getStaffSessionFromToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  return (await verifyJwt<Record<string, unknown> & AuthenticatedStaffUser>(token, getSessionSecret())) as AuthenticatedStaffUser | null;
}

export async function getStaffSessionFromCookies() {
  const token = (await cookies()).get(STAFF_SESSION_COOKIE)?.value;
  return getStaffSessionFromToken(token);
}
