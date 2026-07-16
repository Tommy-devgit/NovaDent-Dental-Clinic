import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TeamSection } from "@/components/sections/team-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ValueSection } from "@/components/sections/value-section";
import { FloatingAssistantButton } from "@/components/vapi/floating-assistant";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ValueSection />
      <TestimonialsSection />
      <TeamSection />
      <ContactSection />
      <section id="assistant" className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-950/20">
          <h2 className="text-3xl font-semibold tracking-tight">AI assistant section</h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            The frontend only initiates the conversation. Voice intake and persistence are handled downstream by Vapi, n8n, and Neon.
          </p>
        </div>
      </section>
      <FloatingAssistantButton />
    </>
  );
}
