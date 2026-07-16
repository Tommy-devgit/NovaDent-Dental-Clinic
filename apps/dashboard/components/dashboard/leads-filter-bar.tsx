"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@novadent/ui";
import { LEAD_STATUSES, LEAD_URGENCIES } from "@novadent/utils";

const ALL_VALUE = "ALL";

export function LeadsFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

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
      router.push(`/dashboard/leads?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form
        className="relative flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ q: query || undefined });
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, phone, email, or reason"
          className="pl-9"
        />
      </form>

      <Select
        defaultValue={searchParams.get("status") ?? ALL_VALUE}
        onValueChange={(value) => updateParams({ status: value })}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All statuses</SelectItem>
          {LEAD_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("urgency") ?? ALL_VALUE}
        onValueChange={(value) => updateParams({ urgency: value })}
      >
        <SelectTrigger className="sm:w-44">
          <SelectValue placeholder="Urgency" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All urgencies</SelectItem>
          {LEAD_URGENCIES.map((urgency) => (
            <SelectItem key={urgency} value={urgency}>
              {urgency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending ? <span className="text-xs text-muted-foreground">Updating…</span> : null}
    </div>
  );
}
