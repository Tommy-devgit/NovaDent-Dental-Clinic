import { NextRequest, NextResponse } from "next/server";

import {
  activityLogsRepository,
  appointmentsRepository,
  conversationLogsRepository,
  patientLeadsRepository,
} from "@novadent/database";

import { toCsv } from "@/lib/csv";
import { getStaffSessionFromCookies } from "@/lib/session";

const RESOURCES = new Set(["leads", "appointments", "conversations"]);

function fullName(staff: { firstName: string; lastName: string } | null | undefined): string {
  return staff ? `${staff.firstName} ${staff.lastName}` : "";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!RESOURCES.has(resource)) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? undefined;
  const status = url.searchParams.get("status") ?? undefined;
  const urgency = url.searchParams.get("urgency") ?? undefined;
  const session = await getStaffSessionFromCookies();

  let headers: string[];
  let rows: unknown[][];

  if (resource === "leads") {
    const leads = await patientLeadsRepository.exportLeads({ q, status, urgency });
    headers = ["Name", "Phone", "Email", "Reason", "Urgency", "Status", "Source", "New patient", "Assigned to", "Created"];
    rows = leads.map((lead) => [
      lead.patientName,
      lead.phone,
      lead.email,
      lead.reasonForVisit,
      lead.urgency,
      lead.status,
      lead.source,
      lead.isNewPatient,
      fullName(lead.assignedStaffUser),
      lead.createdAt,
    ]);
  } else if (resource === "appointments") {
    const appointments = await appointmentsRepository.listAppointments();
    headers = ["Patient", "Scheduled for", "Duration (min)", "Status", "Location", "Notes", "Created"];
    rows = appointments.map((appointment) => [
      appointment.lead?.patientName ?? "",
      appointment.scheduledFor,
      appointment.durationMinutes,
      appointment.status,
      appointment.location,
      appointment.notes,
      appointment.createdAt,
    ]);
  } else {
    const conversations = await conversationLogsRepository.exportConversations({ status });
    headers = ["Patient", "Provider", "Status", "Duration (s)", "Summary", "Created"];
    rows = conversations.map((conversation) => [
      conversation.lead?.patientName ?? "",
      conversation.provider,
      conversation.status,
      conversation.durationSeconds,
      conversation.summary,
      conversation.createdAt,
    ]);
  }

  const csv = toCsv(headers, rows);

  await activityLogsRepository
    .logActivity({
      action: "DATA_EXPORTED",
      resourceType: resource,
      resourceId: resource,
      staffUserId: session?.id,
      metadata: { count: rows.length },
    })
    .catch(() => undefined);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="novadent-${resource}.csv"`,
    },
  });
}
