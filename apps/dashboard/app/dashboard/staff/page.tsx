export const dynamic = "force-dynamic";

import { staffUsersRepository } from "@novadent/database";
import {
  EmptyState,
  PageHeader,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@novadent/ui";

import { CreateStaffDialog } from "@/components/dashboard/create-staff-dialog";
import { StaffActions } from "@/components/dashboard/staff-actions";
import { getStaffSessionFromCookies } from "@/lib/session";

export default async function StaffPage() {
  const [staff, session] = await Promise.all([
    staffUsersRepository.listStaff(),
    getStaffSessionFromCookies(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Manage clinic staff accounts, roles, and access."
        actions={<CreateStaffDialog />}
      />

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {staff.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No staff yet" description="Add the first staff member to get started." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {s.firstName} {s.lastName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.email}</TableCell>
                  <TableCell className="text-muted-foreground">{s.role}</TableCell>
                  <TableCell>
                    <StatusBadge value={s.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.lastLoginAt ? s.lastLoginAt.toLocaleString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <StaffActions staff={s} currentUserId={session?.id} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
