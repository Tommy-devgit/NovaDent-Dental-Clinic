import { describe, expect, it } from "vitest";

import { classifyApiError } from "./api-errors";

describe("classifyApiError", () => {
  it("maps Prisma not-found (P2025) to 404", () => {
    expect(classifyApiError({ code: "P2025" })).toEqual({ status: 404, message: "Not found" });
  });

  it("maps FK violation (P2003) to 422", () => {
    expect(classifyApiError({ code: "P2003" }).status).toBe(422);
  });

  it("maps unique violation (P2002) to 409", () => {
    expect(classifyApiError({ code: "P2002" }).status).toBe(409);
  });

  it("falls back to 500 for unknown errors", () => {
    expect(classifyApiError(new Error("boom")).status).toBe(500);
    expect(classifyApiError(null).status).toBe(500);
  });
});
