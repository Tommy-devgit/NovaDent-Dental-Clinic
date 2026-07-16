import { MarketingShell } from "@/components/layout/marketing-shell";
import { AiAssistantSection } from "@/components/sections/ai-assistant-section";
import { ContactSection } from "@/components/sections/contact-section";
import { DoctorsSection } from "@/components/sections/doctors-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { FloatingAssistantButton } from "@/components/vapi/floating-assistant";

export default function Home() {
  return (
    <MarketingShell>
      <HeroSection />
      <ServicesSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <DoctorsSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <AiAssistantSection />
      <FloatingAssistantButton />
    </MarketingShell>
  );
}
