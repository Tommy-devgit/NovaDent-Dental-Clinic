export const dynamic = "force-dynamic";

import { activityLogsRepository } from "@novadent/database";
import {
  EmptyState,
  PageHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@novadent/ui";

import { AuditFilterBar } from "@/components/dashboard/audit-filter-bar";
import { ACTIVITY_LABEL } from "@/lib/activity-meta";

const PAGE_SIZE = 25;

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const action = typeof resolved.action === "string" ? resolved.action : undefined;
  const resourceType = typeof resolved.resourceType === "string" ? resolved.resourceType : undefined;
  const page = Math.max(1, Number(resolved.page) || 1);

  const [items, totalItems] = await Promise.all([
    activityLogsRepository.listActivity({ action, resourceType, page, pageSize: PAGE_SIZE }),
    activityLogsRepository.countActivity({ action, resourceType }),
  ]);

  function buildHref(nextPage: number) {
    const params = new URLSearchParams();
    if (action) params.set("action", action);
    if (resourceType) params.set("resourceType", resourceType);
    params.set("page", String(nextPage));
    return `/dashboard/activity?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Audit log" description="Every action taken across the clinic — who did what, and when." />

      <AuditFilterBar />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {items.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No activity found" description="Try clearing the filters." />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {item.createdAt.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.staffUser ? `${item.staffUser.firstName} ${item.staffUser.lastName}` : "System"}
                    </TableCell>
                    <TableCell>{ACTIVITY_LABEL[item.action] ?? item.action}</TableCell>
                    <TableCell className="text-muted-foreground">{item.resourceType}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                      {item.metadata ? JSON.stringify(item.metadata) : "—"}
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
