export const dynamic = "force-dynamic";

import Link from "next/link";

import { conversationLogsRepository } from "@novadent/database";
import { Card, CardContent, EmptyState, PageHeader, StatusBadge } from "@novadent/ui";

export default async function ConversationsPage() {
  const conversations = await conversationLogsRepository.listConversations();

  return (
    <div className="space-y-6">
      <PageHeader title="Conversations" description="Voice calls and transcript logs generated through Vapi." />

      {conversations.length === 0 ? (
        <EmptyState title="No conversations yet" description="Calls routed through Vapi and n8n will appear here." />
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/dashboard/leads/${conversation.lead.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {conversation.lead.patientName}
                    </Link>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {conversation.summary ?? "Conversation summary"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={conversation.provider} />
                    <p className="text-sm text-muted-foreground">{conversation.createdAt.toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                  {conversation.transcript}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
