"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@novadent/ui";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
}

interface LeadAssignSelectProps {
  leadId: string;
  currentAssigneeId: string | null;
  staff: StaffMember[];
}

const UNASSIGNED_VALUE = "__unassigned__";

export function LeadAssignSelect({ leadId, currentAssigneeId, staff }: LeadAssignSelectProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    const assignedStaffUserId = value === UNASSIGNED_VALUE ? null : value;
    startTransition(async () => {
      const response = await fetch(`/api/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedStaffUserId }),
      });

      if (!response.ok) {
        toast.error("Couldn't update assignee");
        return;
      }

      toast.success(assignedStaffUserId ? "Lead assigned" : "Lead unassigned");
      router.refresh();
    });
  }

  return (
    <Select
      value={currentAssigneeId ?? UNASSIGNED_VALUE}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Assign to…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNASSIGNED_VALUE}>Unassigned</SelectItem>
        {staff.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.firstName} {member.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
