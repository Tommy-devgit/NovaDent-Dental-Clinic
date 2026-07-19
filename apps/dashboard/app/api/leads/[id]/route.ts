import { NextRequest, NextResponse } from "next/server";

import { activityLogsRepository, patientLeadsRepository } from "@novadent/database";
import { leadUpdateDetailsSchema } from "@novadent/validations";

import { toApiError } from "@/lib/api-errors";
import { getStaffSessionFromCookies } from "@/lib/session";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await patientLeadsRepository.getLeadById(id);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getStaffSessionFromCookies();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leadUpdateDetailsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  let lead;
  try {
    lead = await patientLeadsRepository.updateLeadDetails(id, parsed.data, session.id);
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "LEAD_UPDATED_DETAILS",
      resourceType: "PatientLead",
      resourceId: id,
      staffUserId: session.id,
      // Field names only — never log PII values.
      metadata: { fields: Object.keys(parsed.data) },
    })
    .catch(() => undefined);

  return NextResponse.json({ lead });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getStaffSessionFromCookies();
  if (session?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let result;
  try {
    result = await patientLeadsRepository.eraseLead(id);
  } catch (error) {
    return toApiError(error);
  }

  if (!result) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  await activityLogsRepository
    .logActivity({
      action: "LEAD_ERASED",
      resourceType: "PatientLead",
      resourceId: id,
      staffUserId: session.id,
      metadata: {
        appointmentsRemoved: result.appointmentsRemoved,
        conversationsRemoved: result.conversationsRemoved,
      },
    })
    .catch(() => undefined);

  return NextResponse.json({ ok: true, ...result });
}
