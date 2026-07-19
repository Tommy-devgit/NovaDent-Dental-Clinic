import Link from "next/link";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@novadent/ui";

type LeadRow = {
  id: string;
  patientName: string;
  phone: string;
  reasonForVisit: string;
  urgency: string;
  status: string;
  createdAt: Date;
};

export function RecentLeadsTable({ leads }: { leads: LeadRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent leads</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {leads.length === 0 ? (
          <div className="px-6 pb-6">
            <EmptyState title="No leads yet" description="New leads from Vapi and n8n will appear here." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-foreground hover:text-primary">
                      {lead.patientName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground" title={lead.reasonForVisit}>
                    {lead.reasonForVisit}
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={lead.urgency} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge value={lead.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{lead.createdAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
