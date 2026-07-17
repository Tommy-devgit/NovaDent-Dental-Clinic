import { Clock3, HeartPulse, Lock, Users } from "lucide-react";

const VALUES = [
  {
    icon: Clock3,
    title: "Your time matters",
    description:
      "No hold music, no voicemail tag. Our AI assistant is available the moment you need it, and every request reaches a real person the same day.",
  },
  {
    icon: HeartPulse,
    title: "Clinical judgment, always",
    description:
      "The assistant triages and schedules — it never diagnoses or prescribes. Every treatment decision is made by a licensed dentist during your visit.",
  },
  {
    icon: Lock,
    title: "Your records stay yours",
    description:
      "Conversation history and health details are used only to coordinate your care. We don't sell data or use it for advertising, ever.",
  },
  {
    icon: Users,
    title: "Continuity across visits",
    description:
      "Notes from your intake conversation travel with your chart, so the dentist you see already has context before you sit down.",
  },
];

export function ValuesSection() {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">What We Stand For</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Technology that respects the visit, not just the schedule
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <value.icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">{value.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
