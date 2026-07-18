import { prisma } from "../client";

export const appointmentsRepository = {
  listAppointments() {
    return prisma.appointment.findMany({
      include: {
        lead: true,
        createdByStaffUser: true,
        updatedByStaffUser: true,
      },
      orderBy: { scheduledFor: "asc" },
    });
  },

  listUpcomingAppointments(limit = 5) {
    return prisma.appointment.findMany({
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
  },

  listAppointmentsByStatus(status: string) {
    return prisma.appointment.findMany({
      where: { status: status as never },
      include: {
        lead: true,
        createdByStaffUser: true,
        updatedByStaffUser: true,
      },
      orderBy: { scheduledFor: "asc" },
    });
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