import type { Metadata } from "next";

import { MarketingShell } from "@/components/layout/marketing-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How NovaDent collects, uses, and protects patient information under UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {new Date().getFullYear()}</p>

          <div className="mt-6 rounded-lg border border-border bg-secondary/60 px-5 py-4 text-sm leading-6 text-muted-foreground">
            <strong className="font-semibold text-foreground">Important notice.</strong> This is a template privacy
            policy and must be reviewed and approved by a qualified data protection adviser before this website goes
            live. It does not constitute legal advice.
          </div>

          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            <section>
              <h2 className="text-lg font-semibold text-foreground">1. Who we are</h2>
              <p className="mt-2">
                NovaDent Dental Practice (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data
                controller for personal data collected through this website and our AI assistant. Our registered
                address is 12 Cavendish Street, Bristol, BS1 4DJ. You can contact us at{" "}
                <a href="mailto:hello@novadent.com" className="underline hover:text-foreground">
                  hello@novadent.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">2. What personal data we collect</h2>
              <p className="mt-2">We collect the following categories of data when you use our website or AI assistant:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-medium text-foreground">Identity data:</strong> your name
                </li>
                <li>
                  <strong className="font-medium text-foreground">Contact data:</strong> phone number, email address
                </li>
                <li>
                  <strong className="font-medium text-foreground">Health and dental data (special-category):</strong>{" "}
                  symptoms, reason for visit, dental history shared during intake conversations
                </li>
                <li>
                  <strong className="font-medium text-foreground">Voice and transcript data:</strong> recordings and
                  transcripts of AI assistant calls, and AI-generated summaries of those conversations
                </li>
                <li>
                  <strong className="font-medium text-foreground">Usage data:</strong> pages visited, browser type,
                  and device information collected automatically via server logs
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">3. Lawful bases for processing</h2>
              <p className="mt-2">We rely on the following lawful bases under UK GDPR:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-medium text-foreground">Consent (Article 6(1)(a)):</strong> for marketing
                  communications and optional cookies
                </li>
                <li>
                  <strong className="font-medium text-foreground">Legitimate interests (Article 6(1)(f)):</strong>{" "}
                  for operating and improving our AI assistant and website, and for appointment scheduling
                </li>
                <li>
                  <strong className="font-medium text-foreground">
                    Healthcare provision — special-category data (Article 9(2)(h)):
                  </strong>{" "}
                  health and dental information is processed for the purpose of preventive or occupational medicine,
                  assessment of working capacity, medical diagnosis, or the provision of health care
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">4. How we use your information</h2>
              <p className="mt-2">We use the data we collect to:</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>Triage the urgency of your dental query and route it to the correct clinical team</li>
                <li>Book, confirm, and manage appointments</li>
                <li>Follow up with you about your care</li>
                <li>Improve the accuracy and safety of our AI assistant</li>
                <li>Meet our legal and regulatory obligations</li>
              </ul>
              <p className="mt-3">
                We do not sell your personal data. We do not use it for third-party advertising.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">5. Sub-processors</h2>
              <p className="mt-2">
                We share data with the following third-party sub-processors as necessary to deliver our services.
                Each is contractually bound to appropriate data protection obligations:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-medium text-foreground">Vapi</strong> — voice AI infrastructure; processes
                  call audio and generates transcripts
                </li>
                <li>
                  <strong className="font-medium text-foreground">ElevenLabs</strong> — AI voice synthesis used
                  within the assistant
                </li>
                <li>
                  <strong className="font-medium text-foreground">OpenAI</strong> — large language model used to
                  understand and respond to patient queries
                </li>
                <li>
                  <strong className="font-medium text-foreground">n8n</strong> — workflow automation that routes
                  intake data from the assistant to our clinical team
                </li>
                <li>
                  <strong className="font-medium text-foreground">Neon</strong> — cloud Postgres database hosting
                  where appointment and conversation records are stored
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">6. Data retention</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5">
                <li>Appointment and contact records: 7 years from the date of last contact</li>
                <li>Call recordings and transcripts: 2 years from the date of the call</li>
                <li>
                  Clinical records (where applicable): in accordance with NHS Records Management Code of Practice
                  (minimum 10 years for adults)
                </li>
                <li>Audit logs: 7 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">7. Your data-subject rights</h2>
              <p className="mt-2">
                Under UK GDPR you have the right to:
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5">
                <li>
                  <strong className="font-medium text-foreground">Access</strong> — request a copy of the personal
                  data we hold about you
                </li>
                <li>
                  <strong className="font-medium text-foreground">Rectification</strong> — ask us to correct
                  inaccurate or incomplete data
                </li>
                <li>
                  <strong className="font-medium text-foreground">Erasure</strong> — request deletion of your data
                  where we no longer have a lawful basis to retain it
                </li>
                <li>
                  <strong className="font-medium text-foreground">Portability</strong> — receive your data in a
                  structured, machine-readable format
                </li>
                <li>
                  <strong className="font-medium text-foreground">Objection</strong> — object to processing carried
                  out on the basis of legitimate interests
                </li>
                <li>
                  <strong className="font-medium text-foreground">Restriction</strong> — request that we restrict
                  processing of your data in certain circumstances
                </li>
                <li>
                  <strong className="font-medium text-foreground">Withdraw consent</strong> — where processing is
                  based on consent, you may withdraw it at any time without affecting prior processing
                </li>
              </ul>
              <p className="mt-3">
                To exercise any right, contact us at{" "}
                <a href="mailto:hello@novadent.com" className="underline hover:text-foreground">
                  hello@novadent.com
                </a>
                . We will respond within one calendar month.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">8. Complaints</h2>
              <p className="mt-2">
                If you believe we have not handled your data correctly, you have the right to lodge a complaint with
                the Information Commissioner&apos;s Office (ICO), the UK&apos;s data protection regulator.
              </p>
              <p className="mt-2">
                ICO website:{" "}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  ico.org.uk
                </a>{" "}
                &mdash; Helpline: 0303 123 1113
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">9. Changes to this policy</h2>
              <p className="mt-2">
                We may update this policy from time to time. Material changes will be communicated by updating the
                date at the top of this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground">10. Contact us</h2>
              <p className="mt-2">
                For any privacy-related questions, contact us at{" "}
                <a href="mailto:hello@novadent.com" className="underline hover:text-foreground">
                  hello@novadent.com
                </a>{" "}
                or write to NovaDent Dental Practice, 12 Cavendish Street, Bristol, BS1 4DJ.
              </p>
            </section>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
