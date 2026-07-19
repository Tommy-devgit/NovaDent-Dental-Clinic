import {
  CalendarClock,
  CalendarPlus,
  Download,
  KeyRound,
  MessageCircle,
  PhoneOff,
  RefreshCw,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import type { ActivityAction } from "@novadent/types";

export const ACTIVITY_ICON: Record<ActivityAction, LucideIcon> = {
  LEAD_CREATED: UserPlus,
  LEAD_UPDATED: RefreshCw,
  CONVERSATION_STARTED: MessageCircle,
  CONVERSATION_ENDED: PhoneOff,
  APPOINTMENT_CREATED: CalendarPlus,
  APPOINTMENT_UPDATED: CalendarClock,
  STATUS_CHANGED: RefreshCw,
  STAFF_CREATED: UserPlus,
  STAFF_UPDATED: UserCog,
  STAFF_STATUS_CHANGED: UserCog,
  STAFF_PASSWORD_RESET: KeyRound,
  LEAD_ASSIGNED: UserCheck,
  LEAD_UPDATED_DETAILS: RefreshCw,
  LEAD_ERASED: Trash2,
  DATA_EXPORTED: Download,
};

export const ACTIVITY_LABEL: Record<ActivityAction, string> = {
  LEAD_CREATED: "New lead created",
  LEAD_UPDATED: "Lead updated",
  CONVERSATION_STARTED: "Conversation started",
  CONVERSATION_ENDED: "Conversation ended",
  APPOINTMENT_CREATED: "Appointment created",
  APPOINTMENT_UPDATED: "Appointment updated",
  STATUS_CHANGED: "Status changed",
  STAFF_CREATED: "Staff member added",
  STAFF_UPDATED: "Staff member updated",
  STAFF_STATUS_CHANGED: "Staff status changed",
  STAFF_PASSWORD_RESET: "Staff password reset",
  LEAD_ASSIGNED: "Lead assigned",
  LEAD_UPDATED_DETAILS: "Lead details updated",
  LEAD_ERASED: "Patient record erased",
  DATA_EXPORTED: "Data exported",
};
