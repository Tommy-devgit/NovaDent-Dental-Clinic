import { NextResponse } from "next/server";

import { appointmentsRepository, clinicSettingsRepository } from "@novadent/database";

import { buildDaySlots, type WorkingWindow } from "@/lib/availability";
import { parseLondonDateTime } from "@/lib/datetime";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const SLOT_MINUTES = 30;
const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

const DEFAULT_HOURS: Record<string, WorkingWindow> = {
  monday: { open: "09:00", close: "17:00" },
  tuesday: { open: "09:00", close: "17:00" },
  wednesday: { open: "09:00", close: "17:00" },
  thursday: { open: "09:00", close: "17:00" },
  friday: { open: "09:00", close: "17:00" },
  saturday: { open: "09:00", close: "13:00" },
  sunday: { open: "00:00", close: "00:00", closed: true },
};

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

  const [year, month, day] = date.split("-").map(Number);
  const dayStart = parseLondonDateTime(date, "00:00");
  if (Number.isNaN(dayStart.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const dayName = DAY_NAMES[weekday];

  const settings = await clinicSettingsRepository.getSettings();
  const hours = (settings?.workingHours as Record<string, WorkingWindow> | undefined) ?? DEFAULT_HOURS;
  const window = hours[dayName] ?? DEFAULT_HOURS[dayName];

  const taken = await appointmentsRepository.listActiveBetween(dayStart, dayEnd);
  const takenIso = new Set(taken.map((slot) => slot.toISOString()));

  const slots = buildDaySlots({
    dateIso: date,
    window,
    slotMinutes: SLOT_MINUTES,
    takenIso,
    nowMs: Date.now(),
    toUtcInstant: parseLondonDateTime,
  });

  return NextResponse.json({ date, slots });
}
