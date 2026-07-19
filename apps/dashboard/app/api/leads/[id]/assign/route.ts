import { NextRequest, NextResponse } from "next/server";

import { activityLogsRepository, patientLeadsRepository } from "@novadent/database";
import { leadAssignSchema } from "@novadent/validations";

import { toApiError } from "@/lib/api-errors";
import { getStaffSessionFromCookies } from "@/lib/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = leadAssignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();

  let lead;
  try {
    lead = await patientLeadsRepository.assignLead(id, parsed.data.assignedStaffUserId, session?.id);
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "LEAD_ASSIGNED",
      resourceType: "PatientLead",
      resourceId: id,
      staffUserId: session?.id,
      metadata: { assignedStaffUserId: parsed.data.assignedStaffUserId },
    })
    .catch(() => undefined);

  return NextResponse.json({ lead });
}
