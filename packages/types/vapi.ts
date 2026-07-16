import type { VAPI_PROVIDERS } from "@novadent/utils";

export interface VapiConversationWebhookPayload {
  externalConversationId: string;
  n8nExecutionId?: string;
  provider?: (typeof VAPI_PROVIDERS)[number];
  patientName: string;
  phone: string;
  email?: string;
  reasonForVisit: string;
  symptoms?: string;
  urgency?: string;
  transcript: string;
  summary?: string;
  metadata?: Record<string, unknown>;
  startedAt?: string;
  endedAt?: string;
  appointmentRequestedAt?: string;
}
