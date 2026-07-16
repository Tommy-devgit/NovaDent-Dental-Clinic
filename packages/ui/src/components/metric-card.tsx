import type { LucideIcon } from "lucide-react";

import { cn } from "../lib/cn";
import { Card } from "./ui/card";

export interface MetricCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon?: LucideIcon;
  tone?: "default" | "accent" | "warning";
  className?: string;
}

const TONE_STYLES: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  default: "bg-secondary text-secondary-foreground",
  accent: "bg-accent-soft text-accent-foreground",
  warning: "bg-warning/10 text-warning",
};

export function MetricCard({ label, value, detail, icon: Icon, tone = "default", className }: MetricCardProps) {
  return (
    <Card className={cn("flex flex-col gap-4 p-6", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={cn("flex size-9 items-center justify-center rounded-lg", TONE_STYLES[tone])}>
            <Icon className="size-5" />
          </span>
        ) : null}
      </div>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {detail ? <p className="text-sm text-muted-foreground">{detail}</p> : null}
    </Card>
  );
}
