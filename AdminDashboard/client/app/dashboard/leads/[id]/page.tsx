export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { patientLeadsRepository } from "../../../../../../shared/database";
import { StatusPill } from "@/components/dashboard/status-pill";

export default async function LeadDetailsPage({ params }: { params: { id: string } }) {
  const lead = await patientLeadsRepository.getLeadById(params.id);

  if (!lead) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">{lead.patientName}</h2>
        <p className="mt-2 text-sm text-slate-400">Lead details, transcript, and timeline.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white">Patient information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Info label="Phone" value={lead.phone} />
            <Info label="Email" value={lead.email ?? "-"} />
            <Info label="Reason" value={lead.reasonForVisit} />
            <Info label="Symptoms" value={lead.symptoms ?? "-"} />
            <Info label="Urgency" value={<StatusPill value={lead.urgency} />} />
            <Info label="Status" value={<StatusPill value={lead.status} />} />
          </div>

          <div className="mt-6 space-y-4">
            <TextBlock label="Conversation summary" value={lead.conversationSummary ?? "No summary available."} />
            <TextBlock label="Transcript" value={lead.transcript ?? "No transcript stored."} />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Lead timeline</h3>
            <p className="mt-3 text-sm text-slate-400">Timeline events will populate from lead updates, appointments, and conversations.</p>
          </section>
          <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">Actions</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Update status</p>
              <p>Schedule appointment</p>
              <p>Add notes</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-2 text-sm text-white">{value}</div>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm leading-7 text-slate-200">{value}</p>
    </div>
  );
}
