import {
  CalendarPlus,
  CalendarClock,
  MessageCircle,
  PhoneOff,
  RefreshCw,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@novadent/ui";
import type { ActivityAction } from "@novadent/types";

const ACTION_ICON: Record<ActivityAction, LucideIcon> = {
  LEAD_CREATED: UserPlus,
  LEAD_UPDATED: RefreshCw,
  CONVERSATION_STARTED: MessageCircle,
  CONVERSATION_ENDED: PhoneOff,
  APPOINTMENT_CREATED: CalendarPlus,
  APPOINTMENT_UPDATED: CalendarClock,
  STATUS_CHANGED: RefreshCw,
};

const ACTION_LABEL: Record<ActivityAction, string> = {
  LEAD_CREATED: "New lead created",
  LEAD_UPDATED: "Lead updated",
  CONVERSATION_STARTED: "Conversation started",
  CONVERSATION_ENDED: "Conversation ended",
  APPOINTMENT_CREATED: "Appointment created",
  APPOINTMENT_UPDATED: "Appointment updated",
  STATUS_CHANGED: "Status changed",
};

type ActivityEntry = {
  id: string;
  action: ActivityAction;
  createdAt: Date;
  staffUser: { firstName: string; lastName: string } | null;
};

export function RecentActivityFeed({ activity }: { activity: ActivityEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <EmptyState title="No activity yet" description="Actions across leads, appointments, and calls will appear here." />
        ) : (
          <ol className="space-y-4">
            {activity.map((entry) => {
              const Icon = ACTION_ICON[entry.action];
              return (
                <li key={entry.id} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm text-foreground">
                      {ACTION_LABEL[entry.action]}
                      {entry.staffUser ? ` by ${entry.staffUser.firstName} ${entry.staffUser.lastName}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">{entry.createdAt.toLocaleString()}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
