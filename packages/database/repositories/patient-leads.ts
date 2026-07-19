import { normalizePagination } from "@novadent/utils";

import { prisma } from "../client";
import { computeEmailHash, computePhoneHash, decryptLeadRow, encryptLeadWrite } from "../lib/pii";

// PII columns are encrypted, so free-text `contains` search is impossible. Search matches an
// exact phone or email via their deterministic hash instead (a typed name simply won't match).
function buildLeadFilters(filters: { q?: string; status?: string; urgency?: string }) {
  const q = filters.q?.trim();
  return {
    status: filters.status ? (filters.status as never) : undefined,
    urgency: filters.urgency ? (filters.urgency as never) : undefined,
    OR: q ? [{ phoneHash: computePhoneHash(q) }, { emailHash: computeEmailHash(q) }] : undefined,
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

  async listLeadOptions(limit = 100) {
    const options = await prisma.patientLead.findMany({
      select: { id: true, patientName: true, phone: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return options.map((option) => decryptLeadRow(option));
  },

  async listLeads(filters: { q?: string; status?: string; urgency?: string; page?: number; pageSize?: number }) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });

    const leads = await prisma.patientLead.findMany({
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
    return leads.map((lead) => decryptLeadRow(lead));
  },

  countLeads(filters: { q?: string; status?: string; urgency?: string }) {
    return prisma.patientLead.count({ where: buildLeadFilters(filters) });
  },

  async findByVapiConversationId(vapiConversationId: string) {
    const lead = await prisma.patientLead.findUnique({ where: { vapiConversationId } });
    return lead ? decryptLeadRow(lead) : null;
  },

  async getLeadById(id: string) {
    const lead = await prisma.patientLead.findUnique({
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
    return lead ? decryptLeadRow(lead) : null;
  },

  createLeadFromBooking(payload: {
    patientName: string;
    phone: string;
    email?: string;
    reasonForVisit: string;
    isNewPatient?: boolean;
    notes?: string;
    appointmentRequestedAt: Date;
  }) {
    return prisma.patientLead.create({
      data: encryptLeadWrite({
        patientName: payload.patientName,
        phone: payload.phone,
        email: payload.email,
        reasonForVisit: payload.reasonForVisit,
        isNewPatient: payload.isNewPatient,
        conversationSummary: payload.notes,
        source: "website_booking",
        appointmentRequestedAt: payload.appointmentRequestedAt,
      }),
    });
  },

  updateLeadStatus(id: string, status: string, updatedByStaffUserId?: string, note?: string) {
    return prisma.patientLead.update({
      where: { id },
      data: encryptLeadWrite({
        status: status as never,
        updatedByStaffUserId,
        conversationSummary: note ? note : undefined,
      }),
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
    isNewPatient?: boolean;
    transcript: string;
    summary?: string;
    vapiConversationId: string;
    n8nExecutionId?: string;
    appointmentRequestedAt?: Date;
    source?: string;
  }) {
    return prisma.patientLead.upsert({
      where: { vapiConversationId: payload.vapiConversationId },
      create: encryptLeadWrite({
        patientName: payload.patientName,
        phone: payload.phone,
        email: payload.email,
        reasonForVisit: payload.reasonForVisit,
        symptoms: payload.symptoms,
        urgency: (payload.urgency as never) ?? "LOW",
        isNewPatient: payload.isNewPatient,
        transcript: payload.transcript,
        conversationSummary: payload.summary,
        vapiConversationId: payload.vapiConversationId,
        n8nExecutionId: payload.n8nExecutionId,
        appointmentRequestedAt: payload.appointmentRequestedAt,
        source: payload.source,
      }),
      update: encryptLeadWrite({
        patientName: payload.patientName,
        phone: payload.phone,
        email: payload.email,
        reasonForVisit: payload.reasonForVisit,
        symptoms: payload.symptoms,
        urgency: (payload.urgency as never) ?? undefined,
        isNewPatient: payload.isNewPatient,
        transcript: payload.transcript,
        conversationSummary: payload.summary,
        n8nExecutionId: payload.n8nExecutionId,
        appointmentRequestedAt: payload.appointmentRequestedAt,
      }),
    });
  },
};