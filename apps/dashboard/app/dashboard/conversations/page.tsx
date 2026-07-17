export const dynamic = "force-dynamic";

import Link from "next/link";

import { conversationLogsRepository } from "@novadent/database";
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
import { conversationFiltersSchema } from "@novadent/validations";

import { ConversationsFilterBar } from "@/components/dashboard/conversations-filter-bar";

function formatDuration(seconds: number | null | undefined) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = conversationFiltersSchema.parse({
    q: resolvedSearchParams.q,
    status: resolvedSearchParams.status,
    page: resolvedSearchParams.page,
    pageSize: resolvedSearchParams.pageSize,
  });

  const [conversations, totalItems] = await Promise.all([
    conversationLogsRepository.listConversations(filters),
    conversationLogsRepository.countConversations(filters),
  ]);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.status) params.set("status", filters.status);
    params.set("page", String(page));
    return `/dashboard/conversations?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Conversations" description="Voice calls and transcript logs generated through Vapi." />

      <ConversationsFilterBar />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {conversations.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No conversations match your filters" description="Try adjusting your search or filters." />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversations.map((conversation) => (
                  <TableRow key={conversation.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/conversations/${conversation.id}`} className="hover:text-primary">
                        {conversation.lead.patientName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{conversation.createdAt.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDuration(conversation.durationSeconds)}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {conversation.summary ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={conversation.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={filters.page} pageSize={filters.pageSize} totalItems={totalItems} buildHref={buildHref} />
          </>
        )}
      </div>
    </div>
  );
}
