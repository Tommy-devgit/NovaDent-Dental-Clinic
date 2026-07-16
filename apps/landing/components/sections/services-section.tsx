import { Sparkle, Droplets, Hammer, AlignCenter, Anchor, Siren, Gem } from "lucide-react";

import { Card, CardContent, CardDescription, CardTitle } from "@novadent/ui";

const SERVICES = [
  {
    icon: Droplets,
    name: "Teeth Cleaning",
    description: "Routine hygiene visits that catch problems early and keep your smile healthy.",
  },
  {
    icon: Sparkle,
    name: "Teeth Whitening",
    description: "Professional-grade whitening for noticeably brighter results in a single visit.",
  },
  {
    icon: Hammer,
    name: "Fillings",
    description: "Comfortable, tooth-colored fillings that restore strength without the stares.",
  },
  {
    icon: AlignCenter,
    name: "Braces",
    description: "Modern orthodontic options for kids and adults, mapped out from day one.",
  },
  {
    icon: Anchor,
    name: "Implants",
    description: "Permanent, natural-feeling replacements backed by careful surgical planning.",
  },
  {
    icon: Siren,
    name: "Emergency Dental Care",
    description: "Same-day triage for sudden pain, breaks, or swelling — talk to us any time.",
  },
  {
    icon: Gem,
    name: "Cosmetic Dentistry",
    description: "Veneers, bonding, and smile design tailored to how you want to look and feel.",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Services</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Dental care designed for quick, confident routing
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Tell the AI assistant what&apos;s going on and get routed to the right service — no guesswork, no waiting on
            hold.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Card key={service.name} className="transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <service.icon className="size-5" />
                </span>
                <CardTitle className="mt-4">{service.name}</CardTitle>
                <CardDescription className="mt-2 leading-6">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
