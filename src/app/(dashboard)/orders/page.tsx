"use client";

import { useState, useMemo } from "react";
import {
  ShoppingCart,
  Search,
  ChevronDown,
  MoreHorizontal,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Download,
  Eye,
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

const allOrders = [
  { id: "#ORD-7842", customer: "Olivia Martin", email: "olivia@example.com", items: 3, amount: 249.99, status: "delivered", payment: "paid", date: "Mar 1, 2025", eta: "Mar 3, 2025" },
  { id: "#ORD-7841", customer: "Jackson Lee", email: "jackson@example.com", items: 1, amount: 1299.00, status: "shipped", payment: "paid", date: "Feb 28, 2025", eta: "Mar 5, 2025" },
  { id: "#ORD-7840", customer: "Isabella Nguyen", email: "isabella@example.com", items: 5, amount: 89.99, status: "processing", payment: "paid", date: "Feb 27, 2025", eta: "Mar 6, 2025" },
  { id: "#ORD-7839", customer: "William Chen", email: "william@example.com", items: 2, amount: 459.00, status: "delivered", payment: "paid", date: "Feb 26, 2025", eta: "Feb 28, 2025" },
  { id: "#ORD-7838", customer: "Sofia Rodriguez", email: "sofia@example.com", items: 4, amount: 199.95, status: "cancelled", payment: "refunded", date: "Feb 25, 2025", eta: "—" },
  { id: "#ORD-7837", customer: "Ethan Kim", email: "ethan@example.com", items: 2, amount: 329.99, status: "delivered", payment: "paid", date: "Feb 24, 2025", eta: "Feb 26, 2025" },
  { id: "#ORD-7836", customer: "Ava Johnson", email: "ava@example.com", items: 1, amount: 799.00, status: "shipped", payment: "paid", date: "Feb 23, 2025", eta: "Mar 2, 2025" },
  { id: "#ORD-7835", customer: "Mason Brown", email: "mason@example.com", items: 7, amount: 1249.50, status: "processing", payment: "pending", date: "Feb 22, 2025", eta: "Mar 8, 2025" },
  { id: "#ORD-7834", customer: "Charlotte Davis", email: "charlotte@example.com", items: 2, amount: 54.99, status: "delivered", payment: "paid", date: "Feb 21, 2025", eta: "Feb 23, 2025" },
  { id: "#ORD-7833", customer: "Liam Martinez", email: "liam@example.com", items: 1, amount: 1899.00, status: "cancelled", payment: "refunded", date: "Feb 20, 2025", eta: "—" },
];

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  delivered: { label: "Delivered", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400" },
  processing: { label: "Processing", icon: Package, className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400" },
  cancelled: { label: "Cancelled", icon: XCircle, className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400" },
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const perPage = 5;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailOrder, setDetailOrder] = useState<(typeof allOrders)[number] | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(["id", "customer", "items", "amount", "status", "date"]));
  const { toast } = useToast();
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    let result = allOrders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        o.customer.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      if (sortField === "amount") {
        return sortDir === "asc" ? a.amount - b.amount : b.amount - a.amount;
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track and manage all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ColumnToggle
            columns={[
              { key: "id", label: "Order" },
              { key: "customer", label: "Customer" },
              { key: "items", label: "Items" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
            ]}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />
          <button
            onClick={() =>
              exportToCSV(
                allOrders,
                `lumora-orders-${new Date().toISOString().split("T")[0]}.csv`,
                [
                  { key: "id", label: "Order ID" },
                  { key: "customer", label: "Customer" },
                  { key: "email", label: "Email" },
                  { key: "items", label: "Items" },
                  { key: "amount", label: "Amount" },
                  { key: "status", label: "Status" },
                  { key: "payment", label: "Payment" },
                  { key: "date", label: "Date" },
                  { key: "eta", label: "ETA" },
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
          { label: "Total Orders", value: allOrders.length.toString() },
          { label: "Revenue", value: `$${allOrders.reduce((s, o) => s + o.amount, 0).toLocaleString()}`, color: "text-indigo-600" },
          { label: "Delivered", value: allOrders.filter((o) => o.status === "delivered").length.toString(), color: "text-emerald-600" },
          { label: "Pending", value: allOrders.filter((o) => o.status === "processing" || o.status === "shipped").length.toString(), color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
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
            placeholder="Search orders..."
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
          <option value="delivered">Delivered</option>
          <option value="shipped">Shipped</option>
          <option value="processing">Processing</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No orders found"
          description={search ? "Try adjusting your search or filters." : "No orders match the current filters."}
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
                          setSelectedIds(new Set(paged.map((o) => o.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                  </th>
                  {[
                    { key: "id", label: "Order" },
                    { key: "customer", label: "Customer" },
                    { key: "items", label: "Items" },
                    { key: "amount", label: "Amount" },
                    { key: "status", label: "Status" },
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
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {paged.map((order) => {
                  const config = statusConfig[order.status];
                  const StatusIcon = config.icon;
                  return (
                    <tr
                      key={order.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                        selectedIds.has(order.id) && "bg-indigo-50/50 dark:bg-indigo-950/20"
                      )}
                      onClick={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(order.id)) next.delete(order.id);
                          else next.add(order.id);
                          return next;
                        });
                      }}
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(order.id)}
                          onChange={() => {
                            setSelectedIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(order.id)) next.delete(order.id);
                              else next.add(order.id);
                              return next;
                            });
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">
                        {order.id}
                        <CopyButton text={order.id} toast={toast} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{order.customer}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {order.email}
                          <CopyButton text={order.email} toast={toast} />
                        </p>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{order.items} items</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">${order.amount.toFixed(2)}</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
                          <StatusIcon className="h-3 w-3" />{config.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{order.date}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-sm text-slate-500 dark:text-slate-400">{order.eta}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDetailOrder(order); }}
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

        {/* Cards — mobile */}
        <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-700">
          {paged.map((order) => {
            const config = statusConfig[order.status];
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(order.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(order.id)) next.delete(order.id);
                          else next.add(order.id);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600"
                    />
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {order.id}
                      <CopyButton text={order.id} toast={toast} />
                    </p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
                    <StatusIcon className="h-3 w-3" />{config.label}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{order.customer}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {order.email}
                    <CopyButton text={order.email} toast={toast} />
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{order.items} items</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${order.amount.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                  <span>{order.date}</span>
                  <span>ETA: {order.eta}</span>
                  <button
                    onClick={() => setDetailOrder(order)}
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
                const selectedOrders = allOrders.filter((o) => selectedIds.has(o.id));
                exportToCSV(
                  selectedOrders,
                  `lumora-selected-orders-${new Date().toISOString().split("T")[0]}.csv`,
                  [
                    { key: "id", label: "Order ID" },
                    { key: "customer", label: "Customer" },
                    { key: "email", label: "Email" },
                    { key: "items", label: "Items" },
                    { key: "amount", label: "Amount" },
                    { key: "status", label: "Status" },
                    { key: "date", label: "Date" },
                  ]
                );
                toast("Exported " + selectedIds.size + " orders", "success");
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
        open={!!detailOrder}
        onClose={() => setDetailOrder(null)}
        title={detailOrder?.id ?? ""}
        subtitle={detailOrder?.customer}
        badge={
          detailOrder && (() => {
            const config = statusConfig[detailOrder.status];
            const BadgeIcon = config.icon;
            return (
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.className)}>
                <BadgeIcon className="h-3 w-3" />{config.label}
              </span>
            );
          })()
        }
        rows={
          detailOrder
            ? [
                { label: "Customer", value: detailOrder.customer },
                { label: "Email", value: detailOrder.email },
                { label: "Items", value: String(detailOrder.items) },
                { label: "Amount", value: `$${detailOrder.amount.toFixed(2)}` },
                { label: "Payment", value: detailOrder.payment },
                { label: "Date", value: detailOrder.date },
                { label: "ETA", value: detailOrder.eta },
              ]
            : []
        }
        footer={
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95"
          >
            <Eye className="h-4 w-4" />
            View Order Details
          </button>
        }
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
