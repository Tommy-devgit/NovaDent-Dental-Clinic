import { NextResponse } from "next/server";

import {
  activityLogsRepository,
  appointmentsRepository,
  conversationLogsRepository,
  patientLeadsRepository,
} from "@novadent/database";
import { bookAppointmentToolArgsSchema, vapiToolCallWebhookSchema } from "@novadent/validations";

function isAuthorized(request: Request) {
  const expected = process.env.VAPI_TOOL_SECRET;
  if (!expected) return false;
  return request.headers.get("x-vapi-secret") === expected;
}

async function ensureConversationLog(externalConversationId: string, leadId: string) {
  const existing = await conversationLogsRepository.findByExternalConversationId(externalConversationId);
  if (existing) return existing;

  return conversationLogsRepository.createConversationLog({
    leadId,
    provider: "VAPI",
    externalConversationId,
    status: "IN_PROGRESS",
    transcript: "(conversation in progress)",
  });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = vapiToolCallWebhookSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }

  const { call, chat, toolCallList } = parsed.data.message;
  const externalConversationId = call?.id ?? chat?.id;

  const results = await Promise.all(
    toolCallList.map(async (toolCall) => {
      if (toolCall.name !== "book_appointment") {
        return { toolCallId: toolCall.id, result: `Unknown tool: ${toolCall.name}` };
      }

      const argsParsed = bookAppointmentToolArgsSchema.safeParse(toolCall.arguments ?? toolCall.parameters ?? {});

      if (!argsParsed.success) {
        const firstIssue = argsParsed.error.issues[0];
        return {
          toolCallId: toolCall.id,
          result: `Missing or invalid ${firstIssue?.path.join(".") ?? "field"}: ${firstIssue?.message ?? "please ask the patient again and retry."}`,
        };
      }

      const args = argsParsed.data;
      const scheduledFor = new Date(`${args.preferredDate}T${args.preferredTime}`);

      if (Number.isNaN(scheduledFor.getTime())) {
        return {
          toolCallId: toolCall.id,
          result: "The date or time couldn't be understood. Please ask the patient to confirm a specific date and time and try again.",
        };
      }

      if (!externalConversationId) {
        return { toolCallId: toolCall.id, result: "Could not identify the active conversation. Please try again." };
      }

      const lead = await patientLeadsRepository.upsertLeadFromAutomation({
        patientName: args.patientName,
        phone: args.phone,
        email: args.email,
        reasonForVisit: args.reasonForVisit,
        isNewPatient: args.isNewPatient,
        transcript: "(conversation in progress)",
        summary: args.notes,
        vapiConversationId: externalConversationId,
        appointmentRequestedAt: scheduledFor,
      });

      const conversationLog = await ensureConversationLog(externalConversationId, lead.id);

      const appointment = await appointmentsRepository.createAppointment({
        leadId: lead.id,
        conversationLogId: conversationLog.id,
        scheduledFor,
        notes: args.notes,
      });

      await Promise.all([
        activityLogsRepository.logActivity({
          action: "LEAD_CREATED",
          resourceType: "PatientLead",
          resourceId: lead.id,
          metadata: { source: "ai_assistant" },
        }),
        activityLogsRepository.logActivity({
          action: "APPOINTMENT_CREATED",
          resourceType: "Appointment",
          resourceId: appointment.id,
          metadata: { leadId: lead.id, scheduledFor, source: "ai_assistant" },
        }),
      ]).catch(() => undefined);

      const formattedDate = scheduledFor.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      const formattedTime = scheduledFor.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

      return {
        toolCallId: toolCall.id,
        result: `Thank you, ${args.patientName}. Your appointment request for ${formattedDate} at ${formattedTime} has been submitted. Our front desk will confirm shortly.`,
      };
    }),
  );

  return NextResponse.json({ results });
}
