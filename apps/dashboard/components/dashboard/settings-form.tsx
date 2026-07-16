"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "@novadent/ui";
import type { ClinicSettingRecord, WorkingHours } from "@novadent/types";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

function defaultWorkingHours(): WorkingHours {
  return Object.fromEntries(
    DAYS.map((day) => [day, { open: "09:00", close: "17:00", closed: day === "sunday" }]),
  ) as WorkingHours;
}

export function SettingsForm({ settings }: { settings: ClinicSettingRecord | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinicName, setClinicName] = useState(settings?.clinicName ?? "");
  const [address, setAddress] = useState(settings?.address ?? "");
  const [phone, setPhone] = useState(settings?.phone ?? "");
  const [email, setEmail] = useState(settings?.email ?? "");
  const [timezone, setTimezone] = useState(settings?.timezone ?? "UTC");
  const [workingHours, setWorkingHours] = useState<WorkingHours>(settings?.workingHours ?? defaultWorkingHours());
  const [vapiConfigText, setVapiConfigText] = useState(JSON.stringify(settings?.vapiConfig ?? {}, null, 2));
  const [notificationSettingsText, setNotificationSettingsText] = useState(
    JSON.stringify(settings?.notificationSettings ?? {}, null, 2),
  );
  const [jsonError, setJsonError] = useState<string | null>(null);

  function updateDay(day: string, patch: Partial<{ open: string; close: string; closed: boolean }>) {
    setWorkingHours((current) => ({
      ...current,
      [day]: { ...current[day], ...patch },
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJsonError(null);

    let vapiConfig: Record<string, unknown>;
    let notificationSettings: Record<string, unknown>;

    try {
      vapiConfig = JSON.parse(vapiConfigText);
      notificationSettings = JSON.parse(notificationSettingsText);
    } catch {
      setJsonError("Vapi config and notification settings must be valid JSON.");
      return;
    }

    setIsSubmitting(true);
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clinicName,
        address,
        phone,
        email,
        timezone,
        workingHours,
        vapiConfig,
        notificationSettings,
      }),
    });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error("Couldn't save settings");
      return;
    }

    toast.success("Settings saved");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinic information</CardTitle>
          <CardDescription>Shown to patients and used across the automation workflow.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Clinic name">
            <Input value={clinicName} onChange={(event) => setClinicName(event.target.value)} required />
          </Field>
          <Field label="Address">
            <Input value={address} onChange={(event) => setAddress(event.target.value)} required />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          <Field label="Timezone">
            <Input value={timezone} onChange={(event) => setTimezone(event.target.value)} required />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Working hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {DAYS.map((day) => {
            const window = workingHours[day] ?? { open: "09:00", close: "17:00", closed: false };
            return (
              <div key={day} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
                <span className="w-24 text-sm font-medium capitalize text-foreground">{day}</span>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={window.closed ?? false}
                    onChange={(event) => updateDay(day, { closed: event.target.checked })}
                  />
                  Closed
                </label>
                {!window.closed ? (
                  <>
                    <Input
                      type="time"
                      value={window.open}
                      onChange={(event) => updateDay(day, { open: event.target.value })}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      type="time"
                      value={window.close}
                      onChange={(event) => updateDay(day, { close: event.target.value })}
                      className="w-32"
                    />
                  </>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation settings</CardTitle>
          <CardDescription>Advanced Vapi configuration and notification preferences, stored as JSON.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Vapi config">
            <Textarea
              value={vapiConfigText}
              onChange={(event) => setVapiConfigText(event.target.value)}
              rows={6}
              className="font-mono text-xs"
            />
          </Field>
          <Field label="Notification settings">
            <Textarea
              value={notificationSettingsText}
              onChange={(event) => setNotificationSettingsText(event.target.value)}
              rows={6}
              className="font-mono text-xs"
            />
          </Field>
          {jsonError ? <p className="text-sm text-destructive">{jsonError}</p> : null}
        </CardContent>
      </Card>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
