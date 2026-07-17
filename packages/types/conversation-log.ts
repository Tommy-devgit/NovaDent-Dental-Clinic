import type { CONVERSATION_STATUSES, VAPI_PROVIDERS } from "@novadent/utils";

export type ConversationProvider = (typeof VAPI_PROVIDERS)[number];

export type ConversationStatus = (typeof CONVERSATION_STATUSES)[number];

export interface ConversationLogRecord {
  id: string;
  leadId: string;
  provider: ConversationProvider;
  externalConversationId: string;
  assistantId?: string | null;
  status: ConversationStatus;
  durationSeconds?: number | null;
  summary?: string | null;
  transcript: string;
  metadata?: Record<string, unknown> | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
