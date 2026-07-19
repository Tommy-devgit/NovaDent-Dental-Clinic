import { NextRequest, NextResponse } from "next/server";

import { activityLogsRepository, patientLeadsRepository } from "@novadent/database";
import { patientLeadStatusUpdateSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";
import { toApiError } from "@/lib/api-errors";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patientLeadStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();

  let lead;
  try {
    lead = await patientLeadsRepository.updateLeadStatus(id, parsed.data.status, session?.id, parsed.data.note);
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "STATUS_CHANGED",
      resourceType: "PatientLead",
      resourceId: id,
      staffUserId: session?.id,
      metadata: { status: parsed.data.status, note: parsed.data.note },
    })
    .catch(() => undefined);

  return NextResponse.json({ lead });
}
