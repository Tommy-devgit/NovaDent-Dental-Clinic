import { NextResponse } from "next/server";

import { staffUsersRepository } from "../../../../../../shared/database";
import { staffLoginSchema } from "../../../../../../shared/validations/auth";

import { verifyStaffPassword } from "@/lib/auth";
import { STAFF_SESSION_COOKIE, createStaffSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = staffLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const user = await staffUsersRepository.findByEmail(parsed.data.email);

  if (!user || user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValidPassword = await verifyStaffPassword(parsed.data.password, user.passwordHash);

  if (!isValidPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createStaffSessionToken({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(STAFF_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  await staffUsersRepository.updateLastLogin(user.id).catch(() => undefined);

  return response;
}
