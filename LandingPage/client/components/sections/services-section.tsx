const services = [
  "Teeth Cleaning",
  "Whitening",
  "Fillings",
  "Braces",
  "Implants",
  "Emergency Care",
];

export function ServicesSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Dental services designed for quick routing</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service} className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-lg font-medium text-slate-900">{service}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Patients are guided to the right next step without waiting for manual triage.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}