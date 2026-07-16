import { NextRequest, NextResponse } from "next/server";

import { appointmentsRepository } from "@novadent/database";
import { appointmentRescheduleSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = appointmentRescheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();
  const appointment = await appointmentsRepository.rescheduleAppointment(id, parsed.data.scheduledFor, session?.id);
  return NextResponse.json({ appointment });
}
