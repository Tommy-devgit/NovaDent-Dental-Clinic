"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@novadent/ui";
import { ACTIVITY_ACTIONS } from "@novadent/utils";

import { ACTIVITY_LABEL } from "@/lib/activity-meta";

const ALL_VALUE = "ALL";
const RESOURCE_TYPES = ["PatientLead", "Appointment", "ConversationLog", "StaffUser"] as const;

export function AuditFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (!value || value === ALL_VALUE) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/dashboard/activity?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Select
        defaultValue={searchParams.get("action") ?? ALL_VALUE}
        onValueChange={(value) => updateParams({ action: value })}
      >
        <SelectTrigger className="sm:w-64">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All actions</SelectItem>
          {ACTIVITY_ACTIONS.map((action) => (
            <SelectItem key={action} value={action}>
              {ACTIVITY_LABEL[action]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("resourceType") ?? ALL_VALUE}
        onValueChange={(value) => updateParams({ resourceType: value })}
      >
        <SelectTrigger className="sm:w-52">
          <SelectValue placeholder="Resource" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All resources</SelectItem>
          {RESOURCE_TYPES.map((resource) => (
            <SelectItem key={resource} value={resource}>
              {resource}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending ? <span className="text-xs text-muted-foreground">Updating…</span> : null}
    </div>
  );
}
