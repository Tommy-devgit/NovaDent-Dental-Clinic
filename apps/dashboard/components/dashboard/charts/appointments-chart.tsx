"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type AppointmentItem = { key: string; count: number };

// ponytail: fixed palette — add a CSS variable-driven ramp if theming is needed later
const FILLS = ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"];

const TOOLTIP_STYLE = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
} as const;

export function AppointmentsChart({ data }: { data: AppointmentItem[] }): React.ReactElement | null {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="key"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Bar dataKey="count" name="Appointments" radius={[4, 4, 0, 0]}>
          {data.map((_, idx) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static palette index
            <Cell key={idx} fill={FILLS[idx % FILLS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
