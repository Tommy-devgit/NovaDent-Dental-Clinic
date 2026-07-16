import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

function variantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return "bg-white text-slate-900 border border-slate-200 hover:border-slate-300";
    case "ghost":
      return "bg-transparent text-slate-800 hover:bg-slate-100";
    default:
      return "bg-teal-700 text-white hover:bg-teal-800 shadow-lg shadow-teal-700/20";
  }
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; children: ReactNode }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variantClasses(variant)} ${className}`}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: ButtonVariant; children: ReactNode }) {
  return (
    <Link
      href={href}
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${variantClasses(variant)} ${className}`}
    >
      {children}
    </Link>
  );
}