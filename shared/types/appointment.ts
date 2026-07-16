import type { APPOINTMENT_STATUSES } from "../constants/appointments";

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export interface AppointmentRecord {
  id: string;
  leadId: string;
  scheduledFor: Date;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string | null;
  location?: string | null;
  externalCalendarEventId?: string | null;
  cancelledAt?: Date | null;
  completedAt?: Date | null;
  createdByStaffUserId?: string | null;
  updatedByStaffUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}