import { NextResponse } from "next/server";

export interface VapiToolCall {
  toolCallId?: string;
  args: Record<string, unknown>;
  callerNumber?: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

/** Vapi tools authenticate with the same shared bearer secret as the intake webhook. */
export function isVapiAuthorized(request: Request): boolean {
  const expected = process.env.N8N_WEBHOOK_SECRET;
  if (!expected) return false;
  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return provided === expected;
}

/** Pull the tool-call id, parsed arguments, and inbound caller number from Vapi's envelope. */
export function parseVapiToolCall(body: unknown): VapiToolCall {
  const message = asRecord(asRecord(body)?.message);
  const call = asRecord(message?.call);
  const customer = asRecord(call?.customer);
  const callerNumber = typeof customer?.number === "string" ? customer.number : undefined;

  const list = message?.toolCallList;
  if (Array.isArray(list)) {
    for (const entry of list) {
      const rec = asRecord(entry);
      if (!rec) continue;
      const rawArgs = rec.arguments ?? asRecord(rec.function)?.arguments;
      let args: Record<string, unknown> = {};
      if (typeof rawArgs === "string") {
        try {
          args = JSON.parse(rawArgs) as Record<string, unknown>;
        } catch {
          args = {};
        }
      } else {
        args = asRecord(rawArgs) ?? {};
      }
      return { toolCallId: typeof rec.id === "string" ? rec.id : undefined, args, callerNumber };
    }
  }
  return { args: {}, callerNumber };
}

/** Vapi requires the tool-call id echoed in a {results:[…]} envelope, else it logs no result. */
export function vapiResult(toolCallId: string | undefined, result: string) {
  return NextResponse.json({ results: [{ toolCallId: toolCallId ?? "", result }] }, { status: 200 });
}

export function asToolString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

/** "09:30" → "9:30am" for natural speech. */
export function formatTime12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h < 12 ? "am" : "pm";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")}${period}`;
}
