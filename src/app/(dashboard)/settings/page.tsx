"use client";

import { useState, useCallback, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Moon, Sun, Globe, Bell, User, Save, Loader2, CheckCircle2, Key, Lock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { profileSchema, type ProfileInput, type SettingsInput } from "@/lib/validations";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useFormAutosave, AutosaveBadge } from "@/hooks/use-form-autosave";
import { PageTransition, SectionItem } from "@/components/ui/page-transition";

type Tab = "profile" | "notifications" | "appearance";

const tabs: { id: Tab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
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
    name: "Alex Morgan",
    email: "alex@lumora.io",
    location: "San Francisco, CA",
    bio: "Full-stack developer and dashboard enthusiast. Building tools that make data beautiful.",
  });
  const [profileErrors, setProfileErrors] = useState<Partial<Record<keyof ProfileInput, string>>>({});

  // Autosave profile to localStorage with debounce
  const { status: autosaveStatus, lastSaved, loadDraft } = useFormAutosave({
    key: "settings-profile",
    data: profile,
    delay: 1200,
  });

  // Load draft from localStorage on mount
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
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setSaving(null);
    toast("Profile updated successfully!", "success");
  }, [profile, toast]);

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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account settings and preferences.
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
                AM
              </div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                Alex Morgan
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Administrator</p>
            </div>
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Plan</span>
                <span className="font-medium text-slate-900 dark:text-white">Enterprise</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Team</span>
                <span className="font-medium text-slate-900 dark:text-white">12 members</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Storage</span>
                <span className="font-medium text-slate-900 dark:text-white">45.2 GB / 100 GB</span>
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
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Update your personal details and public profile
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
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profile.bio ?? ""}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-indigo-500"
                  />                    <p className="mt-1 text-xs text-slate-400">{(profile.bio ?? "").length}/500 characters</p>
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
                    key: "weeklyDigest" as const,
                    label: "Weekly digest",
                    desc: "Get a weekly summary of your activity",
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
              {/* Theme */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Theme</h3>
                <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
                  Customize your dashboard appearance
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "relative flex items-center gap-4 rounded-xl border-2 p-4 transition-all",
                      theme === "light"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Light</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Clean and bright</p>
                    </div>
                    {theme === "light" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-indigo-500" />
                    )}
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "relative flex items-center gap-4 rounded-xl border-2 p-4 transition-all",
                      theme === "dark"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-slate-600 dark:text-indigo-400">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Dark</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Easy on the eyes</p>
                    </div>
                    {theme === "dark" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-indigo-500" />
                    )}
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={cn(
                      "relative flex items-center gap-4 rounded-xl border-2 p-4 transition-all",
                      theme === "system"
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:hover:border-slate-500"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300">
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
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">System</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Follows device theme</p>
                    </div>
                    {theme === "system" && (
                      <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-indigo-500" />
                    )}
                  </button>
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
            <p>This action cannot be undone. All of your data, team associations, and billing information will be permanently deleted.</p>
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
