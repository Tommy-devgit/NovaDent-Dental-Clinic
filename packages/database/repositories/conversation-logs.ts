import { normalizePagination } from "@novadent/utils";

import { prisma } from "../client";
import { Prisma } from "../generated/client";
import { decryptConversationRow, decryptLeadRow, encryptConversationWrite } from "../lib/pii";

// summary/transcript and the joined lead's name are encrypted, so `contains` search is not
// possible here — only the status filter is applied server-side.
function buildConversationFilters(filters: { q?: string; status?: string }) {
  return {
    status: filters.status ? (filters.status as never) : undefined,
  };
}

function decryptConversationWithLead<T extends Record<string, unknown>>(row: T): T {
  const decrypted = decryptConversationRow(row);
  if (decrypted.lead && typeof decrypted.lead === "object") {
    return { ...decrypted, lead: decryptLeadRow(decrypted.lead as Record<string, unknown>) };
  }
  return decrypted;
}

export const conversationLogsRepository = {
  async listConversations(filters: { q?: string; status?: string; page?: number; pageSize?: number } = {}) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });

    const conversations = await prisma.conversationLog.findMany({
      where: buildConversationFilters(filters),
      include: {
        lead: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });
    return conversations.map((conversation) => decryptConversationWithLead(conversation));
  },

  countConversations(filters: { q?: string; status?: string } = {}) {
    return prisma.conversationLog.count({ where: buildConversationFilters(filters) });
  },

  async getConversationById(id: string) {
    const conversation = await prisma.conversationLog.findUnique({
      where: { id },
      include: {
        lead: true,
        appointments: {
          orderBy: { scheduledFor: "desc" },
        },
      },
    });
    return conversation ? decryptConversationWithLead(conversation) : null;
  },

  async getConversationByLeadId(leadId: string) {
    const conversations = await prisma.conversationLog.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
    return conversations.map((conversation) => decryptConversationRow(conversation));
  },

  async findByExternalConversationId(externalConversationId: string) {
    const conversation = await prisma.conversationLog.findUnique({
      where: { externalConversationId },
    });
    return conversation ? decryptConversationRow(conversation) : null;
  },

  createConversationLog(input: {
    leadId: string;
    provider: string;
    externalConversationId: string;
    assistantId?: string;
    status?: string;
    durationSeconds?: number;
    summary?: string;
    transcript: string;
    recordingUrl?: string;
    metadata?: Prisma.InputJsonValue;
    startedAt?: Date;
    endedAt?: Date;
  }) {
    return prisma.conversationLog.create({
      data: encryptConversationWrite({
        leadId: input.leadId,
        provider: input.provider as never,
        externalConversationId: input.externalConversationId,
        assistantId: input.assistantId,
        status: (input.status as never) ?? "COMPLETED",
        durationSeconds: input.durationSeconds,
        summary: input.summary,
        transcript: input.transcript,
        recordingUrl: input.recordingUrl,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      }),
    });
  },

  upsertConversationLog(input: {
    leadId: string;
    provider: string;
    externalConversationId: string;
    assistantId?: string;
    status?: string;
    durationSeconds?: number;
    summary?: string;
    transcript: string;
    recordingUrl?: string;
    metadata?: Prisma.InputJsonValue;
    startedAt?: Date;
    endedAt?: Date;
  }) {
    return prisma.conversationLog.upsert({
      where: { externalConversationId: input.externalConversationId },
      create: encryptConversationWrite({
        leadId: input.leadId,
        provider: input.provider as never,
        externalConversationId: input.externalConversationId,
        assistantId: input.assistantId,
        status: (input.status as never) ?? "COMPLETED",
        durationSeconds: input.durationSeconds,
        summary: input.summary,
        transcript: input.transcript,
        recordingUrl: input.recordingUrl,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      }),
      update: encryptConversationWrite({
        assistantId: input.assistantId,
        status: (input.status as never) ?? undefined,
        durationSeconds: input.durationSeconds,
        summary: input.summary,
        transcript: input.transcript,
        recordingUrl: input.recordingUrl,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      }),
    });
  },

  setRecordingUrl(externalConversationId: string, recordingUrl: string) {
    return prisma.conversationLog.update({
      where: { externalConversationId },
      data: encryptConversationWrite({ recordingUrl }),
    });
  },
};
