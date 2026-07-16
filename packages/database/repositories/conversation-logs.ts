import { prisma } from "../client";
import { Prisma } from "../generated/client";

export const conversationLogsRepository = {
  listConversations() {
    return prisma.conversationLog.findMany({
      include: {
        lead: true,
      },
      orderBy: { createdAt: "desc" },
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
        summary: input.summary,
        transcript: input.transcript,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
      update: {
        summary: input.summary,
        transcript: input.transcript,
        metadata: input.metadata,
        startedAt: input.startedAt,
        endedAt: input.endedAt,
      },
    });
  },
};