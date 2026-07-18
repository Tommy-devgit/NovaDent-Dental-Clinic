"use client";

import { Star } from "lucide-react";
import { motion } from "motion/react";

import { Reveal, revealItemVariants } from "../motion/reveal";

const TESTIMONIALS = [
  {
    quote:
      "I described my toothache to the AI assistant at 11pm and had a same-day appointment confirmed before I woke up.",
    name: "Sarah M.",
    role: "Patient since 2024",
  },
  {
    quote: "No more waiting on hold. It understood exactly how urgent my case was and got me seen fast.",
    name: "James O.",
    role: "Patient since 2023",
  },
  {
    quote: "The front desk already knew my situation by the time I called back — genuinely saved me time.",
    name: "Priya K.",
    role: "Patient since 2024",
  },
  {
    quote:
      "Dr. Reyes walked me through the whole implant timeline before I even sat in the chair, because the assistant had already logged my concerns.",
    name: "Marcus T.",
    role: "Patient since 2021",
  },
  {
    quote: "Booked my daughter's orthodontics consult over text during my lunch break. Took maybe three minutes.",
    name: "Elena V.",
    role: "Patient since 2022",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Testimonials</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What patients say about NovaDent
          </h2>
        </Reveal>

        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {TESTIMONIALS.map((item) => (
            <motion.blockquote
              key={item.name}
              variants={revealItemVariants}
              className="rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-base leading-7 text-foreground">“{item.quote}”</p>
              <footer className="mt-6 text-sm">
                <p className="font-semibold text-foreground">{item.name}</p>
                <p className="text-muted-foreground">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
