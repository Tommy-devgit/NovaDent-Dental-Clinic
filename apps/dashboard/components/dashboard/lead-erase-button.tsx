"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@novadent/ui";

interface LeadEraseButtonProps {
  leadId: string;
  patientName: string;
}

export function LeadEraseButton({ leadId, patientName }: LeadEraseButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleErase() {
    startTransition(async () => {
      const response = await fetch(`/api/leads/${leadId}`, { method: "DELETE" });

      if (!response.ok) {
        toast.error("Couldn't erase patient data");
        return;
      }

      toast.success("Patient data erased");
      setOpen(false);
      router.push("/dashboard/leads");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Erase patient (GDPR)
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Erase patient data?</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            You are about to permanently erase all data for{" "}
            <span className="font-medium text-foreground">{patientName}</span>.
          </p>
          <p>
            This will delete the lead, all associated appointments, and all conversation records.
            This action is irreversible.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleErase} disabled={isPending}>
            {isPending ? "Erasing…" : "Erase permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
