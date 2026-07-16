import { CalendarClock, MessageCircle, Stethoscope } from "lucide-react";

const STEPS = [
  {
    icon: MessageCircle,
    step: "1",
    title: "Start a conversation",
    description: "Tap “Talk to AI Assistant” and describe what's going on in your own words, by voice or chat.",
  },
  {
    icon: Stethoscope,
    step: "2",
    title: "Get triaged instantly",
    description: "The assistant asks a few smart follow-ups to understand urgency and the right service for you.",
  },
  {
    icon: CalendarClock,
    step: "3",
    title: "Your visit gets booked",
    description: "Your request is routed straight to our front desk, and our team confirms a time that works.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">How It Works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From “it hurts” to “you&apos;re booked” in one conversation
          </h2>
        </div>

        <div className="relative mt-14 grid gap-10 sm:grid-cols-3">
          <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-border sm:block" />
          {STEPS.map((item) => (
            <div key={item.step} className="relative flex flex-col items-start gap-4">
              <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-primary shadow-sm">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Step {item.step}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
