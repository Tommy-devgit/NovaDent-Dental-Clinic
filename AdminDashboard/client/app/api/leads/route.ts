import { NextResponse } from "next/server";

import { patientLeadsRepository } from "../../../../../shared/database";
import { patientLeadFiltersSchema } from "../../../../../shared/validations/patient-lead";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = patientLeadFiltersSchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    urgency: searchParams.get("urgency") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid filters" }, { status: 400 });
  }

  const leads = await patientLeadsRepository.listLeads(parsed.data);
  return NextResponse.json({ leads });
}
