import { beforeAll, describe, expect, it } from "vitest";

// 32-byte key as 64 hex chars, set before importing the module under test.
const TEST_KEY = "0".repeat(64);

let encryptField: typeof import("./crypto-column").encryptField;
let decryptField: typeof import("./crypto-column").decryptField;
let hashForSearch: typeof import("./crypto-column").hashForSearch;

beforeAll(async () => {
  process.env.PII_ENCRYPTION_KEY = TEST_KEY;
  const mod = await import("./crypto-column");
  encryptField = mod.encryptField;
  decryptField = mod.decryptField;
  hashForSearch = mod.hashForSearch;
});

describe("crypto-column", () => {
  it("round-trips a value", () => {
    const plain = "Jane Smith";
    expect(decryptField(encryptField(plain))).toBe(plain);
  });

  it("produces different ciphertext each call (random IV)", () => {
    expect(encryptField("07863789108")).not.toBe(encryptField("07863789108"));
  });

  it("ciphertext does not contain the plaintext", () => {
    expect(encryptField("secret-phone")).not.toContain("secret-phone");
  });

  it("rejects tampered ciphertext (auth tag failure)", () => {
    const token = encryptField("sensitive");
    const tampered = `${token.slice(0, -2)}${token.slice(-2) === "AA" ? "BB" : "AA"}`;
    expect(() => decryptField(tampered)).toThrow();
  });

  it("hashForSearch is deterministic and case/space-insensitive", () => {
    expect(hashForSearch(" Jane@Example.com ")).toBe(hashForSearch("jane@example.com"));
  });

  it("hashForSearch differs for different inputs", () => {
    expect(hashForSearch("07863789108")).not.toBe(hashForSearch("07999999999"));
  });
});
