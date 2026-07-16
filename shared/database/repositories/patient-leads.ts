import { prisma } from "../client";
import { normalizePagination } from "../../utils/pagination";

export const patientLeadsRepository = {
  getOverviewMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.$transaction(async (transaction) => {
      const [totalLeads, newLeads, contactedLeads, urgentCases, appointmentsToday] = await Promise.all([
        transaction.patientLead.count(),
        transaction.patientLead.count({ where: { status: "NEW" } }),
        transaction.patientLead.count({ where: { status: "CONTACTED" } }),
        transaction.patientLead.count({ where: { urgency: { in: ["HIGH", "URGENT"] } } }),
        transaction.appointment.count({
          where: {
            scheduledFor: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            status: { in: ["SCHEDULED", "CONFIRMED", "RESCHEDULED"] },
          },
        }),
      ]);

      return {
        totalLeads,
        newLeads,
        contactedLeads,
        urgentCases,
        appointmentsToday,
      };
    });
  },

  listLeads(filters: { q?: string; status?: string; urgency?: string; page?: number; pageSize?: number }) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });

    return prisma.patientLead.findMany({
      where: {
        status: filters.status ? (filters.status as never) : undefined,
        urgency: filters.urgency ? (filters.urgency as never) : undefined,
        OR: filters.q
          ? [
              { patientName: { contains: filters.q, mode: "insensitive" } },
              { phone: { contains: filters.q, mode: "insensitive" } },
              { email: { contains: filters.q, mode: "insensitive" } },
              { reasonForVisit: { contains: filters.q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        assignedStaffUser: true,
        appointments: {
          orderBy: { scheduledFor: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });
  },

  getLeadById(id: string) {
    return prisma.patientLead.findUnique({
      where: { id },
      include: {
        assignedStaffUser: true,
        updatedByStaffUser: true,
        appointments: {
          orderBy: { scheduledFor: "desc" },
          include: {
            createdByStaffUser: true,
            updatedByStaffUser: true,
          },
        },
        conversationLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  updateLeadStatus(id: string, status: string, updatedByStaffUserId?: string, note?: string) {
    return prisma.patientLead.update({
      where: { id },
      data: {
        status: status as never,
        updatedByStaffUserId,
        conversationSummary: note ? note : undefined,
      },
    });
  },

  upsertLeadFromAutomation(payload: {
    externalLeadId?: string;
    patientName: string;
    phone: string;
    email?: string;
    reasonForVisit: string;
    symptoms?: string;
    urgency?: string;
    transcript: string;
    summary?: string;
    vapiConversationId: string;
    n8nExecutionId?: string;
    appointmentRequestedAt?: Date;
  }) {
    return prisma.patientLead.upsert({
      where: { vapiConversationId: payload.vapiConversationId },
      create: {
        patientName: payload.patientName,
        phone: payload.phone,
        email: payload.email,
        reasonForVisit: payload.reasonForVisit,
        symptoms: payload.symptoms,
        urgency: (payload.urgency as never) ?? "LOW",
        transcript: payload.transcript,
        conversationSummary: payload.summary,
        vapiConversationId: payload.vapiConversationId,
        n8nExecutionId: payload.n8nExecutionId,
        appointmentRequestedAt: payload.appointmentRequestedAt,
      },
      update: {
        patientName: payload.patientName,
        phone: payload.phone,
        email: payload.email,
        reasonForVisit: payload.reasonForVisit,
        symptoms: payload.symptoms,
        urgency: (payload.urgency as never) ?? undefined,
        transcript: payload.transcript,
        conversationSummary: payload.summary,
        n8nExecutionId: payload.n8nExecutionId,
        appointmentRequestedAt: payload.appointmentRequestedAt,
      },
    });
  },
};