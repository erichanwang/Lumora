"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Moon, Sun, Globe, Bell, User, Save, Loader2, CheckCircle2, Key, Lock, Trash2, Brain, AlertTriangle, SlidersHorizontal, Activity } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { profileSchema, type ProfileInput, type SettingsInput } from "@/lib/validations";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFormAutosave, AutosaveBadge } from "@/hooks/use-form-autosave";
import { PageTransition, SectionItem } from "@/components/ui/page-transition";

type Tab = "profile" | "detection" | "notifications" | "appearance";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "detection", label: "Detection", icon: Brain },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Moon },
];

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "es", label: "Español" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState<string | null>(null);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  // Profile form state
  const [profile, setProfile] = useState<ProfileInput>({
    name: "Dr. Sarah Chen",
    email: "sarah.chen@lumora.io",
    location: "San Francisco, CA",
    bio: "Board-certified dermatologist specializing in melanoma detection and AI-assisted dermoscopy. 2,847 cases reviewed.",
  });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileInput, string>>>({});

  // Autosave profile to localStorage
  const { status: autosaveStatus, lastSaved, loadDraft } = useFormAutosave({
    key: "settings-profile",
    data: profile,
    delay: 1200,
  });

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setProfile(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Settings form state
  const [settings, setSettings] = useState<SettingsInput>({
    theme: theme as SettingsInput["theme"],
    language: "en",
    emailNotifications: true,
    pushNotifications: true,
  });

  // Detection settings
  const [detectionSettings, setDetectionSettings] = useState({
    melanomaThreshold: 0.90,
    bccThreshold: 0.92,
    akThreshold: 0.85,
    nevusThreshold: 0.95,
    autoFlagEnabled: true,
    autoFlagThreshold: 0.85,
    requireSecondOpinion: true,
    secondOpinionThreshold: 0.75,
    edgeCaseReview: true,
  });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Notification toggles
  const [notifToggles, setNotifToggles] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: true,
    productUpdates: false,
    criticalFindings: true,
    modelUpdates: true,
    reviewReminders: true,
  });

  const handleProfileSave = useCallback(async () => {
    const result = profileSchema.safeParse(profile);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ProfileInput, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProfileInput;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setProfileErrors(fieldErrors);
      return;
    }
    setProfileErrors({});
    setSaving("profile");
    await new Promise((r) => setTimeout(r, 800));
    setSaving(null);
    toast("Profile updated successfully!", "success");
  }, [profile, toast]);

  const handleDetectionSave = useCallback(async () => {
    setSaving("detection");
    await new Promise((r) => setTimeout(r, 600));
    setSaving(null);
    toast("Detection settings saved!", "success");
  }, [toast]);

  const handleSettingsSave = useCallback(async () => {
    setSaving("appearance");
    await new Promise((r) => setTimeout(r, 600));
    setSaving(null);
    toast("Appearance preferences saved!", "success");
  }, [toast]);

  const handleNotifSave = useCallback(async () => {
    setSaving("notifications");
    await new Promise((r) => setTimeout(r, 600));
    setSaving(null);
    toast("Notification preferences updated!", "success");
  }, [toast]);

  const handlePasswordChange = useCallback(async () => {
    const errs: Record<string, string> = {};
    if (!passwordForm.current) errs.current = "Current password is required";
    if (passwordForm.newPass.length < 6) errs.newPass = "New password must be at least 6 characters";
    if (passwordForm.newPass !== passwordForm.confirm) errs.confirm = "Passwords do not match";
    if (Object.keys(errs).length > 0) { setPasswordErrors(errs); return; }
    setPasswordErrors({});
    setSaving("password");
    await new Promise((r) => setTimeout(r, 800));
    setSaving(null);
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    toast("Password changed successfully!", "success");
  }, [passwordForm, toast]);

  const handleDeleteAccount = useCallback(async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setDeleting(false);
    setShowDeleteConfirm(false);
    toast("Account deleted. Redirecting...", "error");
  }, [toast]);

  const TabIcon = tabs.find((t) => t.id === activeTab)?.icon ?? User;

  return (
    <PageTransition>
      <SectionItem>
      <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account, detection preferences, and platform settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Tab sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Profile card */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white">
                SC
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                Dr. Sarah Chen
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Dermatologist</p>
            </div>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Cases Reviewed</span>
                <span className="font-medium text-slate-900 dark:text-white">2,847</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Detection Accuracy</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">98.7%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">License</span>
                <span className="font-medium text-slate-900 dark:text-white">Enterprise</span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="mt-6 rounded-xl border border-red-200 bg-white p-5 shadow-sm dark:border-red-900 dark:bg-slate-800">
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">Irreversible actions</p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Account
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tab indicator */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:hidden">
            <TabIcon className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">
              {activeTab} Settings
            </span>
          </div>

          {/* ===== PROFILE TAB ===== */}
          {activeTab === "profile" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Clinician Profile</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Update your professional details and credentials
                  </p>
                </div>
                <AutosaveBadge status={autosaveStatus} lastSaved={lastSaved} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => {
                      setProfile((p) => ({ ...p, name: e.target.value }));
                      if (profileErrors.name) setProfileErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    className={cn(
                      "mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-slate-700 dark:text-white",
                      profileErrors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-600"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-500"
                    )}
                  />
                  {profileErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{profileErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => {
                      setProfile((p) => ({ ...p, email: e.target.value }));
                      if (profileErrors.email) setProfileErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={cn(
                      "mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-slate-700 dark:text-white",
                      profileErrors.email
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-600"
                        : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600 dark:focus:border-indigo-500"
                    )}
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{profileErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location ?? ""}
                    onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Professional Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio ?? ""}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">{(profile.bio ?? "").length}/500 characters</p>
                </div>
              </div>

              {/* Password change */}
              <div className="mt-8 border-t border-slate-100 pt-8 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-1">
                  <Lock className="h-5 w-5 text-slate-400" />
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Change Password</h4>
                </div>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Update your password. Must be at least 6 characters.
                </p>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => { setPasswordForm((p) => ({ ...p, current: e.target.value })); setPasswordErrors((prev) => ({ ...prev, current: '' })); }}
                      placeholder="Enter current password"
                      className={cn(
                        "mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-slate-700 dark:text-white",
                        passwordErrors.current ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-600" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600"
                      )}
                    />
                    {passwordErrors.current && <p className="mt-1 text-xs text-red-500">{passwordErrors.current}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPass}
                      onChange={(e) => { setPasswordForm((p) => ({ ...p, newPass: e.target.value })); setPasswordErrors((prev) => ({ ...prev, newPass: '' })); }}
                      placeholder="At least 6 characters"
                      className={cn(
                        "mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-slate-700 dark:text-white",
                        passwordErrors.newPass ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-600" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600"
                      )}
                    />
                    {passwordErrors.newPass && <p className="mt-1 text-xs text-red-500">{passwordErrors.newPass}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => { setPasswordForm((p) => ({ ...p, confirm: e.target.value })); setPasswordErrors((prev) => ({ ...prev, confirm: '' })); }}
                      placeholder="Confirm your new password"
                      className={cn(
                        "mt-1 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:ring-2 dark:bg-slate-700 dark:text-white",
                        passwordErrors.confirm ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-600" : "border-slate-200 focus:border-indigo-400 focus:ring-indigo-100 dark:border-slate-600"
                      )}
                    />
                    {passwordErrors.confirm && <p className="mt-1 text-xs text-red-500">{passwordErrors.confirm}</p>}
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={handlePasswordChange}
                    disabled={saving === "password"}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                  >
                    {saving === "password" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Key className="h-4 w-4" />
                    )}
                    {saving === "password" ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProfileSave}
                  disabled={saving === "profile"}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving === "profile" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving === "profile" ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* ===== DETECTION TAB ===== */}
          {activeTab === "detection" && (
            <div className="space-y-6">
              {/* Confidence Thresholds */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confidence Thresholds</h3>
                </div>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Set minimum confidence thresholds per lesion type. Scans below threshold require manual review.
                </p>

                <div className="space-y-5">
                  {[
                    { key: "melanomaThreshold" as const, label: "Melanoma / Melanocytic", desc: "Malignant melanoma detection", color: "rose" },
                    { key: "bccThreshold" as const, label: "Basal Cell Carcinoma", desc: "BCC identification threshold", color: "amber" },
                    { key: "akThreshold" as const, label: "Actinic Keratosis", desc: "Pre-cancerous lesion detection", color: "emerald" },
                    { key: "nevusThreshold" as const, label: "Benign Nevi", desc: "Confidence for benign classification", color: "blue" },
                  ].map((item) => (
                    <div key={item.key} className="grid gap-3 sm:grid-cols-2 items-center">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0.5"
                          max="0.99"
                          step="0.01"
                          value={detectionSettings[item.key]}
                          onChange={(e) => setDetectionSettings((prev) => ({ ...prev, [item.key]: parseFloat(e.target.value) }))}
                          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-600"
                        />
                        <span className="text-sm font-mono font-semibold text-indigo-600 dark:text-indigo-400 w-12 text-right">
                          {Math.round(detectionSettings[item.key] * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto-Flag Rules */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Auto-Flag & Review Rules</h3>
                </div>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Configure when scans should be auto-flagged for urgent review
                </p>

                <div className="space-y-4">
                  {[
                    {
                      key: "autoFlagEnabled" as const,
                      label: "Enable auto-flagging",
                      desc: "Automatically flag high-risk scans for priority review",
                    },
                    {
                      key: "requireSecondOpinion" as const,
                      label: "Require second opinion",
                      desc: "Mandate a second clinician review for flagged scans",
                    },
                    {
                      key: "edgeCaseReview" as const,
                      label: "Edge case review queue",
                      desc: "Route borderline confidence (55-75%) scans to a specialized review queue",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/30"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={detectionSettings[item.key]}
                          onChange={() =>
                            setDetectionSettings((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                          }
                          className="peer sr-only"
                        />
                        <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full dark:bg-slate-600 dark:after:bg-slate-300" />
                      </label>
                    </div>
                  ))}

                  {detectionSettings.autoFlagEnabled && (
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/30">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-indigo-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Auto-flag confidence threshold</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Flag all scans below this confidence for review</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0.5"
                            max="0.95"
                            step="0.05"
                            value={detectionSettings.autoFlagThreshold}
                            onChange={(e) => setDetectionSettings((prev) => ({ ...prev, autoFlagThreshold: parseFloat(e.target.value) }))}
                            className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-amber-500 dark:bg-slate-600"
                          />
                          <span className="text-sm font-mono font-semibold text-amber-600 dark:text-amber-400 w-10 text-right">
                            {Math.round(detectionSettings.autoFlagThreshold * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {detectionSettings.requireSecondOpinion && (
                    <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/30">
                      <div className="flex items-center gap-3">
                        <Activity className="h-4 w-4 text-rose-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Second opinion threshold</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Require a second clinician review below this confidence</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0.5"
                            max="0.90"
                            step="0.05"
                            value={detectionSettings.secondOpinionThreshold}
                            onChange={(e) => setDetectionSettings((prev) => ({ ...prev, secondOpinionThreshold: parseFloat(e.target.value) }))}
                            className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-500 dark:bg-slate-600"
                          />
                          <span className="text-sm font-mono font-semibold text-rose-600 dark:text-rose-400 w-10 text-right">
                            {Math.round(detectionSettings.secondOpinionThreshold * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end border-t border-slate-100 pt-6 dark:border-slate-700">
                  <button
                    onClick={handleDetectionSave}
                    disabled={saving === "detection"}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving === "detection" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Brain className="h-4 w-4" />
                    )}
                    {saving === "detection" ? "Saving..." : "Save Detection Settings"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {activeTab === "notifications" && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h3>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                Choose what notifications you receive and how
              </p>

              <div className="space-y-4">
                {[
                  {
                    key: "emailNotifications" as const,
                    label: "Email notifications",
                    desc: "Receive emails about account activity",
                  },
                  {
                    key: "pushNotifications" as const,
                    label: "Push notifications",
                    desc: "Receive push notifications in browser",
                  },
                  {
                    key: "criticalFindings" as const,
                    label: "Critical findings alerts",
                    desc: "Immediate alerts for high-confidence malignant detections",
                  },
                  {
                    key: "weeklyDigest" as const,
                    label: "Weekly detection digest",
                    desc: "Get a weekly summary of detection statistics",
                  },
                  {
                    key: "modelUpdates" as const,
                    label: "Model updates",
                    desc: "Notifications when AI models are updated",
                  },
                  {
                    key: "reviewReminders" as const,
                    label: "Review reminders",
                    desc: "Reminders for pending scan reviews",
                  },
                  {
                    key: "productUpdates" as const,
                    label: "Product updates",
                    desc: "Receive updates about new features",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700/30"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifToggles[item.key]}
                        onChange={() =>
                          setNotifToggles((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                        }
                        className="peer sr-only"
                      />
                      <div className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full dark:bg-slate-600 dark:after:bg-slate-300" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end border-t border-slate-100 pt-6 dark:border-slate-700">
                <button
                  onClick={handleNotifSave}
                  disabled={saving === "notifications"}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving === "notifications" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {saving === "notifications" ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {/* ===== APPEARANCE TAB ===== */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Theme</h3>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Customize your dashboard appearance
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { value: "light" as const, label: "Light", desc: "Clean and bright", Icon: Sun, iconBg: "bg-amber-100 text-amber-600" },
                    { value: "dark" as const, label: "Dark", desc: "Easy on the eyes", Icon: Moon, iconBg: "bg-indigo-100 text-indigo-600 dark:bg-slate-600 dark:text-indigo-400" },
                    { value: "system" as const, label: "System", desc: "Follows device theme", Icon: () => (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2" />
                        <path d="M12 20v2" />
                        <path d="m4.93 4.93 1.41 1.41" />
                        <path d="m17.66 17.66 1.41 1.41" />
                        <path d="M2 12h2" />
                        <path d="M20 12h2" />
                        <path d="m6.34 17.66-1.41 1.41" />
                        <path d="m19.07 4.93-1.41 1.41" />
                      </svg>
                    ), iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setTheme(item.value)}
                      className={cn(
                        "relative flex items-center gap-4 rounded-xl border-2 p-4 transition-all",
                        theme === item.value
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
                      )}
                    >
                      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", item.iconBg)}>
                        <item.Icon className="h-5 w-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      {theme === item.value && (
                        <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                  Current: {resolvedTheme === "dark" ? "Dark" : "Light"} mode
                </p>
              </div>

              {/* Language */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Language</h3>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Choose your preferred interface language
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, language: lang.code as SettingsInput["language"] }))
                      }
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                        settings.language === lang.code
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
                      )}
                    >
                      <Globe className="h-5 w-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {lang.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-end border-t border-slate-100 pt-6 dark:border-slate-700">
                  <button
                    onClick={handleSettingsSave}
                    disabled={saving === "appearance"}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving === "appearance" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {saving === "appearance" ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account?"
        message={
          <>
            <p>This action cannot be undone. All of your data, clinical notes, and detection history will be permanently deleted.</p>
            <p className="mt-2 font-medium text-red-600 dark:text-red-400">Are you sure you want to proceed?</p>
          </>
        }
        confirmLabel={deleting ? "Deleting..." : "Delete Account"}
        variant="danger"
        loading={deleting}
      />
    </div>
      </SectionItem>
    </PageTransition>
  );
}
