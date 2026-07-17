const STATS = [
  { value: "12,400+", label: "Patients treated since 2014" },
  { value: "24/7", label: "AI intake availability" },
  { value: "< 2 min", label: "Average time to a booked visit" },
  { value: "4.9/5", label: "Average patient rating" },
];

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card px-6 py-12 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center lg:text-left">
            <p className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
