import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@novadent/ui";

import { Reveal } from "../motion/reveal";

const FAQS = [
  {
    question: "How does the AI assistant work?",
    answer:
      "Open the assistant from the hero section to talk out loud, or use the Chat button in the corner of any page to type instead. Either way it asks a few follow-up questions to understand urgency and the right service, then hands the details straight to our front desk.",
  },
  {
    question: "Is my information kept private?",
    answer:
      "Yes. Conversations are used only to route your care and are shared with our clinical team for follow-up — never sold or used for advertising.",
  },
  {
    question: "Can I still book by phone or in person?",
    answer:
      "Of course. The AI assistant is an additional way to reach us — you can always call or visit the clinic directly.",
  },
  {
    question: "What happens after I talk to the assistant?",
    answer:
      "Your request is logged immediately and reviewed by our front desk. For urgent cases, we aim to follow up the same day.",
  },
  {
    question: "Do you accept walk-ins for emergencies?",
    answer:
      "Emergency cases are prioritized — start a conversation with the AI assistant or call us directly and we'll do our best to fit you in same-day.",
  },
  {
    question: "Do you treat children?",
    answer:
      "Yes — our general and orthodontic team see patients starting around age 6, and we schedule family visits back-to-back when possible.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "Just tell the assistant your appointment details and the new time you'd prefer, or call the front desk. We ask for at least 24 hours' notice when possible.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Questions patients ask us most
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
