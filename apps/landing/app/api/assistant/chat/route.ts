import { NextResponse } from "next/server";

import { assistantChatRequestSchema } from "@novadent/validations";

import { getVapiPrivateKey, vapiServerFetch } from "@/lib/vapi-server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

interface VapiChatOutputMessage {
  role?: string;
  content?: string;
}

interface VapiChatResponse {
  id: string;
  output?: VapiChatOutputMessage[];
}

/**
 * n8n is the preferred path when configured: it sidesteps Vapi's separate Chat-product
 * billing gate entirely (Voice and Chat are billed separately on Vapi, so having Voice
 * working doesn't mean Chat will). The n8n workflow owns its own AI Agent + memory, keyed
 * by our sessionId, and must respond with JSON shaped like { "reply": "<assistant text>" }.
 */
async function callN8nChat(webhookUrl: string, message: string, sessionId: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.N8N_CHAT_WEBHOOK_SECRET;
  if (secret) {
    headers.Authorization = `Bearer ${secret}`;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`n8n chat webhook responded ${response.status}: ${text}`);
  }

  const data = (await response.json().catch(() => null)) as { reply?: unknown } | null;
  if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
    throw new Error("n8n chat webhook did not return a non-empty `reply` string");
  }

  return data.reply;
}

async function callVapiChat(message: string, previousChatId: string | undefined) {
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  if (!assistantId) {
    throw new Error("NEXT_PUBLIC_VAPI_ASSISTANT_ID is not set");
  }

  const response = await vapiServerFetch("/chat", {
    method: "POST",
    body: JSON.stringify({ assistantId, input: message, previousChatId }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Vapi chat request failed ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as VapiChatResponse;
  const reply = (data.output ?? [])
    .filter((entry) => entry.role === "assistant" && entry.content)
    .map((entry) => entry.content)
    .join("\n\n");

  return { chatId: data.id, reply: reply || "I'm not sure how to respond to that — could you rephrase?" };
}

export async function POST(request: Request) {
  const limit = await rateLimit(`chat:${getClientIp(request)}`, { limit: 20, windowSeconds: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assistantChatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { message, sessionId, previousChatId } = parsed.data;
  const n8nWebhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;

  if (n8nWebhookUrl) {
    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    try {
      const reply = await callN8nChat(n8nWebhookUrl, message, sessionId);
      return NextResponse.json({ chatId: sessionId, reply });
    } catch (error) {
      console.error("n8n chat request failed", error);
      return NextResponse.json({ error: "The assistant couldn't respond right now. Please try again." }, { status: 502 });
    }
  }

  if (!getVapiPrivateKey()) {
    return NextResponse.json(
      { error: "The chat assistant isn't configured yet. Please use the contact form instead." },
      { status: 503 },
    );
  }

  try {
    const result = await callVapiChat(message, previousChatId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Vapi chat request errored", error);
    return NextResponse.json({ error: "The assistant couldn't respond right now. Please try again." }, { status: 502 });
  }
}
