const styles: Record<string, string> = {
  NEW: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  CONTACTED: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  BOOKED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  COMPLETED: "bg-slate-500/15 text-slate-300 border-slate-500/20",
  CLOSED: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  HIGH: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  URGENT: "bg-red-500/15 text-red-300 border-red-500/20",
  LOW: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  MEDIUM: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  SCHEDULED: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  CONFIRMED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  RESCHEDULED: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  CANCELLED: "bg-rose-500/15 text-rose-300 border-rose-500/20",
  NO_SHOW: "bg-slate-500/15 text-slate-300 border-slate-500/20",
};

export function StatusPill({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles[value] ?? "bg-white/10 text-white border-white/10"}`}>
      {value}
    </span>
  );
}
