import { prisma } from "../client";

const DAY_MS = 24 * 60 * 60 * 1000;

/** London-local YYYY-MM-DD for a timestamp (a UK clinic reports by its own day). */
function dayKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(date);
}

/** Ordered map of the last `days` London days, seeded to 0 (so gaps show as zero, not missing). */
function seedDays(days: number, nowMs: number): Map<string, number> {
  const map = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    map.set(dayKey(new Date(nowMs - i * DAY_MS)), 0);
  }
  return map;
}

function bucketByDay(dates: Date[], days: number, nowMs: number): { date: string; count: number }[] {
  const map = seedDays(days, nowMs);
  for (const date of dates) {
    const key = dayKey(date);
    const current = map.get(key);
    if (current !== undefined) map.set(key, current + 1);
  }
  return [...map.entries()].map(([date, count]) => ({ date, count }));
}

function bucketAvgDuration(
  rows: { createdAt: Date; durationSeconds: number | null }[],
  days: number,
  nowMs: number,
): { date: string; avgSeconds: number }[] {
  const totals = seedDays(days, nowMs);
  const counts = seedDays(days, nowMs);
  for (const row of rows) {
    if (row.durationSeconds == null) continue;
    const key = dayKey(row.createdAt);
    if (!totals.has(key)) continue;
    totals.set(key, (totals.get(key) ?? 0) + row.durationSeconds);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...totals.entries()].map(([date, total]) => {
    const n = counts.get(date) ?? 0;
    return { date, avgSeconds: n > 0 ? Math.round(total / n) : 0 };
  });
}

export const analyticsRepository = {
  async getAnalytics({ days }: { days: number }) {
    const nowMs = Date.now();
    const since = new Date(nowMs - days * DAY_MS);

    const [leads, conversations, urgency, leadStatus, source, apptStatus] = await Promise.all([
      prisma.patientLead.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.conversationLog.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, durationSeconds: true },
      }),
      prisma.patientLead.groupBy({ by: ["urgency"], _count: { _all: true } }),
      prisma.patientLead.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.patientLead.groupBy({ by: ["source"], _count: { _all: true } }),
      prisma.appointment.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    return {
      range: days,
      leadsByDay: bucketByDay(
        leads.map((lead) => lead.createdAt),
        days,
        nowMs,
      ),
      conversationsByDay: bucketByDay(
        conversations.map((conversation) => conversation.createdAt),
        days,
        nowMs,
      ),
      avgDurationByDay: bucketAvgDuration(conversations, days, nowMs),
      urgencyBreakdown: urgency.map((row) => ({ key: row.urgency, count: row._count._all })),
      statusBreakdown: leadStatus.map((row) => ({ key: row.status, count: row._count._all })),
      sourceBreakdown: source.map((row) => ({ key: row.source, count: row._count._all })),
      appointmentsByStatus: apptStatus.map((row) => ({ key: row.status, count: row._count._all })),
    };
  },
};
