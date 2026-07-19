export const dynamic = "force-dynamic";

import Link from "next/link";

import { appointmentsRepository, patientLeadsRepository } from "@novadent/database";
import {
  EmptyState,
  PageHeader,
  Pagination,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@novadent/ui";

import { AppointmentActions } from "@/components/dashboard/appointment-actions";
import { CreateAppointmentDialog } from "@/components/dashboard/create-appointment-dialog";
import { ExportCsvButton } from "@/components/dashboard/export-csv-button";
import { getStaffSessionFromCookies } from "@/lib/session";

const PAGE_SIZE = 20;

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const page = Math.max(1, Number(resolved.page) || 1);

  const [appointments, totalItems, leadOptions, session] = await Promise.all([
    appointmentsRepository.listAppointmentsPage({ page, pageSize: PAGE_SIZE }),
    appointmentsRepository.countAppointments(),
    patientLeadsRepository.listLeadOptions(),
    getStaffSessionFromCookies(),
  ]);

  const isAdmin = session?.role === "ADMIN";

  function buildHref(nextPage: number) {
    return `/dashboard/appointments?page=${nextPage}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        description="Manage upcoming, completed, and cancelled appointments."
        actions={
          <div className="flex items-center gap-2">
            {isAdmin ? <ExportCsvButton href="/api/export/appointments" /> : null}
            <CreateAppointmentDialog leadOptions={leadOptions} />
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {appointments.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No appointments yet" description="Create one, or wait for a lead to request one." />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/leads/${appointment.lead.id}`} className="hover:text-primary">
                        {appointment.lead.patientName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{appointment.scheduledFor.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{appointment.durationMinutes} min</TableCell>
                    <TableCell>
                      <StatusBadge value={appointment.status} />
                    </TableCell>
                    <TableCell>
                      <AppointmentActions
                        appointmentId={appointment.id}
                        status={appointment.status}
                        scheduledFor={appointment.scheduledFor}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={page} pageSize={PAGE_SIZE} totalItems={totalItems} buildHref={buildHref} />
          </>
        )}
      </div>
    </div>
  );
}
