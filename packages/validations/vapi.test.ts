import { describe, expect, it } from "vitest";

import { vapiIntakeWebhookSchema } from "./vapi";

const validPayload = {
  externalConversationId: "call_123",
  patientName: "Jane Smith",
  phone: "07863789108",
  reasonForVisit: "Toothache",
  transcript: "Patient: my tooth hurts",
};

describe("vapiIntakeWebhookSchema", () => {
  it("accepts a minimal valid payload and applies defaults", () => {
    const result = vapiIntakeWebhookSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.provider).toBe("VAPI");
      expect(result.data.status).toBe("COMPLETED");
      expect(result.data.urgency).toBe("LOW");
    }
  });

  it("normalizes mixed-case enum values", () => {
    const result = vapiIntakeWebhookSchema.safeParse({ ...validPayload, urgency: "high" });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.urgency).toBe("HIGH");
  });

  it("rejects when required externalConversationId is missing", () => {
    const { externalConversationId: _omit, ...rest } = validPayload;
    expect(vapiIntakeWebhookSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects when required transcript is missing", () => {
    const { transcript: _omit, ...rest } = validPayload;
    expect(vapiIntakeWebhookSchema.safeParse(rest).success).toBe(false);
  });
});
