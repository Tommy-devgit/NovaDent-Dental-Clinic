import { prisma } from "../client";
import { Prisma } from "../generated/client";

export const activityLogsRepository = {
  logActivity(input: {
    action: string;
    resourceType: string;
    resourceId: string;
    staffUserId?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return prisma.activityLog.create({
      data: {
        action: input.action as never,
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        staffUserId: input.staffUserId,
        metadata: input.metadata,
      },
    });
  },

  listActivityForResource(resourceType: string, resourceId: string) {
    return prisma.activityLog.findMany({
      where: { resourceType, resourceId },
      include: { staffUser: true },
      orderBy: { createdAt: "desc" },
    });
  },

  listRecentActivity(limit = 50) {
    return prisma.activityLog.findMany({
      include: { staffUser: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};
