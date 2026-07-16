import type { VAPI_PROVIDERS } from "@novadent/utils";

export type ConversationProvider = (typeof VAPI_PROVIDERS)[number];

export interface ConversationLogRecord {
  id: string;
  leadId: string;
  provider: ConversationProvider;
  externalConversationId: string;
  summary?: string | null;
  transcript: string;
  metadata?: Record<string, unknown> | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}