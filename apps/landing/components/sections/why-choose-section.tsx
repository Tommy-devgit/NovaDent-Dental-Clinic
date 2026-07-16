import { Award, Bot, Cpu, HeartHandshake, Zap } from "lucide-react";

const REASONS = [
  {
    icon: Award,
    title: "Experienced Dentists",
    description: "Every case is reviewed by licensed dentists with years of clinical practice.",
  },
  {
    icon: Cpu,
    title: "Modern Equipment",
    description: "Digital imaging and up-to-date tools mean faster, more accurate diagnoses.",
  },
  {
    icon: Bot,
    title: "AI Assistant Support",
    description: "Get real answers about symptoms and care paths before you ever pick up the phone.",
  },
  {
    icon: Zap,
    title: "Fast Scheduling",
    description: "Requests routed instantly to our front desk — most patients hear back same-day.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    description: "Your history and preferences travel with you, so every visit feels familiar.",
  },
];

export function WhyChooseSection() {
  return (
    <section id="why-choose-us" className="bg-secondary/40 px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Why Choose NovaDent</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A modern clinic built around getting you seen faster
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {REASONS.map((reason) => (
            <div key={reason.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <reason.icon className="size-5" />
              </span>
              <p className="mt-4 font-semibold text-foreground">{reason.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
