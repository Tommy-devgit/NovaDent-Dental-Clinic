import { describe, expect, it } from "vitest";

import { memoryRateLimit } from "./rate-limit";

describe("memoryRateLimit", () => {
  it("allows up to the limit then blocks", () => {
    const key = "test-a";
    expect(memoryRateLimit(key, 3, 60_000, 1000).success).toBe(true);
    expect(memoryRateLimit(key, 3, 60_000, 1000).success).toBe(true);
    expect(memoryRateLimit(key, 3, 60_000, 1000).success).toBe(true);
    const blocked = memoryRateLimit(key, 3, 60_000, 1000);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("resets after the window elapses", () => {
    const key = "test-b";
    memoryRateLimit(key, 1, 60_000, 1000);
    expect(memoryRateLimit(key, 1, 60_000, 1000).success).toBe(false);
    expect(memoryRateLimit(key, 1, 60_000, 61_001).success).toBe(true);
  });

  it("decrements remaining on each call", () => {
    const key = "test-c";
    expect(memoryRateLimit(key, 5, 1000, 0).remaining).toBe(4);
    expect(memoryRateLimit(key, 5, 1000, 0).remaining).toBe(3);
  });
});
