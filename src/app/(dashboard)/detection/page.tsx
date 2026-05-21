"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApi } from "@/lib/swr";
import {
  CANCER_TYPE_LABELS,
  CANCER_TYPE_STATUS,
  CANCER_TYPE_COLORS,
  type CancerType,
  type CancerDetection,
  type DetectionStatus,
} from "@/lib/data/cancer-detection";
import { DetectionStatCard } from "@/components/dashboard/detection-stats";
import { DetectionPageSkeleton } from "./loading";
import Image from "next/image";
import {
  Microscope,
  TrendingUp,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const CANCER_TYPES: { value: CancerType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "akiec", label: "Actinic Keratoses" },
  { value: "bcc", label: "Basal Cell Carcinoma" },
  { value: "bkl", label: "Benign Keratosis" },
  { value: "df", label: "Dermatofibroma" },
  { value: "mel", label: "Melanoma" },
  { value: "nv", label: "Melanocytic Nevi" },
  { value: "vasc", label: "Vascular Lesions" },
];

const STATUS_FILTERS: { value: DetectionStatus | "all"; label: string; icon: typeof Activity }[] = [
  { value: "all", label: "All Status", icon: Activity },
  { value: "malignant", label: "Malignant", icon: AlertTriangle },
  { value: "benign", label: "Benign", icon: CheckCircle2 },
];

const CONFIDENCE_RANGES = [
  { label: "Any", min: "", max: "" },
  { label: "> 95%", min: "95", max: "" },
  { label: "90–95%", min: "90", max: "95" },
  { label: "80–90%", min: "80", max: "90" },
  { label: "< 80%", min: "", max: "80" },
];

const PER_PAGE = 10;

