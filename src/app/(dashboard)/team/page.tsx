"use client";

import { useState } from "react";
import {
  Users,
  Mail,
  Shield,
  MoreHorizontal,
  Plus,
  Search,
  BadgeCheck,
  Clock,
  XCircle,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "invited" | "inactive";
  joined: string;
}

const members: TeamMember[] = [
  { id: "1", name: "Alex Morgan", email: "alex@lumora.io", role: "Admin", status: "active", joined: "Jan 2023" },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", role: "Editor", status: "active", joined: "Mar 2023" },
  { id: "3", name: "Michael Kim", email: "michael@example.com", role: "Admin", status: "active", joined: "Aug 2022" },
  { id: "4", name: "David Park", email: "david@example.com", role: "Editor", status: "invited", joined: "—" },
  { id: "5", name: "Lisa Thompson", email: "lisa@example.com", role: "Viewer", status: "active", joined: "Mar 2025" },
];

const roleBadge = (role: TeamMember["role"]) => {
  const styles = {
    Admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    Editor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Viewer: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return styles[role];
};

const statusIcon = (status: TeamMember["status"]) => {
  switch (status) {
    case "active": return <BadgeCheck className="h-4 w-4 text-emerald-500" />;
    case "invited": return <Clock className="h-4 w-4 text-amber-500" />;
    case "inactive": return <XCircle className="h-4 w-4 text-gray-400" />;
  }
};

const statusLabel = (status: TeamMember["status"]) => {
  switch (status) {
    case "active": return "Active";
    case "invited": return "Invited";
    case "inactive": return "Inactive";
  }
};

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your team members and their roles.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-indigo-400"
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <Plus className="h-4 w-4" />
          Invite member
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members found"
          description={searchQuery ? "Try a different search term." : "No team members yet. Invite your first member to get started."}
          action={
            <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Invite member
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="w-12 px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((member) => (
                <tr
                  key={member.id}
                  className="bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge(member.role)}`}>
                      <Shield className="h-3 w-3" />
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      {statusIcon(member.status)}
                      {statusLabel(member.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {member.joined}
                  </td>
                  <td className="px-6 py-4">
                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
