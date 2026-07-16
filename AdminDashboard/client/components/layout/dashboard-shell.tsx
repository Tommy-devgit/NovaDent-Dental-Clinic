import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/appointments", label: "Appointments" },
  { href: "/dashboard/conversations", label: "Conversations" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] lg:flex">
      <aside className="border-r border-white/10 bg-slate-950/95 px-6 py-8 text-slate-200 lg:w-72">
        <Link href="/dashboard" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-sm font-semibold text-white">
            N
          </span>
          <div>
            <p className="font-semibold tracking-tight text-white">NovaDent</p>
            <p className="text-xs text-slate-400">Clinic operations</p>
          </div>
        </Link>

        <nav className="mt-10 space-y-2 text-sm">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-2xl px-4 py-3 text-slate-300 transition hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-white/10 bg-slate-950/60 px-6 py-4 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Staff workspace</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Operations dashboard</h1>
            </div>
            <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
              Sign in
            </Link>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
