import { Check } from "lucide-react";

import { Card, CardContent } from "@novadent/ui";

const NHS_AND_PLANS = [
  "NHS dental treatment (Bands 1–3)",
  "Denplan Essentials",
  "Denplan Care",
  "Practice membership plan",
  "BUPA Dental",
  "Simplyhealth",
  "AXA Health",
  "Vitality Health",
];

const PAYMENT_OPTIONS = [
  "0% interest-free monthly payment plans available for treatment over £500",
  "Finance options through our approved credit partner — apply in minutes",
  "All major debit and credit cards accepted",
  "We confirm your exact costs in writing before any treatment begins",
];

export function InsuranceSection() {
  return (
    <section id="insurance" className="bg-secondary/40 px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">NHS & Payment</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            NHS, private, and flexible payment options
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We offer both NHS and private dental care. Tell the assistant whether you&apos;re looking for NHS or
            private treatment and we&apos;ll confirm availability and costs before you arrive.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">NHS &amp; plans we accept</p>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {NHS_AND_PLANS.map((plan) => (
                  <li key={plan} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {plan}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Not on a plan? Private pay is always available — we&apos;ll confirm exact costs before any treatment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">Ways to spread the cost</p>
              <ul className="mt-4 space-y-3">
                {PAYMENT_OPTIONS.map((option) => (
                  <li key={option} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {option}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
