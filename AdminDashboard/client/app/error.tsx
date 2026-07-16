"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="px-6 py-10">
      <p className="text-sm text-rose-300">Something went wrong while loading the dashboard.</p>
      <button onClick={reset} className="mt-4 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950">
        Try again
      </button>
    </div>
  );
}
