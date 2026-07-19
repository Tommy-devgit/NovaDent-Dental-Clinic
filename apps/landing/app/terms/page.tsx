import type { Metadata } from "next";

import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing your use of the NovaDent website and AI assistant.",
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Terms of Use</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">Using this site</h2>
              <p className="mt-2">
                This website provides general information about NovaDent&apos;s services and offers an AI assistant to
                help you request an appointment. It is not a substitute for professional medical or dental advice,
                diagnosis, or treatment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">The AI assistant</h2>
              <p className="mt-2">
                Our AI assistant helps triage your request and collect information for our clinical team, but does
                not provide a diagnosis. If you are experiencing a medical emergency, please call 999. For urgent
                non-emergency dental advice, call NHS 111, or attend your nearest A&amp;E.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">Appointment requests</h2>
              <p className="mt-2">
                Submitting a request through the AI assistant or contact page does not guarantee an appointment
                time. Our front desk team will confirm availability directly with you.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">Changes to these terms</h2>
              <p className="mt-2">
                We may update these terms from time to time. Continued use of the site after changes are posted
                constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">Contact us</h2>
              <p className="mt-2">Questions about these terms can be directed to hello@novadent.com.</p>
            </section>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
