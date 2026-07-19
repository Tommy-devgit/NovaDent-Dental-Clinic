import { NextResponse } from "next/server";

import { activityLogsRepository, appointmentsRepository } from "@novadent/database";
import { appointmentUpsertSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";
import { toApiError } from "@/lib/api-errors";

export async function GET() {
  const appointments = await appointmentsRepository.listAppointments();
  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = appointmentUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const session = await getStaffSessionFromCookies();

  let appointment;
  try {
    appointment = await appointmentsRepository.createAppointment({
      ...parsed.data,
      createdByStaffUserId: session?.id,
    });
  } catch (error) {
    return toApiError(error);
  }

  await activityLogsRepository
    .logActivity({
      action: "APPOINTMENT_CREATED",
      resourceType: "Appointment",
      resourceId: appointment.id,
      staffUserId: session?.id,
      metadata: { leadId: appointment.leadId, scheduledFor: appointment.scheduledFor },
    })
    .catch(() => undefined);

  return NextResponse.json({ appointment }, { status: 201 });
}
