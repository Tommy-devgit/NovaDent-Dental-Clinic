import { describe, expect, it } from "vitest";

import { formatTime12h, parseVapiToolCall } from "./vapi-tool";

describe("parseVapiToolCall", () => {
  it("extracts id, object arguments, caller number, and call id", () => {
    const { toolCallId, args, callerNumber, callId } = parseVapiToolCall({
      message: {
        toolCallList: [{ id: "call_1", arguments: { date: "2026-07-22", time: "10:00" } }],
        call: { id: "vapi_call_1", customer: { number: "+447519196325" } },
      },
    });
    expect(toolCallId).toBe("call_1");
    expect(args.date).toBe("2026-07-22");
    expect(callerNumber).toBe("+447519196325");
    expect(callId).toBe("vapi_call_1");
  });

  it("parses JSON-string arguments", () => {
    const { args } = parseVapiToolCall({
      message: { toolCallList: [{ id: "c", arguments: '{"date":"2026-07-22"}' }] },
    });
    expect(args.date).toBe("2026-07-22");
  });

  it("returns empty args when the envelope has no tool call", () => {
    expect(parseVapiToolCall({}).args).toEqual({});
  });
});

describe("formatTime12h", () => {
  it("formats 24h times for speech", () => {
    expect(formatTime12h("09:30")).toBe("9:30am");
    expect(formatTime12h("13:00")).toBe("1:00pm");
    expect(formatTime12h("00:00")).toBe("12:00am");
    expect(formatTime12h("12:15")).toBe("12:15pm");
  });
});
