import { NextResponse } from "next/server";

export async function GET() {
  const hasVapiKey = Boolean(process.env.VAPI_API_KEY);

  return NextResponse.json({
    assistantName: "NovaDent AI Assistant",
    status: hasVapiKey ? "ready" : "unconfigured",
    ctaLabel: "Start voice conversation",
  });
}
