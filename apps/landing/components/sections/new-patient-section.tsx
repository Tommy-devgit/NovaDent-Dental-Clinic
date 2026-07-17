"use client";

import { AlertTriangle, ClipboardList, IdCard, ShieldCheck } from "lucide-react";

import { Button, Card, CardContent } from "@novadent/ui";

import { openBooking } from "@/lib/booking-events";

const CHECKLIST = [
  {
    icon: IdCard,
    title: "Bring a photo ID and insurance card",
    description: "We'll verify benefits before your visit if you share your provider during intake.",
  },
  {
    icon: ClipboardList,
    title: "Arrive 15 minutes early",
    description: "First visits include digital X-rays and a full exam, so we leave extra time to get you settled.",
  },
  {
    icon: ShieldCheck,
    title: "Share your medical history",
    description: "Medications, allergies, and past procedures help your dentist plan treatment safely.",
  },
];

export function NewPatientSection() {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">First Visit</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What to expect as a new patient
          </h2>
          <div className="mt-8 space-y-6">
            {CHECKLIST.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="h-fit border-warning/30 bg-warning/5">
          <CardContent className="p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-warning/15 text-warning">
              <AlertTriangle className="size-5" />
            </span>
            <p className="mt-4 text-lg font-semibold text-foreground">Dental emergency?</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Severe pain, a knocked-out tooth, or facial swelling need same-day attention. Start a conversation with
              the assistant and say it&apos;s urgent — we hold same-day slots for exactly this, seven days a week.
            </p>
            <Button className="mt-6" variant="outline" onClick={() => openBooking()}>
              Request urgent appointment
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
