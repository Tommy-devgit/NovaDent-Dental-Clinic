import type { ACTIVITY_ACTIONS } from "@novadent/utils";

export type ActivityAction = (typeof ACTIVITY_ACTIONS)[number];

export interface ActivityLogRecord {
  id: string;
  action: ActivityAction;
  resourceType: string;
  resourceId: string;
  staffUserId?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}
