"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@novadent/ui";
import { publicAppointmentBookingSchema } from "@novadent/validations";

import { OPEN_BOOKING_EVENT, type OpenBookingDetail } from "@/lib/booking-events";

type FormInput = z.input<typeof publicAppointmentBookingSchema>;
type FormValues = z.output<typeof publicAppointmentBookingSchema>;

const DEFAULT_VALUES: FormInput = {
  patientName: "",
  phone: "",
  email: undefined,
  preferredDate: "",
  preferredTime: "",
  reasonForVisit: "",
  isNewPatient: false,
  notes: "",
};

export function AppointmentBookingModal() {
  const [open, setOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(publicAppointmentBookingSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    function handleOpenRequest(event: Event) {
      const detail = (event as CustomEvent<OpenBookingDetail>).detail;
      if (detail?.prefill) {
        form.reset({ ...DEFAULT_VALUES, ...detail.prefill });
      }
      setIsSuccess(false);
      setOpen(true);
    }

    window.addEventListener(OPEN_BOOKING_EVENT, handleOpenRequest);
    return () => window.removeEventListener(OPEN_BOOKING_EVENT, handleOpenRequest);
  }, [form]);

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/appointments/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(body?.error ?? "Couldn't submit your request. Please try again or call the clinic.");
      return;
    }

    setIsSuccess(true);
    form.reset(DEFAULT_VALUES);
  }

  // Local date, not UTC — new Date().toISOString() reports the UTC date, which is a day off
  // from "today" for anyone west of UTC in the evening and would block same-day bookings.
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setIsSuccess(false);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
              <CalendarCheck className="size-6" />
            </span>
            <DialogTitle>Request received</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Thanks — our front desk will reach out shortly to confirm your appointment time.
            </p>
            <Button className="mt-2" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Book an appointment</DialogTitle>
              <DialogDescription>Tell us a bit about what you need and we&apos;ll confirm a time.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="07863 789108" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="jane@example.com"
                            {...field}
                            value={typeof field.value === "string" ? field.value : ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred date</FormLabel>
                        <FormControl>
                          <Input type="date" min={todayIso} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reasonForVisit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for visit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Tooth pain, cleaning, consultation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isNewPatient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Are you a new patient?</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={field.value ? "default" : "outline"}
                          onClick={() => field.onChange(true)}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={!field.value ? "default" : "outline"}
                          onClick={() => field.onChange(false)}
                        >
                          No
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea rows={3} placeholder="Anything else we should know?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting…" : "Request appointment"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
