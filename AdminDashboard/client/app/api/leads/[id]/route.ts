import { NextRequest, NextResponse } from "next/server";

import { patientLeadsRepository } from "../../../../../../shared/database";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await patientLeadsRepository.getLeadById(id);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ lead });
}
