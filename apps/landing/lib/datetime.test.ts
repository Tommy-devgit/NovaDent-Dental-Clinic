import { describe, expect, it } from "vitest";

import { parseLondonDateTime } from "./datetime";

describe("parseLondonDateTime", () => {
  it("interprets summer times as BST (UTC+1)", () => {
    // 14:00 London in July is 13:00 UTC.
    expect(parseLondonDateTime("2026-07-15", "14:00").toISOString()).toBe("2026-07-15T13:00:00.000Z");
  });

  it("interprets winter times as GMT (UTC+0)", () => {
    expect(parseLondonDateTime("2026-01-15", "14:00").toISOString()).toBe("2026-01-15T14:00:00.000Z");
  });

  it("returns an invalid date for junk input", () => {
    expect(Number.isNaN(parseLondonDateTime("not-a-date", "nope").getTime())).toBe(true);
  });
});
