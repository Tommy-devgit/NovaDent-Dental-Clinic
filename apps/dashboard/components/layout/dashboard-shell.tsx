"use client";

import {
  CalendarCheck2,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Menu,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
} from "@novadent/ui";
import type { AuthenticatedStaffUser } from "@novadent/types";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, adminOnly: false },
  { href: "/dashboard/leads", label: "Leads", icon: Users, adminOnly: false },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarCheck2, adminOnly: false },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessagesSquare, adminOnly: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, adminOnly: true },
];

function initialsFor(session: AuthenticatedStaffUser) {
  return `${session.firstName.charAt(0)}${session.lastName.charAt(0)}`.toUpperCase();
}

function NavLinks({ session, onNavigate }: { session: AuthenticatedStaffUser; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.filter((item) => !item.adminOnly || session.role === "ADMIN").map((item) => {
        const isActive = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserMenu({ session }: { session: AuthenticatedStaffUser }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted">
          <Avatar className="size-9">
            <AvatarFallback>{initialsFor(session)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:block">
            <span className="block text-sm font-medium text-foreground">
              {session.firstName} {session.lastName}
            </span>
            <span className="block text-xs text-muted-foreground">{session.role}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{session.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DashboardShell({
  session,
  children,
}: {
  session: AuthenticatedStaffUser;
  children: ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden border-r border-border bg-card px-4 py-6 lg:block lg:w-64">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2 font-semibold tracking-tight text-foreground">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          <span>
            NovaDent
            <span className="block text-xs font-normal text-muted-foreground">Clinic operations</span>
          </span>
        </Link>

        <div className="mt-8">
          <NavLinks session={session} />
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open navigation">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col gap-6">
                  <SheetHeader>
                    <SheetTitle>NovaDent</SheetTitle>
                  </SheetHeader>
                  <NavLinks session={session} onNavigate={() => setMobileNavOpen(false)} />
                </SheetContent>
              </Sheet>
              <span className="font-semibold text-foreground">NovaDent</span>
            </div>

            <div className="hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Staff workspace</p>
            </div>

            <UserMenu session={session} />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
