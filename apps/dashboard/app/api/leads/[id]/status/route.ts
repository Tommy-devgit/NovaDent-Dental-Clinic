import { NextRequest, NextResponse } from "next/server";

import { patientLeadsRepository } from "@novadent/database";
import { patientLeadStatusUpdateSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = patientLeadStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();
  const lead = await patientLeadsRepository.updateLeadStatus(id, parsed.data.status, session?.id, parsed.data.note);
  return NextResponse.json({ lead });
}
