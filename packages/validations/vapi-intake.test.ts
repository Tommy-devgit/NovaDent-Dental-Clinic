import { describe, expect, it } from "vitest";

import { mapVapiUrgency, normalizeVapiIntake } from "./vapi-intake";
import { vapiIntakeWebhookSchema } from "./vapi";

const toolArguments = {
  patient: { fullName: "Jane Smith", phone: "07863789108", email: "jane@example.com", isNewPatient: true },
  request: { urgency: "emergency", reasonForVisit: "Severe toothache", symptoms: "Swelling" },
  conversationSummary: "Patient in pain, wants urgent appointment.",
  callbackConsent: true,
};

const vapiEnvelope = {
  message: {
    type: "tool-calls",
    toolCallList: [{ id: "toolu_1", name: "NovaDentIntakeWebhook", arguments: toolArguments }],
    call: { id: "call_abc" },
    artifact: {
      messages: [
        { role: "user", message: "My tooth really hurts" },
        { role: "assistant", message: "I'm sorry to hear that" },
      ],
    },
  },
};

describe("mapVapiUrgency", () => {
  it("maps Vapi urgency vocabulary to lead urgency", () => {
    expect(mapVapiUrgency("emergency")).toBe("URGENT");
    expect(mapVapiUrgency("urgent")).toBe("HIGH");
    expect(mapVapiUrgency("routine")).toBe("LOW");
    expect(mapVapiUrgency("not_sure")).toBe("LOW");
  });

  it("passes through already-valid lead urgency and defaults unknowns", () => {
    expect(mapVapiUrgency("HIGH")).toBe("HIGH");
    expect(mapVapiUrgency("whatever")).toBe("LOW");
    expect(mapVapiUrgency(undefined)).toBe("LOW");
  });
});

describe("normalizeVapiIntake", () => {
  it("flattens a full Vapi tool-call envelope into the intake schema and validates", () => {
    const parsed = vapiIntakeWebhookSchema.safeParse(normalizeVapiIntake(vapiEnvelope));
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.externalConversationId).toBe("call_abc");
    expect(parsed.data.patientName).toBe("Jane Smith");
    expect(parsed.data.phone).toBe("07863789108");
    expect(parsed.data.reasonForVisit).toBe("Severe toothache");
    expect(parsed.data.urgency).toBe("URGENT");
    expect(parsed.data.summary).toBe("Patient in pain, wants urgent appointment.");
    expect(parsed.data.transcript).toContain("tooth really hurts");
    expect(parsed.data.metadata?.callbackConsent).toBe(true);
  });

  it("falls back to the inbound caller number when the tool omits patient.phone", () => {
    const noPhone = {
      message: {
        toolCallList: [
          {
            id: "t",
            arguments: {
              patient: { fullName: "Mahbhir Mahnud", email: "m@icloud.com", isNewPatient: true },
              request: { urgency: "routine", reasonForVisit: "Routine checkup" },
              conversationSummary: "New patient, routine checkup.",
            },
          },
        ],
        call: { id: "call_inbound", customer: { number: "+447519196325" } },
      },
    };
    const parsed = vapiIntakeWebhookSchema.safeParse(normalizeVapiIntake(noPhone));
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.phone).toBe("+447519196325");
  });

  it("falls back to the summary for transcript when no artifact messages exist", () => {
    const noMessages = { message: { toolCallList: [{ id: "t", arguments: toolArguments }], call: { id: "c1" } } };
    const parsed = vapiIntakeWebhookSchema.safeParse(normalizeVapiIntake(noMessages));
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.transcript).toBe(toolArguments.conversationSummary);
  });

  it("accepts nested tool arguments with n8n-injected context fields", () => {
    const nested = { ...toolArguments, externalConversationId: "call_xyz", transcript: "full transcript here" };
    const parsed = vapiIntakeWebhookSchema.safeParse(normalizeVapiIntake(nested));
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.externalConversationId).toBe("call_xyz");
      expect(parsed.data.patientName).toBe("Jane Smith");
    }
  });

  it("passes an already-flat payload through unchanged", () => {
    const flat = {
      externalConversationId: "call_flat",
      patientName: "Bob Jones",
      phone: "07123456789",
      reasonForVisit: "Checkup",
      transcript: "Patient: hi",
    };
    const parsed = vapiIntakeWebhookSchema.safeParse(normalizeVapiIntake(flat));
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.patientName).toBe("Bob Jones");
  });
});
