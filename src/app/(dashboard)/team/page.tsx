"use client";

import { useState, useRef, useEffect } from "react";
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
  X,
  Send,
  Loader2,
  Eye,
  Download,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { exportToCSV } from "@/lib/export";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import { EnhancedPagination } from "@/components/ui/pagination-enhanced";
import { CopyButton } from "@/lib/clipboard";
import { useToast } from "@/components/ui/toast";
import { useDebounce } from "@/lib/use-debounce";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  status: "active" | "invited" | "inactive";
  joined: string;
  lastActive?: string;
}

const members: TeamMember[] = [
  { id: "1", name: "Alex Morgan", email: "alex@lumora.io", role: "Admin", status: "active", joined: "Jan 2023", lastActive: "2 min ago" },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", role: "Editor", status: "active", joined: "Mar 2023", lastActive: "1 hour ago" },
  { id: "3", name: "Michael Kim", email: "michael@example.com", role: "Admin", status: "active", joined: "Aug 2022", lastActive: "30 min ago" },
  { id: "4", name: "David Park", email: "david@example.com", role: "Editor", status: "invited", joined: "—", lastActive: "—" },
  { id: "5", name: "Lisa Thompson", email: "lisa@example.com", role: "Viewer", status: "active", joined: "Mar 2025", lastActive: "1 day ago" },
];

