import { MarketingShell } from "@/components/layout/marketing-shell";

export default function ServicesPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Dental services</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            NovaDent routes patients into the right service path, then hands the case into the automated intake workflow.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}