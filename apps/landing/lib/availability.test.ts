import { describe, expect, it } from "vitest";

import { buildDaySlots } from "./availability";

// Test converter treats "HH:mm" as UTC for deterministic assertions.
const toUtc = (dateIso: string, time: string) => new Date(`${dateIso}T${time}:00.000Z`);
const base = {
  dateIso: "2026-07-20",
  slotMinutes: 30,
  toUtcInstant: toUtc,
  nowMs: Date.parse("2026-07-20T00:00:00.000Z"),
};

describe("buildDaySlots", () => {
  it("generates slots across the working window (end exclusive)", () => {
    const slots = buildDaySlots({ ...base, window: { open: "09:00", close: "11:00" }, takenIso: new Set() });
    expect(slots.map((s) => s.time)).toEqual(["09:00", "09:30", "10:00", "10:30"]);
  });

  it("returns nothing for a closed day", () => {
    const slots = buildDaySlots({ ...base, window: { open: "09:00", close: "17:00", closed: true }, takenIso: new Set() });
    expect(slots).toEqual([]);
  });

  it("excludes already-booked slots", () => {
    const taken = new Set(["2026-07-20T09:30:00.000Z"]);
    const slots = buildDaySlots({ ...base, window: { open: "09:00", close: "11:00" }, takenIso: taken });
    expect(slots.map((s) => s.time)).toEqual(["09:00", "10:00", "10:30"]);
  });

  it("excludes past slots", () => {
    const slots = buildDaySlots({
      ...base,
      nowMs: Date.parse("2026-07-20T09:45:00.000Z"),
      window: { open: "09:00", close: "11:00" },
      takenIso: new Set(),
    });
    expect(slots.map((s) => s.time)).toEqual(["10:00", "10:30"]);
  });
});
