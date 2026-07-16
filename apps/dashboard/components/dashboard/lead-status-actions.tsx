"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@novadent/ui";
import type { LeadStatus } from "@novadent/types";

const STATUS_ACTIONS: { status: LeadStatus; label: string; variant: "default" | "outline" | "destructive" }[] = [
  { status: "CONTACTED", label: "Mark Contacted", variant: "outline" },
  { status: "BOOKED", label: "Mark Booked", variant: "default" },
  { status: "COMPLETED", label: "Mark Completed", variant: "outline" },
  { status: "CLOSED", label: "Close Lead", variant: "destructive" },
];

export function LeadStatusActions({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  function updateStatus(status: LeadStatus) {
    setPendingStatus(status);
    startTransition(async () => {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note.trim() || undefined }),
      });

      if (!response.ok) {
        toast.error("Couldn't update lead status");
        setPendingStatus(null);
        return;
      }

      toast.success(`Lead marked ${status.toLowerCase()}`);
      setNote("");
      setPendingStatus(null);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {STATUS_ACTIONS.map((action) => (
            <Button
              key={action.status}
              variant={action.variant}
              size="sm"
              disabled={isPending || currentStatus === action.status}
              onClick={() => updateStatus(action.status)}
            >
              {isPending && pendingStatus === action.status ? "Saving…" : action.label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="lead-note" className="text-sm font-medium text-foreground">
            Add a note (optional)
          </label>
          <Textarea
            id="lead-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Recorded with your next status update"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
