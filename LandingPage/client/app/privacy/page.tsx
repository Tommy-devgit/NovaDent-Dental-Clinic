import { MarketingShell } from "@/components/layout/marketing-shell";

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Privacy policy</h1>
          <p className="mt-4 max-w-2xl text-slate-600">Privacy content can be managed as static legal content in the marketing app.</p>
        </div>
      </section>
    </MarketingShell>
  );
}