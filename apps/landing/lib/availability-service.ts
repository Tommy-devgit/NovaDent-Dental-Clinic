import { appointmentsRepository, clinicSettingsRepository } from "@novadent/database";

import { buildDaySlots, type DaySlot, type WorkingWindow } from "./availability";
import { parseLondonDateTime } from "./datetime";

const SLOT_MINUTES = 30;
const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

// Matches the advertised opening hours (Mon–Fri 8am–6pm, Sat 9am–2pm, closed Sunday)
// so the booking diary never offers or blocks times outside what the clinic promises.
const DEFAULT_HOURS: Record<string, WorkingWindow> = {
  monday: { open: "08:00", close: "18:00" },
  tuesday: { open: "08:00", close: "18:00" },
  wednesday: { open: "08:00", close: "18:00" },
  thursday: { open: "08:00", close: "18:00" },
  friday: { open: "08:00", close: "18:00" },
  saturday: { open: "09:00", close: "14:00" },
  sunday: { open: "00:00", close: "00:00", closed: true },
};

/** Open appointment slots for a Europe/London date, minus already-booked times. */
export async function resolveDaySlots(dateIso: string): Promise<DaySlot[]> {
  const [year, month, day] = dateIso.split("-").map(Number);
  const dayStart = parseLondonDateTime(dateIso, "00:00");
  if (Number.isNaN(dayStart.getTime())) return [];

  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const dayName = DAY_NAMES[weekday];

  const settings = await clinicSettingsRepository.getSettings();
  const hours = (settings?.workingHours as Record<string, WorkingWindow> | undefined) ?? DEFAULT_HOURS;
  const window = hours[dayName] ?? DEFAULT_HOURS[dayName];

  const taken = await appointmentsRepository.listActiveBetween(dayStart, dayEnd);
  const takenIso = new Set(taken.map((slot) => slot.toISOString()));

  return buildDaySlots({
    dateIso,
    window,
    slotMinutes: SLOT_MINUTES,
    takenIso,
    nowMs: Date.now(),
    toUtcInstant: parseLondonDateTime,
  });
}
