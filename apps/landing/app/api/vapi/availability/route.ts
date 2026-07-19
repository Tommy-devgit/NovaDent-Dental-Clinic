import { NextResponse } from "next/server";

import { resolveDaySlots } from "@/lib/availability-service";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { asToolString, formatTime12h, isVapiAuthorized, parseVapiToolCall, vapiResult } from "@/lib/vapi-tool";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_OFFERED = 8;

export async function POST(request: Request) {
  if (!isVapiAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await rateLimit(`vapi-avail:${getClientIp(request)}`, { limit: 60, windowSeconds: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const { toolCallId, args } = parseVapiToolCall(body);
  const date = asToolString(args.date);

  if (!date || !DATE_PATTERN.test(date)) {
    return vapiResult(toolCallId, "I need the date in YYYY-MM-DD format to check availability.");
  }

  const slots = await resolveDaySlots(date);
  if (slots.length === 0) {
    return vapiResult(toolCallId, `There are no appointments available on ${date}. Ask the patient for another day.`);
  }

  const offered = slots.slice(0, MAX_OFFERED).map((slot) => formatTime12h(slot.time)).join(", ");
  const more = slots.length > MAX_OFFERED ? ` and ${slots.length - MAX_OFFERED} more later that day` : "";
  return vapiResult(
    toolCallId,
    `Available times on ${date}: ${offered}${more}. Offer two or three of these to the patient, then call BookAppointment with the exact time they choose.`,
  );
}
