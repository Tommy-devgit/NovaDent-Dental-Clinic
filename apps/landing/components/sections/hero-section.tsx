"use client";

import { CalendarCheck, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import Link from "next/link";

import { Button } from "@novadent/ui";

import { openAssistant } from "@/lib/assistant-events";

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: "HIPAA-conscious intake" },
  { icon: Stethoscope, label: "Licensed dental team" },
  { icon: CalendarCheck, label: "Same-week availability" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-secondary to-transparent"
      />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="size-3.5" />
            AI-Powered Dental Clinic
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Care feels faster when you can talk to NovaDent first.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Ask about symptoms, understand your options, and request an appointment in a two-minute conversation
            with our AI assistant — no hold music, no forms, available around the clock.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={openAssistant}>
              Talk to NovaDent AI
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Book Appointment</Link>
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

        <div className="relative">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
            <p className="text-sm font-medium text-muted-foreground">NovaDent AI Assistant</p>
            <div className="mt-6 space-y-3">
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm leading-6 text-foreground">
                Hi, I&apos;ve had a sharp toothache since yesterday. Can you help?
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground">
                That sounds urgent — I can flag this for same-day care. Can I get your name and best callback number?
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm leading-6 text-foreground">
                Sure, it&apos;s Sarah, and this is my cell.
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-accent-soft px-4 py-3 text-sm font-medium text-accent-foreground">
              Connection status: ready for voice session handoff
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
