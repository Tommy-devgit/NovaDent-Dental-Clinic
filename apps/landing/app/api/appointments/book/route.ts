import { NextResponse } from "next/server";

import { activityLogsRepository, appointmentsRepository, patientLeadsRepository } from "@novadent/database";
import { publicAppointmentBookingSchema } from "@novadent/validations";

import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { parseLondonDateTime } from "@/lib/datetime";

export async function POST(request: Request) {
  const limit = await rateLimit(`book:${getClientIp(request)}`, { limit: 5, windowSeconds: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = publicAppointmentBookingSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const message = firstIssue ? `${firstIssue.path.join(".")}: ${firstIssue.message}` : "Invalid payload";
    return NextResponse.json({ error: message, issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const scheduledFor = parseLondonDateTime(data.preferredDate, data.preferredTime);

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

  // ponytail: non-atomic (a lead can persist without its appointment). Phase 3 rebuilds
  // this against real-time availability with a single $transaction + unique-slot constraint.
  let lead;
  let appointment;
  try {
    lead = await patientLeadsRepository.createLeadFromBooking({
      patientName: data.patientName,
      phone: data.phone,
      email: data.email,
      reasonForVisit: data.reasonForVisit,
      isNewPatient: data.isNewPatient,
      notes: data.notes,
      appointmentRequestedAt: scheduledFor,
    });

    appointment = await appointmentsRepository.createAppointment({
      leadId: lead.id,
      scheduledFor,
      notes: data.notes,
    });
  } catch {
    return NextResponse.json({ error: "We couldn't save your request. Please try again." }, { status: 500 });
  }

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
