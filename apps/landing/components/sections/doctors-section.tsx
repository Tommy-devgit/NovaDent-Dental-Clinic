import { Avatar, AvatarFallback, Card, CardContent } from "@novadent/ui";

const DOCTORS = [
  {
    name: "Dr. Amina Patel",
    specialty: "General Dentistry",
    initials: "AP",
  },
  {
    name: "Dr. Noah Chen",
    specialty: "Orthodontics",
    initials: "NC",
  },
  {
    name: "Dr. Sofia Reyes",
    specialty: "Implants & Restorative",
    initials: "SR",
  },
];

export function DoctorsSection() {
  return (
    <section id="doctors" className="bg-secondary/40 px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Meet Our Doctors</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A team you&apos;ll actually recognize at your visit
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <Card key={doctor.name}>
              <CardContent className="flex items-center gap-4 p-6">
                <Avatar className="size-14">
                  <AvatarFallback className="text-base">{doctor.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
