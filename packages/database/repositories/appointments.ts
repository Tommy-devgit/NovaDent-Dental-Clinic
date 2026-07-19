import { normalizePagination } from "@novadent/utils";

import { prisma } from "../client";
import { decryptLeadRow, encryptLeadWrite } from "../lib/pii";

function decryptApptLead<T extends { lead: Parameters<typeof decryptLeadRow>[0] | null }>(appt: T): T {
  return appt.lead ? { ...appt, lead: decryptLeadRow(appt.lead) } : appt;
}

const ACTIVE_APPOINTMENT_STATUSES = ["SCHEDULED", "CONFIRMED", "RESCHEDULED"] as const;

export const appointmentsRepository = {
  /** Start times of active appointments in [start, end) — used to mask taken slots. */
  async listActiveBetween(start: Date, end: Date) {
    const appointments = await prisma.appointment.findMany({
      where: { scheduledFor: { gte: start, lt: end }, status: { in: ACTIVE_APPOINTMENT_STATUSES as never } },
      select: { scheduledFor: true },
    });
    return appointments.map((appointment) => appointment.scheduledFor);
  },

  /**
   * Create a lead + appointment atomically, rejecting a slot already taken by an active
   * appointment. Throws "SLOT_TAKEN" so the caller can return a friendly 409.
   */
  bookAppointment(input: {
    patientName: string;
    phone: string;
    email?: string;
    reasonForVisit: string;
    isNewPatient?: boolean;
    notes?: string;
    scheduledFor: Date;
  }) {
    return prisma.$transaction(async (tx) => {
      const clash = await tx.appointment.findFirst({
        where: { scheduledFor: input.scheduledFor, status: { in: ACTIVE_APPOINTMENT_STATUSES as never } },
        select: { id: true },
      });
      if (clash) throw new Error("SLOT_TAKEN");

      const lead = await tx.patientLead.create({
        data: encryptLeadWrite({
          patientName: input.patientName,
          phone: input.phone,
          email: input.email,
          reasonForVisit: input.reasonForVisit,
          isNewPatient: input.isNewPatient,
          conversationSummary: input.notes,
          source: "website_booking",
          appointmentRequestedAt: input.scheduledFor,
        }),
      });

      const appointment = await tx.appointment.create({
        data: { leadId: lead.id, scheduledFor: input.scheduledFor, notes: input.notes },
      });

      return { leadId: lead.id, appointmentId: appointment.id };
    });
  },

  async listAppointments() {
    const rows = await prisma.appointment.findMany({
      include: {
        lead: true,
        createdByStaffUser: true,
        updatedByStaffUser: true,
      },
      orderBy: { scheduledFor: "asc" },
    });
    return rows.map(decryptApptLead);
  },

  async listAppointmentsPage(filters: { page?: number; pageSize?: number }) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });
    const rows = await prisma.appointment.findMany({
      include: {
        lead: true,
        createdByStaffUser: true,
        updatedByStaffUser: true,
      },
      orderBy: { scheduledFor: "asc" },
      skip,
      take: pageSize,
    });
    return rows.map(decryptApptLead);
  },

  countAppointments() {
    return prisma.appointment.count();
  },

  async listUpcomingAppointments(limit = 5) {
    const rows = await prisma.appointment.findMany({
      where: {
        scheduledFor: { gte: new Date() },
        status: { in: ["SCHEDULED", "CONFIRMED", "RESCHEDULED"] },
      },
      include: {
        lead: true,
      },
      orderBy: { scheduledFor: "asc" },
      take: limit,
    });
    return rows.map(decryptApptLead);
  },

  async listAppointmentsByStatus(status: string) {
    const rows = await prisma.appointment.findMany({
      where: { status: status as never },
      include: {
        lead: true,
        createdByStaffUser: true,
        updatedByStaffUser: true,
      },
      orderBy: { scheduledFor: "asc" },
    });
    return rows.map(decryptApptLead);
  },

  createAppointment(input: {
    leadId: string;
    conversationLogId?: string;
    scheduledFor: Date;
    durationMinutes?: number;
    notes?: string;
    location?: string;
    createdByStaffUserId?: string;
  }) {
    return prisma.appointment.create({
      data: {
        leadId: input.leadId,
        conversationLogId: input.conversationLogId,
        scheduledFor: input.scheduledFor,
        durationMinutes: input.durationMinutes ?? 30,
        notes: input.notes,
        location: input.location,
        createdByStaffUserId: input.createdByStaffUserId,
      },
    });
  },

  updateAppointmentStatus(id: string, status: string, updatedByStaffUserId?: string) {
    return prisma.appointment.update({
      where: { id },
      data: {
        status: status as never,
        updatedByStaffUserId,
        cancelledAt: status === "CANCELLED" ? new Date() : undefined,
        completedAt: status === "COMPLETED" ? new Date() : undefined,
      },
    });
  },

  rescheduleAppointment(id: string, scheduledFor: Date, updatedByStaffUserId?: string) {
    return prisma.appointment.update({
      where: { id },
      data: {
        scheduledFor,
        status: "RESCHEDULED" as never,
        updatedByStaffUserId,
      },
    });
  },
};