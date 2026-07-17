import { CalendarCheck2, MessageCircle, RefreshCw, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@novadent/ui";

export interface TimelineEvent {
  id: string;
  type: "lead-created" | "conversation" | "appointment" | "status-change";
  label: string;
  timestamp: Date;
}

const ICONS: Record<TimelineEvent["type"], LucideIcon> = {
  "lead-created": UserPlus,
  conversation: MessageCircle,
  appointment: CalendarCheck2,
  "status-change": RefreshCw,
};

export function LeadTimeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <ol className="space-y-4">
            {sorted.map((event) => {
              const Icon = ICONS[event.type];
              return (
                <li key={event.id} className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm text-foreground">{event.label}</p>
                    <p className="text-xs text-muted-foreground">{event.timestamp.toLocaleString()}</p>
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
