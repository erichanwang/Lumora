"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DetectionStatCard } from "@/components/dashboard/detection-stats";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { PageSkeleton } from "@/components/dashboard/skeleton";
import { cn } from "@/lib/utils";
import { useApi } from "@/lib/swr";
import {
  Microscope,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  BarChart3,
  Shield,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useTheme } from "@/lib/theme-context";
import { CANCER_TYPE_STATUS, type CancerType } from "@/lib/data/cancer-detection";

const skinLesionTypes = [
  { name: "Melanocytic Nevi", type: "nv", count: 4672, color: "#6366f1" },
  { name: "Benign Keratosis", type: "bkl", count: 2187, color: "#10b981" },
  { name: "Basal Cell Carcinoma", type: "bcc", count: 1534, color: "#ef4444" },
  { name: "Melanoma", type: "mel", count: 1416, color: "#f59e0b" },
  { name: "Vascular Lesions", type: "vasc", count: 1113, color: "#8b5cf6" },
  { name: "Actinic Keratoses", type: "akiec", count: 892, color: "#ec4899" },
  { name: "Dermatofibroma", type: "df", count: 643, color: "#14b8a6" },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; stroke?: string }>;
  label?: string;
}) {
  if (!active || !payload) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
          <span className="text-slate-600 dark:text-slate-300">{entry.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: detectionData, isValidating } = useApi<{
    overview: { totalDetections: number; malignantCount: number; benignCount: number; averageConfidence: number; scansToday: number; sensitivity: number; specificity: number };
    trend: Array<{ date: string; total: number; malignant: number; benign: number }>;
  }>("/api/detection?perPage=1");

  if (isValidating && !detectionData) {
    return <PageSkeleton />;
  }

  const overview = detectionData?.overview ?? {
    totalDetections: 12457,
    malignantCount: 3842,
    benignCount: 8615,
    averageConfidence: 91.4,
    scansToday: 142,
    sensitivity: 96.8,
    specificity: 94.2,
  };

  const trend = detectionData?.trend ?? [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Page header */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Image
                src="/lumora-icon.svg"
                alt=""
                width={28}
                height={28}
                className="shrink-0 dark:hidden"
                unoptimized
              />
              <Image
                src="/lumora-icon-white.svg"
                alt=""
                width={28}
                height={28}
                className="shrink-0 hidden dark:block"
                unoptimized
              />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cancer Detection Dashboard</h1>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              AI-powered skin lesion analysis — {overview.totalDetections.toLocaleString()} scans processed with {overview.sensitivity}% sensitivity
            </p>
          </div>
          {isValidating && (
            <RefreshCw className="h-4 w-4 animate-spin text-emerald-500" />
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetectionStatCard
          title="Total Detections"
          value={overview.totalDetections.toLocaleString()}
          subtitle={`${overview.scansToday} today`}
          icon={Microscope}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          trend="up"
          trendValue="+12.5%"
        />
        <DetectionStatCard
          title="Malignant"
          value={overview.malignantCount.toLocaleString()}
          subtitle="Requires clinical review"
          icon={AlertTriangle}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-900/40"
          trend="up"
          trendValue="+5.2%"
        />
        <DetectionStatCard
          title="Benign"
          value={overview.benignCount.toLocaleString()}
          subtitle="Routine monitoring"
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          trend="up"
          trendValue="+8.1%"
        />
        <DetectionStatCard
          title="Avg. Confidence"
          value={`${overview.averageConfidence}%`}
          subtitle={`Specificity: ${overview.specificity}%`}
          icon={TrendingUp}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/40"
        />
      </motion.div>

      {/* Secondary stats */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Sensitivity", value: `${overview.sensitivity}%`, desc: "True positive rate", color: "text-emerald-600" },
          { label: "Specificity", value: `${overview.specificity}%`, desc: "True negative rate", color: "text-indigo-600" },
          { label: "Avg. Analysis Time", value: "< 3s", desc: "Per scan processing", color: "text-amber-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{stat.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick action cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/detection"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Microscope className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  View All Detections
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Browse and filter all scans</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:text-slate-600" />
          </div>
        </Link>
        <Link
          href="/detection"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Analytics & Reports
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trends, distributions, and exports</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:text-slate-600" />
          </div>
        </Link>
        <Link
          href="/settings"
          className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Platform Settings
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configure notifications, integrations</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:text-slate-600" />
          </div>
        </Link>
      </motion.div>

      {/* Chart & Top Lesion Types */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Detection Trend Chart */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="pointer-events-none absolute -bottom-8 -right-8 opacity-[0.03] dark:opacity-[0.02]">
            <Image src="/lumora-icon.svg" alt="" width={120} height={140} unoptimized />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Detection Trend</h3>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Daily scan volume — last 7 days</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="maligGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                <XAxis dataKey="date" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fill="url(#totalGrad)" name="Total" />
                <Area type="monotone" dataKey="malignant" stroke="#ef4444" strokeWidth={2} fill="url(#maligGrad)" name="Malignant" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Lesion Types */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Lesion Type Distribution</h3>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Total detections across all categories</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skinLesionTypes} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} horizontal={false} />
                <XAxis type="number" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="type"
                  stroke={isDark ? "#64748b" : "#94a3b8"}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                  tickFormatter={(val: string) => val.toUpperCase()}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const isMalignant = CANCER_TYPE_STATUS[d.type as CancerType] === "malignant";
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{d.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{d.count.toLocaleString()} detections</p>
                        <p className={cn("text-xs font-medium mt-0.5", isMalignant ? "text-red-600" : "text-emerald-600")}>
                          {isMalignant ? "Malignant" : "Benign"}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                  {skinLesionTypes.map((entry) => (
                    <Cell
                      key={entry.type}
                      fill={entry.color}
                      fillOpacity={isDark ? 0.7 : 0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div variants={item}>
        <ActivityFeed />
      </motion.div>
    </motion.div>
  );
}
