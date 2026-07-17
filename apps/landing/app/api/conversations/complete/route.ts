import { NextResponse } from "next/server";

import { activityLogsRepository, conversationLogsRepository, patientLeadsRepository } from "@novadent/database";
import { conversationCompletionSchema } from "@novadent/validations";

function buildTranscriptText(transcript: { role: "user" | "assistant"; text: string }[]) {
  return transcript.map((entry) => `${entry.role === "user" ? "Patient" : "Assistant"}: ${entry.text}`).join("\n");
}

function firstUserMessage(transcript: { role: "user" | "assistant"; text: string }[]) {
  const first = transcript.find((entry) => entry.role === "user");
  return first ? first.text.slice(0, 300) : "General inquiry via AI assistant";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = conversationCompletionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const data = parsed.data;
  const transcriptText = buildTranscriptText(data.transcript);
  const durationSeconds =
    data.startedAt && data.endedAt
      ? Math.max(0, Math.round((data.endedAt.getTime() - data.startedAt.getTime()) / 1000))
      : undefined;

  const existingLead = await patientLeadsRepository.findByVapiConversationId(data.externalConversationId);

  const lead = await patientLeadsRepository.upsertLeadFromAutomation({
    patientName: existingLead?.patientName ?? "Website visitor",
    phone: existingLead?.phone ?? "Not provided",
    reasonForVisit: existingLead?.reasonForVisit ?? firstUserMessage(data.transcript),
    transcript: transcriptText,
    vapiConversationId: data.externalConversationId,
  });

  const conversationLog = await conversationLogsRepository.upsertConversationLog({
    leadId: lead.id,
    provider: "VAPI",
    externalConversationId: data.externalConversationId,
    status: "COMPLETED",
    durationSeconds,
    transcript: transcriptText,
    startedAt: data.startedAt,
    endedAt: data.endedAt,
  });

  await Promise.all([
    activityLogsRepository.logActivity({
      action: existingLead ? "LEAD_UPDATED" : "LEAD_CREATED",
      resourceType: "PatientLead",
      resourceId: lead.id,
      metadata: { source: "website_chat" },
    }),
    activityLogsRepository.logActivity({
      action: "CONVERSATION_ENDED",
      resourceType: "ConversationLog",
      resourceId: conversationLog.id,
      metadata: { leadId: lead.id },
    }),
  ]).catch(() => undefined);

  return NextResponse.json({ leadId: lead.id, conversationLogId: conversationLog.id }, { status: 201 });
}
