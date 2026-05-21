"use client";

import { useState, useRef, useEffect } from "react";
import {
  Users,
  Mail,
  Shield,
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
  Stethoscope,
  Microscope,
  FlaskConical,
  Brain,
} from "lucide-react";
import Image from "next/image";
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
  role: "Radiologist" | "Dermatologist" | "Pathologist" | "Clinician";
  specialty: string;
  status: "active" | "invited" | "inactive";
  joined: string;
  casesReviewed: number;
  lastActive?: string;
  certifications: string[];
}

const members: TeamMember[] = [
  { id: "1", name: "Dr. Sarah Chen", email: "sarah@lumora.io", role: "Dermatologist", specialty: "Melanoma & Pigmented Lesions", status: "active", joined: "Jan 2023", casesReviewed: 2847, lastActive: "2 min ago", certifications: ["ABD Board Certified", "Dermoscopy Master"] },
  { id: "2", name: "Dr. Michael Kim", email: "michael@lumora.io", role: "Radiologist", specialty: "AI-Assisted Imaging", status: "active", joined: "Mar 2023", casesReviewed: 1923, lastActive: "1 hour ago", certifications: ["ABR Board Certified", "AI/ML in Radiology"] },
  { id: "3", name: "Dr. Emily Rodriguez", email: "emily@lumora.io", role: "Pathologist", specialty: "Dermatopathology", status: "active", joined: "Aug 2022", casesReviewed: 4510, lastActive: "30 min ago", certifications: ["ABP Board Certified", "Fellowship: Dermatopathology"] },
  { id: "4", name: "Dr. David Park", email: "david@lumora.io", role: "Clinician", specialty: "General Dermatology", status: "invited", joined: "—", casesReviewed: 0, lastActive: "—", certifications: ["MD, FAAD"] },
  { id: "5", name: "Dr. Lisa Thompson", email: "lisa@lumora.io", role: "Dermatologist", specialty: "Pediatric Dermatology", status: "active", joined: "Mar 2025", casesReviewed: 156, lastActive: "1 day ago", certifications: ["ABD Board Certified", "Pediatric Derm Subspecialty"] },
];

const roleBadge = (role: TeamMember["role"]) => {
  const styles = {
    Dermatologist: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    Radiologist: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    Pathologist: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Clinician: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  };
  return styles[role];
};

const roleIcons: Record<TeamMember["role"], typeof Stethoscope> = {
  Dermatologist: Stethoscope,
  Radiologist: Brain,
  Pathologist: Microscope,
  Clinician: Shield,
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

export default function ClinicalTeamPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([""]);
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("Clinician");
  const [sending, setSending] = useState(false);
  const [emailErrors, setEmailErrors] = useState<Record<number, string>>({});
  const [page, setPage] = useState(0);
  const perPage = 5;
  const [detailMember, setDetailMember] = useState<TeamMember | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.specialty.toLowerCase().includes(debouncedSearch.toLowerCase())
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
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const validEmails = emails.filter((e) => e.trim() !== "");
    toast(
      `Invitation${validEmails.length > 1 ? "s" : ""} sent to ${validEmails.length} ${validEmails.length > 1 ? "clinicians" : "clinician"} with ${inviteRole} role`,
      "success"
    );

    setSending(false);
    setInviteOpen(false);
    setEmails([""]);
    setEmailErrors({});
  };

  const totalCases = members.reduce((s, m) => s + m.casesReviewed, 0);

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Clinical Team</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your clinical team of dermatologists, radiologists, and pathologists
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Team Members", value: members.length.toString(), icon: Users, color: "text-indigo-600" },
          { label: "Active Clinicians", value: members.filter((m) => m.status === "active").length.toString(), icon: BadgeCheck, color: "text-emerald-600" },
          { label: "Total Cases Reviewed", value: totalCases.toLocaleString(), icon: Brain, color: "text-violet-600" },
          { label: "Specialties", value: [...new Set(members.map((m) => m.role))].length.toString(), icon: Shield, color: "text-amber-600" },
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search clinicians..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-900/30"
          />
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Invite Clinician
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clinicians found"
          description={searchQuery ? "Try a different search term." : "No clinical team members yet. Invite your first clinician to get started."}
          action={
            <button
              onClick={() => setInviteOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Invite Clinician
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
                <th className="px-6 py-3">Clinician</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Specialty</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Cases Reviewed</th>
                <th className="w-12 px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paged.map((member) => {
                const RoleIcon = roleIcons[member.role];
                return (
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
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                          {member.name.split(" ").map((n) => n[1] === "." ? n.slice(2) : n).join("").slice(0, 2)}
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
                        <RoleIcon className="h-3 w-3" />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{member.specialty}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        {statusIcon(member.status)}
                        {statusLabel(member.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {member.casesReviewed.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDetailMember(member); }}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 active:scale-95 dark:hover:bg-slate-700 dark:hover:text-slate-300"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 sm:hidden dark:divide-slate-700">
            {paged.map((member) => {
              const RoleIcon = roleIcons[member.role];
              return (
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white">
                        {member.name.split(" ").map((n) => n[1] === "." ? n.slice(2) : n).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDetailMember(member)}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 active:scale-95 dark:hover:bg-slate-700"
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge(member.role)}`}>
                      <RoleIcon className="h-3 w-3" />
                      {member.role}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      {statusIcon(member.status)}
                      {statusLabel(member.status)}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{member.casesReviewed.toLocaleString()} cases</span>
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
                  const selectedMembers = members.filter((m) => selectedIds.has(m.id));
                  exportToCSV(
                    selectedMembers as unknown as Record<string, unknown>[],
                    `lumora-clinical-team-${new Date().toISOString().split("T")[0]}.csv`,
                    [
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "role", label: "Role" },
                      { key: "specialty", label: "Specialty" },
                      { key: "status", label: "Status" },
                      { key: "casesReviewed", label: "Cases Reviewed" },
                    ]
                  );
                  toast("Exported " + selectedIds.size + " clinicians", "success");
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
                Invite Clinical Team Member
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
                          placeholder="clinician@hospital.com"
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
                  Clinical Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  <option value="Clinician">Clinician — General dermatology</option>
                  <option value="Dermatologist">Dermatologist — Specialized in lesion assessment</option>
                  <option value="Radiologist">Radiologist — AI-assisted image analysis</option>
                  <option value="Pathologist">Pathologist — Histopathology confirmation</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700">
              <button
                onClick={() => setInviteOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvites}
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95 disabled:opacity-60"
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
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${roleBadge(detailMember.role)}`}>
              {detailMember.role}
            </span>
          )
        }
        rows={
          detailMember
            ? [
                { label: "Role", value: detailMember.role },
                { label: "Specialty", value: detailMember.specialty },
                { label: "Status", value: statusLabel(detailMember.status) },
                { label: "Cases Reviewed", value: detailMember.casesReviewed.toLocaleString() },
                { label: "Joined", value: detailMember.joined },
                { label: "Last Active", value: detailMember.lastActive || "—" },
                { label: "Certifications", value: <div className="flex flex-wrap gap-1">{detailMember.certifications.map((c, i) => <span key={i} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">{c}</span>)}</div> },
              ]
            : []
        }
        footer={
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95">
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
