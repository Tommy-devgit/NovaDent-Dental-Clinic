"use client";

import { MessageCircle, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@novadent/ui";

import { openAssistant } from "@/lib/assistant-events";
import { openBooking } from "@/lib/booking-events";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          NovaDent
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="outline" size="sm" onClick={() => openBooking()}>
            Book Appointment
          </Button>
          <Button size="icon" onClick={openAssistant} aria-label="Chat with NovaDent AI" title="Chat with NovaDent AI">
            <MessageCircle className="size-4" />
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex flex-col gap-6">
            <SheetHeader>
              <SheetTitle>NovaDent</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 text-base font-medium text-foreground">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    openBooking();
                  }}
                >
                  Book Appointment
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  onClick={() => {
                    setOpen(false);
                    openAssistant();
                  }}
                >
                  <MessageCircle className="size-4" />
                  Chat with NovaDent AI
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
