export function StatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-950/10">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{detail}</p>
    </div>
  );
}
