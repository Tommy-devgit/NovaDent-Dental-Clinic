import { NextResponse } from "next/server";

import { resolveDaySlots } from "@/lib/availability-service";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const limit = await rateLimit(`availability:${getClientIp(request)}`, { limit: 60, windowSeconds: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const date = new URL(request.url).searchParams.get("date");
  if (!date || !DATE_PATTERN.test(date)) {
    return NextResponse.json({ error: "A valid date (YYYY-MM-DD) is required" }, { status: 400 });
  }

  const slots = await resolveDaySlots(date);
  return NextResponse.json({ date, slots });
}
