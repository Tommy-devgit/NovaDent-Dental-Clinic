import { NextRequest, NextResponse } from "next/server";

import { STAFF_SESSION_COOKIE, getStaffSessionFromToken } from "./lib/session";

const ADMIN_ONLY_PATHS = [
  "/dashboard/settings",
  "/api/settings",
  "/dashboard/staff",
  "/api/staff",
  "/dashboard/activity",
  "/api/activity",
  "/api/export",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth") || pathname === "/api/health") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(STAFF_SESSION_COOKIE)?.value;
  const session = await getStaffSessionFromToken(token);

  if (!session) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const requiresAdmin = ADMIN_ONLY_PATHS.some((path) => pathname.startsWith(path));

  if (requiresAdmin && session.role !== "ADMIN") {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
