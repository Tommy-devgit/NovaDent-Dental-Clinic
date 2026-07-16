const testimonials = [
  {
    quote: "The AI assistant saved our front desk from repetitive intake calls.",
    name: "Clinic Manager",
  },
  {
    quote: "Patients get directed fast, and urgent cases surface immediately.",
    name: "Reception Lead",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">What clinics care about</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="rounded-[2rem] bg-white p-8 shadow-sm">
              <p className="text-lg leading-8 text-slate-700">“{item.quote}”</p>
              <footer className="mt-4 text-sm font-semibold text-slate-950">{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}