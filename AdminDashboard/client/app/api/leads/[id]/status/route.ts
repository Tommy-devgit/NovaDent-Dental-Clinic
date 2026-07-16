import { NextRequest, NextResponse } from "next/server";

import { patientLeadsRepository } from "../../../../../../../shared/database";
import { patientLeadStatusUpdateSchema } from "../../../../../../../shared/validations/patient-lead";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patientLeadStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const lead = await patientLeadsRepository.updateLeadStatus(id, parsed.data.status, undefined, parsed.data.note);
  return NextResponse.json({ lead });
}
