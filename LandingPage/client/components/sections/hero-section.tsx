import { ButtonLink } from "../ui/button";

export function HeroSection() {
  return (
    <section className="px-6 pt-16 lg:px-8 lg:pt-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-teal-700/20 bg-teal-700/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-800">
            AI-powered dental clinic assistant
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Care feels faster when patients can talk to NovaDent first.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Capture intake, guide patients to the right care path, and book appointments through a connected Vapi workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#assistant">Talk to AI Assistant</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Book Appointment
            </ButtonLink>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-[var(--surface)] p-6 shadow-2xl shadow-slate-900/5">
          <div className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">Assistant response window</p>
            <div className="mt-6 space-y-4 text-sm leading-6 text-slate-200">
              <p>“I can help you find the right service, check urgency, and guide you to a booking flow.”</p>
              <p className="rounded-2xl bg-white/10 p-4">Connection status: ready for voice session handoff.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}