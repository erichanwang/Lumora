"use client";

import { useState, useMemo } from "react";
import { Download, Plus, Search, CheckCircle2, Clock, AlertCircle, FileText, ChevronDown, Eye, CreditCard, Receipt } from "lucide-react";
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

const invoices = [
  { id: "INV-DET-2025-001", patient: "Margaret Wilson", mrn: "MRN-2847", scans: 3, amount: 750.00, status: "paid", insurance: "Blue Cross", claimStatus: "Approved", date: "Mar 1, 2025", dueDate: "Mar 15, 2025", aiAssisted: true },
  { id: "INV-DET-2025-002", patient: "James Harrison", mrn: "MRN-1556", scans: 5, amount: 1250.00, status: "pending", insurance: "Aetna", claimStatus: "Pending Review", date: "Feb 28, 2025", dueDate: "Mar 14, 2025", aiAssisted: true },
  { id: "INV-DET-2025-003", patient: "Robert Chen", mrn: "MRN-3912", scans: 1, amount: 250.00, status: "paid", insurance: "UnitedHealth", claimStatus: "Approved", date: "Feb 25, 2025", dueDate: "Mar 11, 2025", aiAssisted: true },
  { id: "INV-DET-2025-004", patient: "Carlos Mendez", mrn: "MRN-3356", scans: 8, amount: 2000.00, status: "overdue", insurance: "Cigna", claimStatus: "Denied", date: "Jan 15, 2025", dueDate: "Feb 1, 2025", aiAssisted: true },
  { id: "INV-DET-2025-005", patient: "David Kowalski", mrn: "MRN-5621", scans: 2, amount: 500.00, status: "paid", insurance: "Blue Cross", claimStatus: "Approved", date: "Feb 20, 2025", dueDate: "Mar 6, 2025", aiAssisted: true },
  { id: "INV-DET-2025-006", patient: "Anna Novak", mrn: "MRN-2190", scans: 1, amount: 250.00, status: "pending", insurance: "Humana", claimStatus: "Submitted", date: "Mar 2, 2025", dueDate: "Mar 16, 2025", aiAssisted: true },
  { id: "INV-DET-2025-007", patient: "Tom Baker", mrn: "MRN-4033", scans: 4, amount: 1000.00, status: "overdue", insurance: "Medicare", claimStatus: "Appeal Filed", date: "Dec 10, 2024", dueDate: "Dec 25, 2024", aiAssisted: false },
  { id: "INV-DET-2025-008", patient: "Emily Santos", mrn: "MRN-4783", scans: 1, amount: 250.00, status: "paid", insurance: "Self-pay", claimStatus: "N/A", date: "Feb 28, 2025", dueDate: "Mar 14, 2025", aiAssisted: true },
];

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; className: string }> = {
  paid: { label: "Paid", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  pending: { label: "Pending", icon: Clock, className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  overdue: { label: "Overdue", icon: AlertCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
};

import { PageTransition, SectionItem } from "@/components/ui/page-transition";

export default function BillingPage() {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const perPage = 5;
  const [detailInvoice, setDetailInvoice] = useState<(typeof invoices)[number] | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(["id", "patient", "scans", "amount", "status", "date", "insurance"]));
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = invoices.filter(
      (inv) =>
        inv.patient.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        inv.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        inv.mrn.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        inv.insurance.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    result.sort((a, b) => {
      if (sortField === "amount" || sortField === "scans") {
        return sortDir === "asc" ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
      }
      const valA = (a as any)[sortField];
      const valB = (b as any)[sortField];
      if (typeof valA === "string") {
        return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });

    return result;
  }, [debouncedSearch, sortField, sortDir]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: string }) => (
    <ChevronDown className={cn("h-3 w-3 transition-transform", sortField === field ? (sortDir === "desc" ? "rotate-180" : "") : "opacity-0 group-hover:opacity-50")} />
  );

  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalScans = invoices.reduce((sum, inv) => sum + inv.scans, 0);

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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Detection Billing</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Per-scan billing, insurance claims, and payment tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ColumnToggle
            columns={[
              { key: "id", label: "Invoice" },
              { key: "patient", label: "Patient" },
              { key: "scans", label: "Scans" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
              { key: "date", label: "Issue Date" },
              { key: "insurance", label: "Insurance" },
            ]}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />
          <button
            onClick={() =>
              exportToCSV(
                invoices,
                `lumora-billing-${new Date().toISOString().split("T")[0]}.csv`,
                [
                  { key: "id", label: "Invoice ID" },
                  { key: "patient", label: "Patient" },
                  { key: "mrn", label: "MRN" },
                  { key: "amount", label: "Amount" },
                  { key: "status", label: "Status" },
                  { key: "date", label: "Issue Date" },
                  { key: "dueDate", label: "Due Date" },
                  { key: "insurance", label: "Insurance" },
                  { key: "claimStatus", label: "Claim Status" },
                  { key: "aiAssisted", label: "AI-Assisted" },
                ]
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Revenue", value: `$${invoices.reduce((s, i) => s + i.amount, 0).toLocaleString()}`, color: "text-indigo-600", icon: Receipt },
          { label: "Paid Invoices", value: invoices.filter((i) => i.status === "paid").length.toString(), color: "text-emerald-600", icon: CheckCircle2 },
          { label: "Outstanding", value: `$${totalOutstanding.toLocaleString()}`, color: "text-red-600", icon: AlertCircle },
          { label: "AI-Assisted Scans", value: totalScans.toString(), color: "text-violet-600", icon: CreditCard },
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

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices found"
          description={search ? "Try adjusting your search." : "No invoices match the current filters."}
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
                          setSelectedIds(new Set(paged.map((inv) => inv.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                  </th>
                  <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none" onClick={() => toggleSort("id")}>
                    <div className="flex items-center gap-1">Invoice<SortIcon field="id" /></div>
                  </th>
                  <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none" onClick={() => toggleSort("patient")}>
                    <div className="flex items-center gap-1">Patient<SortIcon field="patient" /></div>
                  </th>
                  <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none" onClick={() => toggleSort("scans")}>
                    <div className="flex items-center gap-1">Scans<SortIcon field="scans" /></div>
                  </th>
                  <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                    <div className="flex items-center gap-1">Amount<SortIcon field="amount" /></div>
                  </th>
                  <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                    <div className="flex items-center gap-1">Status<SortIcon field="status" /></div>
                  </th>
                  <th className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer select-none" onClick={() => toggleSort("date")}>
                    <div className="flex items-center gap-1">Issue Date<SortIcon field="date" /></div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Insurance</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.map((inv) => {
                  const StatusIcon = statusConfig[inv.status].icon;
                  return (
                    <tr
                      key={inv.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                        selectedIds.has(inv.id) && "bg-indigo-50/50 dark:bg-indigo-950/20"
                      )}
                      onClick={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(inv.id)) next.delete(inv.id);
                          else next.add(inv.id);
                          return next;
                        });
                      }}
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(inv.id)}
                          onChange={() => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(inv.id)) next.delete(inv.id);
                              else next.add(inv.id);
                              return next;
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {inv.id}
                            <CopyButton text={inv.id} toast={toast} />
                          </p>
                          {inv.aiAssisted && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-violet-50 px-1.5 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                              AI Scan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.patient}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{inv.mrn}</p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{inv.scans} scans</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", statusConfig[inv.status].className)}>
                          <StatusIcon className="h-3 w-3" />{statusConfig[inv.status].label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{inv.date}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300">{inv.insurance}</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{inv.claimStatus}</p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailInvoice(inv); }}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                            title="View details"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 active:scale-95 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600">
                            <Download className="h-3.5 w-3.5" />PDF
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
          {paged.map((inv) => {
            const StatusIcon = statusConfig[inv.status].icon;
            return (
              <div key={inv.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(inv.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(inv.id)) next.delete(inv.id);
                          else next.add(inv.id);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {inv.id}
                        <CopyButton text={inv.id} toast={toast} />
                      </p>
                      {inv.aiAssisted && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-violet-50 px-1.5 py-0.5 text-xs font-medium text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
                          AI Scan
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDetailInvoice(inv)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                      title="View details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      <Download className="h-3.5 w-3.5" />PDF
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{inv.patient}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{inv.mrn}</p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", statusConfig[inv.status].className)}>
                    <StatusIcon className="h-3 w-3" />{statusConfig[inv.status].label}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">${inv.amount.toLocaleString()}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>Issued: {inv.date}</span>
                  <span>{inv.insurance} · {inv.scans} scans</span>
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
                const selectedInvoices = invoices.filter((inv) => selectedIds.has(inv.id));
                exportToCSV(
                  selectedInvoices,
                  `lumora-selected-billing-${new Date().toISOString().split("T")[0]}.csv`,
                  [
                    { key: "id", label: "Invoice ID" },
                    { key: "patient", label: "Patient" },
                    { key: "mrn", label: "MRN" },
                    { key: "amount", label: "Amount" },
                    { key: "status", label: "Status" },
                    { key: "date", label: "Issue Date" },
                    { key: "dueDate", label: "Due Date" },
                    { key: "insurance", label: "Insurance" },
                    { key: "claimStatus", label: "Claim Status" },
                  ]
                );
                toast("Exported " + selectedIds.size + " invoices", "success");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95"
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
        open={!!detailInvoice}
        onClose={() => setDetailInvoice(null)}
        title={detailInvoice?.id ?? ""}
        subtitle={detailInvoice?.patient}
        badge={
          detailInvoice && (
            <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", statusConfig[detailInvoice.status].className)}>
              {statusConfig[detailInvoice.status].label}
            </span>
          )
        }
        rows={
          detailInvoice
            ? [
                { label: "Patient", value: detailInvoice.patient },
                { label: "MRN", value: detailInvoice.mrn },
                { label: "Scans", value: `${detailInvoice.scans} ($${250}/scan)` },
                { label: "Amount", value: `$${detailInvoice.amount.toLocaleString()}` },
                { label: "Status", value: statusConfig[detailInvoice.status].label },
                { label: "Insurance", value: detailInvoice.insurance },
                { label: "Claim Status", value: detailInvoice.claimStatus },
                { label: "AI-Assisted", value: detailInvoice.aiAssisted ? "Yes" : "No" },
                { label: "Issue Date", value: detailInvoice.date },
                { label: "Due Date", value: detailInvoice.dueDate },
              ]
            : []
        }
        footer={
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            <Receipt className="h-4 w-4" />
            View Invoice Details
          </button>
        }
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
