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
} from "lucide-react";
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

const allUsers = [
  { id: 1, name: "Alex Morgan", email: "alex@lumora.io", role: "Admin", status: "active", plan: "Enterprise", location: "San Francisco, CA", avatar: "AM", joined: "Jan 2023", revenue: 12400 },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "Editor", status: "active", plan: "Pro", location: "New York, NY", avatar: "SC", joined: "Mar 2023", revenue: 8400 },
  { id: 3, name: "James Wilson", email: "james@example.com", role: "Viewer", status: "inactive", plan: "Free", location: "London, UK", avatar: "JW", joined: "Jun 2023", revenue: 0 },
  { id: 4, name: "Emily Rodriguez", email: "emily@example.com", role: "Editor", status: "active", plan: "Pro", location: "Miami, FL", avatar: "ER", joined: "Feb 2024", revenue: 5600 },
  { id: 5, name: "Michael Kim", email: "michael@example.com", role: "Admin", status: "active", plan: "Enterprise", location: "Seattle, WA", avatar: "MK", joined: "Aug 2022", revenue: 18900 },
  { id: 6, name: "Lisa Thompson", email: "lisa@example.com", role: "Viewer", status: "pending", plan: "Free", location: "Austin, TX", avatar: "LT", joined: "Mar 2025", revenue: 0 },
  { id: 7, name: "David Park", email: "david@example.com", role: "Editor", status: "active", plan: "Pro", location: "Chicago, IL", avatar: "DP", joined: "Nov 2023", revenue: 7200 },
  { id: 8, name: "Anna Novak", email: "anna@example.com", role: "Admin", status: "active", plan: "Enterprise", location: "Berlin, DE", avatar: "AN", joined: "Apr 2023", revenue: 15100 },
  { id: 9, name: "Tom Fischer", email: "tom@example.com", role: "Viewer", status: "inactive", plan: "Free", location: "Vienna, AT", avatar: "TF", joined: "Sep 2024", revenue: 0 },
  { id: 10, name: "Rachel Green", email: "rachel@example.com", role: "Editor", status: "active", plan: "Pro", location: "Boston, MA", avatar: "RG", joined: "Oct 2023", revenue: 9300 },
  { id: 11, name: "Chris Evans", email: "chris@example.com", role: "Viewer", status: "pending", plan: "Free", location: "Denver, CO", avatar: "CE", joined: "Jan 2025", revenue: 0 },
  { id: 12, name: "Priya Sharma", email: "priya@example.com", role: "Admin", status: "active", plan: "Enterprise", location: "Mumbai, IN", avatar: "PS", joined: "Jul 2022", revenue: 22100 },
];

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  inactive: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
};

const roleColors: Record<string, string> = {
  Admin: "text-purple-600 dark:text-purple-400",
  Editor: "text-blue-600 dark:text-blue-400",
  Viewer: "text-slate-600 dark:text-slate-400",
};

