"use client";

import { useState, useMemo } from "react";
import {
  ScrollText,
  Filter,
  UserPlus,
  Settings,
  Shield,
  CreditCard,
  FileText,
  BrainCircuit,
  Download,
  Search,
  ScanEye,
  Activity,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { EmptyState } from "@/components/ui/empty-state";
import { EnhancedPagination } from "@/components/ui/pagination-enhanced";
import { useDebounce } from "@/lib/use-debounce";

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  type: "scan" | "diagnosis" | "model" | "billing" | "report" | "security";
}

const auditLog: AuditEntry[] = [
  { id: "1", user: "Dr. Sarah Chen", action: "Reviewed AI detection result", resource: "Scan #SCN-4821 (Melanoma probable)", ip: "192.168.1.1", timestamp: "2 min ago", type: "scan" },
  { id: "2", user: "Dr. Michael Kim", action: "Overrode AI classification", resource: "Scan #SCN-4815 → Malignant confirmed", ip: "10.0.0.5", timestamp: "15 min ago", type: "diagnosis" },
  { id: "3", user: "System", action: "Deployed model update v3.3", resource: "ResNet-50 (melanoma sensitivity +0.4%)", ip: "—", timestamp: "1 hour ago", type: "model" },
  { id: "4", user: "Billing Dept", action: "Generated detection invoice", resource: "INV-DET-2025-009 (42 scans)", ip: "192.168.1.1", timestamp: "2 hours ago", type: "billing" },
  { id: "5", user: "Dr. Emily Rodriguez", action: "Generated performance report", resource: "Q1 Model Benchmark Report", ip: "172.16.0.8", timestamp: "3 hours ago", type: "report" },
  { id: "6", user: "Dr. Sarah Chen", action: "Flagged for urgent biopsy", resource: "Scan #SCN-4822 (BCC, 98.7% confidence)", ip: "192.168.1.1", timestamp: "5 hours ago", type: "diagnosis" },
  { id: "7", user: "Dr. David Park", action: "Exported patient detection data", resource: "Patient cohort CSV (340 records)", ip: "10.0.0.15", timestamp: "1 day ago", type: "security" },
  { id: "8", user: "System", action: "Failed API authentication", resource: "External integration 'DermPACS'", ip: "45.33.32.156", timestamp: "2 days ago", type: "security" },
  { id: "9", user: "Dr. Anna Novak", action: "Changed confidence threshold", resource: "BCC detection: 0.85 → 0.92", ip: "192.168.1.1", timestamp: "3 days ago", type: "model" },
  { id: "10", user: "Dr. Priya Sharma", action: "Deleted draft report", resource: "Weekly Summary Draft", ip: "10.0.0.22", timestamp: "5 days ago", type: "report" },
];

const typeConfig: Record<AuditEntry["type"], { icon: typeof ScanEye; color: string; bg: string; label: string }> = {
  scan: { icon: ScanEye, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40", label: "Scan" },
  diagnosis: { icon: Activity, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40", label: "Diagnosis" },
  model: { icon: BrainCircuit, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40", label: "Model" },
  billing: { icon: CreditCard, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40", label: "Billing" },
  report: { icon: FileText, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40", label: "Report" },
  security: { icon: Shield, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40", label: "Security" },
};

import { PageTransition, SectionItem } from "@/components/ui/page-transition";

export default function AuditLogPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 7;
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filtered = useMemo(() => {
    let result = typeFilter === "all"
      ? auditLog
      : auditLog.filter((e) => e.type === typeFilter);

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (e) =>
          e.user.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.resource.toLowerCase().includes(q) ||
          e.ip.toLowerCase().includes(q)
      );
    }

    return result;
  }, [typeFilter, debouncedSearch]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detection Audit Log</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track every scan, diagnosis, and model change across the platform.
          </p>
        </div>
        <button
          onClick={() =>
            exportToCSV(
              filtered as unknown as Record<string, unknown>[],
              `lumora-detection-audit-${new Date().toISOString().split("T")[0]}.csv`,
              [
                { key: "id", label: "ID" },
                { key: "user", label: "User" },
                { key: "action", label: "Action" },
                { key: "resource", label: "Resource" },
                { key: "ip", label: "IP Address" },
                { key: "timestamp", label: "Timestamp" },
                { key: "type", label: "Type" },
              ]
            )
          }
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Download className="h-4 w-4" />
          Export log
        </button>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Total Events", value: auditLog.length, icon: ScrollText, color: "text-indigo-600" },
          { label: "Scans Today", value: "47", icon: ScanEye, color: "text-emerald-600" },
          { label: "Diagnosis Overrides", value: "3", icon: Activity, color: "text-rose-600" },
          { label: "Security Alerts", value: "2", icon: AlertTriangle, color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit log..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="flex flex-wrap gap-2">
            {["all", "scan", "diagnosis", "model", "billing", "report", "security"].map((type) => (
              <button
                key={type}
                onClick={() => { setTypeFilter(type); setPage(0); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === type
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {type === "all" ? "All events" : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title="No audit entries found"
          description={searchQuery ? "Try a different search term." : "No events match the selected filter."}
        />
      ) : (
        <div className="space-y-3">
          {paged.map((entry) => {
            const cfg = typeConfig[entry.type];
            const IconComponent = cfg.icon;
            return (
              <div
                key={entry.id}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:shadow-sm hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700/50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
                  <IconComponent className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      <span className="font-semibold">{entry.user}</span>{" "}
                      {entry.action}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", cfg.bg, cfg.color)}>
                        {cfg.label}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                        {entry.timestamp}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                      {entry.resource}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 dark:bg-slate-700">
                      IP: {entry.ip}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Pagination */}
      <EnhancedPagination
        page={page}
        totalPages={totalPages}
        total={filtered.length}
        perPage={perPage}
        onPageChange={(p) => setPage(p)}
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
