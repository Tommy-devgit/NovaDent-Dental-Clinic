import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StatusBadge,
} from "@novadent/ui";

type AppointmentRow = {
  id: string;
  scheduledFor: Date;
  durationMinutes: number;
  status: string;
  lead: { id: string; patientName: string };
};

export function UpcomingAppointments({ appointments }: { appointments: AppointmentRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyState title="Nothing scheduled" description="Upcoming appointments will show up here." />
        ) : (
          <ul className="divide-y divide-border">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <Link
                    href={`/dashboard/leads/${appointment.lead.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {appointment.lead.patientName}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {appointment.scheduledFor.toLocaleString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {appointment.durationMinutes} min
                  </p>
                </div>
                <StatusBadge value={appointment.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