export default function UsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "all");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [sortField, setSortField] = useState(searchParams.get("sort") || "name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">((searchParams.get("dir") as "asc" | "desc") || "asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 0);
  const perPage = 5;
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [detailUser, setDetailUser] = useState<(typeof allUsers)[number] | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(["name", "role", "status", "plan", "revenue", "joined"]));
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
  const setRoleAndSync = (val: string) => {
    setRoleFilter(val);
    setPage(0);
    syncUrl({ role: val, page: "0" });
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
    let result = allUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter;
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
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
  }, [debouncedSearch, roleFilter, statusFilter, sortField, sortDir]);

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

  // Pagination state for enhanced pagination
  const [perPageState, setPerPageState] = useState(perPage);

  return (
    <PageTransition>
      {/* Header */}
      <SectionItem>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage team members, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ColumnToggle
            columns={[
              { key: "name", label: "User" },
              { key: "role", label: "Role" },
              { key: "status", label: "Status" },
              { key: "plan", label: "Plan" },
              { key: "revenue", label: "Revenue" },
              { key: "joined", label: "Joined" },
            ]}
            visibleColumns={visibleColumns}
            onChange={setVisibleColumns}
          />
          <button
            onClick={() =>
              exportToCSV(
                allUsers,
                `lumora-users-${new Date().toISOString().split("T")[0]}.csv`,
                [
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "role", label: "Role" },
                  { key: "status", label: "Status" },
                  { key: "plan", label: "Plan" },
                  { key: "location", label: "Location" },
                  { key: "revenue", label: "Revenue" },
                  { key: "joined", label: "Joined" },
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
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Users", value: allUsers.length.toString() },
          { label: "Active", value: allUsers.filter((u) => u.status === "active").length.toString(), color: "text-emerald-600" },
          { label: "Pending", value: allUsers.filter((u) => u.status === "pending").length.toString(), color: "text-amber-600" },
          { label: "Revenue", value: `$${(allUsers.reduce((s, u) => s + u.revenue, 0) / 1000).toFixed(0)}K`, color: "text-indigo-600" },
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
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearchAndSync(e.target.value); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleAndSync(e.target.value); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
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

      {/* Empty state for no results */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={search ? "Try adjusting your search or filters." : "No users match the current filters."}
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
                          setSelectedIds(new Set(paged.map((u) => u.id)));
                        }
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                  </th>
                  {[
                    { key: "name", label: "User" },
                    { key: "role", label: "Role" },
                    { key: "status", label: "Status" },
                    { key: "plan", label: "Plan" },
                    { key: "revenue", label: "Revenue" },
                    { key: "joined", label: "Joined" },
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
                {paged.map((user) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                      selectedIds.has(user.id) && "bg-indigo-50/50 dark:bg-indigo-950/20"
                    )}
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.tagName === "INPUT" || target.tagName === "BUTTON") return;
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(user.id)) next.delete(user.id);
                        else next.add(user.id);
                        return next;
                      });
                    }}
                  >
                    <td className="whitespace-nowrap px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(user.id)}
                        onChange={() => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            if (next.has(user.id)) next.delete(user.id);
                            else next.add(user.id);
                            return next;
                          });
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                            <CopyButton text={user.email} toast={toast} />
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Shield className={cn("h-3.5 w-3.5", roleColors[user.role])} />
                        <span className={cn("text-sm font-medium", roleColors[user.role])}>{user.role}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[user.status])}>{user.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={cn("text-sm", user.plan === "Enterprise" ? "font-semibold text-indigo-600 dark:text-indigo-400" : user.plan === "Pro" ? "font-medium text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400")}>{user.plan}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">{user.revenue > 0 ? `$${user.revenue.toLocaleString()}` : "—"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.joined}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDetailUser(user); }}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users cards — mobile */}
        <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-700">
          {paged.map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(user.id)}
                    onChange={() => {
                      setSelectedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(user.id)) next.delete(user.id);
                        else next.add(user.id);
                        return next;
                      });
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                      <CopyButton text={user.email} toast={toast} />
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailUser(user)}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                  title="View details"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[user.status])}>{user.status}</span>
                <span className={cn("text-sm", roleColors[user.role])}>{user.role} · {user.plan}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">${user.revenue.toLocaleString()} · {user.joined}</span>
              </div>
            </div>
          ))}
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
                const selectedUsers = allUsers.filter((u) => selectedIds.has(u.id));
                exportToCSV(
                  selectedUsers,
                  `lumora-selected-users-${new Date().toISOString().split("T")[0]}.csv`,
                  [
                    { key: "name", label: "Name" },
                    { key: "email", label: "Email" },
                    { key: "role", label: "Role" },
                    { key: "status", label: "Status" },
                    { key: "plan", label: "Plan" },
                    { key: "revenue", label: "Revenue" },
                    { key: "joined", label: "Joined" },
                  ]
                );
                toast("Exported " + selectedIds.size + " users", "success");
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

      </SectionItem>

      {/* Detail Drawer */}
      <DetailDrawer
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
        title={detailUser?.name ?? ""}
        subtitle={detailUser?.email}
        badge={
          detailUser && (
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize",
                statusStyles[detailUser.status]
              )}
            >
              {detailUser.status}
            </span>
          )
        }
        rows={
          detailUser
            ? [
                { label: "Role", value: <span className={cn("font-medium", roleColors[detailUser.role])}>{detailUser.role}</span> },
                { label: "Plan", value: detailUser.plan },
                { label: "Revenue", value: detailUser.revenue > 0 ? `$${detailUser.revenue.toLocaleString()}` : "—" },
                { label: "Location", value: detailUser.location },
                { label: "Joined", value: detailUser.joined },
              ]
            : []
        }
        footer={
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95"
          >
            <Eye className="h-4 w-4" />
            View Full Profile
          </button>
        }
      />


    </PageTransition>
  );
}
