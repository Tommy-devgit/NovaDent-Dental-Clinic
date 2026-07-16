import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import { Button, Card, CardContent } from "@novadent/ui";

const CONTACT_DETAILS = [
  { icon: Phone, label: "Phone", value: "(555) 123-4567", href: "tel:+15551234567" },
  { icon: Mail, label: "Email", value: "hello@novadent.com", href: "mailto:hello@novadent.com" },
  { icon: MapPin, label: "Address", value: "100 Dental Avenue, Suite 200", href: undefined },
  { icon: Clock, label: "Hours", value: "Mon–Fri 8am–6pm, Sat 9am–2pm", href: undefined },
];

export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <Card className="overflow-hidden">
          <CardContent className="grid gap-10 p-8 lg:grid-cols-[1fr_1.2fr] lg:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Contact</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                Reach us however&apos;s easiest
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                For the fastest response, talk to our AI assistant — it&apos;s available around the clock and routes
                straight to our front desk.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="#ai-assistant">Talk to AI Assistant</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="tel:+15551234567">Call the clinic</Link>
                </Button>
              </div>
            </div>

            <dl className="grid gap-6 sm:grid-cols-2">
              {CONTACT_DETAILS.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <item.icon className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">
                      {item.href ? <Link href={item.href}>{item.value}</Link> : item.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
