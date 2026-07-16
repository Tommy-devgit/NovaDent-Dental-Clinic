export const dynamic = "force-dynamic";

import { dashboardRepository, patientLeadsRepository } from "../../../../shared/database";

import { RecentLeadsTable } from "@/components/dashboard/recent-leads-table";
import { StatCard } from "@/components/dashboard/stat-card";

export default async function DashboardPage() {
  const [metrics, recentLeads] = await Promise.all([
    dashboardRepository.getOverviewMetrics(),
    patientLeadsRepository.listLeads({ page: 1, pageSize: 5 }),
  ]);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-5">
        <StatCard label="Total leads" value={metrics.totalLeads} detail="All patient intake records" />
        <StatCard label="New leads" value={metrics.newLeads} detail="Awaiting first outreach" />
        <StatCard label="Contacted leads" value={metrics.contactedLeads} detail="Touched by staff" />
        <StatCard label="Appointments today" value={metrics.appointmentsToday} detail="Scheduled or in progress" />
        <StatCard label="Urgent cases" value={metrics.urgentCases} detail="High-priority follow-up needed" />
      </section>

      <RecentLeadsTable
        leads={recentLeads.map((lead) => ({
          id: lead.id,
          patientName: lead.patientName,
          phone: lead.phone,
          email: lead.email ?? null,
          reasonForVisit: lead.reasonForVisit,
          urgency: lead.urgency,
          status: lead.status,
          createdAt: lead.createdAt,
        }))}
      />
    </div>
  );
}
