import type { Metadata } from "next";
import { CalendarClock, GraduationCap, MapPinned } from "lucide-react";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { DoctorsSection } from "@/components/sections/doctors-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ValuesSection } from "@/components/sections/values-section";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "NovaDent is a Bristol dental practice pairing GDC-registered dentists with an AI intake assistant, so care starts the moment you reach out.",
};

const TIMELINE = [
  {
    year: "2014",
    title: "NovaDent opens its doors",
    description: "Founded by Dr. Amina Patel with a single chair and a simple goal: make good dental care easy to reach.",
  },
  {
    year: "2018",
    title: "Orthodontics and implants added",
    description: "Dr. Noah Chen and Dr. Sofia Reyes joined, expanding the practice to full-mouth restorative care.",
  },
  {
    year: "2023",
    title: "Digital imaging suite installed",
    description: "In-house 3D imaging cut implant planning time and improved same-day diagnosis accuracy.",
  },
  {
    year: "2025",
    title: "AI-assisted intake launches",
    description: "Our voice and chat assistant went live to handle scheduling and triage outside office hours.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">About NovaDent</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Dental care that meets you where you are
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            NovaDent was built on a simple idea: getting dental care shouldn&apos;t start with hold music. Our AI
            assistant handles intake the moment you reach out, so our licensed dentists and front desk team can
            focus on what they do best — treating patients well.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPinned className="size-4 text-primary" />
              Bristol, since 2014
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="size-4 text-primary" />3 licensed dentists on staff
            </span>
            <span className="flex items-center gap-2">
              <CalendarClock className="size-4 text-primary" />
              Same-week availability
            </span>
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Our Story</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A decade of growing alongside our patients
            </h2>
          </div>

          <div className="relative mt-14 space-y-10 border-l border-border pl-8">
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative">
                <span className="absolute -left-9.25 top-1 size-2.5 rounded-full bg-primary" />
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.year}</p>
                <p className="mt-1 text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DoctorsSection />
      <ValuesSection />
    </MarketingShell>
  );
}
