import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Clinic",
    links: [
      { href: "/services", label: "Services" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Patients",
    links: [
      { href: "/services#insurance", label: "Insurance & Payment" },
      { href: "/contact", label: "New Patient Forms" },
      { href: "/contact", label: "Emergency Care" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

const CONTACT_LINES = [
  { icon: Phone, value: "(555) 123-4567", href: "tel:+15551234567" },
  { icon: Mail, value: "hello@novadent.com", href: "mailto:hello@novadent.com" },
  { icon: MapPin, value: "100 Dental Avenue, Suite 200, Riverside", href: undefined },
  { icon: Clock, value: "Mon–Fri 8am–6pm · Sat 9am–2pm", href: undefined },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
              NovaDent
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A modern dental practice serving Riverside families since 2014. Our AI assistant answers questions,
              triages urgency, and books appointments the moment a patient reaches out — day or night — but every
              treatment plan is reviewed by a licensed dentist.
            </p>
            <div className="mt-5 space-y-2.5">
              {CONTACT_LINES.map((line) => (
                <div key={line.value} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <line.icon className="size-4 shrink-0 text-primary" />
                  {line.href ? (
                    <Link href={line.href} className="transition-colors hover:text-foreground">
                      {line.value}
                    </Link>
                  ) : (
                    <span>{line.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <p className="text-sm font-semibold text-foreground">{group.heading}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.heading}-${link.label}`}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NovaDent Dental Care. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            Licensed dentists in every state we operate in — patient records handled with HIPAA-conscious care.
          </p>
        </div>
      </div>
    </footer>
  );
}
