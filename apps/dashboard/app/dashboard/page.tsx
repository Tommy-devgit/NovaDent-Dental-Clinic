export const dynamic = "force-dynamic";

import {
  AlertTriangle,
  CalendarClock,
  CalendarPlus,
  Clock,
  MessagesSquare,
  PhoneCall,
  UserPlus,
  Users,
} from "lucide-react";

import { activityLogsRepository, appointmentsRepository, dashboardRepository, patientLeadsRepository } from "@novadent/database";
import { MetricCard, PageHeader } from "@novadent/ui";

import { RecentActivityFeed } from "@/components/dashboard/recent-activity-feed";
import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments";

function formatDuration(seconds: number) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default async function DashboardPage() {
  const [metrics, recentLeads, upcomingAppointments, recentActivity] = await Promise.all([
    dashboardRepository.getOverviewMetrics(),
    patientLeadsRepository.listLeads({ page: 1, pageSize: 5 }),
    appointmentsRepository.listUpcomingAppointments(5),
    activityLogsRepository.listRecentActivity(8),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="A snapshot of leads, conversations, and appointments." />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total leads" value={metrics.totalLeads} detail="All patient intake records" icon={Users} />
        <MetricCard label="New leads" value={metrics.newLeads} detail="Awaiting first outreach" icon={UserPlus} tone="accent" />
        <MetricCard
          label="Total conversations"
          value={metrics.totalConversations}
          detail="All-time assistant calls"
          icon={PhoneCall}
        />
        <MetricCard
          label="Today's conversations"
          value={metrics.todaysConversations}
          detail="Logged today"
          icon={MessagesSquare}
          tone="accent"
        />
        <MetricCard
          label="Avg. call duration"
          value={formatDuration(metrics.averageCallDurationSeconds)}
          detail="Across completed calls"
          icon={Clock}
        />
        <MetricCard
          label="Appointment requests"
          value={metrics.appointmentRequests}
          detail="Leads that asked to book"
          icon={CalendarPlus}
          tone="accent"
        />
        <MetricCard
          label="Appointments today"
          value={metrics.appointmentsToday}
          detail="Scheduled or in progress"
          icon={CalendarClock}
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
        <div className="space-y-6">
          <UpcomingAppointments
            appointments={upcomingAppointments.map((appointment) => ({
              id: appointment.id,
              scheduledFor: appointment.scheduledFor,
              durationMinutes: appointment.durationMinutes,
              status: appointment.status,
              lead: { id: appointment.lead.id, patientName: appointment.lead.patientName },
            }))}
          />
          <RecentActivityFeed
            activity={recentActivity.map((entry) => ({
              id: entry.id,
              action: entry.action,
              createdAt: entry.createdAt,
              staffUser: entry.staffUser
                ? { firstName: entry.staffUser.firstName, lastName: entry.staffUser.lastName }
                : null,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
