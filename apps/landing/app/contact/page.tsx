import type { Metadata } from "next";

import { MarketingShell } from "@/components/layout/marketing-shell";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { NewPatientSection } from "@/components/sections/new-patient-section";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with NovaDent by phone, email, or by talking to our AI assistant.",
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="px-6 pt-20 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Contact</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            We&apos;d love to see you
          </h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">
            The fastest way to reach us is through the AI assistant — available any time, day or night. Prefer to
            call or stop by? We&apos;re happy to help that way too.
          </p>
        </div>
      </section>

      <ContactSection />
      <NewPatientSection />
      <FaqSection />
    </MarketingShell>
  );
}
