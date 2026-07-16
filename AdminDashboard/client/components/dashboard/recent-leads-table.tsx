import Link from "next/link";

import { StatusPill } from "./status-pill";

type LeadRow = {
  id: string;
  patientName: string;
  phone: string;
  email: string | null;
  reasonForVisit: string;
  urgency: string;
  status: string;
  createdAt: Date;
};

export function RecentLeadsTable({ leads }: { leads: LeadRow[] }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Recent leads</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">Reason</th>
              <th className="px-6 py-4 font-medium">Urgency</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-6 py-4">
                  <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-white transition hover:text-sky-300">
                    {lead.patientName}
                  </Link>
                  <p className="text-xs text-slate-400">{lead.phone}</p>
                </td>
                <td className="px-6 py-4 text-slate-300">{lead.reasonForVisit}</td>
                <td className="px-6 py-4">
                  <StatusPill value={lead.urgency} />
                </td>
                <td className="px-6 py-4">
                  <StatusPill value={lead.status} />
                </td>
                <td className="px-6 py-4 text-slate-400">{lead.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
