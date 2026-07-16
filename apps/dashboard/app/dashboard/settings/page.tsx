export const dynamic = "force-dynamic";

import { clinicSettingsRepository } from "@novadent/database";
import { PageHeader } from "@novadent/ui";
import type { ClinicSettingRecord, WorkingHours } from "@novadent/types";

import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const settings = await clinicSettingsRepository.getSettings();

  const normalizedSettings: ClinicSettingRecord | null = settings
    ? {
        ...settings,
        workingHours: (settings.workingHours ?? {}) as unknown as WorkingHours,
        vapiConfig: (settings.vapiConfig ?? {}) as Record<string, unknown>,
        notificationSettings: (settings.notificationSettings ?? {}) as Record<string, unknown>,
      }
    : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Clinic profile, working hours, and automation configuration." />
      <SettingsForm settings={normalizedSettings} />
    </div>
  );
}
