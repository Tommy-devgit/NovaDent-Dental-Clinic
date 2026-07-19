import { NextResponse } from "next/server";

import { activityLogsRepository, appointmentsRepository } from "@novadent/database";
import { publicAppointmentBookingSchema } from "@novadent/validations";

import { resolveDaySlots } from "@/lib/availability-service";
import { parseLondonDateTime } from "@/lib/datetime";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { asToolString, formatTime12h, isVapiAuthorized, parseVapiToolCall, vapiResult } from "@/lib/vapi-tool";

export async function POST(request: Request) {
  if (!isVapiAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = await rateLimit(`vapi-book:${getClientIp(request)}`, { limit: 15, windowSeconds: 60 });
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const { toolCallId, args, callerNumber } = parseVapiToolCall(body);

  const date = asToolString(args.date);
  const time = asToolString(args.time);
  if (!date || !time) {
    return vapiResult(toolCallId, "To book I need both the date (YYYY-MM-DD) and the time you offered.");
  }

  const parsed = publicAppointmentBookingSchema.safeParse({
    patientName: asToolString(args.patientName),
    phone: asToolString(args.phone) ?? callerNumber,
    email: asToolString(args.email),
    preferredDate: date,
    preferredTime: time,
    reasonForVisit: asToolString(args.reasonForVisit) ?? "General appointment",
    isNewPatient: typeof args.isNewPatient === "boolean" ? args.isNewPatient : false,
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path.join(".");
    return vapiResult(
      toolCallId,
      `I couldn't book that yet — ${field === "phone" ? "I need a valid UK phone number" : "I still need the patient's full name and reason for visit"}.`,
    );
  }

  const data = parsed.data;
  const scheduledFor = parseLondonDateTime(data.preferredDate, data.preferredTime);
  if (Number.isNaN(scheduledFor.getTime())) {
    return vapiResult(toolCallId, "That date or time wasn't clear. Please confirm them and try again.");
  }

  try {
    const booking = await appointmentsRepository.bookAppointment({
      patientName: data.patientName,
      phone: data.phone,
      email: data.email,
      reasonForVisit: data.reasonForVisit,
      isNewPatient: data.isNewPatient,
      scheduledFor,
    });

    await Promise.all([
      activityLogsRepository.logActivity({
        action: "LEAD_CREATED",
        resourceType: "PatientLead",
        resourceId: booking.leadId,
        metadata: { source: "vapi_booking" },
      }),
      activityLogsRepository.logActivity({
        action: "APPOINTMENT_CREATED",
        resourceType: "Appointment",
        resourceId: booking.appointmentId,
        metadata: { leadId: booking.leadId, scheduledFor, source: "vapi_booking" },
      }),
    ]).catch(() => undefined);

    return vapiResult(
      toolCallId,
      `Booked. ${data.patientName} is confirmed for ${formatTime12h(data.preferredTime)} on ${data.preferredDate}. Confirm this back to the patient and let them know the practice will send a reminder.`,
    );
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_TAKEN") {
      const slots = await resolveDaySlots(date);
      const alts = slots.slice(0, 4).map((slot) => formatTime12h(slot.time)).join(", ");
      return vapiResult(
        toolCallId,
        alts
          ? `That time was just taken. Other times on ${date}: ${alts}. Offer one of these instead.`
          : `That time was just taken and nothing else is free on ${date}. Suggest another day.`,
      );
    }
    return vapiResult(toolCallId, "Sorry, I couldn't complete the booking just now. Please try again in a moment.");
  }
}
