"use client";

import { CalendarClock, Clock, PhoneCall, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Card, CardContent, CardHeader, CardTitle, ErrorState, MetricCard, Skeleton } from "@novadent/ui";

import { AppointmentsChart } from "@/components/dashboard/charts/appointments-chart";
import { BreakdownChart } from "@/components/dashboard/charts/breakdown-chart";
import { TrendChart } from "@/components/dashboard/charts/trend-chart";
import type { TrendPoint } from "@/components/dashboard/charts/trend-chart";

type RangeOption = 7 | 30 | 90;

type AnalyticsData = {
  range: number;
  leadsByDay: { date: string; count: number }[];
  conversationsByDay: { date: string; count: number }[];
  avgDurationByDay: { date: string; avgSeconds: number }[];
  urgencyBreakdown: { key: string; count: number }[];
  statusBreakdown: { key: string; count: number }[];
  sourceBreakdown: { key: string; count: number }[];
  appointmentsByStatus: { key: string; count: number }[];
};

const RANGE_OPTIONS: RangeOption[] = [7, 30, 90];

function formatDuration(seconds: number): string {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function mergeTrend(
  leads: { date: string; count: number }[],
  conversations: { date: string; count: number }[],
): TrendPoint[] {
  const map = new Map<string, { leads: number; conversations: number }>();
  for (const item of leads) map.set(item.date, { leads: item.count, conversations: 0 });
  for (const item of conversations) {
    const existing = map.get(item.date) ?? { leads: 0, conversations: 0 };
    map.set(item.date, { ...existing, conversations: item.count });
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));
}

function sumCounts(items: { count: number }[]): number {
  return items.reduce((acc, item) => acc + item.count, 0);
}

function avgSeconds(items: { avgSeconds: number }[]): number {
  if (items.length === 0) return 0;
  return items.reduce((acc, item) => acc + item.avgSeconds, 0) / items.length;
}

async function fetchAnalytics(range: RangeOption): Promise<AnalyticsData> {
  const res = await fetch(`/api/analytics?range=${range}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json() as Promise<AnalyticsData>;
}

export function AnalyticsView(): React.ReactElement {
  const [range, setRange] = useState<RangeOption>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setHasError(false);

    fetchAnalytics(range)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  function handleRangeChange(next: RangeOption): void {
    setRange(next);
  }

  const rangeSelector = (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
      {RANGE_OPTIONS.map((opt) => (
        <Button
          key={opt}
          size="sm"
          variant={range === opt ? "default" : "ghost"}
          onClick={() => handleRangeChange(opt)}
          className="h-7 px-3 text-xs"
        >
          {opt}d
        </Button>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">{rangeSelector}</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">{rangeSelector}</div>
        <ErrorState
          title="Failed to load analytics"
          description="Could not fetch analytics data. Please try again."
          onRetry={() => handleRangeChange(range)}
        />
      </div>
    );
  }

  if (!data) return <></>;

  const totalLeads = sumCounts(data.leadsByDay);
  const totalCalls = sumCounts(data.conversationsByDay);
  const avgDur = avgSeconds(data.avgDurationByDay);
  const totalAppointments = sumCounts(data.appointmentsByStatus);
  const trendData = mergeTrend(data.leadsByDay, data.conversationsByDay);
  const isEmpty = totalLeads === 0 && totalCalls === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">{rangeSelector}</div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total leads"
          value={totalLeads}
          detail={`In the last ${range} days`}
          icon={Users}
        />
        <MetricCard
          label="Total calls"
          value={totalCalls}
          detail={`In the last ${range} days`}
          icon={PhoneCall}
        />
        <MetricCard
          label="Avg. call duration"
          value={formatDuration(Math.round(avgDur))}
          detail="Average across the period"
          icon={Clock}
        />
        <MetricCard
          label="Appointments"
          value={totalAppointments}
          detail="Across all statuses"
          icon={CalendarClock}
          tone="accent"
        />
      </section>

      {isEmpty ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">No data for this period</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a wider range or check back once there is activity.</p>
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Leads &amp; calls over time</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={trendData} />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointments by status</CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentsChart data={data.appointmentsByStatus} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Breakdowns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <BreakdownChart data={data.urgencyBreakdown} label="By urgency" />
                <BreakdownChart data={data.sourceBreakdown} label="By source" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
