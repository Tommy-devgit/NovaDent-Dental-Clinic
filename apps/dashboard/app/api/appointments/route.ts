import { NextResponse } from "next/server";

import { appointmentsRepository } from "@novadent/database";
import { appointmentUpsertSchema } from "@novadent/validations";

import { getStaffSessionFromCookies } from "@/lib/session";

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
  const appointment = await appointmentsRepository.createAppointment({
    ...parsed.data,
    createdByStaffUserId: session?.id,
  });
  return NextResponse.json({ appointment }, { status: 201 });
}
