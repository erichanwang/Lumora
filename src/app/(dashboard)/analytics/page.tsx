"use client";

import { useState, useMemo } from "react";
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { BarChart3, Microscope, TrendingUp, Activity, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";
import { PageTransition, SectionItem } from "@/components/ui/page-transition";
import { CANCER_TYPE_LABELS, CANCER_TYPE_STATUS, detectionByType, type CancerType } from "@/lib/data/cancer-detection";

const DAILY_DETECTION_DATA = [
  { name: "Mon", total: 187, malignant: 58, benign: 129, confidence: 92.1 },
  { name: "Tue", total: 195, malignant: 62, benign: 133, confidence: 91.8 },
  { name: "Wed", total: 203, malignant: 71, benign: 132, confidence: 90.5 },
  { name: "Thu", total: 178, malignant: 49, benign: 129, confidence: 93.2 },
  { name: "Fri", total: 210, malignant: 68, benign: 142, confidence: 91.4 },
  { name: "Sat", total: 155, malignant: 41, benign: 114, confidence: 92.8 },
  { name: "Sun", total: 142, malignant: 38, benign: 104, confidence: 93.1 },
];

const CONFIDENCE_DISTRIBUTION = [
  { name: "95-100%", value: 3842, color: "#10b981" },
  { name: "90-95%", value: 4512, color: "#6366f1" },
  { name: "85-90%", value: 2910, color: "#f59e0b" },
  { name: "80-85%", value: 1193, color: "#ef4444" },
];

const TYPE_DATA = Object.entries(detectionByType).map(([type, value]) => ({
  name: CANCER_TYPE_LABELS[type as CancerType],
  short: type.toUpperCase(),
  value,
  status: CANCER_TYPE_STATUS[type as CancerType],
  color: type === "mel" ? "#ef4444" : type === "bcc" ? "#f97316" : type === "akiec" ? "#f59e0b" :
         type === "nv" ? "#6366f1" : type === "bkl" ? "#10b981" : type === "df" ? "#14b8a6" : "#8b5cf6",
}));

const MONTHLY_TREND = [
  { name: "Jan", malignant: 310, benign: 720 },
  { name: "Feb", malignant: 345, benign: 835 },
  { name: "Mar", malignant: 380, benign: 910 },
];

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
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke ?? entry.fill ?? "#6366f1" }} />
          <span className="text-slate-600 dark:text-slate-400">{entry.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState<"daily" | "monthly">("daily");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const gridStroke = isDark ? "#334155" : "#e2e8f0";
  const axisStroke = isDark ? "#64748b" : "#94a3b8";

  const totalDetections = 12457;
  const malignantTotal = 3842;
  const benignTotal = 8615;
  const malignantRate = ((malignantTotal / totalDetections) * 100).toFixed(1);
  const benignRate = ((benignTotal / totalDetections) * 100).toFixed(1);
  const avgConfidence = 91.4;

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Image src="/lumora-icon.svg" alt="" width={22} height={22} className="opacity-25 dark:hidden" unoptimized />
            <Image src="/lumora-icon-white.svg" alt="" width={22} height={22} className="hidden opacity-25 dark:block" unoptimized />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detection Analytics</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            AI model performance, detection trends, and cancer type distribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-800">
            {(["daily", "monthly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedView(v)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all",
                  selectedView === v
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Detections", value: totalDetections.toLocaleString(), icon: Microscope, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/40", change: "+12.3%" },
          { label: "Malignant Rate", value: `${malignantRate}%`, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/40", change: `${malignantTotal.toLocaleString()} cases` },
          { label: "Benign Rate", value: `${benignRate}%`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/40", change: `${benignTotal.toLocaleString()} cases` },
          { label: "Avg Confidence", value: `${avgConfidence}%`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/40", change: "+1.2% mo/m" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <div className={cn("rounded-lg p-2", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Detection Volume & Cancer Type Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detection Volume Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
            {selectedView === "daily" ? "Daily Detection Volume" : "Monthly Malignant vs Benign"}
          </h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            {selectedView === "daily" ? "Detections and confidence score per day" : "Trend over the last 3 months"}
          </p>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {selectedView === "daily" ? (
                <BarChart data={DAILY_DETECTION_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="name" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickLine={false} axisLine={false} domain={[85, 96]} unit="%" />
                  <Tooltip content={<BarTooltip />} />
                  <Bar yAxisId="left" dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Detections" />
                  <Bar yAxisId="left" dataKey="malignant" fill="#ef4444" radius={[4, 4, 0, 0]} name="Malignant" />
                  <Line yAxisId="right" type="monotone" dataKey="confidence" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: "#10b981" }} name="Avg Confidence" />
                </BarChart>
              ) : (
                <AreaChart data={MONTHLY_TREND} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="maligGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="benignGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                  <XAxis dataKey="name" stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={axisStroke} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<BarTooltip />} />
                  <Area type="monotone" dataKey="benign" stroke="#10b981" strokeWidth={2} fill="url(#benignGrad2)" name="Benign" />
                  <Area type="monotone" dataKey="malignant" stroke="#ef4444" strokeWidth={2} fill="url(#maligGrad2)" name="Malignant" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cancer Type Distribution Pie */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Cancer Type Distribution</h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Breakdown of all detection results by lesion type</p>
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={TYPE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {TYPE_DATA.map((entry) => (
                    <Cell key={entry.short} fill={entry.color} stroke={isDark ? "#1e293b" : "#fff"} strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={({ active, payload }) => {
                  const first = payload?.[0];
                  return active && first ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{first.payload.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{first.value.toLocaleString()} detections</p>
                      <p className={cn("text-xs font-medium mt-0.5", first.payload.status === "malignant" ? "text-red-600" : "text-emerald-600")}>
                        {first.payload.status === "malignant" ? "Malignant" : "Benign"}
                      </p>
                    </div>
                  ) : null;
                }} />
                <Legend
                  verticalAlign="bottom" height={36} iconType="circle" iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Confidence Distribution & Model Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Confidence Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Confidence Distribution</h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Detection confidence score spread across all scans</p>
          <div className="h-64 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONFIDENCE_DISTRIBUTION} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke={axisStroke} fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip content={({ active, payload }) => {
                  const first = payload?.[0];
                  return active && first ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{first.payload.name}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{first.value.toLocaleString()} detections</p>
                    </div>
                  ) : null;
                }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                  {CONFIDENCE_DISTRIBUTION.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} fillOpacity={isDark ? 0.7 : 0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Performance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">Model Performance</h3>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Key performance indicators for the AI detection model</p>
          <div className="space-y-5">
            {[
              { label: "Sensitivity (True Positive Rate)", value: 96.8, color: "#10b981" },
              { label: "Specificity (True Negative Rate)", value: 94.2, color: "#6366f1" },
              { label: "Precision", value: 92.7, color: "#f59e0b" },
              { label: "F1 Score", value: 94.7, color: "#8b5cf6" },
              { label: "AUC-ROC", value: 98.3, color: "#ec4899" },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{metric.label}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{metric.value}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${metric.value}%`, backgroundColor: metric.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      </SectionItem>
    </PageTransition>
  );
}
