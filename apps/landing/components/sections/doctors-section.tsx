import { Avatar, AvatarFallback, Badge, Card, CardContent } from "@novadent/ui";

import { Reveal, RevealGroup, RevealItem } from "../motion/reveal";

const DOCTORS = [
  {
    name: "Dr. Amina Patel, DDS",
    specialty: "General & Family Dentistry",
    initials: "AP",
    experience: "14 years in practice",
    bio: "Leads our general dentistry program with a focus on preventive care and same-day treatment for anxious patients.",
    credentials: ["University of Michigan School of Dentistry", "Fellow, Academy of General Dentistry"],
  },
  {
    name: "Dr. Noah Chen, DMD",
    specialty: "Orthodontics",
    initials: "NC",
    experience: "9 years in practice",
    bio: "Plans every orthodontic case — braces, clear aligners, and growth guidance for kids — around how it fits your life.",
    credentials: ["Boston University Orthodontics Residency", "Invisalign Diamond Provider"],
  },
  {
    name: "Dr. Sofia Reyes, DDS",
    specialty: "Implants & Restorative",
    initials: "SR",
    experience: "17 years in practice",
    bio: "Specializes in full-mouth restorations and implant surgery, working closely with our lab for a natural fit and finish.",
    credentials: ["NYU College of Dentistry", "Diplomate, American Board of Oral Implantology"],
  },
];

export function DoctorsSection() {
  return (
    <section id="doctors" className="bg-secondary/40 px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Meet Our Doctors</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A team you&apos;ll actually recognise at your visit
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Three licensed dentists, three focus areas, one shared chart — so whoever you see already knows your
            history.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <RevealItem key={doctor.name}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14">
                      <AvatarFallback className="text-base">{doctor.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mt-4">
                    {doctor.experience}
                  </Badge>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{doctor.bio}</p>

                  <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                    {doctor.credentials.map((credential) => (
                      <li key={credential} className="text-xs leading-5 text-muted-foreground">
                        {credential}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
