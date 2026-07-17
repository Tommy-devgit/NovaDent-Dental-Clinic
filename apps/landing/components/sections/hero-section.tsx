"use client";

import { CalendarCheck, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import Image from "next/image";

import { Button } from "@novadent/ui";

import { openBooking } from "@/lib/booking-events";

import { HeroAssistantCard } from "../vapi/hero-assistant-card";

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: "HIPAA-conscious intake" },
  { icon: Stethoscope, label: "Licensed dental team" },
  { icon: CalendarCheck, label: "Same-week availability" },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div aria-hidden className="absolute inset-0 -z-20">
        <Image
          src="/hero-medical-bg.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/70 to-background"
      />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" />
            AI-Powered Dental Clinic
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Meet NovaDent&apos;s AI receptionist.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Talk or type, any time of day. Ask about symptoms, understand your options, and request an appointment
            in a two-minute conversation — no hold music, no waiting.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" variant="outline" onClick={() => openBooking()}>
              Book Appointment
            </Button>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-foreground">
                  <Icon className="size-4" />
                </span>
                {label}
              </div>
            ))}
          </dl>
        </div>

        <HeroAssistantCard />
      </div>
    </section>
  );
}