const roleBadge = (role: TeamMember["role"]) => {
  const styles = {
    Admin: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    Editor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Viewer: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  return styles[role];
};

const statusIcon = (status: TeamMember["status"]) => {
  switch (status) {
    case "active": return <BadgeCheck className="h-4 w-4 text-emerald-500" />;
    case "invited": return <Clock className="h-4 w-4 text-amber-500" />;
    case "inactive": return <XCircle className="h-4 w-4 text-slate-400" />;
  }
};

const statusLabel = (status: TeamMember["status"]) => {
  switch (status) {
    case "active": return "Active";
    case "invited": return "Invited";
    case "inactive": return "Inactive";
  }
};

import { PageTransition, SectionItem } from "@/components/ui/page-transition";

export default function TeamPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([""]);
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Editor");
  const [sending, setSending] = useState(false);
  const [emailErrors, setEmailErrors] = useState<Record<number, string>>({});
  const [page, setPage] = useState(0);
  const perPage = 5;
  const [detailMember, setDetailMember] = useState<TeamMember | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const paged = filtered.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (inviteOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setInviteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [inviteOpen]);

  const addEmailField = () => {
    setEmails((prev) => [...prev, ""]);
  };

  const removeEmailField = (index: number) => {
    setEmails((prev) => prev.filter((_, i) => i !== index));
    setEmailErrors((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const updateEmail = (index: number, value: string) => {
    setEmails((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    // Clear error on edit
    if (emailErrors[index]) {
      setEmailErrors((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    }
  };

  const validateEmails = (): boolean => {
    const errors: Record<number, string> = {};
    const validEmails = emails.filter((e) => e.trim() !== "");

    if (validEmails.length === 0) {
      toast("Please enter at least one email address", "error");
      return false;
    }

    emails.forEach((email, i) => {
      if (email.trim() === "") return;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors[i] = "Invalid email format";
      }
    });

    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendInvites = async () => {
    if (!validateEmails()) return;

    setSending(true);

    // Simulate sending invites
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const validEmails = emails.filter((e) => e.trim() !== "");
    toast(
      `Invitation${validEmails.length > 1 ? "s" : ""} sent to ${validEmails.length} ${validEmails.length > 1 ? "recipients" : "recipient"} with ${inviteRole} role`,
      "success"
    );

    setSending(false);
    setInviteOpen(false);
    setEmails([""]);
    setEmailErrors({});
  };

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">        <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your team members and their roles.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
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
            <button
              onClick={() => setInviteOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Invite member
            </button>
          }
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* Desktop table */}
          <table className="hidden w-full sm:table">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && selectedIds.size === paged.length}
                    onChange={() => {
                      if (selectedIds.size === paged.length) {
                        setSelectedIds(new Set());
                      } else {
                        setSelectedIds(new Set(paged.map((m) => m.id)));
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                  />
                </th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
                <th className="px-6 py-3">Last Active</th>
                <th className="w-12 px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.map((member) => (
                <tr
                  key={member.id}
                  className={cn(
                    "transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                    selectedIds.has(member.id) && "bg-indigo-50/50 dark:bg-indigo-950/20"
                  )}
                  onClick={() => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(member.id)) next.delete(member.id);
                      else next.add(member.id);
                      return next;
                    });
                  }}
                >
                  <td className="whitespace-nowrap px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(member.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(member.id)) next.delete(member.id);
                          else next.add(member.id);
                          return next;
                        });
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Mail className="h-3 w-3" />
                          {member.email}
                          <CopyButton text={member.email} toast={toast} />
                        </p>
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
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      {statusIcon(member.status)}
                      {statusLabel(member.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{member.joined}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 dark:text-slate-500">{member.lastActive || "—"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); setDetailMember(member); }}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-700">
            {paged.map((member) => (
              <div key={member.id} className="bg-white p-4 dark:bg-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(member.id)}
                      onChange={() => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (next.has(member.id)) next.delete(member.id);
                          else next.add(member.id);
                          return next;
                        });
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 dark:border-slate-600"
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailMember(member)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge(member.role)}`}>
                    <Shield className="h-3 w-3" />
                    {member.role}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                    {statusIcon(member.status)}
                    {statusLabel(member.status)}
                  </span>
                  <span className="text-sm text-slate-400">Joined {member.joined}</span>
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
                >Clear selection</button>
              </div>
              <button
                onClick={() => {
                  const selectedMembers = members.filter((m) => selectedIds.has(m.id));
                  exportToCSV(
                    selectedMembers as unknown as Record<string, unknown>[],
                    `lumora-selected-team-${new Date().toISOString().split("T")[0]}.csv`,
                    [
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "role", label: "Role" },
                      { key: "status", label: "Status" },
                      { key: "joined", label: "Joined" },
                    ]
                  );
                  toast("Exported " + selectedIds.size + " members", "success");
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

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="mx-4 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Invite Team Members
              </h2>
              <button
                onClick={() => setInviteOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email addresses
                </label>
                <div className="space-y-2">
                  {emails.map((email, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => updateEmail(i, e.target.value)}
                          placeholder="colleague@company.com"
                          className={cn(
                            "w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 dark:bg-slate-900 dark:text-white",
                            emailErrors[i]
                              ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700"
                              : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-700 dark:focus:border-indigo-500"
                          )}
                        />
                      </div>
                      {emails.length > 1 && (
                        <button
                          onClick={() => removeEmailField(i)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {emailErrors[0] && (
                  <p className="mt-1 text-xs text-red-500">{emailErrors[0]}</p>
                )}
                <button
                  onClick={addEmailField}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another email
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="Viewer">Viewer — Read-only access</option>
                  <option value="Editor">Editor — Can edit content</option>
                  <option value="Admin">Admin — Full access</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
              <button
                onClick={() => setInviteOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvites}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {sending ? "Sending..." : `Send Invite${emails.filter((e) => e.trim()).length > 1 ? "s" : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Detail Drawer */}
      <DetailDrawer
        open={!!detailMember}
        onClose={() => setDetailMember(null)}
        title={detailMember?.name ?? ""}
        subtitle={detailMember?.email}
        badge={
          detailMember && (
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge(detailMember.role)}`}>
              {detailMember.role}
            </span>
          )
        }
        rows={
          detailMember
            ? [
                { label: "Role", value: detailMember.role },
                { label: "Status", value: statusLabel(detailMember.status) },
                { label: "Joined", value: detailMember.joined },
                { label: "Last Active", value: detailMember.lastActive || "—" },
              ]
            : []
        }
        footer={
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            <Shield className="h-4 w-4" />
            Manage Permissions
          </button>
        }
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
