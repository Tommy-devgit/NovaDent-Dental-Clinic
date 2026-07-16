import { NextRequest, NextResponse } from "next/server";

import { STAFF_SESSION_COOKIE, getStaffSessionFromToken } from "./lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(STAFF_SESSION_COOKIE)?.value;
  const session = await getStaffSessionFromToken(token);

  if (session) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
