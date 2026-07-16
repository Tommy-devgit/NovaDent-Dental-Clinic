"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? "Login failed");
      return;
    }

    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Staff login</h1>
        <p className="mt-2 text-sm text-slate-400">Secure access for NovaDent admin and reception staff.</p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Email</span>
            <input name="email" type="email" required className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="admin@novadent.com" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Password</span>
            <input name="password" type="password" required className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="••••••••" />
          </label>
        </div>

        {error ? <p className="mt-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

        <button type="submit" disabled={isPending} className="mt-6 w-full rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
