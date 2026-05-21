"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Download,
  Search,
  ChevronDown,
  Eye,
  BarChart3,
  TrendingUp,
  Filter,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { useToast } from "@/components/ui/toast";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import { EnhancedPagination } from "@/components/ui/pagination-enhanced";
import { EmptyState } from "@/components/ui/empty-state";
import { useDebounce } from "@/lib/use-debounce";
import { CopyButton } from "@/lib/clipboard";

const reports = [
  { id: "RPT-001", name: "Monthly Revenue Report", type: "Financial", date: "Mar 1, 2025", status: "Ready", pages: 12, author: "Alex Morgan", description: "Comprehensive breakdown of monthly revenue streams, including subscription tiers, one-time purchases, and enterprise contracts." },
  { id: "RPT-002", name: "User Growth Analysis", type: "Analytics", date: "Feb 28, 2025", status: "Generating", pages: 8, author: "Sarah Chen", description: "Deep dive into user acquisition channels, retention rates, and cohort analysis for Q1 2025." },
  { id: "RPT-003", name: "Q1 Performance Summary", type: "Executive", date: "Feb 25, 2025", status: "Ready", pages: 24, author: "Emily Rodriguez", description: "Executive overview of Q1 2025 key performance indicators, milestones, and strategic recommendations." },
  { id: "RPT-004", name: "Customer Churn Report", type: "Analytics", date: "Feb 20, 2025", status: "Ready", pages: 6, author: "David Park", description: "Analysis of customer churn patterns, at-risk segment identification, and retention strategy effectiveness." },
  { id: "RPT-005", name: "Competitive Analysis", type: "Marketing", date: "Feb 18, 2025", status: "Failed", pages: 0, author: "Lisa Thompson", description: "Market positioning analysis comparing key features, pricing, and market share against top competitors." },
  { id: "RPT-006", name: "Conversion Funnel Review", type: "Analytics", date: "Feb 15, 2025", status: "Ready", pages: 15, author: "Michael Kim", description: "End-to-end conversion funnel analysis with drop-off points, optimization opportunities, and A/B test results." },
  { id: "RPT-007", name: "Infrastructure Cost Report", type: "Financial", date: "Feb 12, 2025", status: "Ready", pages: 10, author: "Priya Sharma", description: "Detailed breakdown of cloud infrastructure spending by service, region, and department." },
  { id: "RPT-008", name: "Weekly Engagement Metrics", type: "Analytics", date: "Mar 1, 2025", status: "Ready", pages: 5, author: "Rachel Green", description: "Weekly snapshot of user engagement metrics including DAU, MAU, session duration, and feature adoption." },
];

const statusStyles: Record<string, string> = {
  Ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Generating: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const typeColors: Record<string, string> = {
  Financial: "text-indigo-600 dark:text-indigo-400",
  Analytics: "text-cyan-600 dark:text-cyan-400",
  Executive: "text-purple-600 dark:text-purple-400",
  Marketing: "text-rose-600 dark:text-rose-400",
};

import { PageTransition, SectionItem } from "@/components/ui/page-transition";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const perPage = 5;
  const [detailReport, setDetailReport] = useState<(typeof reports)[number] | null>(null);
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = reports.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.author.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesType = filter === "all" || r.type.toLowerCase() === filter;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      const valA = (a as any)[sortField];
      const valB = (b as any)[sortField];
      if (typeof valA === "number") {
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      if (typeof valA === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });

    return result;
  }, [debouncedSearch, filter, sortField, sortDir]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: string }) => (
    <ChevronDown className={cn("h-3 w-3 transition-transform", sortField === field ? (sortDir === "desc" ? "rotate-180" : "") : "opacity-0 group-hover:opacity-50")} />
  );

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/lumora-icon.svg"
              alt=""
              width={22}
              height={22}
              className="opacity-25 dark:hidden"
              unoptimized
            />
            <Image
              src="/lumora-icon-white.svg"
              alt=""
              width={22}
              height={22}
              className="hidden opacity-25 dark:block"
              unoptimized
            />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generate and download custom business reports
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              exportToCSV(
                filtered,
                `lumora-reports-${new Date().toISOString().split("T")[0]}.csv`,
                [
                  { key: "id", label: "Report ID" },
                  { key: "name", label: "Name" },
                  { key: "type", label: "Type" },
                  { key: "author", label: "Author" },
                  { key: "date", label: "Date" },
                  { key: "status", label: "Status" },
                  { key: "pages", label: "Pages" },
                ]
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Reports", value: reports.length.toString(), icon: FileText, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
          { label: "Ready to Download", value: reports.filter((r) => r.status === "Ready").length.toString(), icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
          { label: "Avg Pages", value: `${Math.round(reports.reduce((s, r) => s + r.pages, 0) / reports.length)}`, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
          { label: "Report Types", value: [...new Set(reports.map((r) => r.type))].length.toString(), icon: Filter, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <div className={cn("rounded-lg p-2", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <Filter className="h-4 w-4 text-slate-400" />
        {["all", "financial", "analytics", "executive", "marketing"].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(0); }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              filter === f
                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            )}
          >
            {f === "all" ? "All Types" : f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No reports found"
          description={search ? "Try adjusting your search or filters." : "No reports match the current filters."}
        />
      ) : (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  {[
                    { key: "name", label: "Report" },
                    { key: "type", label: "Type" },
                    { key: "date", label: "Date" },
                    { key: "status", label: "Status" },
                    { key: "pages", label: "Pages" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none"
                      onClick={() => toggleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.key} />
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.map((report) => (
                  <tr
                    key={report.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer"
                    onClick={() => setDetailReport(report)}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {report.name}
                        <CopyButton text={report.id} label="Report ID" toast={toast} />
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{report.id} · {report.author}</p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={cn("text-sm font-medium", typeColors[report.type])}>{report.type}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{report.date}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[report.status])}>
                        {report.status}
                        {report.status === "Generating" && (
                          <span className="ml-1.5 inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" />
                        )}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{report.pages}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDetailReport(report); }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          disabled={report.status !== "Ready"}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cards — mobile */}
        <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-700">
          {paged.map((report) => (
            <div key={report.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{report.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{report.id} · {report.author}</p>
                </div>
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[report.status])}>
                  {report.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className={cn("font-medium", typeColors[report.type])}>{report.type}</span>
                <span className="text-slate-500 dark:text-slate-400">{report.date}</span>
                <span className="text-slate-500 dark:text-slate-400">{report.pages}p</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setDetailReport(report)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  disabled={report.status !== "Ready"}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-300"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        <EnhancedPagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          perPage={perPage}
          onPageChange={(p) => setPage(p)}
        />
      </div>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        open={!!detailReport}
        onClose={() => setDetailReport(null)}
        title={detailReport?.name ?? ""}
        subtitle={detailReport?.id}
        badge={
          detailReport && (
            <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[detailReport.status])}>
              {detailReport.status}
            </span>
          )
        }
        rows={
          detailReport
            ? [
                { label: "Type", value: <span className={cn("font-medium", typeColors[detailReport.type])}>{detailReport.type}</span> },
                { label: "Author", value: detailReport.author },
                { label: "Pages", value: String(detailReport.pages) },
                { label: "Date", value: detailReport.date },
                { label: "Description", value: detailReport.description },
              ]
            : []
        }
        footer={
          <button
            disabled={detailReport?.status !== "Ready"}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        }
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