function StatusBadge({ status }: { status: DetectionStatus }) {
  const isMalignant = status === "malignant";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isMalignant
          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
      )}
    >
      {isMalignant ? (
        <AlertTriangle className="h-3 w-3" />
      ) : (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {isMalignant ? "Malignant" : "Benign"}
    </span>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 95
      ? "bg-emerald-500"
      : value >= 85
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

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

export default function DetectionPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [cancerType, setCancerType] = useState<CancerType | "all">("all");
  const [status, setStatus] = useState<DetectionStatus | "all">("all");
  const [confidenceRange, setConfidenceRange] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDetection, setSelectedDetection] = useState<CancerDetection | null>(null);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (cancerType !== "all") p.set("cancerType", cancerType);
    if (status !== "all") p.set("status", status);
    if (CONFIDENCE_RANGES[confidenceRange].min) p.set("minConfidence", CONFIDENCE_RANGES[confidenceRange].min);
    if (CONFIDENCE_RANGES[confidenceRange].max) p.set("maxConfidence", CONFIDENCE_RANGES[confidenceRange].max);
    if (search) p.set("search", search);
    p.set("page", String(page));
    p.set("perPage", String(PER_PAGE));
    p.set("sortField", sortField);
    p.set("sortDir", sortDir);
    return p.toString();
  }, [cancerType, status, confidenceRange, search, page, sortField, sortDir]);

  const { data, isValidating } = useApi<{
    data: CancerDetection[];
    stats: { total: number; malignantCount: number; benignCount: number; averageConfidence: number };
    overview: typeof import("@/lib/data/cancer-detection").detectionStats;
    trend: typeof import("@/lib/data/cancer-detection").detectionTrend;
    byType: Record<CancerType, number>;
    pagination: { page: number; perPage: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean };
  }>(`/api/detection?${params}`);

  const detectionData = data?.data ?? [];
  const stats = data?.stats ?? { total: 0, malignantCount: 0, benignCount: 0, averageConfidence: 0 };
  const overview = data?.overview;
  const trend = data?.trend ?? [];
  const byType = data?.byType;
  const pagination = data?.pagination;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  };

  const barChartData = useMemo(() => {
    if (!byType) return [];
    return CANCER_TYPES.filter((t) => t.value !== "all").map((t) => ({
      name: t.label,
      short: t.value,
      value: byType[t.value as CancerType],
      status: CANCER_TYPE_STATUS[t.value as CancerType],
    }));
  }, [byType]);

  if (isValidating && !data) {
    return <DetectionPageSkeleton />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Cancer Detection</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            AI-powered skin lesion analysis — {stats.total.toLocaleString()} scans processed
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
            showFilters
              ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {showFilters && <X className="h-3.5 w-3.5" />}
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DetectionStatCard
          title="Total Detections"
          value={stats.total.toLocaleString()}
          subtitle={`${overview?.scansToday ?? 0} today`}
          icon={Microscope}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-100 dark:bg-indigo-900/40"
          trend="up"
          trendValue="+12%"
        />
        <DetectionStatCard
          title="Malignant"
          value={stats.malignantCount.toLocaleString()}
          subtitle="Requires attention"
          icon={AlertTriangle}
          iconColor="text-red-600 dark:text-red-400"
          iconBg="bg-red-100 dark:bg-red-900/40"
          trend="up"
          trendValue="+5.2%"
        />
        <DetectionStatCard
          title="Benign"
          value={stats.benignCount.toLocaleString()}
          subtitle="No action needed"
          icon={CheckCircle2}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-100 dark:bg-emerald-900/40"
          trend="up"
          trendValue="+8.1%"
        />
        <DetectionStatCard
          title="Avg. Confidence"
          value={`${stats.averageConfidence}%`}
          subtitle={`Specificity: ${overview?.specificity ?? 0}%`}
          icon={TrendingUp}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-100 dark:bg-amber-900/40"
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Detection Trend */}
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
                  <linearGradient id="detectionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="malignantGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
                <XAxis dataKey="date" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} fill="url(#detectionGradient)" name="Total Scans" />
                <Area type="monotone" dataKey="malignant" stroke="#ef4444" strokeWidth={2} fill="url(#malignantGradient)" name="Malignant" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution by Type */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Distribution by Cancer Type</h3>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">Total detections across all categories</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} horizontal={false} />
                <XAxis type="number" stroke={isDark ? "#64748b" : "#94a3b8"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="short"
                  stroke={isDark ? "#64748b" : "#94a3b8"}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  width={50}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{d.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{d.value.toLocaleString()} detections</p>
                        <p className={cn("text-xs font-medium mt-0.5", d.status === "malignant" ? "text-red-600" : "text-emerald-600")}>
                          {d.status === "malignant" ? "Malignant" : "Benign"}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {barChartData.map((entry) => (
                    <Cell
                      key={entry.short}
                      fill={entry.status === "malignant" ? "#ef4444" : "#10b981"}
                      fillOpacity={isDark ? 0.7 : 0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            variants={item}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filter Detections</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* Cancer Type Filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancer Type</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CANCER_TYPES.map((ct) => (
                      <button
                        key={ct.value}
                        onClick={() => { setCancerType(ct.value); setPage(1); }}
                        className={cn(
                          "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                          cancerType === ct.value
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        )}
                      >
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</label>
                  <div className="flex gap-1.5">
                    {STATUS_FILTERS.map((sf) => (
                      <button
                        key={sf.value}
                        onClick={() => { setStatus(sf.value); setPage(1); }}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                          status === sf.value
                            ? sf.value === "malignant"
                              ? "bg-red-600 text-white shadow-sm"
                              : sf.value === "benign"
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        )}
                      >
                        <sf.icon className="h-3 w-3" />
                        {sf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Confidence Range */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Confidence</label>
                  <div className="flex gap-1.5">
                    {CONFIDENCE_RANGES.map((cr, i) => (
                      <button
                        key={cr.label}
                        onClick={() => { setConfidenceRange(i); setPage(1); }}
                        className={cn(
                          "rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
                          confidenceRange === i
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        )}
                      >
                        {cr.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, image, or type..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detection Table */}
      <motion.div variants={item} className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => handleSort("id")}
                >
                  Detection ID {sortField === "id" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => handleSort("cancerType")}
                >
                  Cancer Type {sortField === "cancerType" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => handleSort("confidence")}
                >
                  Confidence {sortField === "confidence" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Body Site
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={() => handleSort("date")}
                >
                  Date {sortField === "date" && (sortDir === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {detectionData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                    No detection results match your filters.
                  </td>
                </tr>
              ) : (
                detectionData.map((detection) => (
                  <motion.tr
                    key={detection.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: isDark ? "rgba(99, 102, 241, 0.04)" : "rgba(99, 102, 241, 0.02)" }}
                    className="cursor-pointer transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                    onClick={() => setSelectedDetection(detection)}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {detection.id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={cn("rounded-md px-2 py-1 text-xs font-medium", CANCER_TYPE_COLORS[detection.cancerType])}>
                        {detection.cancerName}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusBadge status={detection.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <ConfidenceBar value={detection.confidence} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {detection.patientAge
                        ? `${detection.patientSex === "female" ? "F" : "M"}, ${detection.patientAge}`
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-slate-500 dark:text-slate-400">
                      {detection.bodySite || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(detection.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Showing {(pagination.page - 1) * PER_PAGE + 1}–{Math.min(pagination.page * PER_PAGE, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    p === pagination.page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 disabled:opacity-30 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDetection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setSelectedDetection(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
                <div>
                  <div className="flex items-center gap-2">
                    <Microscope className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedDetection.id}
                    </h3>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Image: {selectedDetection.imageId}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedDetection(null)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cancer Type</p>
                    <p className={cn("mt-1 inline-block rounded-md px-2 py-1 text-sm font-medium", CANCER_TYPE_COLORS[selectedDetection.cancerType])}>
                      {selectedDetection.cancerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedDetection.status} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Confidence</p>
                    <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                      {selectedDetection.confidence.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Date</p>
                    <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                      {new Date(selectedDetection.date).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  {selectedDetection.patientAge && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Patient</p>
                      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                        {selectedDetection.patientSex === "female" ? "Female" : "Male"}, {selectedDetection.patientAge} years
                      </p>
                    </div>
                  )}
                  {selectedDetection.bodySite && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Body Site</p>
                      <p className="mt-1 text-sm capitalize text-slate-700 dark:text-slate-300">
                        {selectedDetection.bodySite}
                      </p>
                    </div>
                  )}
                </div>
                <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">AI Assessment</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {selectedDetection.status === "malignant"
                      ? `The model detected ${selectedDetection.cancerName} with ${selectedDetection.confidence.toFixed(1)}% confidence. This finding requires immediate clinical review and follow-up.`
                      : `The model classified this lesion as ${selectedDetection.cancerName} (benign) with ${selectedDetection.confidence.toFixed(1)}% confidence. Routine monitoring is recommended.`}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-200 p-5 dark:border-slate-700">
                <button
                  onClick={() => setSelectedDetection(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                >
                  Close
                </button>
                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                  Export Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
