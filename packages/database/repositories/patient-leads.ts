import { normalizePagination } from "@novadent/utils";

import { prisma } from "../client";

function buildLeadFilters(filters: { q?: string; status?: string; urgency?: string }) {
  return {
    status: filters.status ? (filters.status as never) : undefined,
    urgency: filters.urgency ? (filters.urgency as never) : undefined,
    OR: filters.q
      ? [
          { patientName: { contains: filters.q, mode: "insensitive" as const } },
          { phone: { contains: filters.q, mode: "insensitive" as const } },
          { email: { contains: filters.q, mode: "insensitive" as const } },
          { reasonForVisit: { contains: filters.q, mode: "insensitive" as const } },
        ]
      : undefined,
  };
}

export const patientLeadsRepository = {
  async getOverviewMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      urgentCases,
      appointmentsToday,
      totalConversations,
      todaysConversations,
      appointmentRequests,
      callDurationAggregate,
    ] = await Promise.all([
      prisma.patientLead.count(),
      prisma.patientLead.count({ where: { status: "NEW" } }),
      prisma.patientLead.count({ where: { status: "CONTACTED" } }),
      prisma.patientLead.count({ where: { urgency: { in: ["HIGH", "URGENT"] } } }),
      prisma.appointment.count({
        where: {
          scheduledFor: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          status: { in: ["SCHEDULED", "CONFIRMED", "RESCHEDULED"] },
        },
      }),
      prisma.conversationLog.count(),
      prisma.conversationLog.count({
        where: { createdAt: { gte: today } },
      }),
      prisma.patientLead.count({ where: { appointmentRequestedAt: { not: null } } }),
      prisma.conversationLog.aggregate({
        _avg: { durationSeconds: true },
        where: { durationSeconds: { not: null } },
      }),
    ]);

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      urgentCases,
      appointmentsToday,
      totalConversations,
      todaysConversations,
      appointmentRequests,
      averageCallDurationSeconds: Math.round(callDurationAggregate._avg.durationSeconds ?? 0),
    };
  },

  listLeadOptions(limit = 100) {
    return prisma.patientLead.findMany({
      select: { id: true, patientName: true, phone: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  listLeads(filters: { q?: string; status?: string; urgency?: string; page?: number; pageSize?: number }) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });

    return prisma.patientLead.findMany({
      where: buildLeadFilters(filters),
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

  countLeads(filters: { q?: string; status?: string; urgency?: string }) {
    return prisma.patientLead.count({ where: buildLeadFilters(filters) });
  },

  findByVapiConversationId(vapiConversationId: string) {
    return prisma.patientLead.findUnique({ where: { vapiConversationId } });
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