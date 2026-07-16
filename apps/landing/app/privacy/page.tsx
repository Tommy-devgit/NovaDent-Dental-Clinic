import type { Metadata } from "next";

import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NovaDent collects, uses, and protects patient information.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">Information we collect</h2>
              <p className="mt-2">
                When you talk to our AI assistant, request an appointment, or contact us directly, we collect
                information such as your name, phone number, email address, reason for your visit, and relevant
                symptoms. Voice conversations may be transcribed and summarized to support your care.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">How we use your information</h2>
              <p className="mt-2">
                We use the information you share to triage urgency, route your request to our clinical and front
                desk teams, schedule appointments, and follow up with you about your care. We do not sell your
                information or use it for third-party advertising.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">How your information is stored</h2>
              <p className="mt-2">
                Conversation and appointment data collected through our AI assistant is processed through our
                automation workflow and stored securely in our clinic management system, accessible only to
                authorized staff.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">Your choices</h2>
              <p className="mt-2">
                You can request access to, correction of, or deletion of your information at any time by
                contacting us directly. You&apos;re always welcome to reach us by phone or in person instead of the AI
                assistant.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">Contact us</h2>
              <p className="mt-2">
                Questions about this policy can be directed to hello@novadent.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
