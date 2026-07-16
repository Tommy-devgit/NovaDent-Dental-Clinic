export function ContactSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Contact information</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Phone</p>
            <p className="mt-2 text-lg text-slate-900">(555) 123-4567</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Email</p>
            <p className="mt-2 text-lg text-slate-900">hello@novadent.com</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Address</p>
            <p className="mt-2 text-lg text-slate-900">100 Dental Avenue, Suite 200</p>
          </div>
        </div>
      </div>
    </section>
  );
}