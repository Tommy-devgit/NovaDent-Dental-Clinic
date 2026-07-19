import { normalizePagination } from "@novadent/utils";

import { prisma } from "../client";
import { Prisma } from "../generated/client";

function buildActivityFilters(filters: { action?: string; resourceType?: string; staffUserId?: string }) {
  return {
    action: filters.action ? (filters.action as never) : undefined,
    resourceType: filters.resourceType || undefined,
    staffUserId: filters.staffUserId || undefined,
  };
}

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

  listActivity(filters: {
    action?: string;
    resourceType?: string;
    staffUserId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const { skip, pageSize } = normalizePagination({ page: filters.page, pageSize: filters.pageSize });
    return prisma.activityLog.findMany({
      where: buildActivityFilters(filters),
      include: { staffUser: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });
  },

  countActivity(filters: { action?: string; resourceType?: string; staffUserId?: string }) {
    return prisma.activityLog.count({ where: buildActivityFilters(filters) });
  },
};
