export const dynamic = "force-dynamic";

import { AlertTriangle, CalendarClock, MessagesSquare, UserPlus, Users } from "lucide-react";

import { appointmentsRepository, dashboardRepository, patientLeadsRepository } from "@novadent/database";
import { MetricCard, PageHeader } from "@novadent/ui";

import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";

export default async function DashboardPage() {
  const [metrics, recentLeads, upcomingAppointments] = await Promise.all([
    dashboardRepository.getOverviewMetrics(),
    patientLeadsRepository.listLeads({ page: 1, pageSize: 5 }),
    appointmentsRepository.listUpcomingAppointments(5),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="A snapshot of leads, appointments, and conversations." />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Total leads" value={metrics.totalLeads} detail="All patient intake records" icon={Users} />
        <MetricCard label="New leads" value={metrics.newLeads} detail="Awaiting first outreach" icon={UserPlus} tone="accent" />
        <MetricCard
          label="Appointments today"
          value={metrics.appointmentsToday}
          detail="Scheduled or in progress"
          icon={CalendarClock}
        />
        <MetricCard
          label="Active conversations"
          value={metrics.activeConversations}
          detail="Logged today"
          icon={MessagesSquare}
          tone="accent"
        />
        <MetricCard
          label="Urgent cases"
          value={metrics.urgentCases}
          detail="High-priority follow-up needed"
          icon={AlertTriangle}
          tone="warning"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <RecentLeadsTable
          leads={recentLeads.map((lead) => ({
            id: lead.id,
            patientName: lead.patientName,
            phone: lead.phone,
            reasonForVisit: lead.reasonForVisit,
            urgency: lead.urgency,
            status: lead.status,
            createdAt: lead.createdAt,
          }))}
        />
        <UpcomingAppointments
          appointments={upcomingAppointments.map((appointment) => ({
            id: appointment.id,
            scheduledFor: appointment.scheduledFor,
            durationMinutes: appointment.durationMinutes,
            status: appointment.status,
            lead: { id: appointment.lead.id, patientName: appointment.lead.patientName },
          }))}
        />
      </div>
    </div>
  );
}
