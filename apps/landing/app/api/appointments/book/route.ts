import { NextResponse } from "next/server";

import { activityLogsRepository, appointmentsRepository, patientLeadsRepository } from "@novadent/database";
import { publicAppointmentBookingSchema } from "@novadent/validations";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = publicAppointmentBookingSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Invalid payload";
    return NextResponse.json({ error: message, issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const scheduledFor = new Date(`${data.preferredDate}T${data.preferredTime}`);

  if (Number.isNaN(scheduledFor.getTime())) {
    return NextResponse.json({ error: "That date or time doesn't look right — please double check it." }, { status: 400 });
  }

  // Generous grace window: this is a *preferred* time subject to staff confirmation, and the
  // client's local "today" can legitimately differ from the server's by up to a day depending
  // on timezone, so we only reject dates that are unambiguously in the past.
  const oneDayMs = 24 * 60 * 60 * 1000;
  if (scheduledFor.getTime() < Date.now() - oneDayMs) {
    return NextResponse.json({ error: "Please choose a date that isn't in the past." }, { status: 400 });
  }

  const lead = await patientLeadsRepository.createLeadFromBooking({
    patientName: data.patientName,
    phone: data.phone,
    email: data.email,
    reasonForVisit: data.reasonForVisit,
    isNewPatient: data.isNewPatient,
    notes: data.notes,
    appointmentRequestedAt: scheduledFor,
  });

  const appointment = await appointmentsRepository.createAppointment({
    leadId: lead.id,
    scheduledFor,
    notes: data.notes,
  });

  await Promise.all([
    activityLogsRepository.logActivity({
      action: "LEAD_CREATED",
      resourceType: "PatientLead",
      resourceId: lead.id,
      metadata: { source: "website_booking" },
    }),
    activityLogsRepository.logActivity({
      action: "APPOINTMENT_CREATED",
      resourceType: "Appointment",
      resourceId: appointment.id,
      metadata: { leadId: lead.id, scheduledFor },
    }),
  ]).catch(() => undefined);

  return NextResponse.json({ leadId: lead.id, appointmentId: appointment.id }, { status: 201 });
}
