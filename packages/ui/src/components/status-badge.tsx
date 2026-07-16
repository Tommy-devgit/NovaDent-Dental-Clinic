import { Badge, type BadgeProps } from "./ui/badge";

const STATUS_VARIANTS: Record<string, NonNullable<BadgeProps["variant"]>> = {
  // lead status
  NEW: "info",
  CONTACTED: "warning",
  BOOKED: "success",
  CLOSED: "muted",
  // lead urgency
  LOW: "success",
  MEDIUM: "warning",
  HIGH: "destructive",
  URGENT: "destructive",
  // appointment status
  SCHEDULED: "info",
  CONFIRMED: "success",
  RESCHEDULED: "warning",
  CANCELLED: "destructive",
  NO_SHOW: "muted",
  // shared
  COMPLETED: "muted",
  // staff
  ACTIVE: "success",
  INVITED: "warning",
  SUSPENDED: "destructive",
};

export function StatusBadge({ value }: { value: string }) {
  return <Badge variant={STATUS_VARIANTS[value] ?? "secondary"}>{value.replace(/_/g, " ")}</Badge>;
}
