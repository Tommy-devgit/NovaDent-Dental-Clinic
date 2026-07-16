export interface VapiConversationWebhookPayload {
  externalConversationId: string;
  leadId?: string;
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