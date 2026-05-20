"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const barData = [
  { name: "Mon", pageViews: 4200, uniqueVisitors: 2800 },
  { name: "Tue", pageViews: 3800, uniqueVisitors: 2400 },
  { name: "Wed", pageViews: 5100, uniqueVisitors: 3200 },
  { name: "Thu", pageViews: 4900, uniqueVisitors: 3100 },
  { name: "Fri", pageViews: 5600, uniqueVisitors: 3500 },
  { name: "Sat", pageViews: 3100, uniqueVisitors: 2000 },
  { name: "Sun", pageViews: 2800, uniqueVisitors: 1800 },
];

const pieData = [
  { name: "Direct", value: 35 },
  { name: "Organic", value: 28 },
  { name: "Social", value: 20 },
  { name: "Referral", value: 12 },
  { name: "Email", value: 5 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill?: string; stroke?: string }>;
  label?: string;
}

function BarTooltip({ active, payload, label }: ChartTooltipProps) {
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
          <span className="text-slate-600 dark:text-slate-400">{entry.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your website performance and traffic sources.
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Page Views", value: "29,500", change: "+12.3%" },
          { label: "Unique Visitors", value: "18,700", change: "+8.1%" },
          { label: "Avg. Session", value: "4m 32s", change: "+2.4%" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly traffic */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Weekly Traffic
          </h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Page views vs unique visitors
          </p>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar
                  dataKey="pageViews"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  name="Page Views"
                />
                <Bar
                  dataKey="uniqueVisitors"
                  fill="#a5b4fc"
                  radius={[4, 4, 0, 0]}
                  name="Unique Visitors"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic sources */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            Traffic Sources
          </h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Where your visitors come from
          </p>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-sm text-slate-600 dark:text-slate-400">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
