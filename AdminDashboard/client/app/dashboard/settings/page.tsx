export const dynamic = "force-dynamic";

import { clinicSettingsRepository } from "../../../../../shared/database";

export default async function SettingsPage() {
  const settings = await clinicSettingsRepository.getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Settings</h2>
        <p className="mt-2 text-sm text-slate-400">Clinic profile, Vapi config, and notification settings.</p>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        {settings ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Clinic name" value={settings.clinicName} />
            <Field label="Address" value={settings.address} />
            <Field label="Phone" value={settings.phone} />
            <Field label="Email" value={settings.email} />
            <Field label="Timezone" value={settings.timezone} />
            <Field label="Working hours" value={JSON.stringify(settings.workingHours)} />
          </div>
        ) : (
          <p className="text-sm text-slate-400">No clinic settings have been created yet.</p>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-white">{value}</p>
    </div>
  );
}
