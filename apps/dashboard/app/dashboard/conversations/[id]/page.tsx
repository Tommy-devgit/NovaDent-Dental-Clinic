export const dynamic = "force-dynamic";

import { MessageCircle, PhoneCall, PhoneOff } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { conversationLogsRepository } from "@novadent/database";
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader, StatusBadge } from "@novadent/ui";

function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default async function ConversationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conversation = await conversationLogsRepository.getConversationById(id);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Conversation with ${conversation.lead.patientName}`}
        description="Conversation summary, transcript, and call metadata."
        actions={<StatusBadge value={conversation.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {conversation.summary ?? "No summary available."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Full transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{conversation.transcript}</p>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Info label="Patient" value={conversation.lead.patientName} />
              <Info label="Phone" value={conversation.lead.phone} />
              <Info label="Reason for visit" value={conversation.lead.reasonForVisit} />
              <div className="flex items-center gap-2">
                <StatusBadge value={conversation.lead.urgency} />
                <StatusBadge value={conversation.lead.status} />
              </div>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href={`/dashboard/leads/${conversation.lead.id}`}>View full lead</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Info label="Provider" value={conversation.provider} />
              <Info label="Call ID" value={conversation.externalConversationId} />
              {conversation.assistantId ? <Info label="Assistant ID" value={conversation.assistantId} /> : null}
              <Info label="Duration" value={formatDuration(conversation.durationSeconds)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <PhoneCall className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm text-foreground">Conversation started</p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.startedAt?.toLocaleString() ?? conversation.createdAt.toLocaleString()}
                    </p>
                  </div>
                </li>
                {conversation.endedAt ? (
                  <li className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                      <PhoneOff className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm text-foreground">Conversation ended</p>
                      <p className="text-xs text-muted-foreground">{conversation.endedAt.toLocaleString()}</p>
                    </div>
                  </li>
                ) : null}
                <li className="flex gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <MessageCircle className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm text-foreground">Logged in dashboard</p>
                    <p className="text-xs text-muted-foreground">{conversation.createdAt.toLocaleString()}</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm text-foreground">{value}</p>
    </div>
  );
}
