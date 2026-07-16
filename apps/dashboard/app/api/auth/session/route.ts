import { NextResponse } from "next/server";

import { STAFF_SESSION_COOKIE, getStaffSessionFromToken } from "@/lib/session";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${STAFF_SESSION_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const session = await getStaffSessionFromToken(token);

  if (!session) {
    return NextResponse.json({ session: null }, { status: 401 });
  }

  return NextResponse.json({ session });
}
