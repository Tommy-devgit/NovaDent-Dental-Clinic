"use client";

import { CalendarClock, CheckCircle2, MoreHorizontal, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@novadent/ui";
import type { AppointmentStatus } from "@novadent/types";

async function updateStatus(id: string, status: AppointmentStatus) {
  const response = await fetch(`/api/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  return response.ok;
}

export function AppointmentActions({
  appointmentId,
  status,
  scheduledFor,
}: {
  appointmentId: string;
  status: AppointmentStatus;
  scheduledFor: Date;
}) {
  const router = useRouter();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [nextDate, setNextDate] = useState(() => toDateTimeLocal(scheduledFor));
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleStatusChange(next: AppointmentStatus) {
    const ok = await updateStatus(appointmentId, next);
    if (!ok) {
      toast.error("Couldn't update appointment");
      return;
    }
    toast.success(`Appointment ${next.toLowerCase()}`);
    router.refresh();
  }

  async function handleReschedule() {
    setIsSubmitting(true);
    const response = await fetch(`/api/appointments/${appointmentId}/reschedule`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledFor: new Date(nextDate).toISOString() }),
    });
    setIsSubmitting(false);

    if (!response.ok) {
      toast.error("Couldn't reschedule appointment");
      return;
    }

    toast.success("Appointment rescheduled");
    setRescheduleOpen(false);
    router.refresh();
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Appointment actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled={status === "CONFIRMED"} onSelect={() => handleStatusChange("CONFIRMED")}>
            <CheckCircle2 className="mr-2 size-4" />
            Confirm
          </DropdownMenuItem>
          <DropdownMenuItem disabled={status === "COMPLETED"} onSelect={() => handleStatusChange("COMPLETED")}>
            <CheckCircle2 className="mr-2 size-4" />
            Mark completed
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRescheduleOpen(true)}>
            <CalendarClock className="mr-2 size-4" />
            Reschedule
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={status === "CANCELLED"}
            onSelect={() => handleStatusChange("CANCELLED")}
            className="text-destructive focus:text-destructive"
          >
            <XCircle className="mr-2 size-4" />
            Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule appointment</DialogTitle>
          </DialogHeader>
          <Input type="datetime-local" value={nextDate} onChange={(event) => setNextDate(event.target.value)} />
          <DialogFooter>
            <Button onClick={handleReschedule} disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save new time"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function toDateTimeLocal(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}
