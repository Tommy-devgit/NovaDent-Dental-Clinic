import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    assistantName: "NovaDent AI Assistant",
    status: "Connected to Vapi workflow",
    ctaLabel: "Start voice conversation",
  });
}