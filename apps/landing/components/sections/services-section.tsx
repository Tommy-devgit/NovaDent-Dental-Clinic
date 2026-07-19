"use client";

import { Sparkle, Droplets, Hammer, AlignCenter, Anchor, Siren, Gem } from "lucide-react";
import { motion } from "motion/react";

import { Badge, Button, Card, CardContent, CardDescription, CardTitle } from "@novadent/ui";

import { openAssistant } from "@/lib/assistant-events";

import { Reveal, RevealGroup, RevealItem } from "../motion/reveal";

const SERVICES = [
  {
    icon: Droplets,
    name: "Teeth Cleaning",
    description: "Routine hygiene visits that catch problems early and keep your smile healthy.",
    duration: "45 min visit",
    cadence: "Every 6 months",
  },
  {
    icon: Sparkle,
    name: "Teeth Whitening",
    description: "Professional-grade whitening for noticeably brighter results in a single visit.",
    duration: "60–90 min visit",
    cadence: "In-office or take-home kit",
  },
  {
    icon: Hammer,
    name: "Fillings",
    description: "Comfortable, tooth-coloured fillings that restore strength without the stares.",
    duration: "30–45 min visit",
    cadence: "Same-week scheduling",
  },
  {
    icon: AlignCenter,
    name: "Braces & Aligners",
    description: "Modern orthodontic options for kids and adults, mapped out from day one.",
    duration: "12–24 month plans",
    cadence: "Free consult first",
  },
  {
    icon: Anchor,
    name: "Implants",
    description: "Permanent, natural-feeling replacements backed by careful surgical planning.",
    duration: "3–6 month process",
    cadence: "3D imaging included",
  },
  {
    icon: Siren,
    name: "Emergency Dental Care",
    description: "Same-day triage for sudden pain, breaks, or swelling — talk to us any time.",
    duration: "Seen within hours",
    cadence: "Available 7 days a week",
  },
  {
    icon: Gem,
    name: "Cosmetic Dentistry",
    description: "Veneers, bonding, and smile design tailored to how you want to look and feel.",
    duration: "1–3 visits",
    cadence: "Digital smile preview",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Services</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Dental care designed for quick, confident routing
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Tell the AI assistant what&apos;s going on and get routed to the right service — no guesswork, no waiting on
            hold.
          </p>
          <Button className="mt-6" variant="outline" onClick={openAssistant}>
            Ask About Dental Services
          </Button>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <RevealItem key={service.name}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }} className="h-full">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                      <service.icon className="size-5" />
                    </span>
                    <CardTitle className="mt-4">{service.name}</CardTitle>
                    <CardDescription className="mt-2 leading-6">{service.description}</CardDescription>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary">{service.duration}</Badge>
                      <Badge variant="outline">{service.cadence}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
