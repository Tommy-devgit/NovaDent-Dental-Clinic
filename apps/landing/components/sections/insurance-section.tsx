import { Check } from "lucide-react";

import { Card, CardContent } from "@novadent/ui";

const ACCEPTED_PLANS = [
  "Delta Dental",
  "Cigna Dental",
  "MetLife",
  "Aetna",
  "Guardian",
  "United Concordia",
  "Humana",
  "Blue Cross Blue Shield Dental",
];

const PAYMENT_OPTIONS = [
  "In-network and out-of-network insurance billing handled in-house",
  "CareCredit and Sunbit financing for larger treatment plans",
  "HSA and FSA cards accepted at checkout",
  "Transparent, itemized estimates before any procedure begins",
];

export function InsuranceSection() {
  return (
    <section id="insurance" className="bg-secondary/40 px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Insurance & Payment</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Straightforward coverage, no surprise bills
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Mention your insurance provider during intake and our assistant flags it for the front desk, so your
            benefits are verified before you arrive.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">Plans we bill directly</p>
              <ul className="mt-4 grid grid-cols-2 gap-3">
                {ACCEPTED_PLANS.map((plan) => (
                  <li key={plan} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="size-4 shrink-0 text-primary" />
                    {plan}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Not seeing your plan? We still accept most PPO coverage — ask the assistant to confirm.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="font-semibold text-foreground">Ways to pay</p>
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
