import type { LEAD_STATUSES, LEAD_URGENCIES } from "@novadent/utils";

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadUrgency = (typeof LEAD_URGENCIES)[number];

export interface PatientLeadRecord {
  id: string;
  patientName: string;
  phone: string;
  email?: string | null;
  reasonForVisit: string;
  symptoms?: string | null;
  urgency: LeadUrgency;
  status: LeadStatus;
  conversationSummary?: string | null;
  transcript?: string | null;
  source: string;
  vapiConversationId?: string | null;
  n8nExecutionId?: string | null;
  appointmentRequestedAt?: Date | null;
  assignedStaffUserId?: string | null;
  updatedByStaffUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}