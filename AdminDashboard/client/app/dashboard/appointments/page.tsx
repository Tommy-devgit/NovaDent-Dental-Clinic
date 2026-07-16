export const dynamic = "force-dynamic";

import { appointmentsRepository } from "../../../../../shared/database";
import { StatusPill } from "@/components/dashboard/status-pill";

export default async function AppointmentsPage() {
  const appointments = await appointmentsRepository.listAppointments();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Appointments</h2>
        <p className="mt-2 text-sm text-slate-400">Manage upcoming, completed, and cancelled appointments.</p>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Patient</th>
              <th className="px-6 py-4 font-medium">When</th>
              <th className="px-6 py-4 font-medium">Duration</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-t border-white/10">
                <td className="px-6 py-4 text-white">{appointment.lead.patientName}</td>
                <td className="px-6 py-4 text-slate-300">{appointment.scheduledFor.toLocaleString()}</td>
                <td className="px-6 py-4 text-slate-300">{appointment.durationMinutes} min</td>
                <td className="px-6 py-4"><StatusPill value={appointment.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
