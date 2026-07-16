import { MarketingShell } from "@/components/layout/marketing-shell";

export default function AboutPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Clinic information</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            This page will present clinic hours, team details, and care standards without duplicating the operational data stored in Neon.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}