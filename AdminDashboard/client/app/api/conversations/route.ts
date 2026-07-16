import { NextResponse } from "next/server";

import { conversationLogsRepository } from "../../../../../shared/database";

export async function GET() {
  const conversations = await conversationLogsRepository.listConversations();
  return NextResponse.json({ conversations });
}
