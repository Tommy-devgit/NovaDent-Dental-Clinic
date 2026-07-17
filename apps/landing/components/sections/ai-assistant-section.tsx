"use client";

import { CalendarPlus, HelpCircle, ListChecks, MessagesSquare, Sparkles } from "lucide-react";

import { Button } from "@novadent/ui";

import { openAssistant } from "@/lib/assistant-events";

const CAPABILITIES = [
  { icon: HelpCircle, label: "Answers questions about care and treatment" },
  { icon: ListChecks, label: "Explains services and what to expect" },
  { icon: MessagesSquare, label: "Collects patient information securely" },
  { icon: CalendarPlus, label: "Requests appointments on your behalf" },
];

export function AiAssistantSection() {
  return (
    <section id="ai-assistant" className="scroll-mt-24 px-6 pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-primary px-8 py-14 text-primary-foreground shadow-xl sm:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="size-3.5" />
              NovaDent AI Assistant
            </span>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              A front desk that never sleeps
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">
              Talk it through by voice, get routed to the right service, and have your appointment request land
              directly with our team — powered by Vapi voice AI and automated through n8n into our clinic system.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-blue-50"
                onClick={openAssistant}
              >
                Start voice conversation
              </Button>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((item) => (
              <li key={item.label} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icon className="size-4" />
                </span>
                <span className="text-sm leading-6 text-blue-50">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
