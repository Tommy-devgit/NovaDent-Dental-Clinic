import { normalizePagination } from "@novadent/utils";

import { prisma } from "../client";
import { Prisma } from "../generated/client";

function buildConversationFilters(filters: { q?: string; status?: string }) {
  return {
    status: filters.status ? (filters.status as never) : undefined,
    OR: filters.q
      ? [
          { summary: { contains: filters.q, mode: "insensitive" as const } },
          { transcript: { contains: filters.q, mode: "insensitive" as const } },
          { lead: { patientName: { contains: filters.q, mode: "insensitive" as const } } },
        ]
      : undefined,
  };
}

export const conversationLogsRepository = {
  listConversations(filters: { q?: string; status?: string; page?: number; pageSize?: number } = {}) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });

    return prisma.conversationLog.findMany({
      where: buildConversationFilters(filters),
      include: {
        lead: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });
  },

  countConversations(filters: { q?: string; status?: string } = {}) {
    return prisma.conversationLog.count({ where: buildConversationFilters(filters) });
  },

  getConversationById(id: string) {
    return prisma.conversationLog.findUnique({
      where: { id },
      include: {
        lead: true,
      },
    });
  },

  getConversationByLeadId(leadId: string) {
    return prisma.conversationLog.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
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
    metadata?: Prisma.InputJsonValue;
    startedAt?: Date;
    endedAt?: Date;
  }) {
    return prisma.conversationLog.create({
      data: {
        leadId: input.leadId,
        provider: input.provider as never,
        externalConversationId: input.externalConversationId,
        assistantId: input.assistantId,
        status: (input.status as never) ?? "COMPLETED",
        durationSeconds: input.durationSeconds,
        summary: input.summary,
        transcript: input.transcript,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
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
    metadata?: Prisma.InputJsonValue;
    startedAt?: Date;
    endedAt?: Date;
  }) {
    return prisma.conversationLog.upsert({
      where: { externalConversationId: input.externalConversationId },
      create: {
        leadId: input.leadId,
        provider: input.provider as never,
        externalConversationId: input.externalConversationId,
        assistantId: input.assistantId,
        status: (input.status as never) ?? "COMPLETED",
        durationSeconds: input.durationSeconds,
        summary: input.summary,
        transcript: input.transcript,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
      update: {
        assistantId: input.assistantId,
        status: (input.status as never) ?? undefined,
        durationSeconds: input.durationSeconds,
        summary: input.summary,
        transcript: input.transcript,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
    });
  },
};
