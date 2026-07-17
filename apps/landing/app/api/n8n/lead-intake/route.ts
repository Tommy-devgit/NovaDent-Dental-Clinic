import { NextResponse } from "next/server";

import { activityLogsRepository, conversationLogsRepository, patientLeadsRepository } from "@novadent/database";
import type { Prisma } from "@novadent/database";
import { vapiIntakeWebhookSchema } from "@novadent/validations";

function isAuthorized(request: Request) {
  const expected = process.env.N8N_WEBHOOK_SECRET;

  if (!expected) {
    return false;
  }

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return provided === expected;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = vapiIntakeWebhookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  const existingLead = await patientLeadsRepository.findByVapiConversationId(data.externalConversationId);

  const lead = await patientLeadsRepository.upsertLeadFromAutomation({
    patientName: data.patientName,
    phone: data.phone,
    email: data.email,
    reasonForVisit: data.reasonForVisit,
    symptoms: data.symptoms,
    urgency: data.urgency,
    transcript: data.transcript,
    summary: data.summary,
    vapiConversationId: data.externalConversationId,
    n8nExecutionId: data.n8nExecutionId,
    appointmentRequestedAt: data.appointmentRequestedAt,
  });

  const durationSeconds =
    data.durationSeconds ??
    (data.startedAt && data.endedAt
      ? Math.max(0, Math.round((data.endedAt.getTime() - data.startedAt.getTime()) / 1000))
      : undefined);

  const conversationLog = await conversationLogsRepository.upsertConversationLog({
    leadId: lead.id,
    provider: data.provider,
    externalConversationId: data.externalConversationId,
    assistantId: data.assistantId,
    status: data.status,
    durationSeconds,
    summary: data.summary,
    transcript: data.transcript,
    metadata: data.metadata as Prisma.InputJsonValue | undefined,
    startedAt: data.startedAt,
    endedAt: data.endedAt,
  });

  await Promise.all([
    activityLogsRepository.logActivity({
      action: existingLead ? "LEAD_UPDATED" : "LEAD_CREATED",
      resourceType: "PatientLead",
      resourceId: lead.id,
      metadata: { source: "vapi", conversationId: data.externalConversationId },
    }),
    activityLogsRepository.logActivity({
      action: data.status === "IN_PROGRESS" ? "CONVERSATION_STARTED" : "CONVERSATION_ENDED",
      resourceType: "ConversationLog",
      resourceId: conversationLog.id,
      metadata: { leadId: lead.id },
    }),
  ]).catch(() => undefined);

  return NextResponse.json({ leadId: lead.id, conversationLogId: conversationLog.id }, { status: 201 });
}
