"use client";

import { useState, useMemo } from "react";
import {
  ScrollText,
  Filter,
  UserPlus,
  Settings,
  Shield,
  DollarSign,
  FileText,
  LogOut,
  Download,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { EmptyState } from "@/components/ui/empty-state";
import { EnhancedPagination } from "@/components/ui/pagination-enhanced";

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  type: "user" | "settings" | "auth" | "billing" | "content" | "security";
}

const auditLog: AuditEntry[] = [
  { id: "1", user: "Alex Morgan", action: "Updated user role", resource: "User #42", ip: "192.168.1.1", timestamp: "2 min ago", type: "user" },
  { id: "2", user: "Sarah Chen", action: "Changed password", resource: "Account", ip: "10.0.0.5", timestamp: "15 min ago", type: "security" },
  { id: "3", user: "System", action: "Deployed update v2.4.1", resource: "Production", ip: "—", timestamp: "1 hour ago", type: "settings" },
  { id: "4", user: "Michael Kim", action: "Generated invoice", resource: "INV-2025-009", ip: "192.168.1.1", timestamp: "2 hours ago", type: "billing" },
  { id: "5", user: "Emily Rodriguez", action: "Created report", resource: "Q1 Analytics", ip: "172.16.0.8", timestamp: "3 hours ago", type: "content" },
  { id: "6", user: "Alex Morgan", action: "Updated billing info", resource: "Subscription", ip: "192.168.1.1", timestamp: "5 hours ago", type: "billing" },
  { id: "7", user: "David Park", action: "Exported user data", resource: "Users CSV", ip: "10.0.0.15", timestamp: "1 day ago", type: "security" },
  { id: "8", user: "System", action: "Failed login attempt", resource: "User 'admin'", ip: "45.33.32.156", timestamp: "2 days ago", type: "auth" },
  { id: "9", user: "Anna Novak", action: "Changed API permissions", resource: "API Keys", ip: "192.168.1.1", timestamp: "3 days ago", type: "settings" },
  { id: "10", user: "James Wilson", action: "Deleted report", resource: "Draft Report", ip: "10.0.0.22", timestamp: "5 days ago", type: "content" },
];

const typeConfig: Record<AuditEntry["type"], { icon: typeof UserPlus; color: string; bg: string }> = {
  user: { icon: UserPlus, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/40" },
  settings: { icon: Settings, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  auth: { icon: LogOut, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-900/40" },
  billing: { icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
  content: { icon: FileText, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/40" },
  security: { icon: Shield, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-900/40" },
};

export default function AuditLogPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const perPage = 7;

  const filtered = useMemo(() => {
    let result = typeFilter === "all"
      ? auditLog
      : auditLog.filter((e) => e.type === typeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.user.toLowerCase().includes(q) ||
          e.action.toLowerCase().includes(q) ||
          e.resource.toLowerCase().includes(q) ||
          e.ip.toLowerCase().includes(q)
      );
    }

    return result;
  }, [typeFilter, searchQuery]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Log</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track every action taken across the platform.
          </p>
        </div>
        <button
          onClick={() =>
            exportToCSV(
              filtered as unknown as Record<string, unknown>[],
              `lumora-audit-log-${new Date().toISOString().split("T")[0]}.csv`,
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
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Download className="h-4 w-4" />
          Export log
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit log..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {["all", "user", "settings", "auth", "billing", "content", "security"].map((type) => (
              <button
                key={type}
                onClick={() => { setTypeFilter(type); setPage(0); }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  typeFilter === type
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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
                className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${cfg.bg}`}>
                  <IconComponent className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="font-semibold">{entry.user}</span>{" "}
                      {entry.action}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                      {entry.timestamp}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
                      {entry.resource}
                    </span>
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
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
  );
}
