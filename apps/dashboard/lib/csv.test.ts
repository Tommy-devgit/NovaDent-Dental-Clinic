import { describe, expect, it } from "vitest";

import { toCsv } from "./csv";

describe("toCsv", () => {
  it("quotes cells containing commas, quotes, or newlines and escapes quotes", () => {
    const csv = toCsv(
      ["Name", "Note"],
      [
        ["Jane Doe", "plain"],
        ["Smith, John", 'has "quotes"'],
        ["Multi", "line\nbreak"],
      ],
    );
    const lines = csv.split("\r\n");
    expect(lines[0]).toBe("Name,Note");
    expect(lines[1]).toBe("Jane Doe,plain");
    expect(lines[2]).toBe('"Smith, John","has ""quotes"""');
    expect(csv).toContain('"line\nbreak"');
  });

  it("renders null/undefined as empty and Dates as ISO", () => {
    const csv = toCsv(["A", "B", "C"], [[null, undefined, new Date("2026-07-22T09:00:00.000Z")]]);
    expect(csv.split("\r\n")[1]).toBe(",,2026-07-22T09:00:00.000Z");
  });
});
