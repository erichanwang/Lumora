"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/lib/theme-context";
import { revenueData } from "@/lib/data";

const data = revenueData;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill?: string; stroke?: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.stroke ?? entry.fill ?? "#6366f1" }}
          />
          <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            ${entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Revenue Overview
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monthly revenue and expense trends
        </p>
      </div>
      <div className="h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#334155" : "#e2e8f0"}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#64748b" : "#94a3b8"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={isDark ? "#64748b" : "#94a3b8"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#expensesGradient)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
