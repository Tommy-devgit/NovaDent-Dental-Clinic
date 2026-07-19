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

export type BreakdownItem = { key: string; count: number };

const FILLS = ["#111827", "#374151", "#6b7280", "#9ca3af", "#d1d5db"];

const TOOLTIP_STYLE = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
} as const;

export function BreakdownChart({
  data,
  label,
}: {
  data: BreakdownItem[];
  label: string;
}): React.ReactElement | null {
  if (data.length === 0) return null;
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-foreground">{label}</p>
      <ResponsiveContainer width="100%" height={Math.max(140, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <YAxis
            dataKey="key"
            type="category"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
            {data.map((_, idx) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static palette index
              <Cell key={idx} fill={FILLS[idx % FILLS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
