import type { ReactNode } from "react";
import Link from "next/link";

const navigation = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-slate-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-700 text-sm text-white shadow-lg shadow-teal-700/20">
              N
            </span>
            <span>
              NovaDent <span className="block text-xs font-normal text-slate-500">AI dental care</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-teal-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-black/5 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-10 text-sm text-slate-600 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>NovaDent helps patients reach care faster through Vapi and n8n automation.</p>
          <p>Built for a Vercel-hosted, serverless clinic workflow.</p>
        </div>
      </footer>
    </div>
  );
}