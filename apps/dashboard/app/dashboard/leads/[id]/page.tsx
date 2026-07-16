export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { patientLeadsRepository } from "@novadent/database";
import { Card, CardContent, CardHeader, CardTitle, PageHeader, StatusBadge } from "@novadent/ui";

import { LeadStatusActions } from "@/components/dashboard/lead-status-actions";
import type { TimelineEvent } from "@/components/dashboard/lead-timeline";
import { LeadTimeline } from "@/components/dashboard/lead-timeline";

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await patientLeadsRepository.getLeadById(id);

  if (!lead) {
    notFound();
  }

  const timelineEvents: TimelineEvent[] = [
    { id: `lead-${lead.id}`, type: "lead-created", label: `Lead created via ${lead.source}`, timestamp: lead.createdAt },
    ...lead.conversationLogs.map((log) => ({
      id: log.id,
      type: "conversation" as const,
      label: `${log.provider} conversation logged`,
      timestamp: log.createdAt,
    })),
    ...lead.appointments.map((appointment) => ({
      id: appointment.id,
      type: "appointment" as const,
      label: `Appointment ${appointment.status.toLowerCase()} for ${appointment.scheduledFor.toLocaleDateString()}`,
      timestamp: appointment.createdAt,
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
