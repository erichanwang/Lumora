"use client";

import { useState, useMemo } from "react";
import {
  ScanEye,
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  Brain,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export";
import { useToast } from "@/components/ui/toast";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import { EnhancedPagination } from "@/components/ui/pagination-enhanced";
import { EmptyState } from "@/components/ui/empty-state";
import { ColumnToggle } from "@/components/ui/column-toggle";
import { useDebounce } from "@/lib/use-debounce";
import { CopyButton } from "@/lib/clipboard";
import { PageTransition, SectionItem } from "@/components/ui/page-transition";

const allScans = [
  { id: "#SCN-7842", patient: "Margaret Wilson", mrn: "MRN-2847", lesionType: "Melanocytic", confidence: 94.2, status: "completed", priority: "urgent", clinician: "Dr. Sarah Chen", date: "Mar 1, 2025", bodySite: "Upper back", notes: "Asymmetric border. Recommend biopsy." },
  { id: "#SCN-7841", patient: "Robert Chen", mrn: "MRN-3912", lesionType: "Actinic Keratosis", confidence: 88.7, status: "reviewing", priority: "routine", clinician: "Dr. Michael Kim", date: "Feb 28, 2025", bodySite: "Forehead", notes: "Multiple lesions. Monitor at 6 months." },
  { id: "#SCN-7840", patient: "James Harrison", mrn: "MRN-1556", lesionType: "Basal Cell Carcinoma", confidence: 98.1, status: "completed", priority: "stat", clinician: "Dr. Sarah Chen", date: "Feb 27, 2025", bodySite: "Nose", notes: "Nodular BCC. Referred for Mohs surgery." },
  { id: "#SCN-7839", patient: "Emily Santos", mrn: "MRN-4783", lesionType: "Nevus", confidence: 99.4, status: "completed", priority: "routine", clinician: "Dr. David Park", date: "Feb 26, 2025", bodySite: "Left forearm", notes: "Benign compound nevus. No follow-up needed." },
  { id: "#SCN-7838", patient: "David Kowalski", mrn: "MRN-5621", lesionType: "Melanocytic", confidence: 76.3, status: "reviewing", priority: "high", clinician: "Dr. Anna Novak", date: "Feb 25, 2025", bodySite: "Right calf", notes: "Atypical features. Second opinion requested." },
  { id: "#SCN-7837", patient: "Carlos Mendez", mrn: "MRN-3356", lesionType: "Dermatofibroma", confidence: 91.6, status: "completed", priority: "routine", clinician: "Dr. Sarah Chen", date: "Feb 24, 2025", bodySite: "Left thigh", notes: "Firm papule. Dimple sign positive." },
  { id: "#SCN-7836", patient: "Anna Novak", mrn: "MRN-2190", lesionType: "Actinic Keratosis", confidence: 85.0, status: "queued", priority: "high", clinician: "—", date: "Mar 2, 2025", bodySite: "Right cheek", notes: "Rough scaly patch. Solar damage present." },
  { id: "#SCN-7835", patient: "Rachel Kim", mrn: "MRN-1295", lesionType: "Vascular", confidence: 97.8, status: "queued", priority: "routine", clinician: "—", date: "Mar 1, 2025", bodySite: "Chest", notes: "Cherry angioma. Cosmetic concern only." },
  { id: "#SCN-7834", patient: "Lisa Thompson", mrn: "MRN-1049", lesionType: "Melanocytic", confidence: null, status: "queued", priority: "urgent", clinician: "—", date: "Mar 3, 2025", bodySite: "Lower back", notes: "New patient intake. Total body screening." },
  { id: "#SCN-7833", patient: "Tom Baker", mrn: "MRN-4033", lesionType: "Basal Cell Carcinoma", confidence: 95.4, status: "completed", priority: "stat", clinician: "Dr. Michael Kim", date: "Feb 20, 2025", bodySite: "Left ear", notes: "Pigmented BCC. Surgical excision performed." },
];

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  completed: { label: "Completed", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  reviewing: { label: "Under Review", icon: Brain, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  queued: { label: "Queued", icon: Clock, className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  stat: { label: "STAT", color: "text-red-600 dark:text-red-400" },
  urgent: { label: "Urgent", color: "text-rose-600 dark:text-rose-400" },
  high: { label: "High", color: "text-amber-600 dark:text-amber-400" },
  routine: { label: "Routine", color: "text-slate-500 dark:text-slate-400" },
};

export default function ScanQueuePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const perPage = 5;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailScan, setDetailScan] = useState<(typeof allScans)[number] | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(["id", "patient", "lesionType", "confidence", "status", "priority", "date"]));
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = allScans.filter((s) => {
      const matchesSearch =
        s.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.patient.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.mrn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.lesionType.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortField === "confidence") {
        const valA = a.confidence ?? 0;
        const valB = b.confidence ?? 0;
        return sortDir === "asc" ? valA - valB : valB - valA;
      }
      const valA = (a as any)[sortField];
      const valB = (b as any)[sortField];
      if (typeof valA === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [debouncedSearch, statusFilter, sortField, sortDir]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: string }) => (
    <ChevronDown className={cn("h-3 w-3", sortField === field ? "" : "opacity-0 group-hover:opacity-50", sortField === field && sortDir === "desc" && "rotate-180")} />
  );

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scan Queue</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage and prioritize incoming dermoscopic image scans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ColumnToggle
            columns={[
              { key: "id", label: "Scan" },
              { key: "patient", label: "Patient" },
              { key: "lesionType", label: "Lesion Type" },
              { key: "confidence", label: "Confidence" },
              { key: "status", label: "Status" },
              { key: "priority", label: "Priority" },
              { key: "date", label: "Date" },
            ]}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />
          <button
            onClick={() =>
              exportToCSV(
                allScans,
                `lumora-scan-queue-${new Date().toISOString().split("T")[0]}.csv`,
                [
                  { key: "id", label: "Scan ID" },
                  { key: "patient", label: "Patient" },
                  { key: "mrn", label: "MRN" },
                  { key: "lesionType", label: "Lesion Type" },
                  { key: "confidence", label: "Confidence %" },
                  { key: "status", label: "Status" },
                  { key: "priority", label: "Priority" },
                  { key: "clinician", label: "Clinician" },
                  { key: "date", label: "Date" },
                  { key: "bodySite", label: "Body Site" },
                ]
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Scans", value: allScans.length.toString(), icon: ScanEye, color: "text-indigo-600" },
          { label: "Awaiting Review", value: allScans.filter((s) => s.status === "queued" || s.status === "reviewing").length.toString(), icon: Clock, color: "text-amber-600" },
          { label: "Completed Today", value: "3", icon: CheckCircle2, color: "text-emerald-600" },
          { label: "STAT Priority", value: allScans.filter((s) => s.priority === "stat" || s.priority === "urgent").length.toString(), icon: AlertTriangle, color: "text-red-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <p className={cn("mt-2 text-2xl font-bold text-slate-900 dark:text-white", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search scans..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="queued">Queued</option>
          <option value="reviewing">Under Review</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ScanEye}
          title="No scans found"
          description={search ? "Try adjusting your search or filters." : "No scans match the current filters."}
        />
      ) : (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={paged.length > 0 && selectedIds.size === paged.length}
                      onChange={() => {
                        if (selectedIds.size === paged.length) {
                          setSelectedIds(new Set());
                        } else {
                          setSelectedIds(new Set(paged.map((s) => s.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                  </th>
                  {[
                    { key: "id", label: "Scan" },
                    { key: "patient", label: "Patient" },
                    { key: "lesionType", label: "Lesion" },
                    { key: "confidence", label: "Confidence" },
                    { key: "status", label: "Status" },
                    { key: "priority", label: "Priority" },
                    { key: "date", label: "Date" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none"
                      onClick={() => toggleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">{col.label}<SortIcon field={col.key} /></div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Clinician</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.map((scan) => {
                  const config = statusConfig[scan.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr
                      key={scan.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                        selectedIds.has(scan.id) && "bg-indigo-50/50 dark:bg-indigo-950/20"
                      )}
                      onClick={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(scan.id)) next.delete(scan.id);
                          else next.add(scan.id);
                          return next;
                        });
                      }}
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(scan.id)}
                          onChange={() => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(scan.id)) next.delete(scan.id);
                              else next.add(scan.id);
                              return next;
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {scan.id}
                        <CopyButton text={scan.id} toast={toast} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{scan.patient}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{scan.mrn} · {scan.bodySite}</p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{scan.lesionType}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {scan.confidence !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-12 rounded-full bg-slate-200 dark:bg-slate-700">
                              <div
                                className={cn(
                                  "h-1.5 rounded-full",
                                  scan.confidence >= 95 ? "bg-emerald-500" : scan.confidence >= 85 ? "bg-amber-500" : "bg-red-500"
                                )}
                                style={{ width: `${scan.confidence}%` }}
                              />
                            </div>
                            <span className={cn(
                              "text-sm font-mono font-semibold",
                              scan.confidence >= 95 ? "text-emerald-600 dark:text-emerald-400" : scan.confidence >= 85 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                            )}>{scan.confidence}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Pending</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
                          <StatusIcon className="h-3 w-3" />{config.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("text-sm font-semibold", priorityConfig[scan.priority].color)}>
                          {priorityConfig[scan.priority].label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{scan.date}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-sm text-slate-500 dark:text-slate-400">{scan.clinician}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailScan(scan); }}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-700">
          {paged.map((scan) => {
            const config = statusConfig[scan.status];
            const StatusIcon = config.icon;
            return (
              <div key={scan.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(scan.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(scan.id)) next.delete(scan.id);
                          else next.add(scan.id);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600"
                    />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {scan.id}
                      <CopyButton text={scan.id} toast={toast} />
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-semibold", priorityConfig[scan.priority].color)}>{priorityConfig[scan.priority].label}</span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
                      <StatusIcon className="h-3 w-3" />{config.label}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{scan.patient}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{scan.mrn} · {scan.bodySite}</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{scan.lesionType}</span>
                  {scan.confidence !== null ? (
                    <span className={cn("font-mono font-semibold", scan.confidence >= 95 ? "text-emerald-600" : scan.confidence >= 85 ? "text-amber-600" : "text-red-600")}>{scan.confidence}%</span>
                  ) : (
                    <span className="text-slate-400">Pending</span>
                  )}
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{scan.date}</span>
                  <span>{scan.clinician}</span>
                  <button
                    onClick={() => setDetailScan(scan)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-indigo-50/50 px-6 py-3 dark:border-slate-700 dark:bg-indigo-950/20">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {selectedIds.size} selected
              </span>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-slate-500 underline transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >Clear selection</button>
            </div>
            <button
              onClick={() => {
                const selectedScans = allScans.filter((s) => selectedIds.has(s.id));
                exportToCSV(
                  selectedScans,
                  `lumora-selected-scans-${new Date().toISOString().split("T")[0]}.csv`,
                  [
                    { key: "id", label: "Scan ID" },
                    { key: "patient", label: "Patient" },
                    { key: "mrn", label: "MRN" },
                    { key: "lesionType", label: "Lesion Type" },
                    { key: "confidence", label: "Confidence %" },
                    { key: "status", label: "Status" },
                    { key: "priority", label: "Priority" },
                  ]
                );
                toast("Exported " + selectedIds.size + " scans", "success");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export Selected
            </button>
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
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        open={!!detailScan}
        onClose={() => setDetailScan(null)}
        title={detailScan?.id ?? ""}
        subtitle={detailScan?.patient}
        badge={
          detailScan && (() => {
            const config = statusConfig[detailScan.status];
            const BadgeIcon = config.icon;
            return (
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
                <BadgeIcon className="h-3 w-3" />{config.label}
              </span>
            );
          })()
        }
        rows={
          detailScan
            ? [
                { label: "Patient", value: detailScan.patient },
                { label: "MRN", value: detailScan.mrn },
                { label: "Lesion Type", value: detailScan.lesionType },
                { label: "Body Site", value: detailScan.bodySite },
                { label: "Confidence", value: detailScan.confidence !== null ? `${detailScan.confidence}%` : "Pending" },
                { label: "Priority", value: <span className={cn("font-semibold", priorityConfig[detailScan.priority].color)}>{priorityConfig[detailScan.priority].label}</span> },
                { label: "Clinician", value: detailScan.clinician || "Unassigned" },
                { label: "Date", value: detailScan.date },
                { label: "Notes", value: detailScan.notes },
              ]
            : []
        }
        footer={
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
            <ScanEye className="h-4 w-4" />
            View Full Scan
          </button>
        }
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
