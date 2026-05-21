"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Users,
  Search,
  ChevronDown,
  Shield,
  UserPlus,
  Filter,
  Download,
  Eye,
  Heart,
  AlertTriangle,
  Calendar,
  MapPin,
  Activity,
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

const allPatients = [
  { id: 1, name: "Margaret Wilson", mrn: "MRN-2847", age: 67, sex: "F", riskLevel: "High", status: "active", diagnoses: 3, lastScan: "Mar 1, 2025", location: "Portland, OR", avatar: "MW", riskFactors: ["Family history of melanoma", "Fair skin", ">50 nevi"], notes: "Under quarterly monitoring. History of BCC excised 2023.", totalScans: 22 },
  { id: 2, name: "Robert Chen", mrn: "MRN-3912", age: 54, sex: "M", riskLevel: "Medium", status: "active", diagnoses: 1, lastScan: "Feb 28, 2025", location: "Seattle, WA", avatar: "RC", riskFactors: ["Sun exposure (outdoor occupation)", "Previous AK"], notes: "Annual screening. One atypical nevus under observation.", totalScans: 8 },
  { id: 3, name: "James Harrison", mrn: "MRN-1556", age: 72, sex: "M", riskLevel: "High", status: "active", diagnoses: 5, lastScan: "Feb 26, 2025", location: "Boise, ID", avatar: "JH", riskFactors: ["Multiple prior melanomas", "Immunosuppressed", "History of severe sunburns"], notes: "Monthly monitoring. Stage II melanoma survivor. Referred to oncology.", totalScans: 45 },
  { id: 4, name: "Emily Santos", mrn: "MRN-4783", age: 29, sex: "F", riskLevel: "Low", status: "active", diagnoses: 0, lastScan: "Feb 20, 2025", location: "San Francisco, CA", avatar: "ES", riskFactors: ["New mole concern"], notes: "First-time screening. No significant findings.", totalScans: 1 },
  { id: 5, name: "David Kowalski", mrn: "MRN-5621", age: 45, sex: "M", riskLevel: "Medium", status: "active", diagnoses: 2, lastScan: "Mar 2, 2025", location: "Denver, CO", avatar: "DK", riskFactors: ["History of BCC", "High-altitude residence", "Fitzpatrick type II"], notes: "BCC excised 2024. Semi-annual follow-up recommended.", totalScans: 12 },
  { id: 6, name: "Lisa Thompson", mrn: "MRN-1049", age: 58, sex: "F", riskLevel: "Low", status: "pending", diagnoses: 0, lastScan: "—", location: "Austin, TX", avatar: "LT", riskFactors: ["Routine screening referral"], notes: "Awaiting initial dermoscopic imaging.", totalScans: 0 },
  { id: 7, name: "Carlos Mendez", mrn: "MRN-3356", age: 63, sex: "M", riskLevel: "High", status: "active", diagnoses: 4, lastScan: "Feb 18, 2025", location: "Miami, FL", avatar: "CM", riskFactors: ["Dysplastic nevus syndrome", "Familial atypical mole-melanoma syndrome"], notes: "Total body photography every 6 months. 2 dysplastic nevi excised 2024.", totalScans: 30 },
  { id: 8, name: "Anna Novak", mrn: "MRN-2190", age: 41, sex: "F", riskLevel: "Medium", status: "active", diagnoses: 1, lastScan: "Feb 22, 2025", location: "Chicago, IL", avatar: "AN", riskFactors: ["Previous AK diagnosis", "Tanning bed use history"], notes: "Suspicious lesion on left forearm — biopsy recommended.", totalScans: 6 },
  { id: 9, name: "Tom Baker", mrn: "MRN-4033", age: 76, sex: "M", riskLevel: "Medium", status: "inactive", diagnoses: 1, lastScan: "Nov 15, 2024", location: "Boston, MA", avatar: "TB", riskFactors: ["Age > 70", "Northern European ancestry"], notes: "Overdue for follow-up. Outreach letter sent.", totalScans: 15 },
  { id: 10, name: "Rachel Kim", mrn: "MRN-1295", age: 35, sex: "F", riskLevel: "Low", status: "active", diagnoses: 0, lastScan: "Mar 1, 2025", location: "New York, NY", avatar: "RK", riskFactors: ["Pregnancy-related changes"], notes: "Benign nevi — no follow-up required.", totalScans: 3 },
];

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  High: { label: "High", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/40" },
  Medium: { label: "Medium", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/40" },
  Low: { label: "Low", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/40" },
};

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

export default function PatientsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [riskFilter, setRiskFilter] = useState(searchParams.get("risk") || "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [sortField, setSortField] = useState(searchParams.get("sort") || "name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">((searchParams.get("dir") as "asc" | "desc") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
  const perPage = 5;
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [detailPatient, setDetailPatient] = useState<(typeof allPatients)[number] | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(["name", "riskLevel", "diagnoses", "lastScan", "status"]));
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const syncUrl = useCallback((params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") sp.set(key, value);
      else sp.delete(key);
    });
    if (!sp.has("page") || params.page === undefined) sp.delete("page");
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const setSearchAndSync = (val: string) => {
    setSearch(val);
    setPage(0);
    syncUrl({ q: val, page: "0" });
  };
  const setRiskAndSync = (val: string) => {
    setRiskFilter(val);
    setPage(0);
    syncUrl({ risk: val, page: "0" });
  };
  const setStatusAndSync = (val: string) => {
    setStatusFilter(val);
    setPage(0);
    syncUrl({ status: val, page: "0" });
  };
  const setSortAndSync = (field: string) => {
    if (sortField === field) {
      const newDir = sortDir === "asc" ? "desc" : "asc";
      setSortDir(newDir);
      syncUrl({ sort: field, dir: newDir });
    } else {
      setSortField(field);
      setSortDir("asc");
      syncUrl({ sort: field, dir: "asc" });
    }
  };

  const filtered = useMemo(() => {
    let result = allPatients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.mrn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.location.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesRisk = riskFilter === "all" || p.riskLevel.toLowerCase() === riskFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    });

    result.sort((a, b) => {
      const valA = (a as any)[sortField];
      const valB = (b as any)[sortField];
      if (typeof valA === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === "asc" ? valA - valB : valB - valA;
    });

    return result;
  }, [debouncedSearch, riskFilter, statusFilter, sortField, sortDir]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (field: string) => {
    setSortAndSync(field);
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-50" />;
    return (
      <ChevronDown
        className={cn("h-3 w-3", sortDir === "desc" && "rotate-180")}
      />
    );
  };

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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patient Management</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage patient records, risk assessments, and screening schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ColumnToggle
            columns={[
              { key: "name", label: "Patient" },
              { key: "riskLevel", label: "Risk" },
              { key: "diagnoses", label: "Diagnoses" },
              { key: "lastScan", label: "Last Scan" },
              { key: "status", label: "Status" },
            ]}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />
          <button
            onClick={() =>
              exportToCSV(
                allPatients,
                `lumora-patients-${new Date().toISOString().split("T")[0]}.csv`,
                [
                  { key: "name", label: "Name" },
                  { key: "mrn", label: "MRN" },
                  { key: "age", label: "Age" },
                  { key: "sex", label: "Sex" },
                  { key: "riskLevel", label: "Risk Level" },
                  { key: "status", label: "Status" },
                  { key: "diagnoses", label: "Diagnoses" },
                  { key: "totalScans", label: "Total Scans" },
                  { key: "location", label: "Location" },
                ]
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
            <UserPlus className="h-4 w-4" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Patients", value: allPatients.length.toString(), icon: Users, color: "text-indigo-600" },
          { label: "High Risk", value: allPatients.filter((p) => p.riskLevel === "High").length.toString(), icon: AlertTriangle, color: "text-red-600" },
          { label: "Active Diagnoses", value: allPatients.reduce((s, p) => s + p.diagnoses, 0).toString(), icon: Heart, color: "text-rose-600" },
          { label: "Total Scans", value: allPatients.reduce((s, p) => s + p.totalScans, 0).toString(), icon: Activity, color: "text-emerald-600" },
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
            placeholder="Search patients..."
            value={search}
            onChange={(e) => { setSearchAndSync(e.target.value); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={riskFilter}
          onChange={(e) => { setRiskAndSync(e.target.value); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusAndSync(e.target.value); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients found"
          description={search ? "Try adjusting your search or filters." : "No patients match the current filters."}
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
                          setSelectedIds(new Set(paged.map((p) => p.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                  </th>
                  {[
                    { key: "name", label: "Patient" },
                    { key: "riskLevel", label: "Risk" },
                    { key: "diagnoses", label: "Diagnoses" },
                    { key: "lastScan", label: "Last Scan" },
                    { key: "status", label: "Status" },
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
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.map((patient) => {
                  const risk = riskConfig[patient.riskLevel];
                  return (
                    <tr
                      key={patient.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                        selectedIds.has(patient.id) && "bg-indigo-50/50 dark:bg-indigo-950/20"
                      )}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.tagName === "INPUT" || target.tagName === "BUTTON") return;
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(patient.id)) next.delete(patient.id);
                          else next.add(patient.id);
                          return next;
                        });
                      }}
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(patient.id)}
                          onChange={() => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(patient.id)) next.delete(patient.id);
                              else next.add(patient.id);
                              return next;
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white", patient.riskLevel === "High" ? "bg-gradient-to-br from-red-500 to-rose-600" : patient.riskLevel === "Medium" ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-emerald-500 to-teal-600")}>
                            {patient.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{patient.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {patient.mrn} · {patient.age}y {patient.sex}
                              <CopyButton text={patient.mrn} toast={toast} />
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", risk.bg, risk.color)}>
                          <AlertTriangle className="h-3 w-3" />
                          {risk.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("text-sm font-semibold", patient.diagnoses > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400")}>
                          {patient.diagnoses > 0 ? patient.diagnoses : "—"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-300">{patient.lastScan}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[patient.status])}>{patient.status}</span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailPatient(patient); }}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
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
          {paged.map((patient) => {
            const risk = riskConfig[patient.riskLevel];
            return (
              <div key={patient.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(patient.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(patient.id)) next.delete(patient.id);
                          else next.add(patient.id);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600"
                    />
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white", patient.riskLevel === "High" ? "bg-gradient-to-br from-red-500 to-rose-600" : patient.riskLevel === "Medium" ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-gradient-to-br from-emerald-500 to-teal-600")}>
                      {patient.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{patient.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {patient.mrn} · {patient.age}y
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailPatient(patient)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", risk.bg, risk.color)}>
                    <AlertTriangle className="h-3 w-3" />{risk.label}
                  </span>
                  <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[patient.status])}>{patient.status}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {patient.diagnoses} dx · {patient.totalScans} scans
                  </span>
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
              >
                Clear selection
              </button>
            </div>
            <button
              onClick={() => {
                const selectedPatients = allPatients.filter((p) => selectedIds.has(p.id));
                exportToCSV(
                  selectedPatients,
                  `lumora-selected-patients-${new Date().toISOString().split("T")[0]}.csv`,
                  [
                    { key: "name", label: "Name" },
                    { key: "mrn", label: "MRN" },
                    { key: "riskLevel", label: "Risk Level" },
                    { key: "diagnoses", label: "Diagnoses" },
                    { key: "status", label: "Status" },
                    { key: "totalScans", label: "Total Scans" },
                  ]
                );
                toast("Exported " + selectedIds.size + " patients", "success");
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
          onPageChange={(p) => { setPage(p); syncUrl({ page: String(p) }); }}
        />
      </div>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        open={!!detailPatient}
        onClose={() => setDetailPatient(null)}
        title={detailPatient?.name ?? ""}
        subtitle={`${detailPatient?.mrn} · ${detailPatient?.age}y ${detailPatient?.sex}`}
        badge={
          detailPatient && (
            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", riskConfig[detailPatient.riskLevel].bg, riskConfig[detailPatient.riskLevel].color)}>
              <AlertTriangle className="h-3 w-3" />
              {riskConfig[detailPatient.riskLevel].label} Risk
            </span>
          )
        }
        rows={
          detailPatient
            ? [
                { label: "Risk Level", value: <span className={cn("font-medium", riskConfig[detailPatient.riskLevel].color)}>{detailPatient.riskLevel}</span> },
                { label: "Status", value: <span className="capitalize">{detailPatient.status}</span> },
                { label: "Diagnoses", value: detailPatient.diagnoses > 0 ? String(detailPatient.diagnoses) : "None" },
                { label: "Total Scans", value: String(detailPatient.totalScans) },
                { label: "Last Scan", value: detailPatient.lastScan },
                { label: "Location", value: detailPatient.location },
                { label: "Risk Factors", value: <div className="flex flex-wrap gap-1">{detailPatient.riskFactors.map((rf, i) => <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">{rf}</span>)}</div> },
                { label: "Clinical Notes", value: detailPatient.notes },
              ]
            : []
        }
        footer={
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
            <Eye className="h-4 w-4" />
            View Full Record
          </button>
        }
      />
      </div>
      </SectionItem>
    </PageTransition>
  );
}
