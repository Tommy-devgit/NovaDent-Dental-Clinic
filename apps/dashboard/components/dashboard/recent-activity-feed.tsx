import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "@novadent/ui";
import type { ActivityAction } from "@novadent/types";

import { ACTIVITY_ICON as ACTION_ICON, ACTIVITY_LABEL as ACTION_LABEL } from "@/lib/activity-meta";

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
