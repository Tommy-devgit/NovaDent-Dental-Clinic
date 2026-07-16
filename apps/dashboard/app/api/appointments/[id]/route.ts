import { NextRequest, NextResponse } from "next/server";

import { appointmentsRepository } from "@novadent/database";
import { appointmentStatusUpdateSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = appointmentStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();
  const appointment = await appointmentsRepository.updateAppointmentStatus(id, parsed.data.status, session?.id);
  return NextResponse.json({ appointment });
}
