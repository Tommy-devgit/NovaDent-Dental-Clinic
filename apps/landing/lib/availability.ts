export interface WorkingWindow {
  open: string;
  close: string;
  closed?: boolean;
}

export interface DaySlotParams {
  dateIso: string;
  window: WorkingWindow;
  slotMinutes: number;
  takenIso: Set<string>;
  nowMs: number;
  toUtcInstant: (dateIso: string, time: string) => Date;
}

export interface DaySlot {
  time: string;
  iso: string;
}

function toMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/** Slice a day's working window into bookable slots, dropping taken and past ones. */
export function buildDaySlots({ dateIso, window, slotMinutes, takenIso, nowMs, toUtcInstant }: DaySlotParams): DaySlot[] {
  if (window.closed) return [];

  const openMinutes = toMinutes(window.open);
  const closeMinutes = toMinutes(window.close);
  const slots: DaySlot[] = [];

  for (let start = openMinutes; start + slotMinutes <= closeMinutes; start += slotMinutes) {
    const time = formatTime(start);
    const instant = toUtcInstant(dateIso, time);
    if (Number.isNaN(instant.getTime())) continue;
    const iso = instant.toISOString();
    if (instant.getTime() <= nowMs) continue;
    if (takenIso.has(iso)) continue;
    slots.push({ time, iso });
  }

  return slots;
}
