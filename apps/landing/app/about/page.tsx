import type { Metadata } from "next";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { DoctorsSection } from "@/components/sections/doctors-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about NovaDent's mission to make dental care faster and more accessible with AI-powered intake.",
};

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
        </div>
      </section>

      <DoctorsSection />
      <WhyChooseSection />
    </MarketingShell>
  );
}
