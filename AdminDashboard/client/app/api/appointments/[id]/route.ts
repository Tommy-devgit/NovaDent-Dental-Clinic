import { NextRequest, NextResponse } from "next/server";

import { appointmentsRepository } from "../../../../../../shared/database";
import { appointmentStatusUpdateSchema } from "../../../../../../shared/validations/appointment";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = appointmentStatusUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const appointment = await appointmentsRepository.updateAppointmentStatus(id, parsed.data.status, undefined);
  return NextResponse.json({ appointment });
}
