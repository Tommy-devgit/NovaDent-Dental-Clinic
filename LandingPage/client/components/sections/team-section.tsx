const doctors = [
  { name: "Dr. Amina Patel", specialty: "General Dentistry" },
  { name: "Dr. Noah Chen", specialty: "Orthodontics" },
  { name: "Dr. Sofia Reyes", specialty: "Implants & Restorative" },
];

export function TeamSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Doctors team</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {doctors.map((doctor) => (
            <div key={doctor.name} className="rounded-[2rem] border border-black/5 bg-white p-6">
              <p className="text-lg font-medium text-slate-950">{doctor.name}</p>
              <p className="mt-2 text-sm text-slate-600">{doctor.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}