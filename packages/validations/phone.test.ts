import { describe, expect, it } from "vitest";

import { normalizeUkPhone } from "./phone";

describe("normalizeUkPhone", () => {
  it("normalizes UK mobile formats to E.164", () => {
    expect(normalizeUkPhone("07863789108")).toBe("+447863789108");
    expect(normalizeUkPhone("07863 789108")).toBe("+447863789108");
    expect(normalizeUkPhone("(07863) 789108")).toBe("+447863789108");
    expect(normalizeUkPhone("+447863789108")).toBe("+447863789108");
    expect(normalizeUkPhone("+44 7863 789108")).toBe("+447863789108");
    expect(normalizeUkPhone("447863789108")).toBe("+447863789108");
  });

  it("normalizes UK landlines", () => {
    expect(normalizeUkPhone("020 7946 0958")).toBe("+442079460958");
  });

  it("rejects invalid numbers", () => {
    expect(normalizeUkPhone("12345")).toBeNull();
    expect(normalizeUkPhone("notaphone")).toBeNull();
    expect(normalizeUkPhone("07863")).toBeNull();
    expect(normalizeUkPhone("")).toBeNull();
    expect(normalizeUkPhone("+15551234567")).toBeNull();
  });
});
