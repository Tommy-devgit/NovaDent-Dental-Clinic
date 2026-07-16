import { MarketingShell } from "@/components/layout/marketing-shell";

export default function ContactPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Contact information</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Contact details and booking options live here, while conversational intake stays in the Vapi automation path.
          </p>
        </div>
      </section>
    </MarketingShell>
  );
}