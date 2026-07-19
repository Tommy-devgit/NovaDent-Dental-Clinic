export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { activityLogsRepository, patientLeadsRepository, staffUsersRepository } from "@novadent/database";
import { Card, CardContent, CardHeader, CardTitle, PageHeader, StatusBadge } from "@novadent/ui";

import { DsarDownloadButton } from "@/components/dashboard/dsar-download-button";
import { LeadAssignSelect } from "@/components/dashboard/lead-assign-select";
import { LeadEditDialog } from "@/components/dashboard/lead-edit-dialog";
import { LeadEraseButton } from "@/components/dashboard/lead-erase-button";
import { LeadStatusActions } from "@/components/dashboard/lead-status-actions";
import type { TimelineEvent } from "@/components/dashboard/lead-timeline";
import { LeadTimeline } from "@/components/dashboard/lead-timeline";
import { getStaffSessionFromCookies } from "@/lib/session";

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [lead, activity, staff, session] = await Promise.all([
    patientLeadsRepository.getLeadById(id),
    activityLogsRepository.listActivityForResource("PatientLead", id),
    staffUsersRepository.listActiveStaff(),
    getStaffSessionFromCookies(),
  ]);

  if (!lead) {
    notFound();
  }

  const isAdmin = session?.role === "ADMIN";

  const timelineEvents: TimelineEvent[] = [
    { id: `lead-${lead.id}`, type: "lead-created", label: `Lead created via ${lead.source}`, timestamp: lead.createdAt },
    ...lead.conversationLogs.map((log) => ({
      id: log.id,
      type: "conversation" as const,
      label: `${log.provider} conversation ${log.status === "IN_PROGRESS" ? "started" : "completed"}`,
      timestamp: log.createdAt,
    })),
    ...lead.appointments.map((appointment) => ({
      id: appointment.id,
      type: "appointment" as const,
      label: `Appointment ${appointment.status.toLowerCase()} for ${appointment.scheduledFor.toLocaleDateString()}`,
      timestamp: appointment.createdAt,
    })),
    ...activity
      .filter((entry) => entry.action === "STATUS_CHANGED")
      .map((entry) => ({
        id: entry.id,
        type: "status-change" as const,
        label: entry.staffUser
          ? `Status updated by ${entry.staffUser.firstName} ${entry.staffUser.lastName}`
          : "Status updated",
        timestamp: entry.createdAt,
      })),
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title={lead.patientName}
        description="Lead details, transcript, and timeline."
        actions={
          <>
            <StatusBadge value={lead.urgency} />
            <StatusBadge value={lead.status} />
            <DsarDownloadButton
              filename={`patient-${lead.id}.json`}
              data={JSON.stringify(lead, null, 2)}
            />
            {isAdmin ? (
              <>
                <LeadEditDialog
                  leadId={lead.id}
                  defaultValues={{
                    patientName: lead.patientName,
                    phone: lead.phone,
                    email: lead.email ?? null,
                    reasonForVisit: lead.reasonForVisit,
                    urgency: lead.urgency,
                  }}
                />
                <LeadEraseButton leadId={lead.id} patientName={lead.patientName} />
              </>
            ) : null}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info label="Phone" value={lead.phone} />
              <Info label="Email" value={lead.email ?? "—"} />
              <Info label="Reason for visit" value={lead.reasonForVisit} />
              <Info label="Symptoms" value={lead.symptoms ?? "—"} />
              <Info label="Source" value={lead.source} />
              <Info
                label="Assigned to"
                value={
                  lead.assignedStaffUser
                    ? `${lead.assignedStaffUser.firstName} ${lead.assignedStaffUser.lastName}`
                    : "Unassigned"
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversation summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {lead.conversationSummary ?? "No summary available."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                {lead.transcript ?? "No transcript stored."}
              </p>
            </CardContent>
          </Card>

          {lead.conversationLogs.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Conversation history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lead.conversationLogs.map((log) => (
                  <div key={log.id} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <StatusBadge value={log.provider} />
                      <p className="text-xs text-muted-foreground">{log.createdAt.toLocaleString()}</p>
                    </div>
                    {log.summary ? <p className="mt-2 text-sm text-foreground">{log.summary}</p> : null}
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{log.transcript}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignee</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadAssignSelect
                leadId={lead.id}
                currentAssigneeId={lead.assignedStaffUserId ?? null}
                staff={staff}
              />
            </CardContent>
          </Card>
          <LeadStatusActions leadId={lead.id} currentStatus={lead.status} />
          <LeadTimeline events={timelineEvents} />
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}
