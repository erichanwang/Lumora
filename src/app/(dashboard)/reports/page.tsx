"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reports = [
  {
    id: "RPT-001",
    name: "Monthly Revenue Report",
    type: "Financial",
    date: "Mar 1, 2025",
    status: "Ready",
    pages: 12,
  },
  {
    id: "RPT-002",
    name: "User Growth Analysis",
    type: "Analytics",
    date: "Feb 28, 2025",
    status: "Generating",
    pages: 8,
  },
  {
    id: "RPT-003",
    name: "Q1 Performance Summary",
    type: "Executive",
    date: "Feb 25, 2025",
    status: "Ready",
    pages: 24,
  },
  {
    id: "RPT-004",
    name: "Customer Churn Report",
    type: "Analytics",
    date: "Feb 20, 2025",
    status: "Ready",
    pages: 6,
  },
  {
    id: "RPT-005",
    name: "Competitive Analysis",
    type: "Marketing",
    date: "Feb 18, 2025",
    status: "Failed",
    pages: 0,
  },
  {
    id: "RPT-006",
    name: "Conversion Funnel Review",
    type: "Analytics",
    date: "Feb 15, 2025",
    status: "Ready",
    pages: 15,
  },
];

const statusStyles: Record<string, string> = {
  Ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  Generating: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  Failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function ReportsPage() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? reports : reports.filter((r) => r.type.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generate and download custom business reports
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <FileText className="h-4 w-4" />
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Reports", value: "156", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
          { label: "Generated This Month", value: "23", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
          { label: "Avg. Processing Time", value: "2.4s", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
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

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-slate-400" />
        {["all", "financial", "analytics", "executive", "marketing"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
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

      {/* Report table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Report</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Pages</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((report) => (
                <tr key={report.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{report.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{report.id}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{report.type}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{report.date}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[report.status])}>
                      {report.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{report.pages}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <button
                      disabled={report.status !== "Ready"}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
