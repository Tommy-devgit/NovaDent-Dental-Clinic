"use client";

import { CalendarCheck, PhoneCall, ShieldCheck, Stethoscope } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { Button } from "@novadent/ui";

import { openBooking } from "@/lib/booking-events";

import { HeroAssistantCard } from "../vapi/hero-assistant-card";

const TRUST_INDICATORS = [
  { icon: ShieldCheck, label: "UK GDPR compliant" },
  { icon: Stethoscope, label: "Licensed dental team" },
  { icon: CalendarCheck, label: "Same-week availability" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", prefersReducedMotion ? "0%" : "12%"]);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
      <motion.div aria-hidden className="absolute inset-0 -z-20" style={{ y: imageY }}>
        <Image
          src="/images/hero-dental-office.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/92 to-background/55"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-transparent to-background"
      />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Meet NovaDent&apos;s AI receptionist.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Talk or type, any time of day. Ask about symptoms, understand your options, and request an appointment
            in a two-minute conversation — no hold music, no waiting.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => openBooking()}>
              Book Appointment
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="tel:+447863789108">
                <PhoneCall className="size-4" />
                +44 7863 789108
              </Link>
            </Button>
          </div>

          <dl className="mt-12 mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {TRUST_INDICATORS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-foreground">
                  <Icon className="size-4" />
                </span>
                {label}
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <HeroAssistantCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
