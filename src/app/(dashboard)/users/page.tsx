"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  ChevronDown,
  MoreHorizontal,
  Shield,
  Mail,
  Phone,
  MapPin,
  Star,
  UserPlus,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const perPage = 5;

  const filtered = useMemo(() => {
    let result = allUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
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
  }, [search, roleFilter, statusFilter, sortField, sortDir]);

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage team members, roles, and permissions
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
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
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <Filter className="h-4 w-4 text-slate-400" />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Users table — desktop */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700">
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
                  <tr key={user.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
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
                      <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"><MoreHorizontal className="h-4 w-4" /></button>
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><MoreHorizontal className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize", statusStyles[user.status])}>{user.status}</span>
                <span className={cn("text-sm", roleColors[user.role])}>{user.role} · {user.plan}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">${user.revenue.toLocaleString()} · {user.joined}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {(page * perPage) + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >Previous</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-medium transition-colors", page === i ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700")}
              >{i + 1}</button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
