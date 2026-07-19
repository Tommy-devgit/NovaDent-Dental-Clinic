import { NextRequest, NextResponse } from "next/server";

import { activityLogsRepository, appointmentsRepository } from "@novadent/database";
import { appointmentRescheduleSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";
import { toApiError } from "@/lib/api-errors";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = appointmentRescheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();

  let appointment;
  try {
    appointment = await appointmentsRepository.rescheduleAppointment(id, parsed.data.scheduledFor, session?.id);
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "APPOINTMENT_UPDATED",
      resourceType: "Appointment",
      resourceId: id,
      staffUserId: session?.id,
      metadata: { rescheduledTo: parsed.data.scheduledFor },
    })
    .catch(() => undefined);

  return NextResponse.json({ appointment });
}
