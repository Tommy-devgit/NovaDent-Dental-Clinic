const points = [
  "Immediate voice-led intake",
  "Automated lead capture",
  "Human follow-up for high urgency cases",
  "Centralized appointment handoff",
];

export function ValueSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white">
          <h2 className="text-3xl font-semibold tracking-tight">Why NovaDent works</h2>
          <p className="mt-4 max-w-xl text-slate-300">
            The landing page is the patient entry point. Vapi handles the conversation, n8n processes the workflow, and the dashboard keeps the clinic in control.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((point) => (
            <div key={point} className="rounded-[1.5rem] border border-black/5 bg-white p-6">
              <p className="font-medium text-slate-900">{point}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}