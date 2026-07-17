import type { Metadata } from "next";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { InsuranceSection } from "@/components/sections/insurance-section";
import { ServicesSection } from "@/components/sections/services-section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore NovaDent's dental services, from routine cleanings to emergency care, cosmetic dentistry, and implants — plus insurance and payment details.",
};

export default function ServicesPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Dental Services</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Every service, routed the moment you ask
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            Describe your symptoms or what you&apos;re looking for to our AI assistant, and you&apos;ll be pointed to the
            right service and next steps immediately — no need to know the exact procedure name yourself.
          </p>
        </div>
      </section>

      <ServicesSection />
      <HowItWorksSection />
      <InsuranceSection />
    </MarketingShell>
  );
}
