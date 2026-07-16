"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/10 px-6 py-8 text-rose-200">
      <p>Unable to load dashboard content.</p>
      <button onClick={reset} className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
        Retry
      </button>
    </div>
  );
}
