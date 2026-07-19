import { beforeAll, describe, expect, it } from "vitest";

process.env.PII_ENCRYPTION_KEY = "0".repeat(64);

let pii: typeof import("./pii");

beforeAll(async () => {
  pii = await import("./pii");
});

describe("encryptLeadWrite", () => {
  it("encrypts PII fields and adds deterministic search hashes", () => {
    const out = pii.encryptLeadWrite({ patientName: "Jane Smith", phone: "07863789108", email: "Jane@Example.com" });
    expect(out.patientName).not.toBe("Jane Smith");
    expect(out.phone).not.toBe("07863789108");
    expect(typeof out.phoneHash).toBe("string");
    expect(typeof out.emailHash).toBe("string");
  });

  it("leaves absent fields untouched", () => {
    const out = pii.encryptLeadWrite({ status: "NEW" });
    expect(out.status).toBe("NEW");
    expect(out.phoneHash).toBeUndefined();
  });
});

describe("decryptLeadRow round-trip", () => {
  it("decrypts what encryptLeadWrite produced", () => {
    const encrypted = pii.encryptLeadWrite({ patientName: "Jane Smith", phone: "07863789108", transcript: "hi" });
    const decrypted = pii.decryptLeadRow(encrypted);
    expect(decrypted?.patientName).toBe("Jane Smith");
    expect(decrypted?.phone).toBe("07863789108");
    expect(decrypted?.transcript).toBe("hi");
  });

  it("passes legacy plaintext through unchanged (tolerant)", () => {
    const decrypted = pii.decryptLeadRow({ patientName: "Legacy Plain", phone: "07123456789" });
    expect(decrypted?.patientName).toBe("Legacy Plain");
    expect(decrypted?.phone).toBe("07123456789");
  });

  it("decrypts nested conversationLogs", () => {
    const row = { patientName: pii.encryptLeadWrite({ patientName: "X" }).patientName, conversationLogs: [pii.encryptConversationWrite({ transcript: "secret call" })] };
    const decrypted = pii.decryptLeadRow(row) as { conversationLogs: { transcript: string }[] };
    expect(decrypted.conversationLogs[0].transcript).toBe("secret call");
  });
});

describe("phone hashing", () => {
  it("hashes UK phone variants to the same value", () => {
    expect(pii.computePhoneHash("07863789108")).toBe(pii.computePhoneHash("+447863789108"));
    expect(pii.computePhoneHash("07863 789108")).toBe(pii.computePhoneHash("07863789108"));
  });
});
