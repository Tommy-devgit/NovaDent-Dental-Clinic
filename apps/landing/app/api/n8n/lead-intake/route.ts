import { NextResponse } from "next/server";

import {
  activityLogsRepository,
  appointmentsRepository,
  conversationLogsRepository,
  patientLeadsRepository,
} from "@novadent/database";
import type { Prisma } from "@novadent/database";
import { normalizeVapiIntake, vapiIntakeWebhookSchema } from "@novadent/validations";

import { getClientIp, rateLimit } from "@/lib/rate-limit";

function isAuthorized(request: Request) {
  const expected = process.env.N8N_WEBHOOK_SECRET;

  if (!expected) {
    return false;
  }

  const provided = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return provided === expected;
}

/** Vapi custom tools require the tool-call id echoed back in a {results:[...]} envelope. */
function extractToolCallId(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null) return undefined;
  const message = (body as { message?: unknown }).message;
  if (typeof message !== "object" || message === null) return undefined;
  const list = (message as { toolCallList?: unknown }).toolCallList;
  if (!Array.isArray(list)) return undefined;
  for (const call of list) {
    if (typeof call === "object" && call !== null && typeof (call as { id?: unknown }).id === "string") {
      return (call as { id: string }).id;
    }
  }
  return undefined;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await rateLimit(`intake:${getClientIp(request)}`, { limit: 120, windowSeconds: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = vapiIntakeWebhookSchema.safeParse(normalizeVapiIntake(body));

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

  const activityLogPromises = [
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
  ];

  // Only the lead carried an appointmentRequestedAt before this — nothing ever turned it into
  // an actual Appointment row, so voice/chat-driven booking never showed up on the calendar.
  let appointmentId: string | undefined;
  const hasExistingAppointment = existingLead
    ? await patientLeadsRepository.getLeadById(existingLead.id).then((full) => (full?.appointments.length ?? 0) > 0)
    : false;

  if (data.appointmentRequestedAt && !hasExistingAppointment) {
    const appointment = await appointmentsRepository.createAppointment({
      leadId: lead.id,
      conversationLogId: conversationLog.id,
      scheduledFor: data.appointmentRequestedAt,
      notes: data.summary,
    });
    appointmentId = appointment.id;

    activityLogPromises.push(
      activityLogsRepository.logActivity({
        action: "APPOINTMENT_CREATED",
        resourceType: "Appointment",
        resourceId: appointment.id,
        metadata: { leadId: lead.id, scheduledFor: data.appointmentRequestedAt, source: "vapi" },
      }),
    );
  }

  await Promise.all(activityLogPromises).catch(() => undefined);

  // A Vapi tool call needs the result echoed in its own envelope, or the assistant logs
  // "No result returned" and can't confirm the booking on the call. Direct/n8n callers
  // (no toolCallId) keep the plain lead payload.
  const toolCallId = extractToolCallId(body);
  if (toolCallId) {
    const result = appointmentId
      ? "Appointment request received. The practice will call to confirm shortly."
      : "Your details are saved. The practice will be in touch shortly.";
    return NextResponse.json({ results: [{ toolCallId, result }] }, { status: 200 });
  }

  return NextResponse.json({ leadId: lead.id, conversationLogId: conversationLog.id, appointmentId }, { status: 201 });
}
