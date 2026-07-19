import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

import { AppointmentBookingModal } from "@/components/booking/appointment-booking-modal";
import { CookieConsent } from "@/components/cookie-consent";
import { ChatWidget } from "@/components/vapi/chat-widget";
import { VapiAssistantProvider } from "@/components/vapi/vapi-assistant-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteDescription =
  "NovaDent is an AI-powered dental clinic. Learn about our services, meet our doctors, and talk to our AI assistant to request an appointment in seconds.";

export const metadata: Metadata = {
  title: {
    default: "NovaDent | AI-Powered Dental Care",
    template: "%s | NovaDent",
  },
  description: siteDescription,
  openGraph: {
    title: "NovaDent | AI-Powered Dental Care",
    description: siteDescription,
    siteName: "NovaDent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaDent | AI-Powered Dental Care",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <VapiAssistantProvider>
            {children}
            <ChatWidget />
            <AppointmentBookingModal />
            <CookieConsent />
          </VapiAssistantProvider>
        </Providers>
      </body>
    </html>
  );
}
