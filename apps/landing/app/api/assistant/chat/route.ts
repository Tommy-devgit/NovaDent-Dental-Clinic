import { NextResponse } from "next/server";

import { assistantChatRequestSchema } from "@novadent/validations";

import { getVapiPrivateKey, vapiServerFetch } from "@/lib/vapi-server";

interface VapiChatOutputMessage {
  role?: string;
  content?: string;
}

interface VapiChatResponse {
  id: string;
  output?: VapiChatOutputMessage[];
}

export async function POST(request: Request) {
  if (!getVapiPrivateKey()) {
    return NextResponse.json(
      { error: "The chat assistant isn't configured yet. Please use the contact form instead." },
      { status: 503 },
    );
  }

  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
  if (!assistantId) {
    return NextResponse.json({ error: "No assistant is configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = assistantChatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { message, previousChatId } = parsed.data;

  try {
    const response = await vapiServerFetch("/chat", {
      method: "POST",
      body: JSON.stringify({
        assistantId,
        input: message,
        previousChatId,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Vapi chat request failed", response.status, errorBody);
      return NextResponse.json({ error: "The assistant couldn't respond right now. Please try again." }, { status: 502 });
    }

    const data = (await response.json()) as VapiChatResponse;
    const reply = (data.output ?? [])
      .filter((entry) => entry.role === "assistant" && entry.content)
      .map((entry) => entry.content)
      .join("\n\n");

    return NextResponse.json({
      chatId: data.id,
      reply: reply || "I'm not sure how to respond to that — could you rephrase?",
    });
  } catch (error) {
    console.error("Vapi chat request errored", error);
    return NextResponse.json({ error: "The assistant couldn't respond right now. Please try again." }, { status: 502 });
  }
}
